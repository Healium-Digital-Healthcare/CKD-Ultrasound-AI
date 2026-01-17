"use client"
import { ReportPanel } from "./report-panel"

interface StudyReportGenerationProps {
  caseId: string
  onGoBack?: () => void
}

export function StudyReportGeneration({ caseId, onGoBack }: StudyReportGenerationProps) {
  return (
    <div className="h-full flex overflow-hidden">
      {caseId && <ReportPanel caseId={caseId} />}
    </div>
  )
}