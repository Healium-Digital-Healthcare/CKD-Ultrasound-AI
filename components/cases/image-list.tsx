"use client"

import type React from "react"

import type { ImageAnalysis } from "@/types/case"
import { Check, MoreHorizontal, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useDeleteImageMutation } from "@/store/services/cases"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

interface ImageListProps {
  images: ImageAnalysis[]
  selectedImage: ImageAnalysis | null
  onSelectImage: (image: ImageAnalysis) => void
}

export function ImageList({ images, selectedImage, onSelectImage }: ImageListProps) {
  const [deleteImage, { isLoading: isDeleting }] = useDeleteImageMutation()
  const [imageToDelete, setImageToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDeleteClick = (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setImageToDelete(imageId)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent dialog from auto-closing

    if (!imageToDelete) return

    try {
      await deleteImage(imageToDelete).unwrap()
      if (selectedImage?.id === imageToDelete) {
        const remainingImages = images.filter((img) => img.id !== imageToDelete)
        if (remainingImages.length > 0) {
          onSelectImage(remainingImages[0])
        }
      }
      setIsDeleteDialogOpen(false) // Only close dialog after successful deletion
      setImageToDelete(null)
    } catch (error) {
      console.error("Failed to delete image:", error)
      setIsDeleteDialogOpen(false) // Close dialog even on error to allow retry
      setImageToDelete(null)
    }
  }

  return (
    <>
      <div className="bg-white border-r border-gray-200 flex flex-col h-full w-fit">
        <div className="h-12 border-b border-gray-200 flex items-center px-4 flex-shrink-0">
          <span className="text-sm font-medium text-gray-700">Images ({images.length})</span>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-2 space-y-2">
            {images.map((image, idx) => (
              <div
                key={image.id}
                className={`rounded-lg border transition-all ${
                  selectedImage?.id === image.id
                    ? "bg-primary/10 border-primary/20"
                    : "bg-white border-gray-200 hover:bg-primary/10 hover:border-primary/20"
                }`}
              >
                {/* <div className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={(e) => handleDeleteClick(image.id, e)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div> */}

                <button
                  key={image.id}
                  onClick={() => onSelectImage(image)}
                  className="flex items-center gap-2.5 p-2"
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded border overflow-hidden flex-shrink-0",
                    )}
                  >
                    <img
                      src={image.signed_url || "/placeholder.svg"}
                      alt={`${image.kidney_type} ${image.id}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs font-medium text-foreground capitalize">{image.kidney_type} Kidney</p>
                    <p className="text-xs text-muted-foreground">Image {idx + 1}</p>
                  </div>
                  {image.ai_analysis_status === "completed" && (
                    <Check className={cn("h-4 w-4", selectedImage?.id === image.id ? "text-primary" : "text-green-600")} />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
