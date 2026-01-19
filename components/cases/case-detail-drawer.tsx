"use client"

import { useState, useRef, useEffect } from "react"
import { useGetCaseQuery } from "@/store/services/cases"
import type { ImageAnalysis } from "@/types/case"
import { ImageList } from "@/components/cases/image-list"
import { ImageViewer } from "@/components/cases/image-viewer"
import { AIAnalysisPanel } from "@/components/cases/ai-analysis-panel"
import { ResizeHandle } from "@/components/cases/resize-handle"
import { Button } from "@/components/ui/button"
import { Upload, ArrowLeft } from "lucide-react"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { CaseDetailSkeleton } from "@/components/cases/case-detail-skeleton"

interface CaseDetailDrawerProps {
  caseNumber: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CaseDetailDrawer({ caseNumber, open, onOpenChange }: CaseDetailDrawerProps) {
  const [selectedImage, setSelectedImage] = useState<ImageAnalysis | null>(null)
  const [zoom, setZoom] = useState(75)
  const [rightWidth, setRightWidth] = useState(384) // 24rem = 384px
  const [isResizingRight, setIsResizingRight] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    data: caseData,
    isLoading,
    isError,
  } = useGetCaseQuery(caseNumber || "", {
    skip: !caseNumber || !open, // Skip if no caseNumber or drawer is closed
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingRight && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const newWidth = containerRect.right - e.clientX
        if (newWidth >= 300 && newWidth <= 600) {
          setRightWidth(newWidth)
        }
      }
    }

    const handleMouseUp = () => {
      setIsResizingRight(false)
    }

    if (isResizingRight) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizingRight])

  useEffect(() => {
    if (caseData && caseData.images.length > 0) {
      setSelectedImage(caseData.images[0])
    }
  }, [caseData])

  useEffect(() => {
    if (!open) {
      setSelectedImage(null)
      setZoom(75)
    }
  }, [open])

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetTitle></SheetTitle>
      <SheetContent side="bottom" className="h-screen w-screen max-w-none p-0 flex flex-col gap-0">
        {open && (
          <>
            <div className="border-b border-gray-200 bg-white flex items-center justify-between h-16 px-6 flex-shrink-0">
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="gap-2 -ml-2 hover:bg-gray-100"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <div className="h-8 w-px bg-gray-200" />
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-0.5">Case Number</div>
                    <div className="text-sm font-semibold text-gray-900">{caseData ? caseData.case_number : "..."}</div>
                  </div>
                  <div className="h-8 w-px bg-gray-100" />
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-0.5">Patient</div>
                    <div className="text-sm font-medium text-gray-900">{caseData ? caseData.patient.name : "..."}</div>
                  </div>
                  <div className="h-8 w-px bg-gray-100" />
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-0.5">Age</div>
                    <div className="text-sm font-medium text-gray-900">
                      {caseData ? `${caseData.patient.age}` : "..."}
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gray-100" />
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-0.5">Sex</div>
                    <div className="text-sm font-medium text-gray-900">{caseData?.patient.sex ? caseData.patient.sex === 'M' ? "Male" : "Female" : "..."}</div>
                  </div>
                </div>
              </div>
            </div>

            {isLoading && <CaseDetailSkeleton />}

            {isError && (
              <div className="flex-1 h-full flex flex-col items-center justify-center bg-white">
                <p className="text-base text-gray-900 font-medium mb-2">Case not found</p>
                <p className="text-sm text-gray-600 mb-6">The requested case could not be loaded.</p>
                <Button onClick={() => onOpenChange(false)} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Cases
                </Button>
              </div>
            )}

            {caseData && (
              <div ref={containerRef} className="flex-1 h-full min-h-0 flex overflow-hidden bg-gray-50">
                <ImageList images={caseData.images} selectedImage={selectedImage} onSelectImage={setSelectedImage} />

                <ImageViewer selectedImage={selectedImage} zoom={zoom} onZoomChange={setZoom} />

                <ResizeHandle onMouseDown={() => setIsResizingRight(true)} />

                <div style={{ width: rightWidth }} className="overflow-y-auto overflow-x-hidden">
                  <AIAnalysisPanel imageId={selectedImage?.id || null} />
                </div>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}