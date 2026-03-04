'use client'

import { StatCardSkeleton } from "@/components/dashboard/stat-card-skeleton"

const colors: Array<"green" | "blue" | "teal" | "cyan"> = ["green", "blue", "teal", "cyan"]

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <StatCardSkeleton key={i} bgColor={colors[i]} />
      ))}
    </div>
  )
}
