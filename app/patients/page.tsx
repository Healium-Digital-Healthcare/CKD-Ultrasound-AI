"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { PatientListTable } from "@/components/patients/patient-list-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Filter, Plus, Search, X, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { useGetPatientsQuery } from "@/store/services/patients"
import { PatientListTableSkeleton } from "@/components/patients/Patient-table-skeleton"
import { PatientFormDialog } from "@/components/patients/patient-form"
import { CreatePatientSheet } from "@/components/patients/create-patient-sheet"
import { EditPatientSheet } from "@/components/patients/edit-patient-sheet"

export default function PatientsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBy, setFilterBy] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)

  const { data: patients = [], isLoading, isError, error, refetch, isFetching } = useGetPatientsQuery()
  
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || patient.id && patient.id.includes(searchQuery)

      const matchesSeverity = severityFilter === "all" || patient.severity === severityFilter

      return matchesSearch && matchesSeverity
    })
  }, [patients, searchQuery, severityFilter])

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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Patients</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your patient records</p>
          </div>
          <Button onClick={handleCreate} className="">
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Name / Patient ID"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-9"
          />
        </div>

        <Select value={filterBy} onValueChange={setFilterBy}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Name / Patient ID" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="id">Patient ID</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative">
          <Select
            value={severityFilter}
            onValueChange={(value) => {
              setSeverityFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Severities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="mild">Mild</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="severe">Severe</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          {severityFilter !== "all" && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-8 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setSeverityFilter("all")
                setCurrentPage(1)
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 bg-transparent"
            onClick={handleRefresh}
            disabled={isFetching}
          >
            <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
          </Button>
      </div>
      {
        isError && (
          <div className="p-6 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading patients: {error?.toString()}</p>
              <Button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700">
                Try Again
              </Button>
            </div>
          </div>
        )
      }
      {
        (isLoading || isFetching) && (
          <PatientListTableSkeleton />
        )
      }
      {
        (!isError && !isFetching && !isLoading) && (
          <PatientListTable
            patients={paginatedPatients}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setCurrentPage(1)
            }}
            onRefresh={handleRefresh}
            onEdit={handleEdit}
          />
        )
      }

      {
        isCreateDialogOpen && (
          <CreatePatientSheet open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
        )
      }
      {
        isEditDialogOpen && selectedPatient && (
          <EditPatientSheet open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} patient={selectedPatient}/>
        )
      }
    </div>
  )
}