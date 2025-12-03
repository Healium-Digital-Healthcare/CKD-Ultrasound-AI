"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, RefreshCw } from 'lucide-react'
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useGetCasesQuery } from "@/store/services/cases"
import { useEffect } from "react"
import { CaseListTableSkeleton } from "@/components/cases/Case-table-skeleton"
import { CaseListTable } from "@/components/cases/Case-list"
import { CreateCaseSheet } from "@/components/cases/create-case-sheet"

export default function CasesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

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
    }
  })

  // ensure `cases` is always an array (if the API returns a single case object, wrap it)
  const cases = Array.isArray(data?.data) ? data.data : data?.data ? [data.data] : []
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 }

  const handleRefresh = () => {
    refetch()
  }

  const handleCreate = () => {
    setIsCreateDialogOpen(true)
  }

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Case List</h1>
          <Button 
          className="gap-2"
          onClick={() => handleCreate()}
          >
            <Plus className="h-4 w-4" />
            New Case
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by Case #, Patient Name, or Patient ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            onClick={handleRefresh}
            disabled={isFetching}
          >
            <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
          </Button>
        </div>

        {isError && (
          <div className="p-6 flex items-center justify-center min-h-[400px] bg-white rounded-lg border">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading cases: {error?.toString()}</p>
              <Button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700">
                Try Again
              </Button>
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
            onRefresh={handleRefresh}
          />
        )}
      </div>
      {
        isCreateDialogOpen && (
          <CreateCaseSheet open={isCreateDialogOpen} onOpenChange={(value) => setIsCreateDialogOpen(value)}/>
        )
      }
    </div>
  )
}
