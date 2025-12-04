"use client"

import { Calendar } from "lucide-react"

export function PatientTimeline() {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Timeline Coming Soon</h3>
        <p className="text-sm text-gray-600">Patient timeline and activity history will be displayed here.</p>
      </div>
    </div>
  )
}
