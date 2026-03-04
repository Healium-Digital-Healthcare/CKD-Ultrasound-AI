"use client"

import { useState } from "react"
import { Plus, RefreshCw, Calendar, AlertCircle, CheckCircle, FileText, TrendingUp, TrendingDown, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetCasesQuery } from "@/store/services/cases"
import { useGetTodayStatsQuery } from "@/store/services/organization"
import { CaseDetailDrawer } from "@/components/cases/case-detail-drawer"
import { CreateStudySheet } from "@/components/cases/create-study-sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatsSkeleton } from "@/components/organization/stats-skeleton"
import { StudiesSkeleton } from "@/components/organization/studies-skeleton"
import { Pagination } from "@/components/pagination"
import { StatCard } from "@/components/dashboard/stat-card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { cn } from "@/lib/utils"

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

      {/* Stats section - Colored cards row */}
      {(isStatsLoading || isStatsFetching) ? (
        <StatsSkeleton />
      ) : (
        <div className="px-6 pb-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            <StatCard label="0-6 Months" value={todayStats?.total || 0} bgColor="green" className="min-w-max flex-1" />
            <StatCard label="6-9 Months" value={todayStats?.normal || 0} bgColor="blue" className="min-w-max flex-1" />
            <StatCard label="9-12 Months" value={todayStats?.ckdDetected || 0} bgColor="green" className="min-w-max flex-1" />
            <StatCard label="12-18 Months" value={42} bgColor="teal" className="min-w-max flex-1" />
            <StatCard label="18-36 Months" value={76} bgColor="green" className="min-w-max flex-1" />
          </div>
        </div>
      )}

      {/* Studies section */}
      {(isLoading || isFetching) ? (
        <StudiesSkeleton />
      ) : (
        <div className="flex-1 overflow-auto px-6 pb-6">
          <div className="bg-card rounded-lg border border-border overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-muted/20 to-transparent">
              <h2 className="text-sm font-semibold text-foreground">Today&apos;s Studies</h2>
              <div className="text-xs text-muted-foreground">
                Showing {Math.min(pageSize, cases.length)} of {pagination.total}
              </div>
            </div>
            {cases?.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <EmptyState
                  icon={Inbox}
                  title="No studies today"
                  description="Check back later or create a new study to get started."
                />
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-muted/40 to-transparent hover:bg-transparent">
                      <TableHead className="px-6 py-3 font-semibold text-muted-foreground">Patient</TableHead>
                      <TableHead className="px-6 py-3 font-semibold text-muted-foreground">Study ID</TableHead>
                      <TableHead className="px-6 py-3 font-semibold text-muted-foreground">CKD Stage</TableHead>
                      <TableHead className="px-6 py-3 font-semibold text-muted-foreground">eGFR</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cases.map((caseItem) => {
                      const egfr = caseItem.images[0]?.ai_analysis_result?.egfr || "-"
                      const ckdRisk = caseItem.images[0]?.ai_analysis_result?.ckdRisk
                      const ckdStage = caseItem.images[0]?.ai_analysis_result?.ckdStage || "-"

                      const stageDotColor = ckdStage && ckdStage.includes("1") ? "bg-success" : ckdStage && ckdStage.includes("3a") ? "bg-warning" : ckdStage && ckdStage.includes("2") ? "bg-warning" : "bg-destructive"

                      return (
                        <TableRow key={caseItem.id} className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => handleCaseClick(caseItem.case_number)}>
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 bg-muted">
                                <AvatarFallback className="font-bold text-sm text-foreground">
                                  {caseItem.patient?.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm text-foreground">{caseItem.patient?.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {caseItem.patient?.age} yrs • {caseItem.patient?.sex === "M" ? "Male" : "Female"}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 font-mono text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <FileText className="h-4 w-4 text-destructive" />
                              <span className="font-mono text-sm text-foreground">{caseItem.case_number}</span>
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
                    })}
                  </TableBody>
                </Table>
                <div className="p-4 border-t border-border">
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
              </>
            )}
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
