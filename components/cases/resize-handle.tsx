"use client"

import { GripVertical } from 'lucide-react'

interface ResizeHandleProps {
  onMouseDown: () => void
}

export function ResizeHandle({ onMouseDown }: ResizeHandleProps) {
  return (
    <div
      className="w-1 bg-gray-200 hover:bg-blue-400 cursor-w-resize flex items-center justify-center group transition-colors flex-shrink-0"
      onMouseDown={onMouseDown}
    >
      <GripVertical className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
    </div>
  )
}
