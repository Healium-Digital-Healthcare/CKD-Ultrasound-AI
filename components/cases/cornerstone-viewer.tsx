"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import cornerstone from "cornerstone-core"
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader"
import dicomParser from "dicom-parser"

interface CornerstoneViewerProps {
  signedUrl: string
  kidneySide: string
  zoom: number
  onZoomChange: (zoom: number) => void
  activeTool: "none" | "linear" | "area" | "angle" | "ellipse" | "freehand" | "eraser"
  isDragging: boolean
  pan: { x: number; y: number } // Added pan prop
  dragStart: { x: number; y: number } // Added dragStart prop
  onMouseDown: (e: React.MouseEvent) => void
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: () => void
  onMouseLeave: () => void
}

export default function CornerstoneViewer({
  signedUrl,
  kidneySide,
  zoom,
  onZoomChange,
  activeTool,
  isDragging,
  pan, // Added pan
  dragStart, // Added dragStart
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
}: CornerstoneViewerProps) {
  const dicomRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!signedUrl || !dicomRef.current) return

    const loadDicom = async () => {
      const element = dicomRef.current
      if (!element) return

      setIsLoading(true)
      setError(null)

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
        setError(err instanceof Error ? err.message : "Failed to load DICOM file")
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

  useEffect(() => {
    if (activeTool === "none" && isDragging) {
      // No action needed as pan is now a prop
    }
  }, [isDragging])

  const getCursor = () => {
    if (isDragging) return "grabbing"
    if (activeTool === "eraser") return "crosshair"
    if (activeTool === "none") return "grab"
    return "crosshair"
  }

  return (
    <div
      className="flex-1 flex items-center justify-center p-6 overflow-hidden relative bg-gray-50"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      style={{ cursor: getCursor() }}
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{ transform: `scale(${zoom / 100}) translate(${pan.x / (zoom / 100)}px, ${pan.y / (zoom / 100)}px)` }} // Apply pan transform
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
            <p className="text-gray-300">Loading DICOM...</p>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900/40 rounded-lg">
            <div className="text-center">
              <p className="text-red-300 text-sm font-medium mb-2">Failed to load DICOM</p>
              <p className="text-red-200 text-xs">{error}</p>
            </div>
          </div>
        )}
        <div
          ref={dicomRef}
          className="w-full h-full max-w-[600px] max-h-[600px] rounded-lg shadow-2xl overflow-hidden"
          style={{ backgroundColor: "#000000" }}
        />
      </div>
    </div>
  )
}
