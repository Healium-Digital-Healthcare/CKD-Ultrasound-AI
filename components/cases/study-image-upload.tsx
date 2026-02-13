"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, CheckCircle, AlertCircle, FileText, Trash2, Activity, XCircle } from "lucide-react"
import { useLazyGetSignedUrlQuery } from "@/store/services/cases"
import { useSubmitKidneyDetectionMutation } from "@/store/services/ai"
import type { Patient } from "@/types/patient"
import { useUser } from "@/lib/contexts/UserContext"
import { DicomPreview } from "./dicom-preview"

export interface UploadedFile {
  id: string
  name: string
  file: File
  path?: string
  size?: number
  fileType?: string
  displaySignedUrl?: string
  status: "pending" | "uploading" | "processing" | "completed" | "error" | "rejected"
  progress: number
  error?: string
  errorTitle?: string
  errorIcon?: string
  // AI Detection fields
  jobId?: string
  detectionProgress?: number
  detectionStage?: string
  detectionMessage?: string
  kidneyDetected?: boolean
  qualityClass?: string
  qualityLabel?: string
  qualityConfidence?: number
  detectionConfidence?: number
  croppedUrl?: string
  boundingBoxUrl?: string
  rejectionReason?: string
}

interface StudyImageUploadProps {
  onComplete: (
    leftImage: { path: string; size: number; fileType: string; signedUrl: string } | null,
    rightImage: { path: string; size: number; fileType: string; signedUrl: string } | null,
  ) => void
  onStateChange?: (state: { leftKidney: UploadedFile | null; rightKidney: UploadedFile | null }) => void
  initialFiles?: { leftKidney: UploadedFile | null; rightKidney: UploadedFile | null }
  initialImages?: {
    leftKidney: { path: string; displaySignedUrl?: string; size: number; fileType: string } | null
    rightKidney: { path: string; displaySignedUrl?: string; size: number; fileType: string } | null
  }
  isDisabled?: boolean
  patient: Patient | null
  onUploadingStateChange?: (isUploading: boolean) => void
  apiBaseUrl?: string // e.g., "http://localhost:8000"
}

export function StudyImageUpload({
  onComplete,
  onStateChange,
  initialFiles,
  initialImages,
  isDisabled,
  patient,
  onUploadingStateChange,
  apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
}: StudyImageUploadProps) {
  const [leftFileError, setLeftFileError] = useState<string | null>(null)
  const [rightFileError, setRightFileError] = useState<string | null>(null)

  const [leftKidneyFile, setLeftKidneyFile] = useState<UploadedFile | null>(() => {
    if (initialFiles?.leftKidney) {
      return initialFiles.leftKidney
    }
    if (initialImages?.leftKidney?.path) {
      return {
        id: `restored-left`,
        name: initialImages.leftKidney.path.split("/").pop() || `left-kidney-image`,
        file: new File([], ""),
        path: initialImages.leftKidney.path,
        size: initialImages.leftKidney.size,
        fileType: initialImages.leftKidney.fileType,
        displaySignedUrl: initialImages.leftKidney.displaySignedUrl,
        status: "completed" as const,
        progress: 100,
        kidneyDetected: true,
      }
    }
    return null
  })

  const [rightKidneyFile, setRightKidneyFile] = useState<UploadedFile | null>(() => {
    if (initialFiles?.rightKidney) {
      return initialFiles.rightKidney
    }
    if (initialImages?.rightKidney?.path) {
      return {
        id: `restored-right`,
        name: initialImages.rightKidney.path.split("/").pop() || `right-kidney-image`,
        file: new File([], ""),
        path: initialImages.rightKidney.path,
        size: initialImages.rightKidney.size,
        fileType: initialImages.rightKidney.fileType,
        displaySignedUrl: initialImages.rightKidney.displaySignedUrl,
        status: "completed" as const,
        progress: 100,
        kidneyDetected: true,
      }
    }
    return null
  })

  const { user } = useUser()

  const [getLazySignedUrl] = useLazyGetSignedUrlQuery()
  const [submitKidneyDetection] = useSubmitKidneyDetectionMutation()

  const leftInputRef = useRef<HTMLInputElement>(null)
  const rightInputRef = useRef<HTMLInputElement>(null)
  const eventSourcesRef = useRef<Map<string, EventSource>>(new Map())
  const sseErrorHandledRef = useRef<Map<string, boolean>>(new Map())

  const isValidFile = (file: File) => {
    const allowedMimeTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/dicom",
      "application/dicom+json",
      "application/octet-stream",
    ]

    const allowedExtensions = ["png", "jpg", "jpeg", "dcm"]
    const extension = file.name.split(".").pop()?.toLowerCase()

    return (
      allowedMimeTypes.includes(file.type) ||
      (extension && allowedExtensions.includes(extension))
    )
  }

  // Error message mappings (defined outside to be reused)
  const errorMessages = {
    NO_KIDNEY_DETECTED: {
      title: "No Kidney Detected",
      message: "We couldn't detect a kidney in this image. Please ensure the ultrasound shows a clear view of the kidney.",
      icon: "search"
    },
    PROCESSING_ERROR: {
      title: "Processing Failed",
      message: "An error occurred while analyzing the image. Please try uploading again.",
      icon: "alert"
    },
    UNKNOWN_ERROR: {
      title: "Upload Failed",
      message: "Something went wrong. Please try again or contact support if the issue persists.",
      icon: "alert"
    }
  }

  const startDetectionStream = (jobId: string, kidney: "left" | "right") => {
    const setFile = kidney === "left" ? setLeftKidneyFile : setRightKidneyFile
    
    // Close existing connection if any
    const existingConnection = eventSourcesRef.current.get(kidney)
    if (existingConnection) {
      existingConnection.close()
    }

    const eventSource = new EventSource(
      `${apiBaseUrl}/api/v1/kidney-detection/jobs/${jobId}/stream`
    )

    eventSourcesRef.current.set(kidney, eventSource)
    sseErrorHandledRef.current.set(kidney, false)

    eventSource.addEventListener("progress", (event) => {
      const data = JSON.parse(event.data)
      setFile((prev) =>
        prev
          ? {
              ...prev,
              detectionProgress: data.progress,
              detectionStage: data.stage,
              detectionMessage: data.message,
            }
          : null
      )
    })

    eventSource.addEventListener("complete", (event) => {
      const data = JSON.parse(event.data)

      if (data.accepted && data.detected) {
        // Accepted and kidney detected
        setFile((prev) =>
          prev
            ? {
                ...prev,
                status: "completed",
                progress: 100,
                detectionProgress: 100,
                kidneyDetected: data.detected,
                qualityClass: data.quality?.class,
                qualityLabel: data.quality?.label,
                qualityConfidence: data.quality?.confidence,
                detectionConfidence: data.detection_confidence,
                croppedUrl: data.cropped_url,
                boundingBoxUrl: data.bounding_box_url,
              }
            : null
        )
      } else {
        const rejectionMessage =
          data.rejection_reason || `Low quality image (${data.quality?.label || "Unknown"})`
        const errorInfo = data.detected
          ? {
              title: "Image Not Accepted",
              message: rejectionMessage,
              icon: "alert",
            }
          : errorMessages.NO_KIDNEY_DETECTED

        setFile((prev) =>
          prev
            ? {
                ...prev,
                status: "error",
                progress: 100,
                detectionProgress: 100,
                kidneyDetected: data.detected,
                qualityClass: data.quality?.class,
                qualityLabel: data.quality?.label,
                qualityConfidence: data.quality?.confidence,
                rejectionReason: rejectionMessage,
                errorTitle: errorInfo.title,
                error: errorInfo.message,
                errorIcon: errorInfo.icon,
                // Show original image even when rejected
                displaySignedUrl: data.original_file_url || prev.displaySignedUrl,
              }
            : null
        )
      }

      eventSource.close()
      eventSourcesRef.current.delete(kidney)
    })

    eventSource.addEventListener("error", (event: MessageEvent) => {
      const data = event.data ? JSON.parse(event.data) : {}
      
      const errorInfo = (data.error_code && errorMessages[data.error_code as keyof typeof errorMessages]) || errorMessages.UNKNOWN_ERROR
      
      sseErrorHandledRef.current.set(kidney, true)
      setFile((prev) =>
        prev
          ? {
              ...prev,
              status: "error",
              error: data.error_message || errorInfo.message,
              errorTitle: errorInfo.title,
              errorIcon: errorInfo.icon,
              // Keep original file URL for preview
              displaySignedUrl: data.original_file_url || prev.displaySignedUrl,
            }
          : null
      )

      eventSource.close()
      eventSourcesRef.current.delete(kidney)
    })

    eventSource.onerror = () => {
      if (sseErrorHandledRef.current.get(kidney)) {
        eventSource.close()
        eventSourcesRef.current.delete(kidney)
        return
      }
      setFile((prev) =>
        prev
          ? {
              ...prev,
              status: "error",
              error: "Connection to AI service was interrupted. Please check your internet connection and try again.",
              errorTitle: "Connection Failed",
              errorIcon: "wifi"
            }
          : null
      )

      eventSource.close()
      eventSourcesRef.current.delete(kidney)
    }
  }

  const submitForDetection = async (file: File, kidney: "left" | "right") => {
    const setFile = kidney === "left" ? setLeftKidneyFile : setRightKidneyFile

    try {
      if (!user?.id) {
        setFile((prev) =>
          prev
            ? {
                ...prev,
                status: "error",
                errorTitle: "Authentication Required",
                errorIcon: "alert",
                error: "You must be logged in to submit images for AI detection.",
              }
            : null
        )
        return
      }

      setFile((prev) => (prev ? { ...prev, status: "processing", detectionProgress: 0 } : null))

      const formData = new FormData()
      formData.append("file", file)
      formData.append("kidney_type", kidney)
      formData.append("user_id", user.id)

      const data = await submitKidneyDetection(formData).unwrap()

      setFile((prev) =>
        prev
          ? {
              ...prev,
              path: data.file_path || prev.path,
              jobId: data.job_id,
            }
          : null
      )

      // Start listening to SSE stream
      startDetectionStream(data.job_id, kidney)
    } catch (error) {
      setFile((prev) =>
        prev
          ? {
              ...prev,
              status: "error",
              error: "Failed to start AI detection",
            }
          : null
      )
    }
  }

  const fetchDisplaySignedUrl = async (path: string, kidney: "left" | "right") => {
    try {
      console.log("Fetching display signed URL for path:", path)
      const result = await getLazySignedUrl(path)
    
      if (result.data?.signedUrl) {
        console.log("Received display signed URL:", result.data.signedUrl)
        const setFile = kidney === "left" ? setLeftKidneyFile : setRightKidneyFile
        setFile((prev) => (prev ? { ...prev, displaySignedUrl: result?.data?.signedUrl } : null))
      }
    } catch (error) {
      console.error("Failed to fetch display signed URL:", error)
    }
  }

  const handleFileSelect = (files: FileList | null, kidney: "left" | "right") => {
    if (!files || files.length === 0) return

    const file = files[0]

    if (!isValidFile(file)) {
      const errorMsg = "Only PNG, JPG, JPEG images or DICOM (.dcm) files are allowed."
      if (kidney === "left") {
        setLeftFileError(errorMsg)
      } else {
        setRightFileError(errorMsg)
      }
      return
    }

    const setFile = kidney === "left" ? setLeftKidneyFile : setRightKidneyFile

    const newFile: UploadedFile = {
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      file,
      size: file.size,
      fileType: file.type,
      status: "pending",
      progress: 0,
    }

    setFile(newFile)
    submitForDetection(file, kidney)
  }

  const removeFile = (kidney: "left" | "right") => {
    // Close SSE connection if active
    const connection = eventSourcesRef.current.get(kidney)
    if (connection) {
      connection.close()
      eventSourcesRef.current.delete(kidney)
    }

    const setFile = kidney === "left" ? setLeftKidneyFile : setRightKidneyFile
    setFile(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 10) / 10 + " " + sizes[i]
  }

  const getFileExtension = (name: string) => {
    const ext = name.split(".").pop()?.toUpperCase() || "FILE"
    return ext
  }

  const truncatePath = (path: string, maxLength = 40) => {
    if (path.length <= maxLength) return path
    const start = path.substring(0, maxLength / 3)
    const end = path.substring(path.length - maxLength / 2)
    return `${start}...${end}`
  }

  const callCompleteIfReady = () => {
    const leftImage =
      leftKidneyFile?.path &&
      leftKidneyFile.size !== undefined &&
      leftKidneyFile.displaySignedUrl &&
      leftKidneyFile.status === "completed"
        ? {
            path: leftKidneyFile.path,
            size: leftKidneyFile.size,
            fileType: leftKidneyFile.fileType ?? "",
            signedUrl: leftKidneyFile.displaySignedUrl,
          }
        : null

    const rightImage =
      rightKidneyFile?.path &&
      rightKidneyFile.size !== undefined &&
      rightKidneyFile.displaySignedUrl &&
      rightKidneyFile.status === "completed"
        ? {
            path: rightKidneyFile.path,
            size: rightKidneyFile.size,
            fileType: rightKidneyFile.fileType ?? "",
            signedUrl: rightKidneyFile.displaySignedUrl,
          }
        : null

    onComplete(leftImage, rightImage)
  }

  const getFileType = (path: string) => {
    if (!path) return
    const cleanPath = path.split("?")[0]
    return cleanPath.toLowerCase().endsWith(".dcm") ? "dicom" : "image"
  }

  const getQualityBadgeColor = (qualityClass?: string) => {
    switch (qualityClass) {
      case "high":
        return "bg-green-100 text-green-700 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  useEffect(() => {
    callCompleteIfReady()
  }, [leftKidneyFile, rightKidneyFile, onComplete])

  useEffect(() => {
    onStateChange?.({ leftKidney: leftKidneyFile, rightKidney: rightKidneyFile })
  }, [leftKidneyFile, rightKidneyFile, onStateChange])

  useEffect(() => {
    const isUploading =
      leftKidneyFile?.status === "uploading" ||
      rightKidneyFile?.status === "uploading" ||
      leftKidneyFile?.status === "processing" ||
      rightKidneyFile?.status === "processing"
    onUploadingStateChange?.(isUploading)
  }, [leftKidneyFile?.status, rightKidneyFile?.status, onUploadingStateChange])

  useEffect(() => {
    if (
      leftKidneyFile?.path &&
      leftKidneyFile?.status === "completed" &&
      !leftKidneyFile?.displaySignedUrl
    ) {
      fetchDisplaySignedUrl(leftKidneyFile.path, "left")
    }
  }, [leftKidneyFile?.path, leftKidneyFile?.status, leftKidneyFile?.displaySignedUrl])

  useEffect(() => {
    if (
      rightKidneyFile?.path &&
      rightKidneyFile?.status === "completed" &&
      !rightKidneyFile?.displaySignedUrl
    ) {
      fetchDisplaySignedUrl(rightKidneyFile.path, "right")
    }
  }, [rightKidneyFile?.path, rightKidneyFile?.status, rightKidneyFile?.displaySignedUrl])

  // Cleanup SSE connections on unmount
  useEffect(() => {
    return () => {
      eventSourcesRef.current.forEach((connection) => connection.close())
      eventSourcesRef.current.clear()
    }
  }, [])

  if (!patient) return null

  const isRightKidneyUploading =
    rightKidneyFile?.status === "uploading" || rightKidneyFile?.status === "processing"
  const isLeftKidneyUploading =
    leftKidneyFile?.status === "uploading" || leftKidneyFile?.status === "processing"

  const totalUploaded =
    (leftKidneyFile?.status === "completed" ? 1 : 0) +
    (rightKidneyFile?.status === "completed" ? 1 : 0)

  const renderUploadedFile = (file: UploadedFile, kidney: "left" | "right") => {
    const signedUrl = file.displaySignedUrl
    console.log("Rendering file:", { name: file.name, status: file.status,path: file.path, signedUrl })
    const fileType = getFileType(signedUrl!)
    const isProcessing = file.status === "uploading" || file.status === "processing"
    const isRejected = file.status === "rejected"
    const isError = file.status === "error"

    return (
      <div
        key={file.id}
        className={`border-2 border-solid rounded-xl p-4 ${
          isRejected
            ? "border-red-500 bg-red-50"
            : isError
            ? "border-red-500 bg-red-50"
            : file.status === "completed"
            ? "border-green-500 bg-green-50"
            : "border-blue-500 bg-blue-50"
        }`}
      >
        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
          {isError ? (
            <div className="flex flex-col items-center justify-center text-center text-white px-4">
              <XCircle className="w-12 h-12 mx-auto mb-2 text-red-400" />
              <p className="text-sm font-medium">{file.errorTitle || "Processing Failed"}</p>
              <p className="text-xs opacity-80 mt-1">{file.error || "An error occurred while processing the image"}</p>
            </div>
          ) : signedUrl && fileType && !isRejected ? (
            fileType === "dicom" ? (
              <DicomPreview signedUrl={signedUrl || ""} className="w-full h-full" />
            ) : (
              <img
                src={signedUrl || "/placeholder.svg"}
                alt={`${kidney} kidney`}
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <div className="text-center text-white">
              {isProcessing ? (
                <>
                  <Activity className="w-12 h-12 mx-auto mb-2 animate-spin" />
                  <p className="text-sm opacity-75">{file.detectionMessage || "Processing..."}</p>
                </>
              ) : isRejected ? (
                <>
                  <XCircle className="w-12 h-12 mx-auto mb-2 text-red-500" />
                  <p className="text-sm opacity-75">Rejected</p>
                </>
              ) : isError ? (
                <>
                  <AlertCircle className="w-12 h-12 mx-auto mb-2 text-red-500" />
                  <p className="text-sm opacity-75">Error</p>
                </>
              ) : (
                <>
                  <svg
                    className="w-12 h-12 mx-auto mb-2 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm opacity-75">Loading...</p>
                </>
              )}
            </div>
          )}
          <div className="absolute top-2 right-2">
            {file.status === "completed" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-emerald-500 text-white">
                <CheckCircle className="w-3 h-3" />
                Validated
              </span>
            )}
            {isRejected && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-red-500 text-white">
                <XCircle className="w-3 h-3" />
                Rejected
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isRejected ? "bg-red-100" : isError ? "bg-red-100" : "bg-green-100"
              }`}
            >
              <FileText
                className="w-5 h-5"
                style={{
                  color: isRejected || isError ? "red" : "green",
                }}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{truncatePath(file.name)}</p>
              <p className="text-xs text-gray-500">
                {file.size ? formatFileSize(file.size) : "0 B"} • {getFileExtension(file.name)}
              </p>
            </div>
          </div>
          <button
            onClick={() => removeFile(kidney)}
            disabled={isProcessing}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* AI Detection Progress */}
        {isProcessing && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 font-medium">
                {file.status === "uploading" ? "Uploading" : "AI Analysis"}
              </span>
              <span className="text-gray-500">
                {file.status === "uploading"
                  ? `${file.progress}%`
                  : `${file.detectionProgress || 0}%`}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full transition-all bg-blue-500"
                style={{
                  width: `${
                    file.status === "uploading" ? file.progress : file.detectionProgress || 0
                  }%`,
                }}
              />
            </div>
            {file.detectionStage && (
              <p className="text-xs text-gray-600">
                <span className="font-medium capitalize">{file.detectionStage}:</span>{" "}
                {file.detectionMessage}
              </p>
            )}
          </div>
        )}

        {/* AI Detection Results */}
        {file.status === "completed" && file.kidneyDetected && (
          <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">AI Detection Results</span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${getQualityBadgeColor(
                  file.qualityClass
                )}`}
              >
                {file.qualityLabel || "Unknown"}
              </span>
            </div>
            <div className="flex items-center gap-8 text-xs">
              <div>
                <span className="text-gray-500">Detection:</span>
                <span className="ml-1 font-medium text-gray-900">
                  {file.detectionConfidence
                    ? `${(file.detectionConfidence * 100).toFixed(1)}%`
                    : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Quality:</span>
                <span className="ml-1 font-medium text-gray-900">
                  {file.qualityConfidence
                    ? `${(file.qualityConfidence * 100).toFixed(1)}%`
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Rejection Message */}
        {isRejected && (
          <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-yellow-800 flex-1">
                <p className="font-medium mb-1">Image Not Suitable</p>
                <p>{file.rejectionReason || "Quality check failed"}</p>
                {file.qualityLabel && (
                  <p className="mt-1">
                    Quality Assessment: <span className="font-medium">{file.qualityLabel}</span>
                    {file.qualityConfidence && (
                      <span className="ml-1 text-yellow-600">
                        ({(file.qualityConfidence * 100).toFixed(1)}% confidence)
                      </span>
                    )}
                  </p>
                )}
                <div className="mt-2 pt-2 border-t border-yellow-200">
                  <p className="font-medium mb-1">💡 Please try again with:</p>
                  <ul className="space-y-0.5 ml-4 list-disc">
                    <li>A clearer ultrasound image</li>
                    <li>Better lighting or contrast</li>
                    <li>A different view or angle of the kidney</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {isError && (
          <div className="mt-3 p-3 bg-red-100 rounded-lg border border-red-200">
            <div className="flex items-start gap-2">
              {file.errorIcon === "search" ? (
                <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              ) : file.errorIcon === "wifi" ? (
                <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              )}
              <div className="text-xs text-red-800 flex-1">
                <p className="font-medium mb-1">{file.errorTitle || "Processing Failed"}</p>
                <p>{file.error || "An error occurred while processing the image"}</p>
                <div className="mt-2 pt-2 border-t border-red-200">
                  <p className="font-medium mb-1">💡 What you can do:</p>
                  <ul className="space-y-0.5 ml-4 list-disc">
                    {file.errorIcon === "search" ? (
                      <>
                        <li>Ensure the image clearly shows a kidney</li>
                        <li>Use a different ultrasound view or angle</li>
                        <li>Make sure the image is not too dark or blurry</li>
                      </>
                    ) : file.errorIcon === "wifi" ? (
                      <>
                        <li>Check your internet connection</li>
                        <li>Try uploading the image again</li>
                        <li>Refresh the page if the issue persists</li>
                      </>
                    ) : (
                      <>
                        <li>Try uploading the image again</li>
                        <li>Ensure the file is a valid image or DICOM file</li>
                        <li>Contact support if the problem continues</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="px-6 py-6">
        <div className="mb-8 p-4 bg-white border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-emerald-700">
                  {patient.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{patient.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {patient.patient_id && (
                    <>
                      <span className="text-sm text-gray-500 font-mono">#{patient.patient_id}</span>
                      <span className="text-gray-300">•</span>
                    </>
                  )}
                  <span className="text-sm text-gray-500">{patient.age} yrs</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-500">
                    {patient.sex === "M" ? "Male" : "Female"}
                  </span>
                </div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5" />
              Selected Patient
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Upload Ultrasound Images</h2>
          <p className="text-gray-500 mt-1">
            Upload one image for each kidney - AI will detect kidneys and verify quality
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Left Kidney */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Left Kidney</h3>
                  <p className="text-xs text-gray-500">AI-powered quality check</p>
                </div>
              </div>
              {isLeftKidneyUploading && (
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-xs font-medium text-blue-600">Processing...</span>
                </div>
              )}
            </div>

            {leftKidneyFile ? (
              renderUploadedFile(leftKidneyFile, "left")
            ) : (
              <button
                type="button"
                disabled={isDisabled || isLeftKidneyUploading}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer transition-all hover:border-emerald-400 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => leftInputRef.current?.click()}
              >
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="font-medium text-gray-700 mb-1">Click to upload</p>
                  <p className="text-sm text-gray-500">or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-3">Maximum file size: 50MB</p>
                </div>
              </button>
            )}
            <input
              ref={leftInputRef}
              type="file"
              disabled={isDisabled || isLeftKidneyUploading}
              accept="image/png,image/jpeg,image/jpg,.dcm"
              onChange={(e) => handleFileSelect(e.target.files, "left")}
              className="hidden"
            />
          </div>

          {/* Right Kidney */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Right Kidney</h3>
                  <p className="text-xs text-gray-500">AI-powered quality check</p>
                </div>
              </div>
              {isRightKidneyUploading && (
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-xs font-medium text-purple-600">Processing...</span>
                </div>
              )}
            </div>

            {rightKidneyFile ? (
              renderUploadedFile(rightKidneyFile, "right")
            ) : (
              <button
                type="button"
                disabled={isDisabled || isRightKidneyUploading}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer transition-all hover:border-emerald-400 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => rightInputRef.current?.click()}
              >
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="font-medium text-gray-700 mb-1">Click to upload</p>
                  <p className="text-sm text-gray-500">or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-3">Maximum file size: 50MB</p>
                </div>
              </button>
            )}
            <input
              ref={rightInputRef}
              type="file"
              disabled={isDisabled || isRightKidneyUploading}
              accept="image/png,image/jpeg,image/jpg,.dcm"
              onChange={(e) => handleFileSelect(e.target.files, "right")}
              className="hidden"
            />
          </div>
        </div>

        {totalUploaded === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-2">AI-Powered Quality Assurance</h4>
                <ul className="text-sm text-blue-800 space-y-1.5">
                  <li>• AI automatically detects kidneys in uploaded images</li>
                  <li>• Quality assessment ensures only high-quality images are used</li>
                  <li>• Real-time progress updates during processing</li>
                  <li>• Low-quality images will be rejected automatically</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}