export interface DicomImageData {
  imageData: Uint8ClampedArray
  width: number
  height: number
  windowCenter: number
  windowWidth: number
  bitsAllocated: number
  samplesPerPixel: number
  photometricInterpretation: string
}

interface DicomTag {
  group: number
  element: number
  value: any
  vr?: string
  length?: number
}

export async function parseDicomFile(arrayBuffer: ArrayBuffer): Promise<DicomImageData | null> {
  try {
    const dataView = new DataView(arrayBuffer)

    // Check for DICOM file signature (DICM at byte 128)
    const dicmSignature = String.fromCharCode(
      dataView.getUint8(128),
      dataView.getUint8(129),
      dataView.getUint8(130),
      dataView.getUint8(131),
    )

    if (dicmSignature !== "DICM") {
      console.error("[v0] Invalid DICOM file: missing DICM signature")
      return null
    }

    // Initialize DICOM parameters with defaults
    let width = 512
    let height = 512
    let windowCenter = 40
    let windowWidth = 400
    let bitsAllocated = 16
    let samplesPerPixel = 1
    let photometricInterpretation = "MONOCHROME2"
    let pixelData: Uint16Array | Uint8Array | null = null
    let rescaleSlope = 1
    let rescaleIntercept = 0

    // Start parsing after DICM signature (at byte 132)
    let offset = 132
    const tags: DicomTag[] = []

    // Parse DICOM data elements
    while (offset < arrayBuffer.byteLength - 8) {
      try {
        const group = dataView.getUint16(offset, true)
        const element = dataView.getUint16(offset + 2, true)

        // Read VR (Value Representation) - 2 bytes
        const vr = String.fromCharCode(dataView.getUint8(offset + 4), dataView.getUint8(offset + 5))

        let valueLength: number
        let valueOffset: number

        // Handle VR types with different length encoding
        if (["OB", "OW", "OF", "SQ", "UN", "UT"].includes(vr)) {
          // Skip 2 reserved bytes and read 4-byte length
          valueLength = dataView.getUint32(offset + 8, true)
          valueOffset = offset + 12
        } else if (vr.charCodeAt(0) >= 65 && vr.charCodeAt(0) <= 90) {
          // Valid VR, read 2-byte length
          valueLength = dataView.getUint16(offset + 6, true)
          valueOffset = offset + 8
        } else {
          // Implicit VR
          valueLength = dataView.getUint32(offset + 4, true)
          valueOffset = offset + 8
        }

        // Skip sequence delimiters and invalid lengths
        if (valueLength === 0xffffffff || valueLength > arrayBuffer.byteLength) {
          offset += 8
          continue
        }

        // Parse specific critical tags
        if (group === 0x0028 && element === 0x0010) {
          // Rows (Image Height)
          height = dataView.getUint16(valueOffset, true)
          console.log("[v0] DICOM Rows:", height)
        } else if (group === 0x0028 && element === 0x0011) {
          // Columns (Image Width)
          width = dataView.getUint16(valueOffset, true)
          console.log("[v0] DICOM Columns:", width)
        } else if (group === 0x0028 && element === 0x0100) {
          // Bits Allocated
          bitsAllocated = dataView.getUint16(valueOffset, true)
          console.log("[v0] DICOM Bits Allocated:", bitsAllocated)
        } else if (group === 0x0028 && element === 0x0002) {
          // Samples Per Pixel
          samplesPerPixel = dataView.getUint16(valueOffset, true)
          console.log("[v0] DICOM Samples Per Pixel:", samplesPerPixel)
        } else if (group === 0x0028 && element === 0x0004) {
          // Photometric Interpretation
          const bytes = new Uint8Array(arrayBuffer, valueOffset, valueLength)
          photometricInterpretation = String.fromCharCode(...bytes).trim()
          console.log("[v0] DICOM Photometric Interpretation:", photometricInterpretation)
        } else if (group === 0x0028 && element === 0x1050) {
          // Window Center
          const bytes = new Uint8Array(arrayBuffer, valueOffset, valueLength)
          const wcString = String.fromCharCode(...bytes).trim()
          windowCenter = Number.parseFloat(wcString) || 40
          console.log("[v0] DICOM Window Center:", windowCenter)
        } else if (group === 0x0028 && element === 0x1051) {
          // Window Width
          const bytes = new Uint8Array(arrayBuffer, valueOffset, valueLength)
          const wwString = String.fromCharCode(...bytes).trim()
          windowWidth = Number.parseFloat(wwString) || 400
          console.log("[v0] DICOM Window Width:", windowWidth)
        } else if (group === 0x0028 && element === 0x1052) {
          // Rescale Intercept
          const bytes = new Uint8Array(arrayBuffer, valueOffset, valueLength)
          const riString = String.fromCharCode(...bytes).trim()
          rescaleIntercept = Number.parseFloat(riString) || 0
          console.log("[v0] DICOM Rescale Intercept:", rescaleIntercept)
        } else if (group === 0x0028 && element === 0x1053) {
          // Rescale Slope
          const bytes = new Uint8Array(arrayBuffer, valueOffset, valueLength)
          const rsString = String.fromCharCode(...bytes).trim()
          rescaleSlope = Number.parseFloat(rsString) || 1
          console.log("[v0] DICOM Rescale Slope:", rescaleSlope)
        } else if (group === 0x7fe0 && element === 0x0010) {
          // Pixel Data
          console.log("[v0] DICOM Pixel Data found at offset:", valueOffset, "length:", valueLength)

          if (bitsAllocated === 16) {
            pixelData = new Uint16Array(arrayBuffer, valueOffset, Math.floor(valueLength / 2))
          } else if (bitsAllocated === 8) {
            pixelData = new Uint8Array(arrayBuffer, valueOffset, valueLength)
          } else {
            console.error("[v0] Unsupported bits allocated:", bitsAllocated)
          }
        }

        // Move to next element
        offset = valueOffset + valueLength

        // Align to even byte boundary
        if (offset % 2 !== 0) {
          offset++
        }
      } catch (e) {
        console.error("[v0] Error parsing DICOM tag at offset:", offset, e)
        break
      }
    }

    if (!pixelData) {
      console.error("[v0] No pixel data found in DICOM file")
      return null
    }

    console.log("[v0] DICOM parsing complete. Width:", width, "Height:", height, "Pixel data length:", pixelData.length)

    // Convert to 8-bit RGBA image data with window/level transformation
    const imageData = new Uint8ClampedArray(width * height * 4)
    const min = windowCenter - windowWidth / 2
    const max = windowCenter + windowWidth / 2
    const range = max - min

    // Handle MONOCHROME1 vs MONOCHROME2
    const isMonochrome1 = photometricInterpretation === "MONOCHROME1"

    for (let i = 0; i < width * height; i++) {
      let pixelValue = pixelData[i]

      // Apply rescale slope and intercept
      pixelValue = pixelValue * rescaleSlope + rescaleIntercept

      // Apply window/level transformation
      let displayValue = 0
      if (pixelValue <= min) {
        displayValue = 0
      } else if (pixelValue >= max) {
        displayValue = 255
      } else {
        displayValue = ((pixelValue - min) / range) * 255
      }

      // Invert for MONOCHROME1
      if (isMonochrome1) {
        displayValue = 255 - displayValue
      }

      // Set RGBA values
      imageData[i * 4] = displayValue // R
      imageData[i * 4 + 1] = displayValue // G
      imageData[i * 4 + 2] = displayValue // B
      imageData[i * 4 + 3] = 255 // A (fully opaque)
    }

    return {
      imageData,
      width,
      height,
      windowCenter,
      windowWidth,
      bitsAllocated,
      samplesPerPixel,
      photometricInterpretation,
    }
  } catch (error) {
    console.error("[v0] Error parsing DICOM file:", error)
    return null
  }
}

export function isDicomFile(path: string): boolean {
  return path.toLowerCase().endsWith(".dcm") || path.toLowerCase().includes(".dcm")
}
