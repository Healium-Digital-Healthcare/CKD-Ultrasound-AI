"use client"

import { useState } from "react"
import { PatientListTable } from "@/components/patient-list-table"
import { mockPatients } from "@/lib/mock-data"

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPatients = mockPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-6">
      <PatientListTable patients={filteredPatients} onPatientSelect={() => {}} />
    </div>
  )
}
