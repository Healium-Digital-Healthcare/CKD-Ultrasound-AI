"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function ImageListSkeleton() {
  return (
    <div className="w-48 border-r border-border overflow-y-auto">
      <div className="p-3 border-b border-border sticky top-0 bg-background z-10">
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="p-2 space-y-1">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="w-full p-2 rounded border border-transparent flex items-center gap-2.5">
            <Skeleton className="w-12 h-12 rounded flex-shrink-0" />
            <div className="flex-1 min-w-0 space-y-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
