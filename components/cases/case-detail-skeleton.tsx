"use client"

import { AIAnalysisSkeleton } from "./ai-analysis-skeleton";
import { ImageListSkeleton } from "./image-list-skeleton";
import { ImageViewerSkeleton } from "./image-viewer-skeleton";

export function CaseDetailSkeleton() {
  return (
    <div className="flex-1 h-full min-h-0 flex overflow-hidden bg-gray-50">
      {/* Image List Skeleton */}
      <ImageListSkeleton/>

      {/* Image Viewer Skeleton */}
      <ImageViewerSkeleton/>
      
      {/* Resize Handle Skeleton */}
      <div className="w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize flex-shrink-0" />

      {/* AI Analysis Panel Skeleton */}
      <AIAnalysisSkeleton/>
    </div>
  )
}
