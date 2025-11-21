"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2 } from 'lucide-react'
import Link from "next/link"

interface CaseDetailHeaderProps {
  caseNumber: string
  patientName: string
}

export function CaseDetailHeader({ caseNumber, patientName }: CaseDetailHeaderProps) {
  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-4">
        <Link href="/cases">
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">Case</span>
          <span className="text-sm font-semibold text-gray-900">{caseNumber}</span>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-600">{patientName}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
