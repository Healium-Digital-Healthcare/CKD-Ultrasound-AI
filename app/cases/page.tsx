"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter } from "lucide-react"
import { useGetCasesQuery } from "@/store/services/cases"
import { useEffect } from "react"
import { CaseListTableSkeleton } from "@/components/cases/Case-table-skeleton"
import { CaseListTable } from "@/components/cases/Case-list"
import { CreateCaseSheet } from "@/components/cases/create-case-sheet"
import { CaseDetailDrawer } from "@/components/cases/case-detail-drawer"
import { CreateStudySheet } from "@/components/cases/create-study-sheet"

export default function CasesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedCaseNumber, setSelectedCaseNumber] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data, isLoading, isError, error, refetch, isFetching } = useGetCasesQuery({
    params: {
      page: currentPage,
      limit: pageSize,
      search: debouncedSearch,
    },
  })

  const cases = Array.isArray(data?.data) ? data.data : data?.data ? [data.data] : []
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 }

  const totalCases = pagination.total
  const todayCases = cases.filter((c) => new Date(c.study_date).toDateString() === new Date().toDateString()).length
  const last7DaysCases = cases.filter((c) => {
    const date = new Date(c.study_date)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7
  }).length
  const last30DaysCases = cases.filter((c) => {
    const date = new Date(c.study_date)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30
  }).length

  const handleCreate = () => {
    setIsCreateDialogOpen(true)
  }

  const handleCaseClick = (caseNumber: string) => {
    setSelectedCaseNumber(caseNumber)
    setIsDrawerOpen(true)
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Study List</h1>
          <Button className="gap-2" onClick={() => handleCreate()}>
            <Plus className="h-4 w-4" />
            New Study
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border p-6">
            <div className="text-3xl font-semibold text-foreground">{totalCases}</div>
            <div className="text-sm text-muted-foreground mt-1">Total</div>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <div className="text-3xl font-semibold text-foreground">{todayCases}</div>
            <div className="text-sm text-muted-foreground mt-1">Today</div>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <div className="text-3xl font-semibold text-foreground">{last7DaysCases}</div>
            <div className="text-sm text-muted-foreground mt-1">Last 7 Days</div>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <div className="text-3xl font-semibold text-foreground">{last30DaysCases}</div>
            <div className="text-sm text-muted-foreground mt-1">Last 30 Days</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Study List</h2>
            <div className="flex items-center gap-2">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient id or name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2 h-9 bg-transparent">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          {isError && (
            <div className="p-6 flex items-center justify-center min-h-[400px] bg-card rounded-lg border">
              <div className="text-center">
                <p className="text-destructive mb-4">Error loading cases: {error?.toString()}</p>
                <Button onClick={refetch}>Try Again</Button>
              </div>
            </div>
          )}

          {(isLoading || isFetching) && <CaseListTableSkeleton />}

          {!isError && !isLoading && !isFetching && (
            <CaseListTable
              cases={cases}
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              pageSize={pagination.limit}
              totalEntries={pagination.total}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setCurrentPage(1)
              }}
              onRefresh={refetch}
              onCaseClick={handleCaseClick}
            />
          )}
        </div>
      </div>
      {isCreateDialogOpen && (
        <CreateStudySheet open={isCreateDialogOpen} onOpenChange={(value) => setIsCreateDialogOpen(value)} />
      )}
      
      <CaseDetailDrawer caseNumber={selectedCaseNumber} open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </div>
  )
}
