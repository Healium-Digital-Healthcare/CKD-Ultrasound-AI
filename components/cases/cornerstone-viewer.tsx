"use client"

import { loadCornerstone } from "@/lib/cornerstoneSetup"
import type React from "react"
import { useEffect, useRef, useState } from "react"

interface CornerstoneViewerProps {
  signedUrl: string
  kidneySide: string
  zoom: number
  activeTool: "none" | "linear" | "area" | "angle" | "ellipse" | "freehand" | "eraser"
  isDragging: boolean
  pan: { x: number; y: number }
  onMouseDown: (e: React.MouseEvent) => void
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: () => void
  onMouseLeave: () => void
}

export default function CornerstoneViewer(props: CornerstoneViewerProps) {
  const {
    signedUrl,
    zoom,
    activeTool,
    isDragging,
    pan,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
  } = props

  const dicomRef = useRef<HTMLDivElement>(null)
  const [cornerstone, setCornerstone] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ✅ Load Cornerstone CLIENT-ONLY
  useEffect(() => {
    loadCornerstone().then(setCornerstone)
  }, [])

  // ✅ Load image
  useEffect(() => {
    if (!cornerstone || !signedUrl || !dicomRef.current) return

    const element = dicomRef.current
    let cancelled = false

    const loadDicom = async () => {
      setIsLoading(true)
      setError(null)

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
        console.error("[Cornerstone]", err)
        setError("Failed to load DICOM")
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

  const getCursor = () => {
    if (isDragging) return "grabbing"
    if (activeTool === "eraser") return "crosshair"
    if (activeTool === "none") return "grab"
    return "crosshair"
  }

  return (
    <div
      className="flex-1 flex items-center justify-center p-6 overflow-hidden relative"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      style={{ cursor: getCursor() }}
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          transform: `scale(${zoom / 100}) translate(${pan.x / (zoom / 100)}px, ${pan.y / (zoom / 100)}px)`,
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg">
            <p className="">Loading DICOM...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900/40 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div
          ref={dicomRef}
          className="w-full h-full max-w-[600px] max-h-[600px] rounded-lg shadow-2xl overflow-hidden"
        />
      </div>
    </div>
  )
}
