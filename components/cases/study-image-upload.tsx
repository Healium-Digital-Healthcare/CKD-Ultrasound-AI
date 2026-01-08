"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, X, CheckCircle, AlertCircle, FileText, Delete, Trash } from "lucide-react"
import { Patient } from "@/types/patient"

interface UploadedFile {
  id: string
  name: string
  file: File
  path?: string
  size?: number
  status: "pending" | "uploading" | "completed" | "error"
  progress: number
  error?: string
}

interface StudyImageUploadProps {
  onComplete: (leftImage: string | null, rightImage: string | null) => void
  initialImages?: { leftKidney: string | null; rightKidney: string | null }
  isDisabled?: boolean
  patient: Patient
  onUploadingStateChange?: (isUploading: boolean) => void
}

export function StudyImageUpload({
  onComplete,
  initialImages,
  isDisabled,
  patient,
  onUploadingStateChange,
}: StudyImageUploadProps) {
  
  const [leftKidneyFile, setLeftKidneyFile] = useState<UploadedFile | null>(() => {
    if (initialImages?.leftKidney) {
      return {
        id: `restored-left`,
        name: initialImages.leftKidney.split("/").pop() || `left-kidney-image`,
        file: new File([], ""),
        path: initialImages.leftKidney,
        status: "completed" as const,
        progress: 100,
      }
    }
    return null
  })

  const [rightKidneyFile, setRightKidneyFile] = useState<UploadedFile | null>(() => {
    if (initialImages?.rightKidney) {
      return {
        id: `restored-right`,
        name: initialImages.rightKidney.split("/").pop() || `right-kidney-image`,
        file: new File([], ""),
        path: initialImages.rightKidney,
        status: "completed" as const,
        progress: 100,
      }
    }
    return null
  })

  const leftInputRef = useRef<HTMLInputElement>(null)
  const rightInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const leftPath = leftKidneyFile?.status === "completed" && leftKidneyFile.path ? leftKidneyFile.path : null
    const rightPath = rightKidneyFile?.status === "completed" && rightKidneyFile.path ? rightKidneyFile.path : null
    onComplete(leftPath, rightPath)
  }, [leftKidneyFile, rightKidneyFile, onComplete])

  useEffect(() => {
    const isAnyUploading = leftKidneyFile?.status === "uploading" || rightKidneyFile?.status === "uploading"
    onUploadingStateChange?.(isAnyUploading)
  }, [leftKidneyFile, rightKidneyFile, onUploadingStateChange])

  const uploadFile = async (file: File, fileId: string, kidney: "left" | "right") => {
    const setFile = kidney === "left" ? setLeftKidneyFile : setRightKidneyFile

    try {
      const urlResponse = await fetch("/api/images/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: [{ name: file.name.replace(/[^a-zA-Z0-9.-_]/g, "_") }],
        }),
      })

      if (!urlResponse.ok) throw new Error("Failed to get upload URL")

      const urlData = await urlResponse.json()
      const signedFile = urlData.files[0]

      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100
          setFile((prev) => (prev ? { ...prev, progress: Math.round(progress) } : null))
        }
      })

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setFile((prev) => (prev ? { ...prev, status: "completed", progress: 100, path: signedFile.path } : null))
        } else {
          setFile((prev) => (prev ? { ...prev, status: "error", error: "Upload failed" } : null))
        }
      })

      xhr.addEventListener("error", () => {
        setFile((prev) => (prev ? { ...prev, status: "error", error: "Network error" } : null))
      })

      setFile((prev) => (prev ? { ...prev, status: "uploading" } : null))

      xhr.open("PUT", signedFile.signedUrl)
      xhr.setRequestHeader("Content-Type", file.type)
      xhr.send(file)
    } catch (error) {
      setFile((prev) => (prev ? { ...prev, status: "error", error: "Upload failed" } : null))
    }
  }

  const handleFileSelect = (files: FileList | null, kidney: "left" | "right") => {
    if (!files || files.length === 0) return

    const file = files[0]
    const fileId = `${Date.now()}-${Math.random()}`
    const setFile = kidney === "left" ? setLeftKidneyFile : setRightKidneyFile

    const newFile: UploadedFile = {
      id: fileId,
      name: file.name,
      file,
      size: file.size,
      status: "pending",
      progress: 0,
    }

    setFile(newFile)
    uploadFile(file, fileId, kidney)
  }

  const removeFile = (kidney: "left" | "right") => {
    if (kidney === "left") {
      setLeftKidneyFile(null)
    } else {
      setRightKidneyFile(null)
    }
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

  const renderUploadedFile = (file: UploadedFile, kidney: "left" | "right") => (
    <div
      key={file.id}
      className="border-2 border-solid border-green-500 bg-green-50 rounded-xl p-4"
    >
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
        <div className="text-center text-white">
          <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm opacity-75">Ultrasound Image</p>
        </div>
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-emerald-500 text-white">
            <CheckCircle className="w-3 h-3" />
            Uploaded
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-100"
            
          >
            <FileText
              className="w-5 h-5"
              style={{
                color: "green",
              }}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{file.name}</p>
            <p className="text-xs text-gray-500">
              {file.size ? formatFileSize(file.size) : "0 B"} • {getFileExtension(file.name)}
            </p>
          </div>
        </div>
        <button
          onClick={() => removeFile(kidney)}
          disabled={file.status === "uploading"}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
        >
          <Trash className="w-5 h-5" />
        </button>
      </div>

      {file.status === "uploading" && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all"
              style={{
                width: `${file.progress}%`,
                backgroundColor: kidney === "left" ? "#0ea5e9" : "#a855f7",
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{file.progress}%</p>
        </div>
      )}
    </div>
  )

  const totalUploaded =
    (leftKidneyFile?.status === "completed" ? 1 : 0) + (rightKidneyFile?.status === "completed" ? 1 : 0)

  return (
    <div className="w-full">
      <div className="px-6 py-6">
        <div className="mb-8 p-4 bg-white border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-emerald-700">{patient.name.charAt(0).toUpperCase()}</span>
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
                  <span className="text-sm text-gray-500">{patient.sex === "M" ? "Male" : "Female"}</span>
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
          <p className="text-gray-500 mt-1">Upload one image for each kidney to continue with AI analysis</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <p className="text-xs text-gray-500">PNG, JPEG, or DICOM files</p>
              </div>
            </div>

            {leftKidneyFile ? (
              renderUploadedFile(leftKidneyFile, "left")
            ) : (
              <button
                type="button"
                disabled={isDisabled}
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
              disabled={isDisabled}
              accept="image/png,image/jpeg,image/jpg,.dcm"
              onChange={(e) => handleFileSelect(e.target.files, "left")}
              className="hidden"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <p className="text-xs text-gray-500">PNG, JPEG, or DICOM files</p>
              </div>
            </div>

            {rightKidneyFile ? (
              renderUploadedFile(rightKidneyFile, "right")
            ) : (
              <button
                type="button"
                disabled={isDisabled}
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
              disabled={isDisabled}
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
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Image Upload Guidelines</h4>
                <ul className="text-sm text-blue-800 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    Ensure images are clear and properly oriented
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    DICOM files are recommended for best analysis results
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    One image per kidney is required to proceed
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    Each image should be less than 50MB
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {totalUploaded === 2 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-emerald-900 mb-1">Images Ready for Analysis</h4>
                <p className="text-sm text-emerald-700">
                  Both kidney images have been uploaded successfully. You can now proceed to AI analysis.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}