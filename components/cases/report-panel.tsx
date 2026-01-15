"use client"

import { Button } from "@/components/ui/button"
import { useLazyGetCaseByCaseIdQuery, useLazyGetImageAnalysisQuery } from "@/store/services/cases"
import { FileText, Download, Printer, Send, AlertCircle } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface ReportPanelProps {
  caseId: string | null,
  onGoBack?: () => void
}

export function ReportPanel({ caseId, onGoBack }: ReportPanelProps) {
  const [fetchCaseDetail, { data: caseDetailData, isLoading, isFetching }] = useLazyGetCaseByCaseIdQuery()
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)
  const printIframeRef = useRef<HTMLIFrameElement>(null)

  
  const isAnalyzed = caseDetailData?.analyzed_by_ai || false

  useEffect(() => {
    if (caseId) {
      fetchCaseDetail(caseId)
    }
  }, [caseId, fetchCaseDetail])

  const handleDownloadPDF = async () => {
    if (!caseId) return

    try {
      setIsDownloadingPdf(true)
      const response = await fetch(`/api/cases/case/${caseId}/download`)

      if (!response.ok) {
        throw new Error("Failed to generate PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `kidney-report-${caseId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("PDF download error:", error)
      alert("Failed to download PDF. Please try again.")
    } finally {
      setIsDownloadingPdf(false)
    }
  }

  const handlePrint = () => {
    if (!printIframeRef.current || !caseDetailData?.report_html) return

    const iframe = printIframeRef.current
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

    if (!iframeDoc) return

    iframeDoc.open()
    iframeDoc.write(caseDetailData.report_html)
    iframeDoc.close()

    // Wait for images to load before printing
    iframe.onload = () => {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
    }
  }

  const handleSendToEMR = () => {
    console.log("Send to EMR for image:", caseId)
  }

  if (!caseId) {
    return (
      <div className="flex-1 flex items-center justify-center h-full bg-[#fafafa]">
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

  if (!isAnalyzed && onGoBack) {
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
  
  const reportHtml = caseDetailData?.report_html

  if (!reportHtml) {
    return (
      <div className="flex-1 flex items-center justify-center h-full bg-[#fafafa]">
        <div className="text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No report available for this image</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-white overflow-y-auto print:overflow-visible">
      {/* Action Bar - Hidden on print */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 print:hidden">
        <div className="max-w-[800px] mx-auto px-8 py-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Kidney Health Report</h2>
            <p className="text-xs text-gray-500 mt-0.5">Generated on {new Date().toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPDF}
              disabled={isDownloadingPdf}
              className="h-8 text-xs bg-transparent"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              {isDownloadingPdf ? "Generating..." : "PDF"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleSendToEMR} className="h-8 text-xs bg-transparent">
              <Send className="h-3.5 w-3.5 mr-1.5" />
              EMR
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint} className="h-8 text-xs bg-transparent">
              <Printer className="h-3.5 w-3.5 mr-1.5" />
              Print
            </Button>
          </div>
        </div>
      </div>

      <div className="report-html-container" dangerouslySetInnerHTML={{ __html: reportHtml }} />

      <iframe ref={printIframeRef} className="hidden" title="Print Report" />
    </div>
  )
}

function ReportPanelSkeleton() {
  return (
    <div className="flex-1 bg-white overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-[800px] mx-auto px-8 py-3 flex items-center justify-between">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-8 py-6 space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  )
}
