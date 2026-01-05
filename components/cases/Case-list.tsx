"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Download, Eye } from "lucide-react"
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
  onCaseClick,
}: CaseListTableProps) {

  const getInitials = (name: string) => {
    const parts = name.split(" ")
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="font-medium text-muted-foreground">Patient</TableHead>
              <TableHead className="font-medium text-muted-foreground">Case Number</TableHead>
              <TableHead className="font-medium text-muted-foreground">Scan Date</TableHead>
              <TableHead className="font-medium text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  No cases found
                </TableCell>
              </TableRow>
            ) : (
              cases.map((caseItem) => (
                <TableRow key={caseItem.id} className="hover:bg-muted/50">
                  <TableCell className="text-foreground">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-muted">
                        <AvatarFallback className="bg-muted text-foreground font-medium">
                          {getInitials(caseItem.patient.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">{caseItem.patient.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {caseItem.patient.patient_id} • {caseItem.patient.age}y • {caseItem.patient.sex}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">
                    {caseItem.case_number}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {new Date(caseItem.study_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      className="gap-1.5 h-8"
                      onClick={() => onCaseClick?.(caseItem.case_number)}
                    >
                      Viewer
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="w-full">
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
