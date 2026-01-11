"use client"

import { useState, useEffect } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRunAnalysisMutation, useGetCaseByCaseIdQuery } from "@/store/services/cases"
import { ImageListSkeleton } from "./image-list-skeleton"
import { ImageViewerSkeleton } from "./image-viewer-skeleton"
import { AIAnalysisSkeleton } from "./ai-analysis-skeleton"
import { ImageViewer } from "./image-viewer"
import { AIAnalysisPanel } from "./ai-analysis-panel"
import { StudyAIAnalysisProcessing } from "./study-ai-analysis-processing"
import { StudyAIAnalysisReady } from "./study-ai-analysis-ready"
import type { ImageAnalysis } from "@/types/case"
import { DicomPreview } from "./dicom-preview"

interface StudyAIAnalysisProps {
  caseId: string
  onComplete: (value: boolean) => void
  onAnalyzingStateChange?: (analyzing: boolean) => void
}

interface AnalysisStep {
  id: string
  title: string
  description: string
  status: "complete" | "processing" | "pending"
}

export function StudyAIAnalysis({ caseId, onComplete, onAnalyzingStateChange }: StudyAIAnalysisProps) {
  const [selectedImage, setSelectedImage] = useState<ImageAnalysis | null>(null)
  const [zoom, setZoom] = useState(75)
  const [rightWidth, setRightWidth] = useState(384)
  const [processingSteps, setProcessingSteps] = useState<AnalysisStep[]>([
    {
      id: "preprocessing",
      title: "Image preprocessing",
      description: "Normalizing and enhancing image quality",
      status: "complete",
    },
    {
      id: "segmentation",
      title: "Kidney segmentation",
      description: "Identifying kidney regions in images",
      status: "complete",
    },
    {
      id: "ckd",
      title: "CKD classification",
      description: "Determining chronic kidney disease stage",
      status: "processing",
    },
    { id: "egfr", title: "eGFR prediction", description: "Estimating glomerular filtration rate", status: "pending" },
    {
      id: "structural",
      title: "Structural analysis",
      description: "Detecting abnormalities and findings",
      status: "pending",
    },
  ])

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

  const getFileType = (path: string) => {
    const cleanPath = path.split("?")[0]
    return cleanPath.toLowerCase().endsWith(".dcm") ? "dicom" : "image"
  }

  if (isLoading && !isAnalyzed) {
    if (isAnalyzing) {
      return (
        <StudyAIAnalysisProcessing
          patientName={caseData?.patient?.name || "Patient"}
          patientId={caseData?.patient?.patient_id || ""}
          patientAge={caseData?.patient?.age || 0}
          patientSex={caseData?.patient?.sex || "M"}
          filesCount={caseData?.images?.length || 0}
          caseId={caseId}
          steps={processingSteps}
        />
      )
    }
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

  if (!isAnalyzed) {
    return (
      <StudyAIAnalysisReady
        patientName={caseData?.patient?.name || "Patient"}
        patientId={caseData?.patient?.patient_id || ""}
        patientAge={caseData?.patient?.age || 0}
        patientSex={caseData?.patient?.sex || "M"}
        filesCount={caseData?.images?.length || 0}
        onStart={handleStartAnalysis}
        caseId={caseId}
        isLoading={isAnalyzing}
      />
    )
  }

  return (
    <div className="h-full overflow-hidden flex flex-col">
      {caseData && caseData.analyzed_by_ai && caseData?.images.length > 0 && (
        <div className="flex-1 flex overflow-hidden">
          <div className="w-48 border-r border-border overflow-y-auto">
            <div className="p-3 border-b border-border sticky top-0 bg-background z-10">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                Images ({caseData.images.length})
              </h3>
            </div>
            <div className="p-2 space-y-1">
              {caseData.images.map((img: ImageAnalysis, idx: number) => {
                if(!img.signed_url) return <></>
                const fileType = getFileType(img.signed_url)

                return (
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
                      { fileType === "dicom" ? (
                        <DicomPreview signedUrl={img.signed_url || ""} className="w-full h-full" />
                      ) : (
                        <img
                          src={img.signed_url || "/placeholder.svg"}
                          alt={`${img.kidney_type} ${img.id}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground capitalize">{img.kidney_type} Kidney</p>
                      <p className="text-xs text-muted-foreground">Image {idx + 1}</p>
                    </div>
                    {img.ai_analysis_status === "completed" && (
                      <Check
                        className={cn("h-4 w-4", selectedImage?.id === img.id ? "text-primary" : "text-green-600")}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <ImageViewer onZoomChange={setZoom} zoom={zoom} selectedImage={selectedImage} />

          {selectedImage?.id && (
            <div style={{ width: rightWidth }} className="overflow-y-auto overflow-x-hidden">
              <AIAnalysisPanel imageId={selectedImage.id} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}