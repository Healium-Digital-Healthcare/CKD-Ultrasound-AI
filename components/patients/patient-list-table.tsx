"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
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

interface PatientListTableProps {
  patients: Patient[]
  currentPage?: number
  totalPages?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  onRefresh?: () => void
  onEdit: (patient: Patient) => void
}

const getSeverityColor = (severity: Patient["severity"]) => {
  switch (severity) {
    case "normal":
      return "bg-green-50 text-green-700 hover:bg-green-50"
    case "mild":
      return "bg-blue-50 text-blue-700 hover:bg-blue-50"
    case "moderate":
      return "bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
    case "severe":
      return "bg-orange-50 text-orange-700 hover:bg-orange-50"
    case "critical":
      return "bg-red-50 text-red-700 hover:bg-red-50"
    default:
      return "bg-gray-100 text-gray-600 hover:bg-gray-100"
  }
}

const getCkdStageColor = (stage?: number) => {
  if (!stage) return "bg-gray-100 text-gray-600"
  if (stage <= 2) return "bg-green-100 text-green-700"
  if (stage === 3) return "bg-yellow-100 text-yellow-700"
  if (stage === 4) return "bg-orange-100 text-orange-700"
  return "bg-red-100 text-red-700"
}

export function PatientListTable({
  patients,
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  onRefresh,
  onEdit
}: PatientListTableProps) {
  const [selectedPatients, setSelectedPatients] = useState<string[]>([])
  const [deletePatient, { isLoading: isDeleting }] = useDeletePatientMutation()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null)


  const startEntry = (currentPage - 1) * pageSize + 1
  const endEntry = Math.min(currentPage * pageSize, patients.length)
  const totalEntries = patients.length

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
      alert("Failed to delete patient. Please try again.")
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 hover:bg-transparent">
                <TableHead className="font-semibold text-gray-700">Patient</TableHead>
                <TableHead className="font-semibold text-gray-700">Age</TableHead>
                <TableHead className="font-semibold text-gray-700">Sex</TableHead>
                <TableHead className="font-semibold text-gray-700">Severity</TableHead>
                <TableHead className="font-semibold text-gray-700">CKD Stage</TableHead>
                <TableHead className="font-semibold text-gray-700">eGFR</TableHead>
                <TableHead className="font-semibold text-gray-700 text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                          {patient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{patient.name}</span>
                        <span className="text-[12px] font-normal">{patient.patient_id}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{patient.age}</TableCell>
                  <TableCell className="text-sm">
                    <Badge variant="outline" className="font-normal">
                      {patient.sex}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn("font-normal capitalize", getSeverityColor(patient.severity))}
                    >
                      {patient.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {patient.ckd_stage ? (
                      <Badge variant="secondary" className={cn("font-normal", getCkdStageColor(patient.ckd_stage))}>
                        Stage {patient.ckd_stage}
                      </Badge>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {patient.egfr ? (
                      <span className={cn(patient.egfr < 60 ? "text-orange-600" : "text-green-600")}>
                        {patient.egfr} mL/min
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => onEdit(patient)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => patient.id && handleDeleteClick(patient.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium text-gray-900">{startEntry}</span> to{" "}
            <span className="font-medium text-gray-900">{endEntry}</span> of{" "}
            <span className="font-medium text-gray-900">{totalEntries}</span> entries
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => onPageChange?.(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => onPageChange?.(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
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