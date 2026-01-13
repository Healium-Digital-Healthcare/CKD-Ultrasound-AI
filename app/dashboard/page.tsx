"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, RefreshCw, Calendar, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetCasesQuery } from "@/store/services/cases"
import { useGetDashboardStatsQuery, useGetTodayStatsQuery } from "@/store/services/organization"
import { CaseDetailDrawer } from "@/components/cases/case-detail-drawer"
import { CreateStudySheet } from "@/components/cases/create-study-sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatsSkeleton } from "@/components/organization/stats-skeleton"
import { StudiesSkeleton } from "@/components/organization/studies-skeleton"
import { Pagination } from "@/components/pagination"

export default function DashboardPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedCaseNumber, setSelectedCaseNumber] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    // No changes needed here for the update
  }, [])

  const {
    data: casesData,
    refetch,
    isFetching,
    isLoading,
  } = useGetCasesQuery({
    params: { page: currentPage, limit: pageSize, range: "all" },
  })

  const { data: todayStats, isLoading: isStatsLoading, isFetching: isStatsFetching, refetch: refetchStats } = useGetTodayStatsQuery()

  const cases = casesData?.data ? casesData.data : []
  const pagination = casesData?.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 }

  const handleCaseClick = (caseId: string) => {
    setSelectedCaseNumber(caseId)
    setIsDrawerOpen(true)
  }

  const handleCreate = () => {
    setIsCreateDialogOpen(true)
  }

  const handleRefetch = () => {
    refetch()
    refetchStats()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header section */}
      <div className="px-4 pt-4 pb-3 border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Daily Screening Summary</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Monitor today&apos;s CKD detection and analysis results</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 h-9 bg-transparent" onClick={() => handleRefetch()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700 text-white gap-2 h-9 px-4">
              <Plus className="w-4 h-4" />
              New Screening
            </Button>
          </div>
        </div>
      </div>

      {/* Stats section */}
      {(isStatsLoading || isStatsFetching) ? (
        <StatsSkeleton />
      ) : (
        <div className="px-4 pt-3 pb-2">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    Today's Screenings
                  </div>
                  <div className="text-3xl font-bold text-foreground mt-2">{todayStats?.total}</div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">CKD Detected</div>
                  <div className="text-3xl font-bold text-red-600 mt-2">{todayStats?.ckdDetected}</div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Normal</div>
                  <div className="text-3xl font-bold text-green-600 mt-2">{todayStats?.normal}</div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Studies section */}
      {(isLoading || isFetching) ? (
        <StudiesSkeleton />
      ) : (
        <div className="flex-1 overflow-auto px-4 py-3">
          <div className="bg-card rounded-lg border overflow-hidden">
            <div className="px-6 py-3 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Today's Studies</h2>
              <div className="text-xs text-muted-foreground">
                Showing {Math.min(pageSize, cases.length)} of {pagination.total}
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="px-6 py-3">Patient</TableHead>
                  <TableHead className="px-6 py-3">Study ID</TableHead>
                  <TableHead className="px-6 py-3">Result</TableHead>
                  <TableHead className="px-6 py-3">eGFR</TableHead>
                  <TableHead className="px-6 py-3"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No studies found
                    </TableCell>
                  </TableRow>
                ) : (
                  cases.map((caseItem) => {
                    const egfr = caseItem.images[0]?.ai_analysis_result?.egfr || "-"
                    const ckdRisk = caseItem.images[0]?.ai_analysis_result?.ckdRisk
                    const ckdStage = caseItem.images[0]?.ai_analysis_result?.ckdStage || "-"

                    const resultColor =
                      ckdRisk === "HIGH"
                        ? "bg-red-50 text-red-700"
                        : ckdRisk === "LOW"
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"

                    return (
                      <TableRow key={caseItem.id}>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-semibold text-xs text-foreground">
                              {caseItem.patient?.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-sm text-foreground">{caseItem.patient?.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {caseItem.patient?.age} yrs • {caseItem.patient?.sex === "M" ? "Male" : "Female"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 font-mono text-sm text-foreground">
                          {caseItem.case_number}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${resultColor}`}>
                            {ckdStage}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <p className="font-semibold text-sm text-foreground">{egfr}</p>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <Button
                            onClick={() => handleCaseClick(caseItem.case_number)}
                            variant="ghost"
                            size="sm"
                            className="h-8 border text-green-600 hover:text-green-700 hover:bg-green-50 gap-1"      
                          >
                            View →
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>

            
          <div className="p-4 border-t">
            <Pagination
            currentPage={pagination.page}
            pageSize={pagination.limit}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setCurrentPage(1)
            }}
            totalEntries={pagination.total}
            totalPages={pagination.totalPages}
            />
          </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isCreateDialogOpen && (
        <CreateStudySheet open={isCreateDialogOpen} onOpenChange={(value) => setIsCreateDialogOpen(value)} />
      )}

      <CaseDetailDrawer caseNumber={selectedCaseNumber} open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </div>
  )
}
