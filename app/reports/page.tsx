"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download, RefreshCw, BarChart3, FileText, Calendar, Clock, TrendingUp } from "lucide-react"
import { useGetCasesQuery, useGetCaseStatsQuery } from "@/store/services/cases"
import { CaseListTableSkeleton } from "@/components/cases/Case-table-skeleton"
import { ReportListTable } from "@/components/reports/report-list"
import { ViewReportSheet } from "@/components/reports/view-reports"
import { StatsSkeleton } from "@/components/patients/stats-skeleton"

function ReportsContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [reportType, setReportType] = useState("All")

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
      analyzed_by_ai: true,
    },
  })

  const {
    data: stats,
    isLoading: isStatsLoading,
    isFetching: isStatsFetching,
    refetch: statsRefetch,
  } = useGetCaseStatsQuery()

  const cases = Array.isArray(data?.data) ? data.data : data?.data ? [data.data] : []
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 }

  const handleViewReport = (case_id: string) => {
    setSelectedCaseId(case_id)
    setIsViewerOpen(true)
  }

  const handleRefresh = () => {
    refetch()
    statsRefetch()
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Reports</h1>
              <p className="text-sm text-muted-foreground mt-1">View and manage AI analysed diagnostic reports</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 h-9 bg-transparent" onClick={() => handleRefresh()}>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button variant="default" size="sm" className="gap-2 h-9">
                <Download className="h-4 w-4" />
                Export All
              </Button>
            </div>
          </div>

          {isStatsFetching || isStatsLoading ? (
            <StatsSkeleton />
          ) : (
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-card rounded-lg border p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Total Reports</div>
                    <div className="text-2xl font-bold text-foreground mt-1">{stats?.total}</div>
                  </div>
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg border p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Today</div>
                    <div className="text-2xl font-bold text-foreground mt-1">{stats?.today}</div>
                  </div>
                  <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg border p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Last 7 Days</div>
                    <div className="text-2xl font-bold text-foreground mt-1">{stats?.last7Days}</div>
                  </div>
                  <div className="w-8 h-8 rounded bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-muted-foreground text-orange-600" />
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg border p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Last 30 Days</div>
                    <div className="text-2xl font-bold text-foreground mt-1">{stats?.last30Days}</div>
                  </div>
                  <div className="w-8 h-8 rounded bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-muted-foreground text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-auto px-4 py-4">
          <div className="bg-background flex items-center justify-between gap-3 p-4 border">
            {/* <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Type:</span>
              {["All", "AI Analysis", "Final", "Draft"].map((type) => (
                <button
                  key={type}
                  onClick={() => setReportType(type)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    reportType === type
                      ? "bg-green-600 text-white"
                      : "bg-transparent text-muted-foreground border border-border hover:bg-muted"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div> */}
            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                type="text"
                value={searchQuery}
                placeholder={`Search by Study ID`}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                }}
                className="pl-9 pr-28 h-9 bg-muted/50 border-border/50 focus-visible:ring-1 focus-visible:ring-primary text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Showing {cases.length} of {pagination.total} reports
              </div>
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

        {selectedCaseId && (
          <ViewReportSheet caseId={selectedCaseId} open={isViewerOpen} onOpenChange={setIsViewerOpen} />
        )}
      </div>
    </>
  )
}

export default function ReportsPage() {
  return (
    <Suspense fallback={null}>
      <ReportsContent />
    </Suspense>
  )
}
