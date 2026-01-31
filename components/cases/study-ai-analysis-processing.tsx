"use client"

import type { JobProgress } from "@/hooks/use-job-progress"

interface AnalysisStep {
  id: string
  title: string
  description: string
  status: "complete" | "processing" | "pending"
}

interface StudyAIAnalysisProcessingProps {
  caseId: string
  patientName: string
  patientId: string
  patientAge: number
  patientSex: string
  filesCount: number
  steps: AnalysisStep[]
  jobProgress?: JobProgress | null
}

export function StudyAIAnalysisProcessing({
  caseId,
  patientName,
  patientId,
  patientAge,
  patientSex,
  filesCount,
  steps,
  jobProgress,
}: StudyAIAnalysisProcessingProps) {
  const fileSize = "2.4 MB"
  const progress = jobProgress?.progress ?? 0
  const status = jobProgress?.status ?? "queued"

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Patient Info Card */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-emerald-700">
                      {patientName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {patientName}
                    </h3>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        ID: <span className="font-mono text-foreground">#{patientId}</span>
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{patientAge} years old</span>
                        <span>•</span>
                        <span>{patientSex}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-3 bg-emerald-50 px-4 py-3 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Images Uploaded</p>
                      <p className="text-base font-semibold text-foreground">
                        {filesCount}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{fileSize}</p>
                    </div>
                    <svg className="w-6 h-6 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Processing Status Card */}
            <div className="bg-card border border-border rounded-2xl p-6">
              {/* Processing Animation */}
              <div className="text-center mb-6">
                <div className="relative inline-flex items-center justify-center mb-5">
                  <div
                    className="absolute w-28 h-28 rounded-full bg-emerald-100"
                    style={{ animation: "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}
                  />
                  <div
                    className="absolute w-24 h-24 rounded-full bg-emerald-50"
                    style={{ animation: "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.5s" }}
                  />
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-200">
                    <svg
                      className="w-12 h-12 text-white animate-spin"
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

                <div className="mb-5">
                  <h2 className="text-xl font-bold text-foreground mb-1">
                    Analyzing Images
                  </h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    Our AI is processing your kidney ultrasound images
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {status === "preprocessing" && "Preprocessing images for analysis..."}
                    {status === "inferring" && "Running AI inference..."}
                    {status === "queued" && "Queued for processing..."}
                    {!["preprocessing", "inferring", "queued"].includes(status) && `Status: ${status}`}
                  </p>
                </div>

                {/* Progress Section */}
                <div className="space-y-3">
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Processing may take up to 60 seconds
                    </span>
                    <span className="text-lg font-bold text-foreground">{progress}%</span>
                  </div>
                </div>
              </div>

              {/* Analysis Steps */}
              <div className="border-t border-border pt-5">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
                  Analysis Pipeline
                </h3>
                <div className="space-y-2">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-start gap-4 pb-4 ${
                        index !== steps.length - 1 ? "border-b border-border" : ""
                      } ${step.status === "pending" ? "opacity-60" : ""}`}
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            step.status === "complete"
                              ? "bg-emerald-100"
                              : step.status === "processing"
                                ? "bg-emerald-500"
                                : "bg-muted"
                          }`}
                        >
                          {step.status === "complete" && (
                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {step.status === "processing" && (
                            <svg
                              className="w-5 h-5 text-white animate-spin"
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
                          {step.status === "pending" && (
                            <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <p className="font-semibold text-sm text-foreground">{step.title}</p>
                          <span
                            className={`text-xs font-medium flex-shrink-0 ${
                              step.status === "complete"
                                ? "text-emerald-600"
                                : step.status === "processing"
                                  ? "text-amber-600 animate-pulse"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {step.status === "complete" && "Complete"}
                            {step.status === "processing" && "Processing..."}
                            {step.status === "pending" && "Pending"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
      `}</style>
    </div>
  )
}
