"use client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface PaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalEntries: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalEntries,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endEntry = Math.min(currentPage * pageSize, totalEntries)

  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-between text-sm">
      {/* Left side: Results count */}
      <div className="text-muted-foreground">
        Showing <span className="font-medium text-foreground">{startEntry}</span> to{" "}
        <span className="font-medium text-foreground">{endEntry}</span> of{" "}
        <span className="font-medium text-foreground">{totalEntries}</span> results
      </div>

      {/* Right side: Pagination controls */}
      <div className="flex items-center gap-4">
        {/* Rows per page dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          {/* Previous button */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={totalPages === 0 || currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page number buttons */}
          {pageNumbers.map((page) => (
            <Button
              key={page}
              onClick={() => onPageChange(page)}
              className={
                page === currentPage
                  ? "h-8 w-8 rounded-md bg-green-600 text-white hover:bg-green-700"
                  : "h-8 w-8 rounded-md border text-black border-input bg-background hover:bg-muted"
              }
            >
              {page}
            </Button>
          ))}

          {/* Next button */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
