'use client'

import { Skeleton } from "@/components/ui/skeleton"

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-card rounded-lg border p-6 space-y-2">
          <Skeleton className="h-8 w-16" /> {/* For the number */}
          <Skeleton className="h-4 w-24" /> {/* For the label */}
        </div>
      ))}
    </div>
  )
}