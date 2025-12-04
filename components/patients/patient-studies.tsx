"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FileText, Eye, Download } from "lucide-react"
import type { Case } from "@/types/case"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface PatientStudiesProps {
  cases: Case[]
  isLoading: boolean
  onCaseClick: (caseNumber: string) => void
}

export function PatientStudies({ cases, isLoading, onCaseClick }: PatientStudiesProps) {
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
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No studies found</h3>
          <p className="text-sm text-gray-600">This patient doesn't have any studies yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-gray-200">
              <TableHead className="font-medium text-gray-700 text-sm w-1/3">Patient</TableHead>
              <TableHead className="font-medium text-gray-700 text-sm w-1/3">Scan Date</TableHead>
              <TableHead className="font-medium text-gray-700 text-sm w-1/3">AI Analysis Result</TableHead>
              <TableHead className="font-medium text-gray-700 text-sm w-1/3">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.map((caseItem) => (
              <TableRow key={caseItem.id} className="hover:bg-gray-50/50 border-b border-gray-100">
                <TableCell className="w-1/3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-gray-100">
                      <AvatarFallback className="bg-gray-100 text-gray-700 font-medium text-sm">
                        {getInitials(caseItem.patient.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">{caseItem.patient.name}</div>
                      <div className="text-sm text-gray-600">
                        {caseItem.patient.patient_id} • {caseItem.patient.age}y • {caseItem.patient.sex}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-900 w-1/3">
                  {new Date(caseItem.study_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </TableCell>
                <TableCell className="w-1/3">
                  <Button variant="link" className="h-auto p-0 text-primary font-normal" asChild>
                    <a href="#" className="flex items-center gap-1.5">
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </a>
                  </Button>
                </TableCell>
                <TableCell className="w-1/3">
                  <Button
                    size="sm"
                    className="gap-1.5 h-9"
                    onClick={() => onCaseClick(caseItem.case_number)}
                  >
                    Viewer
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
