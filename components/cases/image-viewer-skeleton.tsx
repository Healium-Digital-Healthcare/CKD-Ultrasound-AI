import { Skeleton } from "@/components/ui/skeleton"

export function ImageViewerSkeleton() {
  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Toolbar */}
      <div className="bg-background border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            {/* Image Info */}
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>

            <div className="h-6 w-px bg-border" />

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-7 w-7 rounded" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-7 w-7 rounded" />
            </div>

            <div className="h-6 w-px bg-border" />

            {/* Tool Buttons */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 6 }).map((_, idx) => (
                <Skeleton key={idx} className="h-7 w-7 rounded" />
              ))}
            </div>
          </div>
          <Skeleton className="h-7 w-7 rounded" />
        </div>
      </div>

      {/* Image Display Area */}
      <div className="flex-1 flex items-center justify-center bg-muted/30 p-6">
        <Skeleton className="w-[500px] h-[500px]" />
      </div>
    </div>
  )
}