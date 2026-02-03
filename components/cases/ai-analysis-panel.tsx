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
          <div className="p-4 space-y-5">
            {/* CKD Risk - Primary Card */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">CKD Risk Level</p>
              <div
                className={cn(
                  "rounded-lg border-2 p-5 text-center",
                  imageAnalysisData.ai_analysis_result.ckdRisk === "HIGH"
                    ? "border-red-500/30 bg-red-500/5"
                    : "border-yellow-500/30 bg-yellow-500/5",
                )}
              >
                <p
                  className={cn(
                    "text-3xl font-bold tracking-tight",
                    imageAnalysisData.ai_analysis_result.ckdRisk === "HIGH" ? "text-red-600" : "text-yellow-600",
                  )}
                >
                  {imageAnalysisData.ai_analysis_result.ckdRisk}
                </p>
                <p className="text-xs text-muted-foreground mt-1.5">{imageAnalysisData.ai_analysis_result.ckdStage}</p>
              </div>
            </div>

            {/* eGFR - Most Important Metric */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                eGFR Prediction
              </p>
              <div className="rounded-lg border border-border bg-background p-5">
                <div className="flex items-end gap-2 mb-3">
                  <p className="text-4xl font-bold text-foreground leading-none">
                    {imageAnalysisData.ai_analysis_result.egfr}
                  </p>
                  <p className="text-sm text-muted-foreground pb-0.5">mL/min/1.73m²</p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Confidence</p>
                    <p className="text-base font-semibold text-foreground">
                      {imageAnalysisData.ai_analysis_result.confidence}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Range</p>
                    <p className="text-base font-semibold text-foreground">
                      {imageAnalysisData.ai_analysis_result.range}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Structural Findings - Clean List */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Structural Findings
              </p>
              <div className="rounded-lg border border-border bg-background divide-y divide-border">
                {imageAnalysisData.ai_analysis_result.findings.map((finding: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between px-3.5 py-3">
                    <div className="flex items-center gap-2.5">
                      {finding.hasIssue ? (
                        <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-border flex-shrink-0" />
                      )}
                      <span className="text-sm text-foreground">{finding.name}</span>
                    </div>
                    <Badge
                      variant={finding.hasIssue ? "default" : "secondary"}
                      className={cn(
                        "font-medium",
                        !finding.hasIssue && "bg-muted text-muted-foreground hover:bg-muted",
                        finding.hasIssue &&
                          finding.severity === "Mild" &&
                          "bg-yellow-500 hover:bg-yellow-600 text-white",
                        finding.hasIssue &&
                          finding.severity === "Moderate" &&
                          "bg-orange-500 hover:bg-orange-600 text-white",
                      )}
                    >
                      {finding.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Probable Etiology - Progress Bars */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Probable Etiology
              </p>
              <div className="rounded-lg border border-border bg-background p-3 space-y-3">
                {imageAnalysisData.ai_analysis_result.etiology.map((item: any, idx: number) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{item.name}</span>
                      <span className="text-sm font-semibold text-foreground">{item.percentage}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {imageAnalysisData.ai_analysis_result.notes && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Clinical Notes
                </p>
                <div className="rounded-lg border border-border bg-muted/30 p-3">
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
