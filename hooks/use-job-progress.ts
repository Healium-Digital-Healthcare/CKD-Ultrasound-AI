'use client';

import { useEffect, useState, useCallback } from "react"

export interface JobProgress {
  id: string
  case_id: string
  status: "queued" | "preprocessing" | "inferring" | "completed" | "failed"
  progress: number
  error_message?: string
  started_at?: string
  completed_at?: string
}

interface UseJobProgressOptions {
  jobId: string | null
  enabled?: boolean
  pollingInterval?: number
}

export function useJobProgress({
  jobId,
  enabled = true,
  pollingInterval = 2000,
}: UseJobProgressOptions) {
  const [jobProgress, setJobProgress] = useState<JobProgress | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProgress = useCallback(async () => {
    if (!jobId || !enabled) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/jobs/${jobId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch job progress")
      }

      const data = await response.json()
      setJobProgress(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }, [jobId, enabled])

  useEffect(() => {
    if (!jobId || !enabled) return

    // Initial fetch
    fetchProgress()

    // Poll for updates
    const interval = setInterval(() => {
      fetchProgress()
    }, pollingInterval)

    return () => clearInterval(interval)
  }, [jobId, enabled, pollingInterval, fetchProgress])

  return {
    jobProgress,
    isLoading,
    error,
  }
}
