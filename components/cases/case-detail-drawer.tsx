"use client"

import { useState, useRef, useEffect } from "react"
import { useGetCaseQuery } from "@/store/services/cases"
import type { ImageAnalysis } from "@/types/case"
import { ImageList } from "@/components/cases/image-list"
import { ImageViewer } from "@/components/cases/image-viewer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { CaseDetailSkeleton } from "@/components/cases/case-detail-skeleton"
import { cn } from "@/lib/utils"
import { CaseAnalysisPanel } from "@/components/cases/ai-analysis-panel"

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
  const [viewMode, setViewMode] = useState<"images" | "analysis">("images") // Add view mode toggle state
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
      setViewMode("images") // Reset view mode when drawer is closed
    }
  }, [open])

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetTitle></SheetTitle>
      <SheetContent side="bottom" className="h-screen w-screen max-w-none p-0 flex flex-col gap-0">
        {open && (
          <div className="flex flex-col h-full">
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
                    <div className="text-sm font-medium text-gray-900">
                      {caseData?.patient.sex ? (caseData.patient.sex === "M" ? "Male" : "Female") : "..."}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 bg-white flex items-center h-12 px-6 flex-shrink-0">
              <div className="flex gap-4">
                <button
                  onClick={() => setViewMode("images")}
                  className={cn(
                    "px-3 py-2 text-sm font-medium border-b-2 transition-colors",
                    viewMode === "images"
                      ? "text-emerald-600 border-emerald-500"
                      : "text-gray-600 border-transparent hover:text-gray-900",
                  )}
                >
                  Images
                </button>
                <button
                  onClick={() => setViewMode("analysis")}
                  className={cn(
                    "px-3 py-2 text-sm font-medium border-b-2 transition-colors",
                    viewMode === "analysis"
                      ? "text-emerald-600 border-emerald-500"
                      : "text-gray-600 border-transparent hover:text-gray-900",
                  )}
                >
                  Analysis
                </button>
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
              <div ref={containerRef} className="flex-1 min-h-0 flex overflow-hidden bg-gray-50 w-full">
                {viewMode === "images" ? (
                  <>
                    <ImageList
                      images={caseData.images}
                      selectedImage={selectedImage}
                      onSelectImage={setSelectedImage}
                    />
                    <ImageViewer selectedImage={selectedImage} zoom={zoom} onZoomChange={setZoom} />
                  </>
                ) : (
                  <div className="flex-1 min-h-0 flex items-start justify-center overflow-y-auto bg-gray-50 max-w-2xl mx-auto w-full">
                    <CaseAnalysisPanel
                      caseAnalysis={caseData.ai_analysis_result}
                      caseAnalysisStatus={caseData.ai_analysis_status}
                      isLoading={isLoading}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
