"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, FileText } from "lucide-react"
import { useGetCasesQuery } from "@/store/services/cases"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Pagination } from "@/components/pagination"

interface PatientStudiesListProps {
  patientId: string
  onCaseClick: (caseNumber: string) => void
}

export function PatientStudiesList({ patientId, onCaseClick }: PatientStudiesListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { data: casesResponse, isLoading } = useGetCasesQuery({
    params: {
      page: currentPage,
      limit: pageSize,
      patientId: patientId
    },
  })

  const cases = casesResponse?.data ? casesResponse.data : []
  const pagination = casesResponse?.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 }

  const getInitials = (name: string) => {
    const parts = name.split(" ")
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (cases.length === 0) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No studies found</h3>
          <p className="text-sm text-gray-600">This patient doesn&apos;t have any studies yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="space-y-4">
        <div className="rounded-lg overflow-hidden bg-card border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="font-medium text-muted-foreground">Patient</TableHead>
                <TableHead className="font-medium text-muted-foreground">Study Id</TableHead>
                <TableHead className="font-medium text-muted-foreground">Scan Date</TableHead>
                <TableHead className="font-medium text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((caseItem) => (
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
                          {caseItem.patient.patient_id} • {caseItem.patient.age} yrs • {caseItem.patient.sex === 'M' ? 'Male' : 'Female'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-4 w-4 text-green-700" />
                      <span className="font-mono text-sm">{caseItem.case_number}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">
                    {new Date(caseItem.study_date).toDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" className="gap-1.5 h-8" onClick={() => onCaseClick(caseItem.case_number)}>
                      Viewer
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="w-full">
          <Pagination
            currentPage={currentPage}
            totalEntries={pagination.total}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setCurrentPage(1)
            }}
            pageSize={pageSize}
          />
        </div>
      </div>
    </div>
  )
}
