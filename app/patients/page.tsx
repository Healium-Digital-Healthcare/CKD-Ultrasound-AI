"use client"

import { useState, useEffect } from "react"
import { PatientListTable } from "@/components/patients/patient-list-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, RefreshCw, Search } from "lucide-react"
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
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const { data, isLoading, isError, error, refetch, isFetching } = useGetPatientsQuery({
    params: {
      page: currentPage,
      limit: pageSize,
      search: debouncedSearch,
      status: statusFilter,
    },
  })

  const patients = Array.isArray(data?.data) ? data.data : data?.data ? [data.data] : []
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 }

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Patient Registry</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage patient records and view AI analysis status</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 h-9 bg-transparent" onClick={() => handleRefresh()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700" onClick={handleCreate}>
              <Plus className="h-4 w-4" />
              Add Patient
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between p-4 border bg-background">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Status:</span>
              {["All", "Critical", "Stable", "Recovering"].map((label) => (
                <Button
                  key={label}
                  variant={statusFilter === label.toLowerCase().replace(" ", "") ? "default" : "outline"}
                  size="sm"
                  className="h-8 px-3 text-xs"
                  onClick={() => setStatusFilter(label.toLowerCase().replace(" ", "") as any)}
                >
                  {label}
                </Button>
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-4">
              Showing {patients.length} of{" "} {pagination.total} patients
            </span>
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
              patients={patients}
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              pageSize={pagination.limit}
              totalEntries={pagination.total}
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
