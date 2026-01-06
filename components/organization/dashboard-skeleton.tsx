"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header Skeleton */}
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex-1">
          <Skeleton className="bg-background border h-8 w-48 rounded mb-2" />
          <Skeleton className="bg-background border h-4 w-80 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="bg-background border h-9 w-32 rounded" />
          <Skeleton className="bg-background border h-9 w-24 rounded" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto px-4 py-4">
        {/* Stats Cards Skeleton - 4 columns */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Skeleton className="h-3 w-24 rounded mb-3" />
                  <Skeleton className="h-8 w-16 rounded" />
                </div>
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Skeleton - Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Bar Chart Skeleton */}
          <div className="bg-card border border-border rounded-lg">
            <div className="p-6 pb-0">
              <Skeleton className="h-5 w-40 rounded mb-2" />
            </div>
            <Skeleton className="h-80 w-full rounded-b-lg" style={{ margin: 0 }} />
          </div>

          {/* Pie Chart Skeleton */}
          <div className="bg-card border border-border rounded-lg">
            <div className="p-6 pb-0">
              <Skeleton className="h-5 w-48 rounded mb-2" />
            </div>
            <div className="p-6 flex flex-col items-center justify-center">
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
