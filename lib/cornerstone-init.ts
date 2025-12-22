import dicomParser from "dicom-parser"
import cornerstone from "cornerstone-core"
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader"

let initialized = false

export function initializeCornerstone() {
  if (initialized) return

  // Configure cornerstone WADO Image Loader
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser

  // Configure the WADO Image Loader
  cornerstoneWADOImageLoader.configure({
    useWebWorkers: true,
    decodeConfig: {
      convertFloatPixelDataToInt: false,
      use16BitDataType: true,
    },
  })

  const config = {
    maxWebWorkers: navigator.hardwareConcurrency || 1,
    startWebWorkersOnDemand: true,
    taskConfiguration: {
      decodeTask: {
        initializeCodecsOnStartup: false,
        strict: false,
      },
    },
  }

  cornerstoneWADOImageLoader.webWorkerManager.initialize(config)

  initialized = true
  console.log("[v0] Cornerstone initialized successfully")
}

export { cornerstone, cornerstoneWADOImageLoader, dicomParser }
