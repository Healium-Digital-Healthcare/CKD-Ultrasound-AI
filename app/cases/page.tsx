"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, RefreshCw, FileText, Calendar, Clock, TrendingUp, Plus } from "lucide-react"
import { useGetCasesQuery, useGetCaseStatsQuery } from "@/store/services/cases"
import { useEffect } from "react"
import { CaseListTableSkeleton } from "@/components/cases/Case-table-skeleton"
import { CaseListTable } from "@/components/cases/Case-list"
import { CaseDetailDrawer } from "@/components/cases/case-detail-drawer"
import { CreateStudySheet } from "@/components/cases/create-study-sheet"
import { StatsSkeleton } from "@/components/patients/stats-skeleton"
import { StatCard } from "@/components/dashboard/stat-card"

const rangeFilters: {value: "all" | "today" | "week" | "month", label: string}[] = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Today',
    value: 'today'
  },
  {
    label: 'This Week',
    value: 'week'
  },
  {
    label: 'This Month',
    value: 'month'
  }
]

export default function CasesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedCaseNumber, setSelectedCaseNumber] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [filterRange, setFilterRange] = useState<"all" | "today" | "week" | "month">("all")

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
      range: filterRange
    },
  })

  const {
    data: stats,
    isLoading: isStatsLoading,
    isFetching: isStatsFetching,
    refetch: statsRefetch,
  } = useGetCaseStatsQuery()

  const cases = data?.data ? data.data : []
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 }

  const handleCreate = () => {
    setIsCreateDialogOpen(true)
  }

  const handleCaseClick = (caseNumber: string) => {
    setSelectedCaseNumber(caseNumber)
    setIsDrawerOpen(true)
  }

  const handleRefresh = () => {
    refetch()
    statsRefetch()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Study List</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage imaging studies and view analysis results</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 h-9 bg-transparent" onClick={() => handleRefresh()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700" onClick={handleCreate}>
              <Plus className="h-4 w-4" />
              New Study
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 pt-3 pb-2">
        {isStatsFetching || isStatsLoading ? (
          <StatsSkeleton />
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2">
            <StatCard label="Total Studies" value={stats?.total || 0} bgColor="green" className="min-w-max flex-1" />
            <StatCard label="Today" value={stats?.today || 0} bgColor="blue" className="min-w-max flex-1" />
            <StatCard label="Last 7 Days" value={stats?.last7Days || 0} bgColor="green" className="min-w-max flex-1" />
            <StatCard label="Last 30 Days" value={stats?.last30Days || 0} bgColor="teal" className="min-w-max flex-1" />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 bg-background border p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Filter:</span>
            {rangeFilters.map((rangeFilter) => (
              <Button
                key={rangeFilter.value}
                variant={filterRange === rangeFilter.value ? "default" : "outline"}
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => setFilterRange(rangeFilter.value)}
              >
                {rangeFilter.label}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
            <span>
              Showing {cases.length} of {pagination.total} studies
            </span>
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
      {isCreateDialogOpen && (
        <CreateStudySheet open={isCreateDialogOpen} onOpenChange={(value) => setIsCreateDialogOpen(value)} />
      )}

      <CaseDetailDrawer caseNumber={selectedCaseNumber} open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </div>
  )
}
