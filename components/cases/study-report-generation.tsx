"use client"

import { ReportPanel } from "./report-panel"

interface StudyReportGenerationProps {
  caseId: string
  onGoBack?: () => void
}

export function StudyReportGeneration({ caseId, onGoBack }: StudyReportGenerationProps) {

  return (
    <div className="h-full flex overflow-hidden">
      {/* Right: Report Panel - takes all remaining space */}
      {caseId && <ReportPanel caseId={caseId} />}
    </div>
  )
}
