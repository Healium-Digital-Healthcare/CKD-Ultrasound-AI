'use client'

import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardSkeleton() {
  return (
    <div className="p-8 space-y-8 bg-white">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-10 w-56 rounded-lg" />
        <Skeleton className="h-5 w-full max-w-2xl rounded-lg" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-32 rounded-lg" />
                <Skeleton className="h-10 w-24 rounded-lg" />
              </div>
              <Skeleton className="h-14 w-14 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-20 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton - Cases & Patients + Severity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-border rounded-xl p-6 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <Skeleton className="h-4 w-64 rounded-lg" />
          </div>
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>

        <div className="border border-border rounded-xl p-6 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-56 rounded-lg" />
            <Skeleton className="h-4 w-72 rounded-lg" />
          </div>
          <Skeleton className="h-80 w-full rounded-lg" />
          {/* Legend placeholder */}
          <div className="flex items-center justify-center gap-6 pt-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-24 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CKD Distribution Skeleton */}
      <div className="border border-border rounded-xl p-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-56 rounded-lg" />
          <Skeleton className="h-4 w-80 rounded-lg" />
        </div>
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    </div>
  )
}