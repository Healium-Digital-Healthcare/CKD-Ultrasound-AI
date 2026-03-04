"use client"

import { StatCardSkeleton } from "@/components/dashboard/stat-card-skeleton"

const colors: Array<"green" | "blue" | "teal" | "cyan"> = ["green", "blue", "teal"]

export function StatsSkeleton() {
  return (
    <div className="px-4 pt-3 pb-2">
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <StatCardSkeleton key={i} bgColor={colors[i]} />
        ))}
      </div>
    </div>
  )
}
