"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function AIAnalysisSkeleton() {
  return (
    <div className="w-[380px] border-l border-border overflow-y-auto bg-background">
      <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-gradient-to-r from-muted/20 to-transparent z-10">
        <div>
          <Skeleton className="h-[14px] w-28 mb-1" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-8 w-16 rounded-md" />
      </div>

      <div className="p-4 space-y-5">
        <div className="space-y-1.5">
          <Skeleton className="h-[10px] w-24" />
          <div className="rounded-lg border-2 border-border/50 p-5">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Skeleton className="h-[10px] w-28" />
          <div className="rounded-lg border border-border p-5">
            <div className="flex items-end gap-2 mb-3">
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-[14px] w-32 mb-1" />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
              <div>
                <Skeleton className="h-[10px] w-16 mb-1" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="text-right flex flex-col items-end">
                <Skeleton className="h-[10px] w-12 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        </div>

        {/* Structural Findings Skeleton */}
        <div className="space-y-1.5">
          <Skeleton className="h-[10px] w-32" />
          <div className="rounded-lg border border-border bg-background divide-y divide-border">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="flex items-center justify-between px-3.5 py-3">
                <div className="flex items-center gap-2.5 flex-1">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-[14px] w-32" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Probable Etiology Skeleton */}
        <div className="space-y-1.5">
          <Skeleton className="h-[10px] w-28" />
          <div className="rounded-lg border border-border bg-background p-3 space-y-3">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-[14px] w-40" />
                  <Skeleton className="h-[14px] w-10" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Notes Skeleton */}
        <div className="space-y-1.5">
          <Skeleton className="h-[10px] w-24" />
          <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
            <Skeleton className="h-[14px] w-full" />
            <Skeleton className="h-[14px] w-5/6" />
            <Skeleton className="h-[14px] w-4/6" />
          </div>
        </div>
      </div>
    </div>
  )
}
