import React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  label: string
  value: number | string
  bgColor: "green" | "blue" | "teal" | "cyan"
  className?: string
  icon?: LucideIcon
}

const colorMap = {
  green: "bg-green-500",
  blue: "bg-blue-400",
  teal: "bg-teal-500",
  cyan: "bg-cyan-400",
}

export function StatCard({ label, value, bgColor, className, icon: Icon }: StatCardProps) {
  return (
    <div className={cn(
      "rounded-lg p-6 text-white relative overflow-hidden shadow-md",
      colorMap[bgColor],
      className
    )}>
      {/* Decorative wavy shape on right */}
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

      {/* Content */}
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white/90">{label}</p>
          <p className="text-4xl font-bold text-white mt-2">{value}</p>
        </div>
        {Icon && (
          <div className="flex-shrink-0 ml-4 opacity-80">
            <Icon className="h-8 w-8 text-white" />
          </div>
        )}
      </div>
    </div>
  )
}
