"use client"

import { Button } from "@/components/ui/button"
import { useLazyGetImageAnalysisQuery } from "@/store/services/cases"
import { FileText, Download, Printer, Send } from "lucide-react"
import { useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface ReportPanelProps {
  imageId: string | null
}

export function ReportPanel({ imageId }: ReportPanelProps) {
  const [fetchAnalysis, { data: imageAnalysisData, isLoading, isFetching }] = useLazyGetImageAnalysisQuery()

  useEffect(() => {
    if (imageId) {
      fetchAnalysis(imageId)
    }
  }, [imageId, fetchAnalysis])

  const handleDownloadPDF = () => {
    console.log("[v0] Download PDF for image:", imageId)
  }

  const handlePrint = () => {
    console.log("[v0] Print report for image:", imageId)
  }

  const handleSendToEMR = () => {
    console.log("[v0] Send to EMR for image:", imageId)
  }

  if (!imageId) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Select an image to view report</p>
        </div>
      </div>
    )
  }

  if (isLoading || isFetching) {
    return <ReportPanelSkeleton />
  }

  const report = imageAnalysisData?.report
  const analysis = imageAnalysisData?.ai_analysis_result

  if (!report || !analysis) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No report available for this image</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-background overflow-y-auto">
      {/* Header with Actions */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Medical Report</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {imageAnalysisData.kidney_type} Kidney • Generated on {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleSendToEMR}>
              <Send className="h-4 w-4 mr-2" />
              Send to EMR
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Ultrasound Findings */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider border-b border-border pb-2">
            Ultrasound Findings
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="text-muted-foreground min-w-[140px]">Size:</span>
              <span className="text-foreground">{report.findings.size}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-muted-foreground min-w-[140px]">Echogenicity:</span>
              <span className="text-foreground">{report.findings.echogenicity}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-muted-foreground min-w-[140px]">Cortex:</span>
              <span className="text-foreground">{report.findings.cortex}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-muted-foreground min-w-[140px]">Hydronephrosis:</span>
              <span className="text-foreground">{report.findings.hydronephrosis}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-muted-foreground min-w-[140px]">Calculi:</span>
              <span className="text-foreground">{report.findings.calculi}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-muted-foreground min-w-[140px]">Cysts:</span>
              <span className="text-foreground">{report.findings.cysts}</span>
            </div>
          </div>
        </section>

        {/* AI Assessment */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider border-b border-border pb-2">
            AI-Generated Assessment
          </h3>
          <p className="text-sm text-foreground leading-relaxed">{report.assessment}</p>
        </section>

        {/* Impression */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider border-b border-border pb-2">
            Impression
          </h3>
          <ul className="space-y-2">
            {report.impression.map((item: string, idx: number) => (
              <li key={idx} className="text-sm text-foreground flex gap-2">
                <span className="text-muted-foreground">{idx + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Recommendations */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider border-b border-border pb-2">
            Recommendations
          </h3>
          <ul className="space-y-2">
            {report.recommendations.map((item: string, idx: number) => (
              <li key={idx} className="text-sm text-foreground flex gap-2">
                <span className="text-muted-foreground">{idx + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

function ReportPanelSkeleton() {
  return (
    <div className="flex-1 bg-background overflow-y-auto">
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {[1, 2, 3, 4, 5].map((section) => (
          <section key={section} className="space-y-3">
            <Skeleton className="h-4 w-40" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
