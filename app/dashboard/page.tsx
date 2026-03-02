"use client"

import { useState } from "react"
import { Plus, RefreshCw, Calendar, AlertCircle, CheckCircle, FileText, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetCasesQuery } from "@/store/services/cases"
import { useGetTodayStatsQuery } from "@/store/services/organization"
import { CaseDetailDrawer } from "@/components/cases/case-detail-drawer"
import { CreateStudySheet } from "@/components/cases/create-study-sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatsSkeleton } from "@/components/organization/stats-skeleton"
import { StudiesSkeleton } from "@/components/organization/studies-skeleton"
import { Pagination } from "@/components/pagination"

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedCaseNumber, setSelectedCaseNumber] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  

  const {
    data: casesData,
    refetch,
    isFetching,
    isLoading,
  } = useGetCasesQuery({
    params: { page: currentPage, limit: pageSize, range: "today" },
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
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
      </div>

      {/* Stats section */}
      {(isStatsLoading || isStatsFetching) ? (
        <StatsSkeleton />
      ) : (
        <div className="px-6 pb-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-blue-200 p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-foreground/60 font-medium">Today&apos;s Screenings</div>
                  <div className="text-4xl font-bold text-primary mt-2">{todayStats?.total}</div>
                  <div className="flex items-center gap-1 mt-3 text-success">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">3.5% Up from yesterday</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-blue-200 p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-foreground/60 font-medium">Normal</div>
                  <div className="text-4xl font-bold text-success mt-2">{todayStats?.normal}</div>
                  <div className="flex items-center gap-1 mt-3 text-destructive">
                    <TrendingDown className="h-4 w-4" />
                    <span className="text-sm font-medium">1.5% Down from yesterday</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-blue-200 p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-foreground/60 font-medium">CKD Detected</div>
                  <div className="text-4xl font-bold text-destructive mt-2">{todayStats?.ckdDetected}</div>
                  <div className="flex items-center gap-1 mt-3 text-success">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">2% Up from yesterday</span>
                  </div>
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
        <div className="flex-1 overflow-auto px-6 pb-6">
          <div className="bg-white rounded-lg border border-blue-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-blue-200 flex items-center justify-between bg-white">
              <h2 className="text-sm font-semibold text-foreground">Today&apos;s Studies</h2>
              <div className="text-xs text-gray-600">
                Showing {Math.min(pageSize, cases.length)} of {pagination.total}
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-800 hover:bg-blue-800" style={{ backgroundColor: '#1e5a96' }}>
                  <TableHead className="px-6 py-3 text-white font-semibold">Patient</TableHead>
                  <TableHead className="px-6 py-3 text-white font-semibold">Study ID</TableHead>
                  <TableHead className="px-6 py-3 text-white font-semibold">CKD Stage</TableHead>
                  <TableHead className="px-6 py-3 text-white font-semibold">eGFR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="px-6 py-8 text-center text-gray-600">
                      No studies found
                    </TableCell>
                  </TableRow>
                ) : (
                  cases.map((caseItem) => {
                    const egfr = caseItem.images[0]?.ai_analysis_result?.egfr || "-"
                    const ckdRisk = caseItem.images[0]?.ai_analysis_result?.ckdRisk
                    const ckdStage = caseItem.images[0]?.ai_analysis_result?.ckdStage || "-"

                    const stageDotColor = ckdStage && ckdStage.includes("1") ? "bg-success" : ckdStage && ckdStage.includes("3a") ? "bg-warning" : ckdStage && ckdStage.includes("2") ? "bg-warning" : "bg-destructive"

                    return (
                      <TableRow key={caseItem.id} className="border-b border-cyan-100 hover:bg-cyan-50">
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-xs text-white">
                              {caseItem.patient?.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-sm text-primary">{caseItem.patient?.name}</p>
                              <p className="text-xs text-foreground/60">
                                {caseItem.patient?.age} yrs • {caseItem.patient?.sex === "M" ? "Male" : "Female"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 font-mono text-sm text-foreground">
                          <div className="flex items-center gap-2 text-foreground/70">
                            <FileText className="h-4 w-4 text-destructive" />
                            <span className="font-mono text-sm">{caseItem.case_number}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${stageDotColor}`}></div>
                            <span className="text-sm text-foreground">{ckdStage}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <p className="font-medium text-sm text-foreground">{`${egfr} mL/min/1.73m²`}</p>
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
