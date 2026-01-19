"use client"

import { useState, useEffect } from "react"
import { useGetCaseByCaseIdQuery } from "@/store/services/cases"
import { Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { ReportPanel } from "./report-panel"
import { Button } from "@/components/ui/button"
import { ReportGenerationSkeleton } from "./report-generation-skeleton"
import { ImageAnalysis } from "@/types/case"
import { DicomPreview } from "./dicom-preview"

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

  const getFileType = (path: string) => {
    const cleanPath = path.split("?")[0]
    return cleanPath.toLowerCase().endsWith(".dcm") ? "dicom" : "image"
  }

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
          {images?.map((image: ImageAnalysis, idx: number) => {
            if(!image.signed_url) return <></>
            const fileType = getFileType(image.signed_url)

            return (
              <button
                key={image.id}
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedImage.id === image.id
                    ? "bg-green-50 border-green-500"
                    : "bg-white border-gray-200 hover:bg-green-50 hover:border-green-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                    
                    { fileType === "dicom" ? (
                      <DicomPreview signedUrl={image.signed_url || ""} className="w-full h-full" />
                    ) : (
                      <img
                        src={image.signed_url || "/placeholder.svg"}
                        alt={`${image.kidney_type} ${image.id}`}
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
            )
          })}
        </div>
      </div>

      {/* Right: Report Panel - takes all remaining space */}
      {selectedImage?.id && <ReportPanel imageId={selectedImage.id} />}
    </div>
  )
}
