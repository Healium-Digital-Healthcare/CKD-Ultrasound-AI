import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface StatCardSkeletonProps {
  bgColor?: "green" | "blue" | "teal" | "cyan"
  className?: string
}

const colorMap = {
  green: "bg-green-500",
  blue: "bg-blue-400",
  teal: "bg-teal-500",
  cyan: "bg-cyan-400",
}

export function StatCardSkeleton({ bgColor = "green", className }: StatCardSkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-lg p-6 relative overflow-hidden shadow-md",
        colorMap[bgColor],
        className
      )}
    >
      {/* Decorative wavy shape on right - same as actual card */}
      <div className="absolute right-0 top-0 h-full w-24 opacity-30">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <path
            d="M 0 50 Q 25 30 50 50 T 100 50 L 100 0 L 0 0 Z"
            fill="white"
            opacity="0.3"
          />
          <path
            d="M 0 60 Q 25 40 50 60 T 100 60 L 100 100 L 0 100 Z"
            fill="white"
            opacity="0.2"
          />
        </svg>
      </div>

      {/* Content - mirrors the actual card layout */}
      <div className="relative z-10">
        <Skeleton className="h-4 w-24 mb-3 bg-white/30" />
        <Skeleton className="h-10 w-16 bg-white/30" />
      </div>
    </div>
  )
}
