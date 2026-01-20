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
      <div className="space-y-4 bg-background">
        <div className="overflow-hidden border">
          <Table>
            <TableHeader>
              <TableRow className="border-b bg-muted/30 hover:bg-transparent">
                <TableHead className="font-medium text-muted-foreground h-10">PATIENT INFO</TableHead>
                <TableHead className="font-medium text-muted-foreground">MRN / ID</TableHead>
                <TableHead className="font-medium text-muted-foreground">LAST SCAN DATE</TableHead>
                <TableHead className="font-medium text-muted-foreground">STATUS</TableHead>
                <TableHead className="font-medium text-muted-foreground">EGFR</TableHead>
                <TableHead className="font-medium text-muted-foreground text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => { 
                return (
                  <TableRow
                    key={patient.id}
                    className="border-b hover:bg-muted/50 cursor-pointer h-16"
                    onClick={() => handleRowClick(patient.id)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="font-medium text-xs">
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
                          <span className="text-xs text-muted-foreground">
                            {patient.age} yrs, {patient.sex === "M" ? "Male" : "Female"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="h-4 w-4 text-green-700" />
                        <span className="font-mono text-sm">{patient.patient_id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">
                      {patient.scanned_on ? new Date(patient.scanned_on).toDateString() : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("font-normal capitalize", getStatusColor(patient.severity))}
                      >
                        {getStatusLabel(patient.severity)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-foreground">
                      {(patient.egfr !== undefined && patient.egfr !== null) ? `${patient.egfr.toFixed(1)} mL/min/1.73m²` : "-"}
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end items-center gap-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 border text-green-600 hover:text-green-700 hover:bg-green-50 gap-1"
                          onClick={() => handleRowClick(patient.id)}
                        >
                          View
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild className="">
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
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        <div className="w-full p-2">
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