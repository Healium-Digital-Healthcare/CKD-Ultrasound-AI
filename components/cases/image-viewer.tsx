"use client"

import type React from "react"
import {
  ZoomIn,
  ZoomOut,
  Ruler,
  Square,
  Triangle,
  Circle,
  PenTool,
  MousePointer,
  Trash2,
  Save,
  Eraser,
} from "lucide-react"
import type { ImageAnalysis, Measurement } from "@/types/case"
import { useState, useRef, useEffect } from "react"
import { useSaveMeasurementsMutation } from "@/store/services/cases"
import { Button } from "@/components/ui/button"
import { loadDicomFile, isDicomFile, type DicomImageData } from "@/lib/dicom-loader"

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
  const [activeTool, setActiveTool] = useState<"none" | "linear" | "area" | "angle" | "ellipse" | "freehand" | "eraser">("none")
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentDrawing, setCurrentDrawing] = useState<Point[]>([])
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [hoveredMeasurementId, setHoveredMeasurementId] = useState<string | null>(null)
  const [dicomData, setDicomData] = useState<DicomImageData | null>(null)
  const [isLoadingDicom, setIsLoadingDicom] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const dicomCanvasRef = useRef<HTMLCanvasElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)


  const [saveMeasurements, { isLoading: isSaving }] = useSaveMeasurementsMutation()
  
    useEffect(() => {
    if (selectedImage?.signed_url && selectedImage?.image_path && isDicomFile(selectedImage.image_path)) {
      setIsLoadingDicom(true)
      setDicomData(null)

      fetch(selectedImage.signed_url)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => loadDicomFile(arrayBuffer))
        .then((data) => {
          if (data) {
            setDicomData(data)
          }
          setIsLoadingDicom(false)
        })
        .catch((error) => {
          console.error("[v0] Error loading DICOM file:", error)
          setIsLoadingDicom(false)
        })
    } else {
      setDicomData(null)
      setIsLoadingDicom(false)
    }
  }, [selectedImage?.id, selectedImage?.signed_url, selectedImage?.image_path])

  useEffect(() => {
    if (!dicomData || !dicomCanvasRef.current) return

    const canvas = dicomCanvasRef.current
    canvas.width = dicomData.width
    canvas.height = dicomData.height

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const imageData = ctx.createImageData(dicomData.width, dicomData.height)
    imageData.data.set(dicomData.imageData)
    ctx.putImageData(imageData, 0, 0)
  }, [dicomData])

  useEffect(() => {
    if (!overlayCanvasRef.current || !dicomData) return

    const canvas = overlayCanvasRef.current
    canvas.width = dicomData.width
    canvas.height = dicomData.height

    drawMeasurements()
  }, [dicomData, measurements])

  useEffect(() => {
    if (canvasRef.current && containerRef.current) {
      const canvas = canvasRef.current
      const container = containerRef.current
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
      drawMeasurements()
    }
  }, [measurements, zoom, pan, selectedImage])

  useEffect(() => {
    if (selectedImage?.measurements) {
      setMeasurements(selectedImage.measurements)
    } else {
      setMeasurements([])
    }
  }, [selectedImage?.id])

  const drawMeasurements = () => {
    const canvas = canvasRef.current
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
    const canvas = canvasRef.current
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
      if (measurementId) {
        setMeasurements((prev) => prev.filter((m) => m.id !== measurementId))
        setHoveredMeasurementId(null)
      }
      return
    }

    if (activeTool === "none" || activeTool === "freehand") {
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

    if (activeTool === "none" || activeTool === "freehand") {
      if (isDragging) {
        setPan({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        })
      }
    } else if (isDrawing) {
      const point = getCanvasCoordinates(e)
      if (activeTool === "angle" && currentDrawing.length < 3) {
        setCurrentDrawing((prev) => [...prev.slice(0, prev.length), point])
      } else {
        setCurrentDrawing((prev) => [prev[0], point])
      }
    }
  }

  const handleMouseUp = () => {
    if (isDrawing && currentDrawing.length > 0) {
      if (activeTool === "angle") {
        if (currentDrawing.length === 3) {
          const newMeasurement: Measurement = {
            id: `${Date.now()}-${Math.random()}`,
            tool: activeTool,
            points: currentDrawing,
            color: "#22c55e",
            createdAt: new Date().toISOString(),
          }
          setMeasurements((prev) => [...prev, newMeasurement])
          setCurrentDrawing([])
          setIsDrawing(false)
        }
      } else if (currentDrawing.length === 2) {
        const newMeasurement: Measurement = {
          id: `${Date.now()}-${Math.random()}`,
          tool: activeTool as "linear" | "area" | "ellipse",
          points: currentDrawing,
          color: "#22c55e",
          createdAt: new Date().toISOString(),
        }
        setMeasurements((prev) => [...prev, newMeasurement])
        setCurrentDrawing([])
        setIsDrawing(false)
      }
    } else {
      setIsDragging(false)
    }
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    setIsDrawing(false)
  }

  const handleZoomChange = (newZoom: number) => {
    onZoomChange(newZoom)
    if (newZoom <= 100) {
      setPan({ x: 0, y: 0 })
    }
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
      await saveMeasurements({
        imageId: selectedImage.id,
        measurements,
      }).unwrap()

    } catch (error) {
      console.error("[v0] Error saving measurements:", error)
    }
  }

  const handleClearMeasurements = () => {
    setMeasurements([])
  }

  const findMeasurementAtPoint = (point: Point): string | null => {
    const threshold = 10 / (zoom / 100)

    for (const measurement of measurements) {
      if (measurement.tool === "linear" && measurement.points.length === 2) {
        const [p1, p2] = measurement.points
        const distance = distanceToLine(point, p1, p2)
        if (distance < threshold) return measurement.id
      } else if ((measurement.tool === "area" || measurement.tool === "ellipse") && measurement.points.length === 2) {
        const [p1, p2] = measurement.points
        if (
          point.x >= Math.min(p1.x, p2.x) - threshold &&
          point.x <= Math.max(p1.x, p2.x) + threshold &&
          point.y >= Math.min(p1.y, p2.y) - threshold &&
          point.y <= Math.max(p1.y, p2.y) + threshold
        ) {
          return measurement.id
        }
      } else if (measurement.tool === "angle" && measurement.points.length === 3) {
        for (let i = 0; i < measurement.points.length - 1; i++) {
          const distance = distanceToLine(point, measurement.points[i], measurement.points[i + 1])
          if (distance < threshold) return measurement.id
        }
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
    let param = -1

    if (lenSq !== 0) param = dot / lenSq

    let xx, yy

    if (param < 0) {
      xx = lineStart.x
      yy = lineStart.y
    } else if (param > 1) {
      xx = lineEnd.x
      yy = lineEnd.y
    } else {
      xx = lineStart.x + param * C
      yy = lineStart.y + param * D
    }

    const dx = point.x - xx
    const dy = point.y - yy
    return Math.sqrt(dx * dx + dy * dy)
  }

  return (
    <div className="flex-1 bg-gray-50 flex flex-col min-w-0 overflow-hidden">
      <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between gap-2 px-4 flex-shrink-0">
        
        <div className="flex items-center">
          <Button
            variant={'ghost'}
            onClick={() => setActiveTool("none")}
            className={`p-1.5 rounded transition-colors ${
              activeTool === "none" ? "bg-primary text-white" : "text-gray-600"
            }`}
            title="Selection Tool"
          >
            <MousePointer className="h-4 w-4" />
          </Button>
          <Button
            variant={'ghost'}
            onClick={() => handleToolSelect("linear")}
            className={`p-1.5 rounded transition-colors ${
              activeTool === "linear" ? "bg-primary text-white" : "text-gray-600"
            }`}
            title="Linear Measurement"
          >
            <Ruler className="h-4 w-4" />
          </Button>
          <Button
            variant={'ghost'}
            onClick={() => handleToolSelect("area")}
            className={`p-1.5 rounded transition-colors ${
              activeTool === "area" ? "bg-primary text-white" : "text-gray-600"
            }`}
            title="Area Measurement"
          >
            <Square className="h-4 w-4" />
          </Button>
          <Button
            variant={'ghost'}
            onClick={() => handleToolSelect("ellipse")}
            className={`p-1.5 rounded transition-colors ${
              activeTool === "ellipse" ? "bg-primary text-white" : "text-gray-600"
            }`}
            title="Ellipse Measurement"
          >
            <Circle className="h-4 w-4" />
          </Button>
          <Button
            variant={'ghost'}
            onClick={() => handleToolSelect("angle")}
            className={`p-1.5 rounded transition-colors ${
              activeTool === "angle" ? "bg-primary text-white" : "text-gray-600"
            }`}
            title="Angle Measurement"
          >
            <Triangle className="h-4 w-4" />
          </Button>
          <Button
            variant={'ghost'}
            onClick={() => handleToolSelect("freehand")}
            className={`p-1.5 rounded transition-colors ${
              activeTool === "freehand" ? "bg-primary text-white" : "text-gray-600"
            }`}
            title="Freehand Drawing"
          >
            <PenTool className="h-4 w-4" />
          </Button>
          <Button
            variant={'ghost'}
            onClick={() => handleToolSelect("eraser")}
            className={`p-1.5 rounded transition-colors ${
              activeTool === "eraser" ? "bg-red-600 text-white" : "text-gray-600"
            }`}
            title="Eraser - Click measurements to delete"
          >
            <Eraser className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
          {/* {measurements.length > 0 && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClearMeasurements}
                className="h-8 text-white hover:bg-gray-700"
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                Clear ({measurements.length})
              </Button>
              <Button size="sm" onClick={handleSaveMeasurements} disabled={isSaving} className="h-8">
                <Save className="h-4 w-4 mr-1.5" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </>
          )} */}
        </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
        variant="ghost"
        size="sm"
        onClick={() => handleZoomChange(Math.max(50, zoom - 25))}
        className="text-gray-600 text-lg"
      >
        -
          </Button>
          <span className="text-sm text-gray-600 w-16 text-center">{zoom}%</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleZoomChange(Math.min(200, zoom + 25))}
            className="text-gray-600 text-lg"
          >
            +
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-4 overflow-hidden relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: getCursor() }}
      >
        {/* className="flex items-center justify-center transition-transform"
          style={{
            transform: `scale(${zoom / 100}) translate(${pan.x / (zoom / 100)}px, ${pan.y / (zoom / 100)}px)`,
            transition: isDragging || isDrawing ? "none" : "transform 0.2s",
          }} */}
        <div
          className="flex items-center justify-center transition-transform"
          style={{
            width: dicomData?.width ?? imageRef.current?.naturalWidth,
            height: dicomData?.height ?? imageRef.current?.naturalHeight,
            // transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
            // transformOrigin: "top left",
            transform: `scale(${zoom / 100}) translate(${pan.x / (zoom / 100)}px, ${pan.y / (zoom / 100)}px)`,
            transition: isDragging || isDrawing ? "none" : "transform 0.2s",
          }}
        >
          {isLoadingDicom ? (
            <div className="text-sm">Loading DICOM...</div>
          ) : dicomData ? (
           <div
            className="relative"
            style={{
              width: dicomData.width,
              height: dicomData.height,
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
              transformOrigin: "top left",
            }}
          >
            <canvas ref={dicomCanvasRef} />
            <canvas ref={overlayCanvasRef} className="absolute inset-0" />
          </div>
          ) : (
            <img
              ref={imageRef}
              src={selectedImage?.signed_url || "/placeholder.svg"}
              alt="Case Image"
              className="max-w-full max-h-full object-contain select-none pointer-events-none"
              draggable={false}
              style={{ userSelect: "none" }}
            />
          )}
        </div>

        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  )
}
