"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, FileText, Inbox } from "lucide-react"
import type { Case } from "@/types/case"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Pagination } from "../pagination"
import { EmptyState } from "@/components/ui/empty-state"

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
    <div className="space-y-4 bg-background flex flex-col flex-1">
      <div className="overflow-hidden bg-card border border-border rounded-lg flex flex-col flex-1">
        {cases.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={Inbox}
              title="No cases yet"
              description="Create a new case to get started with managing studies and analysis."
            />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-muted/40 to-transparent hover:bg-transparent border-b">
                  <TableHead className="font-semibold text-muted-foreground px-6 py-3">Patient Info</TableHead>
                  <TableHead className="font-semibold text-muted-foreground px-6 py-3">Study ID</TableHead>
                  <TableHead className="font-semibold text-muted-foreground px-6 py-3">Study Date</TableHead>
                  <TableHead className="font-semibold text-muted-foreground px-6 py-3">Status</TableHead>
                  <TableHead className="font-semibold text-muted-foreground text-right px-6 py-3">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.map((caseItem) => (
                  <TableRow key={caseItem.id} className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => onCaseClick?.(caseItem.case_number)}>
                    <TableCell className="text-foreground px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 bg-muted">
                          <AvatarFallback className="font-bold text-sm text-foreground">
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
                    <TableCell className="text-foreground text-sm px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="h-4 w-4 text-destructive" />
                        <span className="font-mono text-sm text-foreground">{caseItem.case_number}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground text-sm px-6 py-4">
                      {new Date(caseItem.study_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${getStatusBadge(caseItem.status || "").dot}`}></span>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(caseItem.status || "").bg}`}
                        >
                          {caseItem.status ? caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1) : "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-border text-foreground hover:bg-muted gap-1"
                        onClick={() => onCaseClick?.(caseItem.case_number)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
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
