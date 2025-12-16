"use client"

import { useState, useMemo } from "react"
import { PatientListTable } from "@/components/patients/patient-list-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter } from "lucide-react"
import { useGetPatientsQuery } from "@/store/services/patients"
import { PatientListTableSkeleton } from "@/components/patients/Patient-table-skeleton"
import { CreatePatientSheet } from "@/components/patients/create-patient-sheet"
import { EditPatientSheet } from "@/components/patients/edit-patient-sheet"

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)

  const { data: patients = [], isLoading, isError, error, refetch, isFetching } = useGetPatientsQuery()

  const stats = useMemo(() => {
    const total = patients.length
    const stable = patients.filter((p) => p.severity === "normal" || p.severity === "mild").length
    const critical = patients.filter((p) => p.severity === "critical").length
    const recovering = patients.filter((p) => p.severity === "moderate" || p.severity === "severe").length

    return { total, stable, critical, recovering }
  }, [patients])

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (patient.patient_id && patient.patient_id.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "stable" && (patient.severity === "normal" || patient.severity === "mild")) ||
        (statusFilter === "critical" && patient.severity === "critical") ||
        (statusFilter === "recovering" && (patient.severity === "moderate" || patient.severity === "severe"))

      return matchesSearch && matchesStatus
    })
  }, [patients, searchQuery, statusFilter])

  const totalPages = Math.ceil(filteredPatients.length / pageSize)
  const paginatedPatients = filteredPatients.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleRefresh = () => {
    refetch()
  }

  const handleCreate = () => {
    setIsCreateDialogOpen(true)
  }

  const handleEdit = (patient: any) => {
    setSelectedPatient(patient)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Patients</h1>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Patient
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border p-6">
            <div className="text-3xl font-semibold text-foreground">{stats.total}</div>
            <div className="text-sm text-muted-foreground mt-1">Total Patients</div>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <div className="text-3xl font-semibold text-foreground">{stats.stable}</div>
            <div className="text-sm text-muted-foreground mt-1">Stable</div>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <div className="text-3xl font-semibold text-foreground">{stats.critical}</div>
            <div className="text-sm text-muted-foreground mt-1">Critical</div>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <div className="text-3xl font-semibold text-foreground">{stats.recovering}</div>
            <div className="text-sm text-muted-foreground mt-1">Recovering</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Patient Records</h2>
            <div className="flex items-center gap-2">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-9 h-9"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[150px] h-9 bg-transparent">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="recovering">Recovering</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isError && (
            <div className="p-6 flex items-center justify-center min-h-[400px] bg-card rounded-lg border">
              <div className="text-center">
                <p className="text-destructive mb-4">Error loading patients: {error?.toString()}</p>
                <Button onClick={handleRefresh}>Try Again</Button>
              </div>
            </div>
          )}

          {(isLoading || isFetching) && <PatientListTableSkeleton />}

          {!isError && !isFetching && !isLoading && (
            <PatientListTable
              patients={paginatedPatients}
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalEntries={filteredPatients.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setCurrentPage(1)
              }}
              onRefresh={handleRefresh}
              onEdit={handleEdit}
            />
          )}
        </div>
      </div>

      {isCreateDialogOpen && <CreatePatientSheet open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />}
      {isEditDialogOpen && selectedPatient && (
        <EditPatientSheet open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} patient={selectedPatient} />
      )}
    </div>
  )
}
