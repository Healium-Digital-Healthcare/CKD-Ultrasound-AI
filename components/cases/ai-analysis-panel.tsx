"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLazyGetImageAnalysisQuery, useTriggerReanalysisMutation } from "@/store/services/cases"
import { Loader2, AlertCircle, Edit2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Badge } from "../ui/badge"
import { EditFindingsDialog } from "./edit-finding-dialog"
import { AIAnalysisSkeleton } from "./ai-analysis-skeleton"
import { BiometryTab } from "./biometry-tab"
import { ImageAnalysis } from "@/types/case"

interface AIAnalysisPanelProps {
  imageId: string | null,
  images: ImageAnalysis[]
}

// Helper functions to generate notes based on analysis results
const generateEGFRNotes = (egfr: number, stage: string): string => {
  if (egfr >= 90) return "Normal kidney function - eGFR is within healthy range. Routine kidney health screening recommended."
  if (egfr >= 60) return "Mildly reduced - eGFR between 60-89. Monitor kidney function annually and correlate with clinical presentation."
  if (egfr >= 45) return "Mildly to moderately reduced - eGFR between 45-59 (Stage 3a). Correlate with serum creatinine and clinical history. Consider nephrology referral if rapidly declining."
  if (egfr >= 30) return "Moderately to severely reduced - eGFR between 30-44 (Stage 3b). Referral to nephrology recommended for further evaluation and management."
  if (egfr >= 15) return "Severely reduced - eGFR between 15-29 (Stage 4). Urgent nephrology referral required. Prepare for renal replacement therapy planning."
  return "Kidney failure — eGFR below 15 (Stage 5). Immediate nephrology intervention required. Renal replacement therapy indicated."
}

const generateCKDAction = (risk: string, stage: string): string => {
  if (risk === "HIGH") return "Action recommended - Refer to nephrologist for further evaluation and management plan."
  if (risk === "MODERATE") return "Monitor recommended - Schedule follow-up screening in 3-6 months. Lifestyle modifications advised."
  return "No action needed - Kidney function within normal range. Routine screening schedule."
}

const generateEtiologyNotes = (etiology: any[]): string => {
  if (!etiology || etiology.length === 0) return ""
  const topDiagnosis = etiology[0]
  return `Most likely: ${topDiagnosis.name} (${topDiagnosis.percentage}%) - consistent with structural findings and eGFR range`
}

const generateFindingsNotes = (findings: any[]): string => {
  const abnormalCount = findings?.filter(f => f.hasIssue).length || 0
  if (abnormalCount === 0) return "No significant findings - Normal kidney ultrasound appearance."
  return `${abnormalCount} finding${abnormalCount > 1 ? "s" : ""} detected - ${findings.filter(f => f.hasIssue).map(f => f.name).join(", ")} require clinical correlation`
}

export function AIAnalysisPanel({ imageId, images }: AIAnalysisPanelProps) {
  const [fetchAnalysis, { data: imageAnalysisData, isLoading, isFetching }] = useLazyGetImageAnalysisQuery()
  const [triggerReanalysis, { isLoading: isReanalyzing }] = useTriggerReanalysisMutation()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"assessment" | "biometry">("assessment")

  useEffect(() => {
    if (imageId) {
      fetchAnalysis(imageId)
    }
  }, [imageId, fetchAnalysis])

  const handleReanalysis = async () => {
    if (!imageId) return
    try {
      await triggerReanalysis(imageId).unwrap()
      fetchAnalysis(imageId)
    } catch (error) {
      console.error("Failed to trigger reanalysis:", error)
    }
  }

  const handleOpenEditDialog = () => {
    if (!imageAnalysisData?.ai_analysis_result) return
    setEditDialogOpen(true)
  }

  if (!imageId) {
    return (
      <div className="border-l border-border/40 flex flex-col flex-shrink-0 h-full backdrop-blur-xl bg-background/60">
        <div className="h-14 border-b border-border/40 flex items-center px-6 flex-shrink-0">
          <h2 className="text-sm font-medium text-muted-foreground">Analysis</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-sm text-muted-foreground">Select an image</p>
        </div>
      </div>
    )
  }

  if (isLoading || isFetching) {
    return <AIAnalysisSkeleton />
  }

  if (!imageAnalysisData?.ai_analysis_result) {
    return (
      <div className="border-l border-border/40 flex flex-col flex-shrink-0 h-full backdrop-blur-xl bg-background/60">
        <div className="h-14 border-b border-border/40 flex items-center justify-between px-6 flex-shrink-0">
          <h2 className="text-sm font-medium text-muted-foreground">Analysis</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <Button onClick={handleReanalysis} disabled={isReanalyzing} variant="ghost" size="sm">
            {isReanalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Start Analysis"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-[380px] border-l border-border bg-background flex flex-col h-full">
      <div className="border-b border-border bg-background z-10">
        <div className="p-4 flex items-center justify-between border-b border-border">
          <div>
            <h3 className="text-sm font-bold text-foreground">Analysis Results</h3>
          </div>
          <Button variant="outline" size="sm" onClick={handleOpenEditDialog} className="h-8 bg-transparent">
            <Edit2 className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
        </div>
        <div className="flex gap-1 px-3 pt-3 pb-0">
          <button
            onClick={() => setActiveTab("assessment")}
            className={cn(
              "flex-1 px-3 py-2 text-xs font-medium border-b-2 rounded-t-lg transition-colors",
              activeTab === "assessment"
                ? "text-emerald-600 border-emerald-500 bg-emerald-50/50"
                : "text-muted-foreground border-transparent hover:text-foreground",
            )}
          >
            Assessment
          </button>
          <button
            onClick={() => setActiveTab("biometry")}
            className={cn(
              "flex-1 px-3 py-2 text-xs font-medium border-b-2 rounded-t-lg transition-colors",
              activeTab === "biometry"
                ? "text-emerald-600 border-emerald-500 bg-emerald-50/50"
                : "text-muted-foreground border-transparent hover:text-foreground",
            )}
          >
            Biometry
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "assessment" ? (
          // Assessment Tab Content
          <div className="p-4 space-y-4">
            {/* eGFR Prediction - First Section */}
            <div className="rounded-lg border border-border bg-background p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">eGFR Prediction</h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700">
                  {imageAnalysisData.ai_analysis_result.ckdStage}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-5xl font-bold text-foreground leading-none">
                  {imageAnalysisData.ai_analysis_result.egfr}
                </p>
                <p className="text-xs text-muted-foreground">mL/min/1.73m²</p>
              </div>
              {/* Gradient Slider */}
              <div className="space-y-2">
                <div className="h-3 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 relative overflow-hidden">
                  <div 
                    className="absolute top-0 h-full w-1 bg-white shadow-sm border border-gray-300 rounded-full"
                    style={{ 
                      left: `${Math.min(Math.max((imageAnalysisData.ai_analysis_result.egfr / 120) * 100, 0), 100)}%`,
                      transform: 'translateX(-50%)'
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>30</span>
                  <span>60</span>
                  <span>90</span>
                  <span>120+</span>
                </div>
              </div>
              {/* Confidence & Range */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5 font-semibold">Confidence</p>
                  <p className="text-base font-bold text-foreground">
                    {imageAnalysisData.ai_analysis_result.confidence}%
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5 font-semibold">Range</p>
                  <p className="text-base font-bold text-foreground">
                    {imageAnalysisData.ai_analysis_result.range}
                  </p>
                </div>
              </div>
              {/* eGFR Notes */}
              <div className="rounded-lg border border-yellow-200/50 bg-yellow-50/50 p-3 mt-2">
                <div className="flex gap-2.5 items-start">
                  <div className="w-5 h-5 rounded-full bg-yellow-300 flex items-center justify-center flex-shrink-0 text-xs font-bold text-yellow-700">
                    !
                  </div>
                  <p className="text-sm text-yellow-900">
                    {generateEGFRNotes(imageAnalysisData.ai_analysis_result.egfr, imageAnalysisData.ai_analysis_result.ckdStage)}
                  </p>
                </div>
              </div>
            </div>

            {/* CKD Risk Level - Second Section */}
            <div className="rounded-lg border border-border bg-background p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-foreground">CKD Risk Level</h3>
              </div>
              <div
                className={cn(
                  "rounded-lg p-4 text-center font-bold",
                  imageAnalysisData.ai_analysis_result.ckdRisk === "HIGH"
                    ? "bg-red-500/10 text-red-600"
                    : imageAnalysisData.ai_analysis_result.ckdRisk === "MODERATE"
                    ? "bg-yellow-500/10 text-yellow-600"
                    : "bg-green-500/10 text-green-600",
                )}
              >
                <p className="text-2xl font-bold leading-none mb-1">
                  {imageAnalysisData.ai_analysis_result.ckdRisk}
                </p>
                <p className="text-xs text-muted-foreground">{imageAnalysisData.ai_analysis_result.ckdStage}</p>
              </div>
              {/* CKD Action Recommended */}
              <div className={cn(
                "rounded-lg border p-3 mt-2 text-sm font-semibold",
                imageAnalysisData.ai_analysis_result.ckdRisk === "HIGH"
                  ? "border-red-200/50 bg-red-50/50 text-red-700"
                  : imageAnalysisData.ai_analysis_result.ckdRisk === "MODERATE"
                  ? "border-yellow-200/50 bg-yellow-50/50 text-yellow-700"
                  : "border-green-200/50 bg-green-50/50 text-green-700"
              )}>
                {generateCKDAction(imageAnalysisData.ai_analysis_result.ckdRisk, imageAnalysisData.ai_analysis_result.ckdStage)}
              </div>
            </div>

            {/* Probable Etiology - Third Section */}
            <div className="rounded-lg border border-border bg-background p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">Probable Etiology</h3>
                </div>
                <span className="text-xs text-muted-foreground font-medium">AI Predicted</span>
              </div>
              <div className="space-y-3">
                {imageAnalysisData.ai_analysis_result.etiology.map((item: any, idx: number) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{item.name}</span>
                      <span className="text-sm font-bold text-foreground">{item.percentage}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all rounded-full",
                          item.percentage >= 70 ? "bg-green-500" :
                          item.percentage >= 50 ? "bg-yellow-500" :
                          item.percentage >= 30 ? "bg-orange-500" :
                          "bg-gray-400"
                        )}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {/* Etiology Notes */}
              {generateEtiologyNotes(imageAnalysisData.ai_analysis_result.etiology) && (
                <div className="rounded-lg border border-green-200/50 bg-green-50/50 p-3 mt-2">
                  <div className="flex gap-2.5 items-start">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 text-xs text-white">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm text-green-900">
                      {generateEtiologyNotes(imageAnalysisData.ai_analysis_result.etiology)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Structural Findings - Fourth Section */}
            <div className="rounded-lg border border-border bg-background p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">Structural Findings</h3>
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {imageAnalysisData.ai_analysis_result.findings.length} assessed
                </span>
              </div>
              <div className="space-y-2">
                {imageAnalysisData.ai_analysis_result.findings.map((finding: any, idx: number) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-lg",
                      !finding.hasIssue 
                        ? "bg-green-50/50 border border-green-100/50"
                        : finding.severity === "Mild" || finding.severity === "Moderate"
                        ? "bg-yellow-50/50 border border-yellow-100/50"
                        : "bg-red-50/50 border border-red-100/50"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      {!finding.hasIssue ? (
                        <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className={cn(
                          "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs",
                          finding.severity === "Mild" 
                            ? "bg-yellow-400 text-yellow-700"
                            : finding.severity === "Moderate"
                            ? "bg-orange-400 text-orange-700"
                            : "bg-red-400 text-red-700"
                        )}>
                          !
                        </div>
                      )}
                      <span className="text-sm text-foreground font-medium">{finding.name}</span>
                    </div>
                    <Badge
                      variant={finding.hasIssue ? "default" : "secondary"}
                      className={cn(
                        "font-medium text-xs",
                        !finding.hasIssue && "bg-green-100 text-green-700 hover:bg-green-200",
                        finding.hasIssue && finding.severity === "Mild" &&
                          "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
                        finding.hasIssue && finding.severity === "Moderate" &&
                          "bg-orange-100 text-orange-700 hover:bg-orange-200",
                        finding.hasIssue && finding.severity === "Present" &&
                          "bg-red-100 text-red-700 hover:bg-red-200",
                      )}
                    >
                      {finding.severity || "Normal"}
                    </Badge>
                  </div>
                ))}
              </div>
              {/* Findings Notes */}
              <div className="rounded-lg border border-yellow-200/50 bg-yellow-50/50 p-3 mt-2">
                <div className="flex gap-2.5 items-start">
                  <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 text-xs font-bold text-yellow-700">
                    {imageAnalysisData.ai_analysis_result.findings.filter((f: any) => f.hasIssue).length}
                  </div>
                  <p className="text-sm text-yellow-900">
                    {generateFindingsNotes(imageAnalysisData.ai_analysis_result.findings)}
                  </p>
                </div>
              </div>
            </div>

            {imageAnalysisData.ai_analysis_result.notes && (
              <div className="rounded-lg border border-border bg-yellow-50/50 border-yellow-100/50 p-3">
                <div className="flex gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-yellow-200 flex items-center justify-center flex-shrink-0 text-xs font-bold text-yellow-700">
                    !
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {imageAnalysisData.ai_analysis_result.notes}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <BiometryTab imageAnalysisData={imageAnalysisData} images={images} />
        )}
      </div>

      {editDialogOpen && imageAnalysisData.ai_analysis_result && imageAnalysisData.id && (
        <EditFindingsDialog
          data={imageAnalysisData.ai_analysis_result}
          onOpenChange={(value: boolean) => setEditDialogOpen(value)}
          imageAnalysisId={imageAnalysisData.id}
          open={editDialogOpen}
          onSuccess={() => fetchAnalysis(imageId)}
        />
      )}
    </div>
  )
}
