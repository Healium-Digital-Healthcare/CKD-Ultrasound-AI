"use client"

import { Button } from "@/components/ui/button"
import { ImageAnalysis } from "@/types/case"
import { ChevronLeft, ChevronRight, Circle, MousePointer, PenTool, Ruler, Square, Triangle } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'


type Point = { x: number; y: number }

interface MeasurementDrawing {
  tool: "linear" | "area" | "ellipse" | "angle"
  points: Point[]
  color: string
}


interface ImageViewerProps {
  selectedImage: ImageAnalysis | null
  zoom: number
  onZoomChange: (zoom: number) => void
}

export function ImageViewer({ selectedImage, zoom, onZoomChange }: ImageViewerProps) {
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [activeTool, setActiveTool] = useState<"none" | "linear" | "area" | "angle" | "ellipse" | "freehand">("none")
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentDrawing, setCurrentDrawing] = useState<Point[]>([])
  const [measurements, setMeasurements] = useState<MeasurementDrawing[]>([])
  const [freehandPath, setFreehandPath] = useState<Point[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault()
  }

  useEffect(() => {
    if (canvasRef.current && containerRef.current) {
      const canvas = canvasRef.current
      const container = containerRef.current
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
      drawMeasurements()
    }
  }, [measurements, zoom, pan, selectedImage])

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
      ctx.strokeStyle = measurement.color
      ctx.lineWidth = 2
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

    if (isDrawing && currentDrawing.length > 0) {
      ctx.strokeStyle = "#22c55e"
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      if (activeTool === "linear" && currentDrawing.length === 2) {
        ctx.beginPath()
        ctx.moveTo(currentDrawing[0].x, currentDrawing[0].y)
        ctx.lineTo(currentDrawing[1].x, currentDrawing[1].y)
        ctx.stroke()
      } else if (activeTool === "area" && currentDrawing.length === 2) {
        const width = currentDrawing[1].x - currentDrawing[0].x
        const height = currentDrawing[1].y - currentDrawing[0].y
        ctx.strokeRect(currentDrawing[0].x, currentDrawing[0].y, width, height)
      } else if (activeTool === "ellipse" && currentDrawing.length === 2) {
        const centerX = (currentDrawing[0].x + currentDrawing[1].x) / 2
        const centerY = (currentDrawing[0].y + currentDrawing[1].y) / 2
        const radiusX = Math.abs(currentDrawing[1].x - currentDrawing[0].x) / 2
        const radiusY = Math.abs(currentDrawing[1].y - currentDrawing[0].y) / 2
        ctx.beginPath()
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI)
        ctx.stroke()
      } else if (activeTool === "angle") {
        ctx.beginPath()
        ctx.moveTo(currentDrawing[0].x, currentDrawing[0].y)
        for (let i = 1; i < currentDrawing.length; i++) {
          ctx.lineTo(currentDrawing[i].x, currentDrawing[i].y)
        }
        ctx.stroke()
      }
    }

    if (activeTool === "freehand" && freehandPath.length > 1) {
      ctx.strokeStyle = "#22c55e"
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.beginPath()
      ctx.moveTo(freehandPath[0].x, freehandPath[0].y)
      for (let i = 1; i < freehandPath.length; i++) {
        ctx.lineTo(freehandPath[i].x, freehandPath[i].y)
      }
      ctx.stroke()
    }

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
    if (activeTool === "none" || activeTool === "freehand") {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
      
      if (activeTool === "freehand") {
        const point = getCanvasCoordinates(e)
        setFreehandPath([point])
      }
    } else {
      setIsDrawing(true)
      const point = getCanvasCoordinates(e)
      setCurrentDrawing([point])
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (activeTool === "none" || activeTool === "freehand") {
      if (isDragging) {
        if (activeTool === "freehand") {
          const point = getCanvasCoordinates(e)
          setFreehandPath(prev => [...prev, point])
          drawMeasurements()
        } else {
          setPan({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
          })
        }
      }
    } else if (isDrawing) {
      const point = getCanvasCoordinates(e)
      if (activeTool === "angle" && currentDrawing.length < 3) {
        setCurrentDrawing(prev => [...prev.slice(0, prev.length), point])
      } else {
        setCurrentDrawing(prev => [prev[0], point])
      }
      drawMeasurements()
    }
  }

  const handleMouseUp = () => {
    if (activeTool === "freehand" && isDragging) {
      setFreehandPath([])
      setIsDragging(false)
    } else if (isDrawing && currentDrawing.length > 0) {
      if (activeTool === "angle") {
        if (currentDrawing.length === 3) {
          setMeasurements(prev => [...prev, {
            tool: activeTool,
            points: currentDrawing,
            color: "#22c55e"
          }])
          setCurrentDrawing([])
          setIsDrawing(false)
        }
      } else if (currentDrawing.length === 2) {
        setMeasurements(prev => [...prev, {
          tool: activeTool as "linear" | "area" | "ellipse",
          points: currentDrawing,
          color: "#22c55e"
        }])
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
    setFreehandPath([])
  }

  const handleZoomChange = (newZoom: number) => {
    onZoomChange(newZoom)
    if (newZoom <= 100) {
      setPan({ x: 0, y: 0 })
    }
  }

  const handleToolSelect = (tool: "linear" | "area" | "angle" | "ellipse" | "freehand") => {
    setActiveTool(activeTool === tool ? "none" : tool)
    setIsDrawing(false)
    setCurrentDrawing([])
    setFreehandPath([])
  }

  const getCursor = () => {
    if (isDragging) return "grabbing"
    if (activeTool === "none") return "grab"
    if (activeTool === "freehand") return "crosshair"
    return "crosshair"
  }


  return (
    <div className="flex-1 bg-gray-50 flex flex-col min-w-0 overflow-hidden">
      {/* Viewer Controls */}
      <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between gap-2 px-4 flex-shrink-0">
        <div className="flex items-center gap-1">
          <Button
            variant={'ghost'}
            onClick={() => setActiveTool("none")}
            className={`p-1.5 rounded transition-colors ${
              activeTool === "none" ? "bg-green-600 text-white" : "text-gray-600"
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
        </div>
        <div className="flex items-center">
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
        className="flex-1 flex items-center justify-center p-4 overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: getCursor() }}
      >
        <div
          className="flex items-center justify-center transition-transform"
          style={{ 
            transform: `scale(${zoom / 100}) translate(${pan.x / (zoom / 100)}px, ${pan.y / (zoom / 100)}px)`,
            transition: isDragging ? 'none' : 'transform 0.2s'
          }}
        >
          <img
            src={selectedImage?.signed_url || "/placeholder.svg"}
            alt="Case Image"
            className="max-w-full max-h-full object-contain select-none pointer-events-none"
            onContextMenu={handleContextMenu}
            onDragStart={handleDragStart}
            draggable={false}
            style={{ userSelect: 'none' }}
          />
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
