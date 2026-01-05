"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface PaginationProps {
  /** The current active page (1-indexed) */
  currentPage: number
  /** Total number of pages */
  totalPages: number
  /** Number of items per page */
  pageSize: number
  /** Total number of items across all pages */
  totalEntries: number
  /** Callback when the page changes */
  onPageChange: (page: number) => void
  /** Callback when the page size changes */
  onPageSizeChange?: (size: number) => void
  /** Options for the rows per page selector */
  pageSizeOptions?: number[]
  /** Additional class names for the container */
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalEntries,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50, 100],
  className,
}: PaginationProps) {
  const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endEntry = Math.min(currentPage * pageSize, totalEntries)

  // Material UI-style pagination logic for page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const siblingCount = 1
    const boundaryCount = 1

    const range = (start: number, end: number) => {
      const length = end - start + 1
      return Array.from({ length }, (_, i) => start + i)
    }

    if (totalPages <= (boundaryCount + siblingCount) * 2 + 3) {
      return range(1, totalPages)
    }

    const startPages = range(1, boundaryCount)
    const endPages = range(totalPages - boundaryCount + 1, totalPages)

    const siblingsStart = Math.max(
      Math.min(currentPage - siblingCount, totalPages - boundaryCount - siblingCount * 2 - 1),
      boundaryCount + 2
    )

    const siblingsEnd = Math.min(
      Math.max(currentPage + siblingCount, boundaryCount + siblingCount * 2 + 2),
      totalPages - boundaryCount - 1
    )

    pages.push(...startPages)

    if (siblingsStart > boundaryCount + 2) {
      pages.push("...")
    } else if (boundaryCount + 1 < totalPages - boundaryCount) {
      pages.push(boundaryCount + 1)
    }

    pages.push(...range(siblingsStart, siblingsEnd))

    if (siblingsEnd < totalPages - boundaryCount - 1) {
      pages.push("...")
    } else if (totalPages - boundaryCount > boundaryCount) {
      pages.push(totalPages - boundaryCount)
    }

    pages.push(...endPages)

    return pages
  }

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-end gap-4 sm:gap-8 py-3 px-2 text-sm text-gray-600", className)}>
      {/* Rows per page selector */}
      {onPageSizeChange && (
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap">Rows per page:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(parseInt(value))}
          >
            <SelectTrigger className="h-8 w-[70px] border-none bg-transparent hover:bg-gray-100 focus:ring-0 focus:ring-offset-0 transition-colors">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Current range and total */}
      <div className="whitespace-nowrap">
        {startEntry}-{endEntry} of {totalEntries}
      </div>

      {/* Navigation controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full hover:bg-gray-100 disabled:opacity-30"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center">
          {getPageNumbers().map((page, index) => (
            <Button
              key={index}
              variant={page === currentPage ? "secondary" : "ghost"}
              size="icon"
              className={cn(
                "h-10 w-10 rounded-full text-sm font-medium transition-colors",
                page === currentPage ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-100",
                page === "..." && "cursor-default hover:bg-transparent"
              )}
              onClick={() => typeof page === "number" && onPageChange(page)}
              disabled={page === "..."}
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full hover:bg-gray-100 disabled:opacity-30"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
