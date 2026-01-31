"use client"

import { useState, useEffect } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRunAnalysisMutation, useGetCaseByCaseIdQuery } from "@/store/services/cases"
import { useJobProgress } from "@/hooks/use-job-progress"
import { ImageListSkeleton } from "./image-list-skeleton"
import { ImageViewerSkeleton } from "./image-viewer-skeleton"
import { AIAnalysisSkeleton } from "./ai-analysis-skeleton"
import { ImageViewer } from "./image-viewer"
import { AIAnalysisPanel } from "./ai-analysis-panel"
import { StudyAIAnalysisProcessing } from "./study-ai-analysis-processing"
import { StudyAIAnalysisReady } from "./study-ai-analysis-ready"
import type { ImageAnalysis } from "@/types/case"
import { useAnalyzeMutation } from "@/store/services/ai"
import { DicomPreview } from "./dicom-preview"

interface StudyAIAnalysisProps {
  caseId: string
  images: { leftKidney: string[]; rightKidney: string[] }
  onComplete: (value: boolean) => void
  onAnalyzingStateChange?: (analyzing: boolean) => void
}

interface AnalysisStep {
  id: string
  title: string
  description: string
  status: "complete" | "processing" | "pending"
}

export function StudyAIAnalysis({ caseId, images, onComplete, onAnalyzingStateChange }: StudyAIAnalysisProps) {
  const [selectedImage, setSelectedImage] = useState<ImageAnalysis | null>(null)
  const [zoom, setZoom] = useState(100)
  const [rightWidth, setRightWidth] = useState(384)
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)
  const [processingSteps, setProcessingSteps] = useState<AnalysisStep[]>([
    {
      id: "preprocessing",
      title: "Image preprocessing",
      description: "Normalizing and enhancing image quality",
      status: "pending",
    },
    {
      id: "segmentation",
      title: "Kidney segmentation",
      description: "Identifying kidney regions in images",
      status: "pending",
    },
    {
      id: "ckd",
      title: "CKD classification",
      description: "Determining chronic kidney disease stage",
      status: "pending",
    },
    { id: "egfr", title: "eGFR prediction", description: "Estimating glomerular filtration rate", status: "pending" },
    {
      id: "structural",
      title: "Structural analysis",
      description: "Detecting abnormalities and findings",
      status: "pending",
    },
  ])

  const { data: caseData, isLoading: caseDataLoading, isFetching: caseDataFetching, refetch: refetchCase } = useGetCaseByCaseIdQuery(caseId)
  
  const [runAnalysis, { isLoading: isAnalyzing, data: analyzeData, isSuccess: isAnalyzeSuccess }] = useAnalyzeMutation()
  
  const { jobProgress } = useJobProgress({
    jobId: currentJobId,
    enabled: !!currentJobId,
  })

  const isAnalyzed = caseData?.analyzed_by_ai || false
  const isLoading = caseDataLoading || caseDataFetching

  const handleStartAnalysis = async () => {
    await runAnalysis(caseId)
  }

  const getFileType = (path: string) => {
    const cleanPath = path.split("?")[0]
    return cleanPath.toLowerCase().endsWith(".dcm") ? "dicom" : "image"
  }

  useEffect(() => {
    if(isAnalyzeSuccess && analyzeData) {
      setCurrentJobId(analyzeData.job_id)
    } 
  }, [isAnalyzeSuccess])

  useEffect(() => {
    if (caseData && caseData.images.length > 0) {
      setSelectedImage(caseData.images[0])
    }
  }, [caseData])

  useEffect(() => {
    if (onAnalyzingStateChange) {
      onAnalyzingStateChange(isAnalyzing)
    }
  }, [isAnalyzing])

  useEffect(() => {
    onComplete(isAnalyzed)
  }, [isAnalyzed])

  // Update processing steps based on job progress
  useEffect(() => {
    if (!jobProgress) return

    const statusMap: { [key: string]: AnalysisStep["status"] } = {
      queued: "pending",
      preprocessing: "processing",
      inferring: "processing",
      completed: "complete",
      failed: "pending",
    }

    const currentStatus = statusMap[jobProgress.status] || "pending"
    const progressPercent = jobProgress.progress || 0

    // Map progress percentage to step
    setProcessingSteps((prevSteps) =>
      prevSteps.map((step, index) => {
        let status: AnalysisStep["status"] = "pending"

        if (currentStatus === "complete") {
          status = "complete"
        } else if (currentStatus === "processing") {
          // Determine which step is active based on progress
          if (progressPercent < 30) {
            status = index === 0 ? "processing" : index < 1 ? "complete" : "pending"
          } else if (progressPercent < 60) {
            status = index <= 1 ? "complete" : index === 2 ? "processing" : "pending"
          } else {
            status = index <= 2 ? "complete" : index === 3 ? "processing" : "pending"
          }
        }

        return { ...step, status }
      })
    )
  }, [jobProgress])

  // Handle job completion
  useEffect(() => {
    if (!jobProgress) return

    if (jobProgress.status === "completed") {
      // Clear the current job ID to stop polling
      setCurrentJobId(null)
      // Refetch the case data to get updated analysis results
      refetchCase()
    } else if (jobProgress.status === "failed") {
      setCurrentJobId(null)
    }
  }, [jobProgress])


  // Show processing screen while job is active
  if (currentJobId) {
    return (
      <StudyAIAnalysisProcessing
        patientName={caseData?.patient?.name || "Patient"}
        patientId={caseData?.patient?.patient_id || ""}
        patientAge={caseData?.patient?.age || 0}
        patientSex={caseData?.patient?.sex || "M"}
        filesCount={caseData?.images?.length || 0}
        caseId={caseId}
        steps={processingSteps}
        jobProgress={jobProgress}
      />
    )
  }

  if (isLoading && !isAnalyzed) {
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
        caseId={caseId}
        patientName={caseData?.patient?.name || "Patient"}
        patientId={caseData?.patient?.patient_id || ""}
        patientAge={caseData?.patient?.age || 0}
        patientSex={caseData?.patient?.sex || "M"}
        filesCount={caseData?.images?.length || 0}
        onStart={handleStartAnalysis}
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
              {caseData.images.map((img: any, idx: number) => {
                const fileType = getFileType(img.image_path)
                return (
                  <div
                    key={img.id}
                    onClick={() => setSelectedImage(img)}
                    className={`rounded-lg border transition-all ${
                      selectedImage?.id === img.id
                        ? "bg-primary/10 border-primary/20"
                        : "bg-white border-gray-200 hover:bg-primary/10 hover:border-primary/20"
                    }`}
                  >
                    <button
                      key={img.id}
                      className="flex items-center gap-2.5 px-2 py-2"
                    >
                      <div className={cn("w-12 h-12 rounded border overflow-hidden flex-shrink-0")}>
                        {fileType === "dicom" ? (
                          <DicomPreview signedUrl={img.signed_url || ""} className="w-full h-full" />
                        ) : (
                          <img
                            src={img.signed_url || "/placeholder.svg"}
                            alt={`${img.kidney_type} ${img.id}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-xs font-medium text-foreground capitalize">{img.kidney_type} Kidney</p>
                      </div>
                    </button>
                    <p className="p-2 text-xs text-muted-foreground">
                      {fileType === "dicom" ? "DICOM File" : `Image File`}
                    </p>
                  </div>
                )
              }
              )}
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
