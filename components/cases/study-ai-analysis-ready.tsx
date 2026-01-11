"use client"

import { Button } from "@/components/ui/button"
import { Zap, Beaker, ClipboardList } from "lucide-react"
import { useGetCaseFileSizeQuery } from "@/store/services/cases"

interface StudyAIAnalysisReadyProps {
  caseId: string
  patientName: string
  patientId: string
  patientAge: number
  patientSex: string
  filesCount: number
  onStart: () => void
  isLoading: boolean
}

export function StudyAIAnalysisReady({
  caseId,
  patientName,
  patientId,
  patientAge,
  patientSex,
  filesCount,
  onStart,
  isLoading,
}: StudyAIAnalysisReadyProps) {
  const { data: fileSizeData, isLoading: isSizeFetching } = useGetCaseFileSizeQuery(caseId, {
    skip: !caseId,
  })

  const fileSize = fileSizeData?.formattedSize ?? "Calculating..."

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="px-6 py-6 flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {/* Selected Patient & Study Info */}
          <div className="mb-6 p-4 bg-white border border-gray-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-emerald-700">{patientName.charAt(0).toUpperCase()}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{patientName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 font-mono">#{patientId}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{patientAge} yrs</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{patientSex === "M" ? "Male" : "Female"}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Images Uploaded</p>
                  <p className="text-sm font-medium text-gray-900">
                    {filesCount} files ({fileSize})
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis Card - Ready State */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
            {/* AI Icon with Pulse - Compact */}
            <div className="relative inline-flex items-center justify-center mb-4">
              <div className="absolute w-20 h-20 rounded-full bg-emerald-100 animate-pulse"></div>
              <div className="relative w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-900 mb-1">AI Analysis Ready</h2>
            <p className="text-sm text-gray-500 mb-6">
              Start the AI analysis to process uploaded kidney images and generate comprehensive diagnostic findings
            </p>

            {/* Analysis Features - Compact */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-2">
                  <Beaker className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-xs font-medium text-gray-700">CKD Stage</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-xs font-medium text-gray-700">eGFR Prediction</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center mx-auto mb-2">
                  <ClipboardList className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-xs font-medium text-gray-700">Structural Findings</p>
              </div>
            </div>

            {/* Start Button */}
            <Button
              onClick={onStart}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-8 py-2.5 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-200 text-sm"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Start AI Analysis
                </>
              )}
            </Button>

            <p className="text-xs text-gray-400 mt-3">Typical analysis time: 30-60 seconds</p>
          </div>
        </div>
      </div>
    </div>
  )
}
