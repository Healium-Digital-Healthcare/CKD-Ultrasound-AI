"use client"

import { Button } from "@/components/ui/button"
import { useLazyGetImageAnalysisQuery } from "@/store/services/cases"
import { FileText, Download, Printer, Send } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface ReportPanelProps {
  imageId: string | null
}

export function ReportPanel({ imageId }: ReportPanelProps) {
  const [fetchAnalysis, { data: imageAnalysisData, isLoading, isFetching }] = useLazyGetImageAnalysisQuery()
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)
  const printIframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (imageId) {
      fetchAnalysis(imageId)
    }
  }, [imageId, fetchAnalysis])

  const handleDownloadPDF = async () => {
    if (!imageId) return

    try {
      setIsDownloadingPdf(true)
      const response = await fetch(`/api/image-analysis/${imageId}/download`)

      if (!response.ok) {
        throw new Error("Failed to generate PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `kidney-report-${imageId}.pdf`
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
    if (!printIframeRef.current || !imageAnalysisData?.report_html) return

    const iframe = printIframeRef.current
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

    if (!iframeDoc) return

    iframeDoc.open()
    iframeDoc.write(imageAnalysisData.report_html)
    iframeDoc.close()

    // Wait for images to load before printing
    iframe.onload = () => {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
    }
  }

  const handleSendToEMR = () => {
    console.log("Send to EMR for image:", imageId)
  }

  if (!imageId) {
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
  
  const reportHtml = imageAnalysisData?.report_html

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
