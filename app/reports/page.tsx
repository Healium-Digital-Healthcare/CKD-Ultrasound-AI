"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, FileText, RefreshCw } from "lucide-react"
import { useGetCasesQuery, useGetCaseStatsQuery } from "@/store/services/cases"
import { CaseListTableSkeleton } from "@/components/cases/Case-table-skeleton"
import { ReportListTable } from "@/components/reports/report-list"
import { ViewReportSheet } from "@/components/reports/view-reports"
import { StatsSkeleton } from "@/components/patients/stats-skeleton"

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)

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
      analyzed_by_ai: true, // Only fetch analyzed cases
    },
  })

  const { data: stats, isLoading: isStatsLoading, isFetching: isStatsFetching, refetch: statsRefetch } = useGetCaseStatsQuery()
  
  const cases = Array.isArray(data?.data) ? data.data : data?.data ? [data.data] : []
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 }

  const handleViewReport = (case_id: string) => {
    // Find case by case_number to get case_id
    setSelectedCaseId(case_id)
    setIsViewerOpen(true)
  }

  const handleRefresh = () => {
    refetch()
    statsRefetch()
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">Reports</h1>
          </div>
          <Button variant="outline" size="sm" className="gap-2 h-9 bg-transparent" onClick={() => handleRefresh()}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button> 
        </div>

        {
          (isStatsFetching || isStatsLoading) ? (
            <StatsSkeleton/>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card rounded-lg border p-6">
                <div className="text-3xl font-semibold text-foreground">{stats?.total}</div>
                <div className="text-sm text-muted-foreground mt-1">Total</div>
              </div>
              <div className="bg-card rounded-lg border p-6">
                <div className="text-3xl font-semibold text-foreground">{stats?.today}</div>
                <div className="text-sm text-muted-foreground mt-1">Today</div>
              </div>
              <div className="bg-card rounded-lg border p-6">
                <div className="text-3xl font-semibold text-foreground">{stats?.last7Days}</div>
                <div className="text-sm text-muted-foreground mt-1">Last 7 Days</div>
              </div>
              <div className="bg-card rounded-lg border p-6">
                <div className="text-3xl font-semibold text-foreground">{stats?.last30Days}</div>
                <div className="text-sm text-muted-foreground mt-1">Last 30 Days</div>
              </div>
            </div>
          )
        }

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Available Reports</h2>
            <div className="flex items-center gap-2">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by case number"
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
                <p className="text-destructive mb-4">Error loading reports: {error?.toString()}</p>
                <Button onClick={refetch}>Try Again</Button>
              </div>
            </div>
          )}

          {(isLoading || isFetching) && <CaseListTableSkeleton />}

          {!isError && !isLoading && !isFetching && (
            <ReportListTable
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
              onReportClick={handleViewReport}
            />
          )}
        </div>
      </div>

      {selectedCaseId && <ViewReportSheet caseId={selectedCaseId} open={isViewerOpen} onOpenChange={setIsViewerOpen} />}
    </div>
  )
}
