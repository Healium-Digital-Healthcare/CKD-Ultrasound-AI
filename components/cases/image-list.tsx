"use client"

import { ImageAIAnalysis } from "@/types/case"

interface ImageListProps {
  images: ImageAIAnalysis[]
  selectedImage: ImageAIAnalysis | null
  onSelectImage: (image: ImageAIAnalysis) => void
}

export function ImageList({ images, selectedImage, onSelectImage }: ImageListProps) {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="bg-white border-r border-gray-200 flex flex-col flex-shrink-0 h-full">
      <div className="h-12 border-b border-gray-200 flex items-center px-2 flex-shrink-0">
        <span className="text-sm font-medium text-gray-700">Images ({images.length})</span>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-2 space-y-2">
          {images.map((image) => (
            <button
              key={image.id}
              onClick={() => onSelectImage(image)}
              className={`w-full p-2 rounded-lg border transition-all ${
                selectedImage?.id === image.id
                  ? "bg-primary/10 border-primary/20"
                  : "bg-white border-gray-200 hover:border-primary/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={image.signed_url || "/placeholder.svg"}
                  alt="Case Image"
                  className="w-16 h-16 rounded object-cover bg-gray-100 select-none"
                  onContextMenu={handleContextMenu}
                  onDragStart={handleDragStart}
                  draggable={false}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}