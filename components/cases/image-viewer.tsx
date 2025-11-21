"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ImageAIAnalysis } from "@/types/case"
import { useState, useRef } from 'react'

interface ImageViewerProps {
  selectedImage: ImageAIAnalysis | null
  zoom: number
  onZoomChange: (zoom: number) => void
}

export function ImageViewer({ selectedImage, zoom, onZoomChange }: ImageViewerProps) {
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleZoomChange = (newZoom: number) => {
    onZoomChange(newZoom)
    if (newZoom <= 100) {
      setPan({ x: 0, y: 0 })
    }
  }

  return (
    <div className="flex-1 bg-gray-50 flex flex-col min-w-0 overflow-hidden">
      {/* Viewer Controls */}
      <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-end px-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleZoomChange(Math.max(50, zoom - 25))}
            className="text-gray-600"
          >
            -
          </Button>
          <span className="text-sm text-gray-600 w-16 text-center">{zoom}%</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleZoomChange(Math.min(200, zoom + 25))}
            className="text-gray-600"
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
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
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
      </div>
    </div>
  )
}
