"use client"
import { Button } from "@/components/ui/button"
import { useLazyGetImageAnalysisQuery, useTriggerReanalysisMutation } from "@/store/services/cases"
import { Loader2, RefreshCw, CheckCircle2, Clock, XCircle } from "lucide-react"
import { useEffect } from "react"

interface AIAnalysisPanelProps {
  imageId: string | null
}

export function AIAnalysisPanel({ imageId }: AIAnalysisPanelProps) {
  const [fetchAnalysis, { data: imageAnalysisData, isLoading, isFetching }] = useLazyGetImageAnalysisQuery()
  const [triggerReanalysis, { isLoading: isReanalyzing }] = useTriggerReanalysisMutation()

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
      console.error("[v0] Failed to trigger reanalysis:", error)
    }
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

  if (isLoading) {
    return (
      <div className="border-l border-border/40 flex flex-col flex-shrink-0 h-full backdrop-blur-xl bg-background/60">
        <div className="h-14 border-b border-border/40 flex items-center px-6 flex-shrink-0">
          <h2 className="text-sm font-medium text-muted-foreground">Analysis</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!imageAnalysisData) {
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

  const status = imageAnalysisData.ai_analysis_status
  const showReanalysis = status === "failed" || status === "completed"

  return (
    <div className="border-l border-border/40 flex flex-col flex-shrink-0 h-full backdrop-blur-xl bg-background/60">
      <div className="h-14 border-b border-border/40 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-medium text-foreground">Analysis</h2>
          {status === "processing" && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
          {status === "completed" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
          {status === "failed" && <XCircle className="w-3.5 h-3.5 text-destructive" />}
          {status === "pending" && <Clock className="w-3.5 h-3.5 text-amber-500" />}
        </div>
        {showReanalysis && (
          <Button onClick={handleReanalysis} disabled variant="ghost" size="sm" className="h-8">
            {isReanalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {imageAnalysisData.ai_analysis_result ? (
          <>
            {/* eGFR */}
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">eGFR</p>
              <div className="rounded-lg border border-border/40 bg-card/50 backdrop-blur-sm p-6 text-center">
                <div className="text-4xl font-bold tabular-nums mb-1">
                  {imageAnalysisData.ai_analysis_result.egfr.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">ml/min/1.73m²</div>
              </div>
            </div>

            {/* Findings */}
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Findings</p>
              <div className="space-y-2">
                {Object.entries(imageAnalysisData.ai_analysis_result.findings).map(([key, value]) => {
                  const percentage = (value as number) * 100
                  return (
                    <div key={key} className="rounded-lg border border-border/40 bg-card/50 backdrop-blur-sm p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium capitalize">{key.replace(/_/g, " ")}</span>
                        <span className="text-xs font-mono tabular-nums">{percentage.toFixed(0)}%</span>
                      </div>
                      <div className="h-1 bg-muted/50 rounded-full overflow-hidden">
                        <div className="h-full bg-foreground/80 rounded-full" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Disease */}
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Classification</p>
              <div className="space-y-2">
                {Object.entries(imageAnalysisData.ai_analysis_result.disease)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .map(([key, value]) => {
                    const percentage = (value as number) * 100
                    return (
                      <div
                        key={key}
                        className="rounded-lg border border-border/40 bg-card/50 backdrop-blur-sm p-3 flex justify-between items-center"
                      >
                        <span className="text-xs font-medium capitalize">{key.replace(/_/g, " ")}</span>
                        <span className="text-xs font-mono tabular-nums">{percentage.toFixed(0)}%</span>
                      </div>
                    )
                  })}
              </div>
              {/* <div className="rounded-lg border border-border/40 bg-card/80 backdrop-blur-sm p-4">
                <div className="text-xs text-muted-foreground mb-1">Predicted</div>
                <div className="text-sm font-semibold capitalize">
                  {imageAnalysisData.ai_analysis_result.disease_predicted.replace(/_/g, " ")}
                </div>
              </div> */}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-12">
            {status === "processing" && (
              <div className="text-center space-y-3">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Processing...</p>
              </div>
            )}
            {status === "failed" && (
              <div className="text-center space-y-3">
                <XCircle className="w-6 h-6 mx-auto text-destructive" />
                <p className="text-xs text-muted-foreground">Analysis failed</p>
              </div>
            )}
            {status === "pending" && (
              <div className="text-center space-y-3">
                <Clock className="w-6 h-6 mx-auto text-amber-500" />
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
