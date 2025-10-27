"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { mockCases } from "@/lib/mock-data"

export default function CasesPage() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""

  const filteredCases = useMemo(() => {
    if (!searchQuery) return mockCases
    const query = searchQuery.toLowerCase()
    return mockCases.filter(
      (caseItem) =>
        caseItem.caseNumber.toLowerCase().includes(query) ||
        caseItem.patientName.toLowerCase().includes(query) ||
        caseItem.mrn.toLowerCase().includes(query) ||
        caseItem.patientId.toLowerCase().includes(query),
    )
  }, [searchQuery])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
      case "severe":
        return "bg-red-600 text-white"
      case "moderate":
        return "bg-[#009A6B] text-white"
      case "mild":
        return "bg-yellow-400 text-black"
      default:
        return "bg-green-500 text-black"
    }
  }

  const getSeverityLabel = (severity: string) =>
    severity.charAt(0).toUpperCase() + severity.slice(1)

  const handleAddCase = () => {
    window.location.href = "/cases/new"
  }

  return (
    <div className="p-2 rounded-lg border border-white/10 overflow-hidden bg-black text-white flex flex-col h-full">

      <div className="flex-1 overflow-auto rounded border border-white/20">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/10">
              <TableHead className="font-semibold text-white">Case #</TableHead>
              <TableHead className="font-semibold text-white">Patient Name</TableHead>
              <TableHead className="font-semibold text-white">Patient ID</TableHead>
              <TableHead className="font-semibold text-white">Age/Sex</TableHead>
              <TableHead className="font-semibold text-white">Severity</TableHead>
              <TableHead className="font-semibold text-white">Scanned On</TableHead>
              <TableHead className="font-semibold text-right text-white">Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCases.map((caseItem) => (
              <TableRow key={caseItem.id} className="hover:bg-white/10 transition-colors">
                <TableCell className="font-medium text-white">{caseItem.caseNumber}</TableCell>
                <TableCell className="text-white">
                  <Link
                    href={`/patients/${caseItem.patientId}`}
                    className="hover:text-[#009A6B] transition-colors"
                  >
                    {caseItem.patientName}
                  </Link>
                </TableCell>
                <TableCell className="text-white">{caseItem.patientId}</TableCell>
                <TableCell className="text-white">
                  {caseItem.age} / {caseItem.gender}
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn("capitalize font-medium px-3 py-1 text-sm", getSeverityColor(caseItem.severity))}
                  >
                    {getSeverityLabel(caseItem.severity)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-300">
                  {new Date(caseItem.studyDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/analysis/${caseItem.id}`}>
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 px-3 text-xs bg-[#009A6B] hover:bg-[#008059] text-white"
                    >
                      Detail
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="border-t border-white/10 px-6 py-4 flex items-center justify-between bg-black/80">
        <div className="text-sm text-gray-400">
          Showing <span className="font-medium text-white">{filteredCases.length}</span> cases
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled
            className="text-white/50 hover:bg-white/10 border border-white/20"
          >
            First
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled
            className="text-white/50 hover:bg-white/10 border border-white/20"
          >
            Prev
          </Button>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((page) => (
              <Button
                key={page}
                size="sm"
                className={cn(
                  "w-8 h-8 p-0 text-xs",
                  page === 1
                    ? "bg-[#009A6B] hover:bg-[#008059] text-white"
                    : "bg-black border border-white/20 text-white/70 hover:bg-white/10",
                )}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:bg-white/10 border border-white/20"
          >
            Next
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:bg-white/10 border border-white/20"
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  )
}