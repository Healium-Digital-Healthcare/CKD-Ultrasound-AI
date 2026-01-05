"use client"

import { useEffect, useState } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { useLazyGetCaseImagesQuery } from "@/store/services/cases"
import { ReportPanel } from "@/components/cases/report-panel"
import { ImageListSkeleton } from "@/components/cases/image-list-skeleton"
import { ReportGenerationSkeleton } from "@/components/cases/report-generation-skeleton"
import type { ImageAnalysis } from "@/types/case"

interface ViewReportSheetProps {
  caseId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewReportSheet({ caseId, open, onOpenChange }: ViewReportSheetProps) {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const [fetchImages, { data: imageAnalysesData, isLoading, isFetching }] = useLazyGetCaseImagesQuery()

  useEffect(() => {
    if (open && caseId) {
      fetchImages(caseId)
    }
  }, [open, caseId, fetchImages])

  useEffect(() => {
    if (imageAnalysesData && imageAnalysesData.length > 0) {
      setSelectedImageId(imageAnalysesData[0].id)
      setCurrentImageIndex(0)
    }
  }, [imageAnalysesData])

  const handleImageSelect = (imageId: string) => {
    setSelectedImageId(imageId)
    const index = imageAnalysesData?.findIndex((img) => img.id === imageId) ?? 0
    setCurrentImageIndex(index)
  }

  const handlePrevious = () => {
    if (imageAnalysesData && currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1
      setCurrentImageIndex(newIndex)
      setSelectedImageId(imageAnalysesData[newIndex].id)
    }
  }

  const handleNext = () => {
    if (imageAnalysesData && currentImageIndex < imageAnalysesData.length - 1) {
      const newIndex = currentImageIndex + 1
      setCurrentImageIndex(newIndex)
      setSelectedImageId(imageAnalysesData[newIndex].id)
    }
  }

  const totalImages = imageAnalysesData?.length ?? 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-full p-0 gap-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-background">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">Medical Report Viewer</h2>
              <div className="text-sm text-muted-foreground">
                Image {currentImageIndex + 1} of {totalImages}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Navigation controls */}
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevious}
                disabled={currentImageIndex === 0 || isLoading}
                className="h-8 w-8 bg-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                disabled={currentImageIndex === totalImages - 1 || isLoading}
                className="h-8 w-8 bg-transparent"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {isLoading || isFetching ? (
              <div className="flex w-full h-full">
                <ReportGenerationSkeleton />
              </div>
            ) : (
              <div className="flex h-full">
                {/* Image List Sidebar */}
                <div className="w-64 border-r bg-muted/30 overflow-y-auto">
                  <div className="p-4 space-y-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                      Images ({totalImages})
                    </div>
                    {imageAnalysesData?.map((image: ImageAnalysis, idx: number) => (
                      <button
                        key={image.id}
                        onClick={() => handleImageSelect(image.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedImageId === image.id
                            ? "bg-green-50 border-green-500"
                            : "bg-white border-gray-200 hover:bg-green-50 hover:border-green-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                            {image.signed_url && (
                              <img
                                src={image.signed_url || "/placeholder.svg"}
                                alt={`${image.kidney_type} kidney`}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate capitalize">{image.kidney_type} Kidney</div>
                            <div className="text-xs text-muted-foreground mt-0.5">Image {idx + 1}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Report Panel */}
                <div className="flex-1 overflow-y-auto">
                  {selectedImageId && <ReportPanel imageId={selectedImageId} />}
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
