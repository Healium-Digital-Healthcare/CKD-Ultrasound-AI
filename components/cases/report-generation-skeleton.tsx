"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function ReportGenerationSkeleton() {
  return (
    <div className="w-full h-full flex overflow-hidden bg-background">
      {/* Left: Image List Skeleton */}
      <div className="w-48 border-r border-border overflow-y-auto bg-background">
        <div className="p-3 border-b border-border bg-gradient-to-r from-muted/20 to-transparent">
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="p-2 space-y-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-2.5 p-2">
              <Skeleton className="w-12 h-12 rounded" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-2.5 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Report Panel Skeleton */}
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="max-w-4xl mx-auto p-8 space-y-8">
          {/* Header */}
          <div className="space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>

          {/* Findings Section */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* AI Assessment Section */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>

          {/* Impression Section */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}
