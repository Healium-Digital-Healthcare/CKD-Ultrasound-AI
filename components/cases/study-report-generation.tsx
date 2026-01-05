"use client"

import { useState, useEffect } from "react"
import { useGetCaseByCaseIdQuery } from "@/store/services/cases"
import { Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { ReportPanel } from "./report-panel"
import { Button } from "@/components/ui/button"
import { ReportGenerationSkeleton } from "./report-generation-skeleton"

interface StudyReportGenerationProps {
  caseId: string
  onGoBack?: () => void
}

export function StudyReportGeneration({ caseId, onGoBack }: StudyReportGenerationProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const { data: caseData, isLoading: caseDataLoading, isFetching: caseDataFetching } = useGetCaseByCaseIdQuery(caseId)

  const isAnalyzed = caseData?.analyzed_by_ai || false
  const images = caseData?.images || []
  const selectedImage = images[selectedImageIndex]

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImageIndex(0)
    }
  }, [images.length])

  if (caseDataLoading || caseDataFetching) {
    return <ReportGenerationSkeleton /> // replaced loading text with proper skeleton
  }

  if (!isAnalyzed) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
            <AlertCircle className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Analysis Required</h3>
          <p className="text-sm text-muted-foreground mb-6">
            This case hasn&poas;t been analyzed yet. Please go back to Step 3 and complete the AI analysis before generating
            reports.
          </p>
          {onGoBack && (
            <Button onClick={onGoBack} variant="outline">
              Go Back to Analysis
            </Button>
          )}
        </div>
      </div>
    )
  }

  if (!images || images.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No images available for report generation</p>
      </div>
    )
  }

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left: Image List */}
      <div className="w-48 border-r border-border overflow-y-auto">
        <div className="p-3 border-b border-border sticky top-0 bg-background z-10">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">Images ({images.length})</h3>
        </div>
        <div className="p-2 space-y-1">
          {images.map((img: any, idx: number) => (
            <button
              key={img.id}
              onClick={() => setSelectedImageIndex(idx)}
              className={cn(
                "w-full p-2 rounded border text-left transition-all flex items-center gap-2.5",
                selectedImageIndex === idx ? "bg-green-50 border-green-500" : "hover:bg-green-50 border-transparent",
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded border overflow-hidden flex-shrink-0",
                  selectedImageIndex === idx ? "border-primary" : "border-border",
                )}
              >
                <img
                  src={img.signed_url || img.image_path || "/placeholder.svg"}
                  alt={`${img.kidney_type} ${idx}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground capitalize">{img.kidney_type} Kidney</p>
                <p className="text-xs text-muted-foreground">Image {idx + 1}</p>
              </div>
              <Check className="h-4 w-4 text-green-600" />
            </button>
          ))}
        </div>
      </div>

      {/* Right: Report Panel - takes all remaining space */}
      {selectedImage?.id && <ReportPanel imageId={selectedImage.id} />}
    </div>
  )
}
