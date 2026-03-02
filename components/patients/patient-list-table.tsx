"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, FileText, MoreVertical } from "lucide-react"
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
import { useDeletePatientMutation } from "@/store/services/patients"
import { Pagination } from "@/components/pagination" // Assuming it's in the same directory or adjust path accordingly
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Avatar, AvatarFallback } from "../ui/avatar"

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
  if (severity === "normal" || severity === "mild") return "Stable"
  if (severity === "moderate" || severity === "severe") return "Recovering"
  if (severity === "critical") return "Critical"
  return "Unknown"
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
      <div className="space-y-4 bg-white">
        <div className="overflow-hidden border-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b bg-blue-900 hover:bg-blue-900">
                <TableHead className="font-semibold text-white h-10 px-6 py-3">Patient Info.</TableHead>
                <TableHead className="font-semibold text-white px-6 py-3">MRN / ID</TableHead>
                <TableHead className="font-semibold text-white px-6 py-3">Last Scan Date</TableHead>
                <TableHead className="font-semibold text-white px-6 py-3">Status</TableHead>
                <TableHead className="font-semibold text-white px-6 py-3">eGFR</TableHead>
                <TableHead className="font-semibold text-white text-right px-6 py-3">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => { 
                return (
                  <TableRow
                    key={patient.id}
                    className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer h-16"
                    onClick={() => handleRowClick(patient.id)}
                  >
                    <TableCell className="font-medium px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 bg-gray-300">
                          <AvatarFallback className="font-medium text-xs text-white">
                            {patient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">{patient.name}</span>
                          <span className="text-xs text-gray-600">
                            {patient.age} yrs, {patient.sex === "M" ? "Male" : "Female"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-foreground px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FileText className="h-4 w-4 text-red-500" />
                        <span className="font-mono text-sm">{patient.patient_id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-foreground px-6 py-4">
                      {patient.scanned_on ? new Date(patient.scanned_on).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "-"}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={cn("font-normal capitalize text-xs", getStatusColor(patient.severity))}
                      >
                        {getStatusLabel(patient.severity)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-foreground px-6 py-4">
                      {(patient.egfr !== undefined && patient.egfr !== null) ? `${patient.egfr.toFixed(1)} mL/min/1.73m²` : "-"}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 border border-green-600 text-green-600 hover:text-green-700 hover:bg-green-50 gap-1 px-3"
                          onClick={() => handleRowClick(patient.id)}
                        >
                          View
                          <span className="text-lg">📋</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        <div className="w-full p-4">
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
