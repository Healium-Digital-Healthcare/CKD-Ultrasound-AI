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
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-3xl font-bold text-foreground">Patients</h1>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="px-6 py-4">
          <div className="bg-white rounded-lg border border-cyan-200">
            <div className="flex items-center justify-between p-4 border-b border-cyan-200">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground/70">Status:</span>
                {["All", "Critical", "Stable", "Recovering"].map((label) => (
                  <Button
                    key={label}
                    variant={statusFilter === label.toLowerCase().replace(" ", "") ? "default" : "outline"}
                    size="sm"
                    className={`h-8 px-4 text-sm font-medium ${
                      statusFilter === label.toLowerCase().replace(" ", "")
                        ? "bg-primary text-primary-foreground border-primary hover:bg-primary"
                        : "bg-white text-foreground border-cyan-200 hover:bg-cyan-50"
                    }`}
                    onClick={() => setStatusFilter(label.toLowerCase().replace(" ", "") as any)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
              <span className="text-sm text-foreground/60 ml-4">
                Showing {patients.length} of {pagination.total}
              </span>
            </div>

            {isError && (
              <div className="p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <p className="text-red-600 mb-4">Error loading patients: {error?.toString()}</p>
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
      </div>

      {isCreateDialogOpen && <CreatePatientSheet open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />}
      {isEditDialogOpen && selectedPatient && (
        <EditPatientSheet open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} patient={selectedPatient} />
      )}
    </div>
  )
}
