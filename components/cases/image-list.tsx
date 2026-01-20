"use client"

import type React from "react"
import { DicomPreview } from "./dicom-preview"
import type { ImageAnalysis } from "@/types/case"
import { cn } from "@/lib/utils"

interface ImageListProps {
  images: ImageAnalysis[]
  selectedImage: ImageAnalysis | null
  onSelectImage: (image: ImageAnalysis) => void
}

const getFileType = (path: string) => {
  const cleanPath = path.split("?")[0]
  return cleanPath.toLowerCase().endsWith(".dcm") ? "dicom" : "image"
}

export function ImageList({ images, selectedImage, onSelectImage }: ImageListProps) {
  return (
    <>
      <div className="bg-white border-r border-gray-200 flex flex-col h-full w-32 flex-shrink-0">
        <div className="h-12 border-b border-gray-200 flex items-center px-4 flex-shrink-0">
          <span className="text-sm font-medium text-gray-700">Images ({images.length})</span>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
          <div className="p-2 space-y-2">
            {images.map((image, idx) => {
              const fileType = getFileType(image.image_path)

              return (
                <div
                  key={image.id}
                  onClick={() => onSelectImage(image)}
                  className={`rounded-lg border transition-all ${
                    selectedImage?.id === image.id
                      ? "bg-primary/10 border-primary/20"
                      : "bg-white border-gray-200 hover:bg-primary/10 hover:border-primary/20"
                  }`}
                >
                  <button
                    key={image.id}
                    className="flex items-center gap-2.5 px-2 py-2"
                  >
                    <div className={cn("w-12 h-12 rounded border overflow-hidden flex-shrink-0")}>
                      {fileType === "dicom" ? (
                        <DicomPreview signedUrl={image.signed_url || ""} className="w-full h-full" />
                      ) : (
                        <img
                          src={image.signed_url || "/placeholder.svg"}
                          alt={`${image.kidney_type} ${image.id}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-xs font-medium text-foreground capitalize">{image.kidney_type} Kidney</p>
                    </div>
                  </button>
                  <p className="p-2 text-xs text-muted-foreground">
                    {fileType === "dicom" ? "DICOM File" : `Image File`}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}