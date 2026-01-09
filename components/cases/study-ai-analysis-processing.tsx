"use client"

import { ChevronLeft } from "lucide-react"

interface AnalysisStep {
  id: string
  title: string
  description: string
  status: "complete" | "processing" | "pending"
}

interface StudyAIAnalysisProcessingProps {
  patientName: string
  patientId: string
  patientAge: number
  patientSex: string
  filesCount: number
  fileSize: string
  steps: AnalysisStep[]
}

export function StudyAIAnalysisProcessing({
  patientName,
  patientId,
  patientAge,
  patientSex,
  filesCount,
  fileSize,
  steps,
}: StudyAIAnalysisProcessingProps) {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Selected Patient & Study Info */}
          <div className="mb-6 p-4 bg-white border border-gray-200 rounded-xl opacity-75">
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
                    <span className="text-xs text-gray-500">{patientSex}</span>
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

          {/* AI Analysis Card - Processing State */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            {/* Processing Animation - Compact */}
            <div className="text-center mb-6">
              <div className="relative inline-flex items-center justify-center mb-4">
                <div
                  className="absolute w-24 h-24 rounded-full bg-emerald-100 animate-pulse"
                  style={{ animation: "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}
                ></div>
                <div
                  className="absolute w-20 h-20 rounded-full bg-emerald-50 animate-pulse"
                  style={{ animation: "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.5s" }}
                ></div>
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
                  <svg
                    className="w-10 h-10 text-white animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-lg font-semibold text-gray-900 mb-1">Analyzing Images...</h2>
              <p className="text-sm text-gray-500 mb-4">Our AI is processing your kidney ultrasound images</p>

              {/* Progress Bar - Compact */}
              <div className="max-w-md mx-auto mb-3">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full w-3/4"
                    style={{ animation: "progress 8s ease-out forwards" }}
                  ></div>
                </div>
              </div>
              <p className="text-xs text-gray-400">Please wait, this may take up to 60 seconds</p>
            </div>

            {/* Analysis Steps - Reduced spacing */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Analysis Progress</h3>
              <div className="space-y-3">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 ${step.status === "pending" ? "opacity-50" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.status === "complete"
                          ? "bg-emerald-100"
                          : step.status === "processing"
                            ? "bg-emerald-500"
                            : "bg-gray-100"
                      }`}
                    >
                      {step.status === "complete" && (
                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {step.status === "processing" && (
                        <svg
                          className="w-4 h-4 text-white animate-spin"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      )}
                      {step.status === "pending" && <span className="w-2 h-2 rounded-full bg-gray-300"></span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{step.title}</p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                    <span
                      className={`text-xs font-medium flex-shrink-0 ${
                        step.status === "complete"
                          ? "text-emerald-600"
                          : step.status === "processing"
                            ? "text-amber-600 animate-pulse"
                            : "text-gray-400"
                      }`}
                    >
                      {step.status === "complete" && "Complete"}
                      {step.status === "processing" && "Processing..."}
                      {step.status === "pending" && "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.9); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 0.4; }
          100% { transform: scale(0.9); opacity: 0.8; }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 75%; }
        }
      `}</style>
    </div>
  )
}
