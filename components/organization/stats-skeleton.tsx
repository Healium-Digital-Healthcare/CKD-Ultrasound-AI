"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function StatsSkeleton() {
  return (
    <div className="px-4 pt-3 pb-2">
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Skeleton className="h-3 w-32 rounded mb-3" />
                <Skeleton className="h-8 w-12 rounded" />
              </div>
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
