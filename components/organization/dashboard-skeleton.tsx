"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { StatCardSkeleton } from "@/components/dashboard/stat-card-skeleton"

const colors: Array<"green" | "blue" | "teal" | "cyan"> = ["green", "blue", "teal", "cyan"]

export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header Skeleton */}
      <div className="px-4 py-4 flex items-center justify-between border-b">
        <div className="flex-1">
          <Skeleton className="h-8 w-48 rounded mb-2" />
          <Skeleton className="h-4 w-80 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-32 rounded" />
          <Skeleton className="h-9 w-24 rounded" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto px-4 py-4">
        {/* Stats Cards Skeleton - 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <StatCardSkeleton key={i} bgColor={colors[i]} />
          ))}
        </div>

        {/* Charts Skeleton - Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Bar Chart Skeleton */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="pb-4">
              <Skeleton className="h-5 w-40 rounded" />
            </div>
            <Skeleton className="h-80 w-full rounded" />
          </div>

          {/* Pie Chart Skeleton */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="pb-4">
              <Skeleton className="h-5 w-48 rounded" />
            </div>
            <div className="flex flex-col items-center justify-center py-6">
              <Skeleton className="h-64 w-64 rounded-full" />
              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-3 w-20 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
