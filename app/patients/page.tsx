"use client"

import { useState, useEffect } from "react"
import { PatientListTable } from "@/components/patients/patient-list-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, RefreshCw, Search, Users } from "lucide-react"
import { useGetPatientsQuery } from "@/store/services/patients"
import { PatientListTableSkeleton } from "@/components/patients/Patient-table-skeleton"
import { CreatePatientSheet } from "@/components/patients/create-patient-sheet"
import { EditPatientSheet } from "@/components/patients/edit-patient-sheet"
import { EmptyState } from "@/components/ui/empty-state"

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
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Patients</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage patient records and medical information</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 h-9 bg-transparent" 
            onClick={() => handleRefresh()}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              size="sm"
              className="h-9 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleCreate}
            >
              <Plus className="h-4 w-4" />
              Add Patient
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="px-6 py-4 space-y-4">
          {/* Search bar */}
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or MRN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9 border-border bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="bg-card rounded-lg border border-border flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-muted/20 to-transparent">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">Status:</span>
                {["All", "Critical", "Stable", "Recovering"].map((label) => (
                  <Button
                    key={label}
                    variant={statusFilter === label.toLowerCase().replace(" ", "") ? "default" : "outline"}
                    size="sm"
                    className={`h-8 px-4 text-sm font-medium transition-colors ${
                      statusFilter === label.toLowerCase().replace(" ", "")
                        ? "bg-primary text-primary-foreground border-primary hover:bg-primary"
                        : "bg-background text-foreground border-border hover:bg-muted"
                    }`}
                    onClick={() => setStatusFilter(label.toLowerCase().replace(" ", "") as any)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                Showing {patients.length} of {pagination.total}
              </span>
            </div>

            {isError && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-destructive mb-4">Error loading patients: {error?.toString()}</p>
                  <Button onClick={handleRefresh}>Try Again</Button>
                </div>
              </div>
            )}

            {(isLoading || isFetching) && <PatientListTableSkeleton />}

            {!isError && !isFetching && !isLoading && patients.length === 0 && (
              <div className="flex-1 flex items-center justify-center">
                <EmptyState
                  icon={Users}
                  title="No patients yet"
                  description="Create a new patient to get started with managing patient records."
                />
              </div>
            )}

            {!isError && !isFetching && !isLoading && patients.length > 0 && (
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
      </div>

      {isCreateDialogOpen && <CreatePatientSheet open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />}
      {isEditDialogOpen && selectedPatient && (
        <EditPatientSheet open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} patient={selectedPatient} />
      )}
    </div>
  )
}