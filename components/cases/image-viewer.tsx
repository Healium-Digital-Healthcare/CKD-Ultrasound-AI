"use client"

import type React from "react"
import { Ruler, Square, Triangle, Circle, PenTool, MousePointer, Eraser } from "lucide-react"
import type { ImageAnalysis, Measurement } from "@/types/case"
import { useState, useRef, useEffect } from "react"
import { useSaveMeasurementsMutation } from "@/store/services/cases"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"

const CornerstoneViewer = dynamic(() => import("@/components/cases/cornerstone-viewer"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-gray-400">Loading DICOM...</div>,
})

interface ImageViewerProps {
  selectedImage: ImageAnalysis | null
  zoom: number
  onZoomChange: (zoom: number) => void
}

type Point = { x: number; y: number }

export function ImageViewer({ selectedImage, zoom, onZoomChange }: ImageViewerProps) {
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [activeTool, setActiveTool] = useState<
    "none" | "linear" | "area" | "angle" | "ellipse" | "freehand" | "eraser"
  >("none")
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentDrawing, setCurrentDrawing] = useState<Point[]>([])
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [hoveredMeasurementId, setHoveredMeasurementId] = useState<string | null>(null)
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null)
  const [fileType, setFileType] = useState<"image" | "dicom" | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)

  const [saveMeasurements, { isLoading: isSaving }] = useSaveMeasurementsMutation()

  useEffect(() => {
    if (selectedImage?.measurements) {
      setMeasurements(selectedImage.measurements)
    } else {
      setMeasurements([])
    }
  }, [selectedImage?.id])

  useEffect(() => {
    if (!overlayCanvasRef.current || !imageSize) return

    const canvas = overlayCanvasRef.current
    const width = imageSize.width ?? 0
    const height = imageSize.height ?? 0
    canvas.width = width
    canvas.height = height

    drawMeasurements()
  }, [imageSize, measurements, zoom, pan])

  useEffect(() => {
    if (selectedImage?.signed_url) {
      const urlWithoutQuery = selectedImage.signed_url.split("?")[0]
      const isDicom = urlWithoutQuery.toLowerCase().endsWith(".dcm")
      setFileType(isDicom ? "dicom" : "image")
    }
  }, [selectedImage?.signed_url])

  const drawMeasurements = () => {
    const canvas = overlayCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()

    ctx.scale(zoom / 100, zoom / 100)
    ctx.translate(pan.x / (zoom / 100), pan.y / (zoom / 100))

    measurements.forEach((measurement) => {
      const isHovered = activeTool === "eraser" && hoveredMeasurementId === measurement.id
      ctx.strokeStyle = isHovered ? "#ef4444" : measurement.color || "#22c55e"
      ctx.lineWidth = isHovered ? 3 : 2
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      if (measurement.tool === "linear" && measurement.points.length === 2) {
        ctx.beginPath()
        ctx.moveTo(measurement.points[0].x, measurement.points[0].y)
        ctx.lineTo(measurement.points[1].x, measurement.points[1].y)
        ctx.stroke()
      } else if (measurement.tool === "area" && measurement.points.length === 2) {
        const width = measurement.points[1].x - measurement.points[0].x
        const height = measurement.points[1].y - measurement.points[0].y
        ctx.strokeRect(measurement.points[0].x, measurement.points[0].y, width, height)
      } else if (measurement.tool === "ellipse" && measurement.points.length === 2) {
        const centerX = (measurement.points[0].x + measurement.points[1].x) / 2
        const centerY = (measurement.points[0].y + measurement.points[1].y) / 2
        const radiusX = Math.abs(measurement.points[1].x - measurement.points[0].x) / 2
        const radiusY = Math.abs(measurement.points[1].y - measurement.points[0].y) / 2
        ctx.beginPath()
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI)
        ctx.stroke()
      } else if (measurement.tool === "angle" && measurement.points.length === 3) {
        ctx.beginPath()
        ctx.moveTo(measurement.points[0].x, measurement.points[0].y)
        ctx.lineTo(measurement.points[1].x, measurement.points[1].y)
        ctx.lineTo(measurement.points[2].x, measurement.points[2].y)
        ctx.stroke()
      }
    })

    ctx.restore()
  }

  const getCanvasCoordinates = (e: React.MouseEvent): Point => {
    const canvas = overlayCanvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const x = ((e.clientX - rect.left) * scaleX) / (zoom / 100) - pan.x / (zoom / 100)
    const y = ((e.clientY - rect.top) * scaleY) / (zoom / 100) - pan.y / (zoom / 100)

    return { x, y }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === "eraser") {
      const point = getCanvasCoordinates(e)
      const measurementId = findMeasurementAtPoint(point)
      if (measurementId) setMeasurements((prev) => prev.filter((m) => m.id !== measurementId))
      return
    }

    if (activeTool === "none") {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
      return
    }

    if (activeTool === "freehand") {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    } else {
      setIsDrawing(true)
      const point = getCanvasCoordinates(e)
      setCurrentDrawing([point])
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (activeTool === "eraser") {
      const point = getCanvasCoordinates(e)
      const measurementId = findMeasurementAtPoint(point)
      setHoveredMeasurementId(measurementId)
      return
    }

    if (activeTool === "none") {
      if (isDragging) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
      return
    }

    if (activeTool === "freehand") {
      if (isDragging) {
        const point = getCanvasCoordinates(e)
        setCurrentDrawing((prev) => [...prev, point])
      }
    } else if (isDrawing) {
      const point = getCanvasCoordinates(e)
      if (activeTool === "angle" && currentDrawing.length < 3) setCurrentDrawing((prev) => [...prev, point])
      else setCurrentDrawing((prev) => [prev[0], point])
    }
  }

  const handleMouseUp = () => {
    if (isDrawing && currentDrawing.length > 0) {
      if (activeTool === "angle" && currentDrawing.length === 3) {
        setMeasurements((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random()}`,
            tool: activeTool,
            points: currentDrawing,
            color: "#22c55e",
            createdAt: new Date().toISOString(),
          },
        ])
        setCurrentDrawing([])
        setIsDrawing(false)
      } else if (currentDrawing.length === 2) {
        setMeasurements((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random()}`,
            tool: activeTool as "linear" | "area" | "ellipse",
            points: currentDrawing,
            color: "#22c55e",
            createdAt: new Date().toISOString(),
          },
        ])
        setCurrentDrawing([])
        setIsDrawing(false)
      }
    } else setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    setIsDrawing(false)
  }

  const handleZoomChange = (newZoom: number) => {
    onZoomChange(newZoom)
    if (newZoom <= 100) setPan({ x: 0, y: 0 })
  }

  const handleToolSelect = (tool: "linear" | "area" | "angle" | "ellipse" | "freehand" | "eraser") => {
    setActiveTool(activeTool === tool ? "none" : tool)
    setIsDrawing(false)
    setCurrentDrawing([])
    setHoveredMeasurementId(null)
  }

  const getCursor = () => {
    if (isDragging) return "grabbing"
    if (activeTool === "eraser") return "crosshair"
    if (activeTool === "none") return "grab"
    return "crosshair"
  }

  const handleSaveMeasurements = async () => {
    if (!selectedImage?.id) return
    try {
      await saveMeasurements({ imageId: selectedImage.id, measurements }).unwrap()
    } catch (error) {
      console.error("[v0] Error saving measurements:", error)
    }
  }

  const findMeasurementAtPoint = (point: Point): string | null => {
    const threshold = 10 / (zoom / 100)

    for (const measurement of measurements) {
      if (measurement.tool === "linear" && measurement.points.length === 2) {
        const [p1, p2] = measurement.points
        if (distanceToLine(point, p1, p2) < threshold) return measurement.id
      } else if ((measurement.tool === "area" || measurement.tool === "ellipse") && measurement.points.length === 2) {
        const [p1, p2] = measurement.points
        if (
          point.x >= Math.min(p1.x, p2.x) - threshold &&
          point.x <= Math.max(p1.x, p2.x) + threshold &&
          point.y >= Math.min(p1.y, p2.y) - threshold &&
          point.y <= Math.max(p1.y, p2.y) + threshold
        )
          return measurement.id
      } else if (measurement.tool === "angle" && measurement.points.length === 3) {
        for (let i = 0; i < measurement.points.length - 1; i++)
          if (distanceToLine(point, measurement.points[i], measurement.points[i + 1]) < threshold) return measurement.id
      }
    }

    return null
  }

  const distanceToLine = (point: Point, lineStart: Point, lineEnd: Point): number => {
    const A = point.x - lineStart.x
    const B = point.y - lineStart.y
    const C = lineEnd.x - lineStart.x
    const D = lineEnd.y - lineStart.y
    const dot = A * C + B * D
    const lenSq = C * C + D * D
    const param = lenSq !== 0 ? dot / lenSq : -1
    const xx = param < 0 ? lineStart.x : param > 1 ? lineEnd.x : lineStart.x + param * C
    const yy = param < 0 ? lineStart.y : param > 1 ? lineEnd.y : lineStart.y + param * D
    const dx = point.x - xx
    const dy = point.y - yy
    return Math.sqrt(dx * dx + dy * dy)
  }

  return (
    <div className="flex-1 bg-gray-50 flex flex-col min-w-0 overflow-hidden relative">
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-white rounded-lg p-1 shadow-lg">
        <Button
          variant="ghost"
          onClick={() => setActiveTool("none")}
          className={`tool-btn w-8 h-8 p-0 rounded-md transition-colors flex items-center justify-center ${activeTool === "none" ? "bg-emerald-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
          title="Selection Tool"
        >
          <MousePointer className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleToolSelect("linear")}
          className={`tool-btn w-8 h-8 p-0 rounded-md transition-colors flex items-center justify-center ${activeTool === "linear" ? "bg-emerald-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
          title="Linear Measurement"
        >
          <Ruler className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleToolSelect("area")}
          className={`tool-btn w-8 h-8 p-0 rounded-md transition-colors flex items-center justify-center ${activeTool === "area" ? "bg-emerald-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
          title="Area Measurement"
        >
          <Square className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleToolSelect("ellipse")}
          className={`tool-btn w-8 h-8 p-0 rounded-md transition-colors flex items-center justify-center ${activeTool === "ellipse" ? "bg-emerald-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
          title="Ellipse Measurement"
        >
          <Circle className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleToolSelect("angle")}
          className={`tool-btn w-8 h-8 p-0 rounded-md transition-colors flex items-center justify-center ${activeTool === "angle" ? "bg-emerald-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
          title="Angle Measurement"
        >
          <Triangle className="h-4 w-4" />
        </Button>
        <div className="w-px h-5 bg-gray-200 mx-0.5"></div>
        <Button
          variant="ghost"
          onClick={() => handleToolSelect("freehand")}
          className={`tool-btn w-8 h-8 p-0 rounded-md transition-colors flex items-center justify-center ${activeTool === "freehand" ? "bg-emerald-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
          title="Freehand Drawing"
        >
          <PenTool className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleToolSelect("eraser")}
          className={`tool-btn w-8 h-8 p-0 rounded-md transition-colors flex items-center justify-center ${activeTool === "eraser" ? "bg-red-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
          title="Eraser"
        >
          <Eraser className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-white rounded-lg p-1 shadow-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleZoomChange(Math.max(50, zoom - 25))}
          className="w-7 h-7 p-0 text-gray-600 hover:bg-gray-100 rounded-md transition-colors flex items-center justify-center"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </Button>
        <span className="text-xs font-medium text-gray-700 w-12 text-center">{zoom}%</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleZoomChange(Math.min(200, zoom + 25))}
          className="w-7 h-7 p-0 text-gray-600 hover:bg-gray-100 rounded-md transition-colors flex items-center justify-center"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Button>
      </div>

      {fileType === "dicom" && selectedImage ? (
        <CornerstoneViewer
          signedUrl={selectedImage.signed_url!}
          kidneySide={selectedImage.kidney_type || "Kidney"}
          zoom={zoom}
          onZoomChange={onZoomChange}
          activeTool={activeTool}
          isDragging={isDragging}
          pan={pan} // Pass pan state
          dragStart={dragStart} // Pass dragStart state
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
      ) : (
        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center p-6 overflow-hidden relative"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: getCursor() }}
        >
          <div
            className="flex items-center justify-center transition-transform relative"
            style={{
              transform: `scale(${zoom / 100}) translate(${pan.x / (zoom / 100)}px, ${pan.y / (zoom / 100)}px)`,
              transition: isDragging || isDrawing ? "none" : "transform 0.2s",
            }}
          >
            <div style={{ position: "relative" }}>
              <div className="relative max-w-full max-h-full">
                <img
                  ref={imageRef}
                  src={selectedImage?.signed_url || "/placeholder.svg?height=380&width=480&query=ultrasound+kidney"}
                  alt="Case Image"
                  draggable={false}
                  className="w-full h-full rounded-lg object-contain select-none pointer-events-none"
                  onLoad={(e) => {
                    const img = e.currentTarget
                    setImageSize({ width: img.naturalWidth, height: img.naturalHeight })
                  }}
                />
              </div>
              <canvas ref={overlayCanvasRef} className="absolute inset-0" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
