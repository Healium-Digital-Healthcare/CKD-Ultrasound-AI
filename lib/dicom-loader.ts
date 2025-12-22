import { initializeCornerstone, cornerstone, cornerstoneWADOImageLoader } from "./cornerstone-init"

export interface DicomImageData {
  imageData: Uint8ClampedArray
  width: number
  height: number
  windowCenter: number
  windowWidth: number
}

export async function loadDicomFile(buffer: ArrayBuffer): Promise<DicomImageData> {
  initializeCornerstone()

  const blob = new Blob([buffer], { type: "application/dicom" })
  const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(blob)

  const image: any = await cornerstone.loadImage(imageId)

  const canvas = document.createElement("canvas")
  canvas.width = image.width
  canvas.height = image.height

  cornerstone.enable(canvas)
  await cornerstone.displayImage(canvas, image)

  const ctx = canvas.getContext("2d")!
  const data = ctx.getImageData(0, 0, image.width, image.height).data

  cornerstone.disable(canvas)

  return {
    imageData: new Uint8ClampedArray(data),
    width: image.width,
    height: image.height,
    windowCenter: Array.isArray(image.windowCenter) ? image.windowCenter[0] : image.windowCenter,
    windowWidth: Array.isArray(image.windowWidth) ? image.windowWidth[0] : image.windowWidth,
  }
}

export function isDicomFile(path: string) {
  return path.toLowerCase().endsWith(".dcm")
}
