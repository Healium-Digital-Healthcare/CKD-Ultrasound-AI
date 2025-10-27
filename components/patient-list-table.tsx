"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Patient } from "@/types/case"

interface PatientListTableProps {
  patients: Patient[]
  onPatientSelect: (patient: Patient) => void
}

export function PatientListTable({ patients, onPatientSelect }: PatientListTableProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "normal":
        return "bg-green-600 text-white"
      case "mild":
        return "bg-yellow-500 text-black"
      case "moderate":
        return "bg-blue-600 text-white"
      case "severe":
      case "critical":
        return "bg-red-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  return (
    <div className="rounded-lg border border-gray-700 overflow-hidden bg-black">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-gray-200">Patient Name</TableHead>
            <TableHead className="font-semibold text-gray-200">Patient ID</TableHead>
            <TableHead className="font-semibold text-gray-200">Age / Sex</TableHead>
            <TableHead className="font-semibold text-gray-200">Severity</TableHead>
            <TableHead className="font-semibold text-gray-200">Scanned On</TableHead>
            <TableHead className="font-semibold text-gray-200">Last Updated</TableHead>
            <TableHead className="font-semibold text-right text-gray-200">Detail</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {patients.map((patient) => (
            <TableRow
              key={patient.id}
              onClick={() => onPatientSelect(patient)}
              className="cursor-pointer hover:bg-gray-800 transition-colors"
            >
              <TableCell className="font-medium text-white">{patient.name}</TableCell>
              <TableCell className="font-mono text-sm text-gray-300">{patient.patientId}</TableCell>
              <TableCell className="text-sm text-gray-300">
                {patient.age}y / {patient.sex}
              </TableCell>
              <TableCell>
                <Badge className={cn("capitalize font-medium px-3 py-1", getSeverityColor(patient.severity))}>
                  {patient.severity || "N/A"}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-gray-300">{patient.scannedOn || "—"}</TableCell>
              <TableCell className="text-sm text-gray-300">{patient.lastUpdated || "—"}</TableCell>
              <TableCell className="text-right">
                <Link href={`/patients/${patient.patientId}`}>
                  <Button
                    size="sm"
                    className="h-8 px-3 text-xs bg-[#009A6B] hover:bg-[#007a55] text-white border-none"
                  >
                    Detail
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="border-t px-6 py-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-white">{patients.length}</span> patients
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled
            className="text-white/50 hover:bg-white/10 border border-white/20"
          >
            First
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled
            className="text-white/50 hover:bg-white/10 border border-white/20"
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6].map((page) => (
              <Button
                key={page}
                size="sm"
                className={cn(
                  "w-8 h-8 p-0 text-xs",
                  page === 1
                    ? "bg-[#009A6B] hover:bg-[#008059] text-white"
                    : "bg-black border border-white/20 text-white/70 hover:bg-white/10",
                )}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:bg-white/10 border border-white/20"
          >
            Next
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:bg-white/10 border border-white/20"
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  )
}
