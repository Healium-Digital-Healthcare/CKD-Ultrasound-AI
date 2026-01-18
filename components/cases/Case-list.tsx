"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, FileText } from "lucide-react"
import type { Case } from "@/types/case"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Pagination } from "../pagination"

interface CaseListTableProps {
  cases: Case[]
  currentPage: number
  totalPages: number
  pageSize: number
  totalEntries: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onRefresh: () => void
  onCaseClick?: (caseNumber: string) => void
}

export function CaseListTable({
  cases,
  currentPage,
  totalPages,
  pageSize,
  totalEntries,
  onPageChange,
  onPageSizeChange,
  onCaseClick
}: CaseListTableProps) {

  const getInitials = (name: string) => {
    const parts = name.split(" ")
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const getModalityColor = (modality: string) => {
    const colors: Record<string, string> = {
      ultrasound: "bg-emerald-100 text-emerald-700",
      "ct scan": "bg-blue-100 text-blue-700",
      mri: "bg-purple-100 text-purple-700",
      xray: "bg-amber-100 text-amber-700",
    }
    return colors[modality?.toLowerCase()] || "bg-gray-100 text-gray-700"
  }

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { bg: string; dot: string }> = {
      completed: { bg: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
      pending: { bg: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
      "in review": { bg: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
      error: { bg: "bg-red-100 text-red-700", dot: "bg-red-500" },
    }
    return configs[status?.toLowerCase()] || { bg: "bg-gray-100 text-gray-700", dot: "bg-gray-500" }
  }

  return (
    <div className="space-y-4 bg-background">
      <div className=" overflow-hidden bg-card border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b bg-muted/30">
              <TableHead className="font-semibold text-muted-foreground text-xs">PATIENT INFO</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-xs">STUDY ID</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-xs">STUDY DATE</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-xs">STATUS</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-xs text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No cases found
                </TableCell>
              </TableRow>
            ) : (
              cases.map((caseItem) => (
                <TableRow key={caseItem.id} className="hover:bg-muted/40 border-b">
                  <TableCell className="text-foreground">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="font-medium text-xs">
                          {getInitials(caseItem.patient.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm text-foreground">{caseItem.patient.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {caseItem.patient.age} yrs, {caseItem.patient.sex === "M" ? "Male" : "Female"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4 text-green-700" />
                    <span className="font-mono text-sm">{caseItem.case_number}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground text-sm">
                    {new Date(caseItem.study_date).toDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${getStatusBadge(caseItem.ai_analysis_status || "").dot}`}></span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(caseItem.ai_analysis_status || "").bg}`}
                      >
                        {caseItem.ai_analysis_status || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 border text-green-600 hover:text-green-700 hover:bg-green-50 gap-1"
                      onClick={() => onCaseClick?.(caseItem.case_number)}
                    >
                      View
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
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