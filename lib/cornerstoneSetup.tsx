let cachedCornerstone: any = null

export async function loadCornerstone() {
  if (typeof window === "undefined") return null
  if (cachedCornerstone) return cachedCornerstone

  const cornerstone = (await import("cornerstone-core")).default
  const cornerstoneWADOImageLoader = (
    await import("cornerstone-wado-image-loader")
  ).default
  const dicomParser = (await import("dicom-parser")).default

  cornerstoneWADOImageLoader.external.cornerstone = cornerstone
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser

  cornerstoneWADOImageLoader.configure({
    beforeSend: () => {},
  })

  cornerstone.registerImageLoader(
    "wadouri",
    cornerstoneWADOImageLoader.wadouri.loadImage
  )

  cachedCornerstone = cornerstone
  return cornerstone
}
