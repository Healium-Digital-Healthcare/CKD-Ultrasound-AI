"use client"

import { ImageListSkeleton } from "./image-list-skeleton"
import { ImageViewerSkeleton } from "./image-viewer-skeleton"

export function CaseDetailSkeleton() {
  return (
    <div className="flex-1 min-h-0 flex overflow-hidden bg-gray-50">
      <ImageListSkeleton />
      <ImageViewerSkeleton />
    </div>
  )
}
