export function CaseDetailSkeleton() {
  return (
    <div className="flex-1 h-full min-h-0 flex overflow-hidden bg-gray-50">
      {/* Image List Skeleton */}
      <div className="w-64 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-video bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Image Viewer Skeleton */}
      <div className="flex-1 flex items-center justify-center relative">
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="h-9 w-9 bg-gray-50 rounded-lg animate-pulse" />
          <div className="h-9 w-9 bg-gray-50 rounded-lg animate-pulse" />
          <div className="h-9 w-20 bg-gray-50 rounded-lg animate-pulse" />
          <div className="h-9 w-9 bg-gray-50 rounded-lg animate-pulse" />
          <div className="h-9 w-9 bg-gray-50 rounded-lg animate-pulse" />
        </div>
        <div className="w-96 h-96 bg-gray-50 rounded-lg animate-pulse" />
      </div>

      {/* Resize Handle Skeleton */}
      <div className="w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize flex-shrink-0" />

      {/* AI Analysis Panel Skeleton */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* eGFR Section */}
          <div className="space-y-3">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Findings Section */}
          <div className="space-y-3">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-4/5 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Classifications Section */}
          <div className="space-y-3">
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
