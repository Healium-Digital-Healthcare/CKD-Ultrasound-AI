"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MoreVertical } from "lucide-react"
import type { Patient } from "@/types/patient"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useDeletePatientMutation } from "@/store/services/patients"
import  {Pagination}  from "@/components/pagination" // Assuming it's in the same directory or adjust path accordingly

interface PatientListTableProps {
  patients: Patient[]
  currentPage: number
  totalPages: number
  pageSize: number
  totalEntries: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onRefresh?: () => void
  onEdit: (patient: Patient) => void
}

const getStatusColor = (severity: Patient["severity"]) => {
  switch (severity) {
    case "normal":
    case "mild":
      return "bg-green-50 text-green-700 border-green-200"
    case "moderate":
    case "severe":
      return "bg-orange-50 text-orange-700 border-orange-200"
    case "critical":
      return "bg-red-50 text-red-700 border-red-200"
    default:
      return "bg-gray-50 text-gray-600 border-gray-200"
  }
}

const getStatusLabel = (severity: Patient["severity"]) => {
  if (severity === "normal" || severity === "mild") return "stable"
  if (severity === "moderate" || severity === "severe") return "recovering"
  if (severity === "critical") return "critical"
  return "unknown"
}

const getCkdStageLabel = (stage?: number) => {
  if (!stage) return "-"
  return `CKD ${stage}`
}

export function PatientListTable({
  patients,
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  totalEntries = 0,
  onPageChange,
  onPageSizeChange,
  onRefresh,
  onEdit,
}: PatientListTableProps) {
  const router = useRouter()
  const [deletePatient, { isLoading: isDeleting }] = useDeletePatientMutation()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null)

  const handleDeleteClick = (patientId: string) => {
    setPatientToDelete(patientId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!patientToDelete) return

    try {
      await deletePatient(patientToDelete).unwrap()
      setDeleteDialogOpen(false)
      setPatientToDelete(null)
      onRefresh?.()
    } catch (error) {
      console.error("Failed to delete patient:", error)
    }
  }

  const handleRowClick = (patientId: string) => {
    router.push(`/patients/${patientId}`)
  }

  return (
    <>
      <div className="space-y-4">
        <div className="rounded overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-b hover:bg-transparent">
                <TableHead className="font-medium text-muted-foreground w-1/6">Patient</TableHead>
                <TableHead className="font-medium text-center text-muted-foreground w-1/6">Stage</TableHead>
                <TableHead className="font-medium text-muted-foreground w-1/6">Status</TableHead>
                <TableHead className="font-medium text-muted-foreground w-1/6">Last Scan</TableHead>
                <TableHead className="font-medium text-muted-foreground w-1/6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow
                  key={patient.id}
                  className="border-b border-gray-100 hover:bg-gray-50/50 cursor-pointer"
                  onClick={() => handleRowClick(patient.id)}
                >
                  <TableCell className="w-1/6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium text-sm">
                        {patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{patient.name}</span>
                        <span className="text-xs text-gray-500">
                          {patient.patient_id} • {patient.age}y • {patient.sex === "M" ? "Male" : "Female"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-center text-gray-900 w-1/6">{getCkdStageLabel(patient.ckd_stage)}</TableCell>
                  <TableCell className="w-1/6">
                    <Badge variant="outline" className={cn("font-normal capitalize", getStatusColor(patient.severity))}>
                      {getStatusLabel(patient.severity)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 w-1/6">
                    {patient.scanned_on ? new Date(patient.scanned_on).toISOString().split("T")[0] : "-"}
                  </TableCell>
                  <TableCell className="w-1/6 flex items-center" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      className="gap-1.5 h-8"
                      onClick={() => handleRowClick(patient.id)}
                    >
                      Detail
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(patient)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(patient.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="w-full">
          <Pagination
          currentPage={currentPage}
          totalEntries={totalEntries}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          />
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the patient record and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
