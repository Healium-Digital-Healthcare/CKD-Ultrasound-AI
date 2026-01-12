"use client"

import { loadCornerstone } from "@/lib/cornerstoneSetup"
import { useEffect, useRef, useState } from "react"

interface DicomPreviewProps {
  signedUrl: string
  className?: string
}

export function DicomPreview({ signedUrl, className = "" }: DicomPreviewProps) {
  const dicomRef = useRef<HTMLDivElement>(null)
  const [cornerstone, setCornerstone] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // ✅ Load Cornerstone client-side only
  useEffect(() => {
    loadCornerstone().then(setCornerstone)
  }, [])

  // ✅ Load DICOM
  useEffect(() => {
    if (!cornerstone || !signedUrl || !dicomRef.current) return

    const element = dicomRef.current
    let cancelled = false

    const loadDicom = async () => {
      setIsLoading(true)
      setError(false)

      try {
        try {
          cornerstone.disable(element)
        } catch {}

        element.innerHTML = ""
        cornerstone.enable(element)

        const imageId = `wadouri:${signedUrl}`
        const image = await cornerstone.loadAndCacheImage(imageId)

        if (cancelled) return

        cornerstone.reset(element)
        cornerstone.displayImage(element, image)
        cornerstone.fitToWindow(element)

        setIsLoading(false)
      } catch (err) {
        console.error("[DicomPreview]", err)
        setError(true)
        setIsLoading(false)
      }
    }

    loadDicom()

    return () => {
      cancelled = true
      try {
        cornerstone.disable(element)
        element.innerHTML = ""
      } catch {}
    }
  }, [cornerstone, signedUrl])

  if (error) {
    return (
      <div
        className={`bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center ${className}`}
      >
        <span className="text-xs font-semibold text-red-700">Error</span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
          <span className="text-[10px] text-gray-200">Loading…</span>
        </div>
      )}

      <div
        ref={dicomRef}
        className="w-full h-full"
      />
    </div>
  )
}
