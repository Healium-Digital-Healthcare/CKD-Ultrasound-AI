"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Brain, Loader2, Edit2, AlertCircle, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useRunAnalysisMutation, useLazyGetCaseImagesQuery, useGetCaseQuery, useGetCaseByCaseIdQuery } from "@/store/services/cases"
import { ImageListSkeleton } from "./image-list-skeleton"
import { ImageViewerSkeleton } from "./image-viewer-skeleton"
import { AIAnalysisSkeleton } from "./ai-analysis-skeleton"
import { ImageViewer } from "./image-viewer"
import { EditFindingsDialog } from "./edit-finding-dialog"
import { AIAnalysisPanel } from "./ai-analysis-panel"
import { ImageAnalysis } from "@/types/case"


interface StudyAIAnalysisProps {
  caseId: string
  images: { leftKidney: string[]; rightKidney: string[] }
  onComplete: (value: boolean) => void
  onAnalyzingStateChange?: (analyzing: boolean) => void
}

export function StudyAIAnalysis({ caseId, images, onComplete, onAnalyzingStateChange }: StudyAIAnalysisProps) {
  const [selectedImage, setSelectedImage] = useState<ImageAnalysis | null>(null)
  const [zoom, setZoom] = useState(100)
  const [rightWidth, setRightWidth] = useState(384) // 24rem = 384px
  

  const { data: caseData, isLoading: caseDataLoading, isFetching: caseDataFetching } = useGetCaseByCaseIdQuery(caseId)
  const [runAnalysis, { isLoading: isAnalyzing }] = useRunAnalysisMutation()

  const isAnalyzed = caseData?.analyzed_by_ai || false
  const isLoading = isAnalyzing || caseDataLoading || caseDataFetching

  useEffect(() => {
    if (caseData && caseData.images.length > 0) {
      setSelectedImage(caseData.images[0])
    }
  }, [caseData])

  useEffect(() => {
    if (onAnalyzingStateChange) {
      onAnalyzingStateChange(isLoading)
    }
  }, [isLoading, onAnalyzingStateChange])

  useEffect(() => {
    onComplete(isAnalyzed)
  }, [isAnalyzed])

  const handleStartAnalysis = async () => {
    await runAnalysis(caseId)
  }

  if (isLoading) {
    return (
      <div className="flex h-full overflow-hidden bg-background">
        <ImageListSkeleton />
        <ImageViewerSkeleton />
        <div className="w-[380px] border-l border-border overflow-y-auto bg-background">
          <AIAnalysisSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-hidden flex flex-col">
      {!isAnalyzed && (
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="border border-border rounded-lg p-12 max-w-xl w-full">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">AI Analysis Ready</h3>
                <p className="text-muted-foreground">
                  Start the AI analysis to process uploaded kidney images and generate comprehensive findings
                </p>
              </div>
              <Button onClick={handleStartAnalysis} disabled={isAnalyzing} size="lg" className="min-w-[200px]">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5 mr-2" />
                    Start AI Analysis
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {caseData && caseData.analyzed_by_ai && caseData?.images.length > 0 && (
        <div className="flex-1 flex overflow-hidden">
          <div className="w-48 border-r border-border overflow-y-auto">
            <div className="p-3 border-b border-border sticky top-0 bg-background z-10">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                Images ({caseData.images.length})
              </h3>
            </div>
            <div className="p-2 space-y-1">
              {caseData.images.map((img: any, idx: number) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img)}
                  className={cn(
                    "w-full p-2 rounded border text-left transition-all flex items-center gap-2.5",
                    selectedImage?.id === img.id ? "bg-primary/10 border-primary" : "hover:bg-muted border-transparent",
                  )}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded border overflow-hidden flex-shrink-0",
                      selectedImage?.id === img.id ? "border-primary" : "border-border",
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
                  {img.ai_analysis_status === "completed" && (
                    <Check className={cn("h-4 w-4", selectedImage?.id === img.id ? "text-primary" : "text-green-600")} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <ImageViewer onZoomChange={setZoom} zoom={zoom} selectedImage={selectedImage} />

          {
            selectedImage?.id && (
              <div style={{ width: rightWidth }} className="overflow-y-auto overflow-x-hidden">
                  <AIAnalysisPanel imageId={selectedImage.id}/>
                </div>
            )
          }
        </div>
      )}
    </div>
  )
}
