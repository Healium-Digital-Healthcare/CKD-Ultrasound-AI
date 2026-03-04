"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function PatientDetailSkeleton() {
  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header Skeleton */}
      <div className="bg-card border-b border-border flex-shrink-0">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-36" />
          </div>

          <div className="flex items-center gap-6 mb-6">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-9 w-64 mb-3" />
              <div className="flex items-center gap-6">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
            <Skeleton className="h-9 w-28" />
          </div>

          <div className="bg-muted/20 rounded-lg p-4 border border-border mb-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-3 w-20 mb-2" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="border-b border-border">
            <nav className="flex gap-8 -mb-px">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-24 mb-4" />
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-6 shadow-premium">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-premium">
          <Skeleton className="h-7 w-48 mb-6" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    </div>
  )
}
