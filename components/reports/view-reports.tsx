"use client"

import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { ReportPanel } from "@/components/cases/report-panel"

interface ViewReportSheetProps {
  caseId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewReportSheet({ caseId, open, onOpenChange }: ViewReportSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-full p-0 gap-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-background">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">Medical Report Viewer</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <div className="flex h-full">
              {/* Report Panel */}
              <div className="flex-1 overflow-y-auto">
                {caseId && <ReportPanel caseId={caseId} />}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}