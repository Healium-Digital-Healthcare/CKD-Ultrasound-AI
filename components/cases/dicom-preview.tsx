"use client"

import { useEffect, useRef, useState } from "react"

import cornerstone from "cornerstone-core"
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader"
import dicomParser from "dicom-parser"

interface DicomPreviewProps {
  signedUrl: string
  className?: string
}

export function DicomPreview({ signedUrl, className = "" }: DicomPreviewProps) {
  const dicomRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  
  useEffect(() => {
    if (!signedUrl || !dicomRef.current) return

    const loadDicom = async () => {
      const element = dicomRef.current
      if (!element) return

      setIsLoading(true)
      setError(false)

      try {
        cornerstoneWADOImageLoader.external.cornerstone = cornerstone
        cornerstoneWADOImageLoader.external.dicomParser = dicomParser

        cornerstoneWADOImageLoader.configure({
          beforeSend: (xhr: XMLHttpRequest) => {
            // No credentials needed - token is in the signed URL
          },
        })

        cornerstone.registerImageLoader("wadouri", cornerstoneWADOImageLoader.wadouri.loadImage)

        // Small delay for DOM
        await new Promise((resolve) => setTimeout(resolve, 50))

        // Enable element
        cornerstone.enable(element)

        const imageId = `wadouri:${signedUrl}`

        const image = await cornerstone.loadImage(imageId)
        cornerstone.displayImage(element, image)
        setIsLoading(false)
      } catch (err) {
        console.error("[v0] Error loading DICOM:", err)
        setError(true)
        setIsLoading(false)

        // Cleanup on error
        if (element) {
          try {
            cornerstone.disable(element)
          } catch (e) {
            console.warn("[v0] Error disabling element:", e)
          }
        }
      }
    }

    loadDicom()

    // Cleanup
    return () => {
      if (dicomRef.current) {
        try {
          cornerstone.disable(dicomRef.current)
        } catch (e) {
          console.warn("[v0] Cleanup error:", e)
        }
      }
    }
  }, [signedUrl])

  if (error) {
    return (
      <div className={`bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center ${className}`}>
        <span className="text-xs font-semibold text-red-700">Error</span>
      </div>
    )
  }

  return <div ref={dicomRef} className={`${className}`} />
}