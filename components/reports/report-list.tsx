"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Download, FileText, Loader2 } from "lucide-react"
import type { Case } from "@/types/case"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"
import { Pagination } from "../pagination"

interface ReportListTableProps {
  cases: Case[]
  currentPage: number
  totalPages: number
  pageSize: number
  totalEntries: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onRefresh: () => void
  onReportClick?: (case_id: string) => void
}

export function ReportListTable({
  cases,
  currentPage,
  totalPages,
  pageSize,
  totalEntries,
  onPageChange,
  onPageSizeChange,
  onReportClick,
}: ReportListTableProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const getInitials = (name: string) => {
    const parts = name.split(" ")
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const handleDownloadReport = async (caseId: string) => {
    setDownloadingId(caseId)
    try {
      const response = await fetch(`/api/cases/case/${caseId}/download`)

      if (!response.ok) {
        throw new Error("Failed to download report")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `report-${caseId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Report download error:", error)
      // Could integrate with toast notification here
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className="space-y-4 bg-background">
      <div className="border overflow-hidden bg-card">
        <Table>
          <TableHeader className="">
            <TableRow className="bg-muted/30 hover:bg-transparent border-b">
              <TableHead className="font-medium text-muted-foreground">Patient Info</TableHead>
              <TableHead className="font-medium text-muted-foreground">Case Number</TableHead>
              <TableHead className="font-medium text-muted-foreground">Report Date</TableHead>
              {/* <TableHead className="font-medium text-muted-foreground">Type</TableHead> */}
              <TableHead className="font-medium text-muted-foreground">Status</TableHead>
              <TableHead className="font-medium text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No reports found
                </TableCell>
              </TableRow>
            ) : (
              cases.map((caseItem) => (
                <TableRow key={caseItem.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 bg-muted">
                        <AvatarFallback className="font-medium text-xs">
                          {getInitials(caseItem.patient.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground text-sm">{caseItem.patient.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {caseItem.patient.age} yrs, {caseItem.patient.sex === "M" ? "Male" : "Female"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-4 w-4 text-green-700" />
                      <span className="font-mono text-sm">{caseItem.case_number}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground text-sm">
                    {new Date(caseItem.study_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  {/* <TableCell>
                    <span className="inline-block px-2.5 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                      AI Analysis
                    </span>
                  </TableCell> */}
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-sm text-green-700">
                      <span className="h-2 w-2 rounded-full bg-green-600"></span>
                      Complete
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-green-50"
                        disabled={downloadingId === caseItem.id}
                        onClick={() => handleDownloadReport(caseItem.id)}
                      >
                        {downloadingId === caseItem.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                        ) : (
                          <Download className="h-4 w-4 text-green-700" />
                        )}
                      </Button> */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 border text-green-600 hover:text-green-700 hover:bg-green-50 gap-1"
                        onClick={() => onReportClick?.(caseItem.id)}
                      >
                        View
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="w-full p-2">
        <Pagination
          currentPage={currentPage}
          totalEntries={totalEntries}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSize={pageSize}
        />
      </div>
    </div>
  )
}