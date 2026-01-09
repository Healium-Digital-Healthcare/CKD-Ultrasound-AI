"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, X, CheckCircle, AlertCircle, FileText, Trash, Trash2 } from "lucide-react"
import { useGetUploadUrlMutation, useLazyGetSignedUrlQuery } from "@/store/services/cases"
import type { Patient } from "@/types/patient"

interface UploadedFile {
  id: string
  name: string
  file: File
  path?: string
  size?: number
  fileType?: string
  displaySignedUrl?: string
  status: "pending" | "uploading" | "completed" | "error"
  progress: number
  error?: string
}

interface StudyImageUploadProps {
  onComplete: (
    leftImage: { path: string; size: number; fileType: string; signedUrl: string } | null,
    rightImage: { path: string; size: number; fileType: string; signedUrl: string } | null,
  ) => void
  initialImages?: {
    leftKidney: { path: string; displaySignedUrl?: string; size: number; fileType: string } | null
    rightKidney: { path: string; displaySignedUrl?: string; size: number; fileType: string } | null
  }
  isDisabled?: boolean
  patient: Patient | null
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
      }
    }
    return null
  })

  const [rightKidneyFile, setRightKidneyFile] = useState<UploadedFile | null>(() => {
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
      }
    }
    return null
  })

  const [getUploadUrl] = useGetUploadUrlMutation()
  const [getLazySignedUrl] = useLazyGetSignedUrlQuery()

  const leftInputRef = useRef<HTMLInputElement>(null)
  const rightInputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File, kidney: "left" | "right") => {
    const setFile = kidney === "left" ? setLeftKidneyFile : setRightKidneyFile
    console.log('file file', file)
    try {
      setFile((prev) => (prev ? { ...prev, status: "uploading" } : null))

      const urlData = await getUploadUrl({
        files: [{ name: file.name.replace(/[^a-zA-Z0-9.-_]/g, "_") }],
      }).unwrap()

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
          setFile((prev) =>
            prev
              ? {
                  ...prev,
                  status: "completed",
                  progress: 100,
                  path: signedFile.path,
                  fileType: file.type,
                  size: file.size,
                }
              : null,
          )
        } else {
          setFile((prev) => (prev ? { ...prev, status: "error", error: "Upload failed" } : null))
        }
      })

      xhr.addEventListener("error", () => {
        setFile((prev) => (prev ? { ...prev, status: "error", error: "Network error" } : null))
      })

      xhr.open("PUT", signedFile.signedUrl)
      xhr.setRequestHeader("Content-Type", file.type)
      xhr.send(file)
    } catch (error) {
      setFile((prev) => (prev ? { ...prev, status: "error", error: "Upload failed" } : null))
    }
  }

  const fetchDisplaySignedUrl = async (path: string, kidney: "left" | "right") => {
    try {
      const result = await getLazySignedUrl(path)
      if (result.data?.signedUrl) {
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
    uploadFile(file, kidney)
  }

  const removeFile = (kidney: "left" | "right") => {
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
  
  console.log('left file', leftKidneyFile)

  const callCompleteIfReady = () => {
    const leftImage =
      leftKidneyFile?.path &&
      leftKidneyFile.size !== undefined &&
      // leftKidneyFile.fileType &&
      leftKidneyFile.displaySignedUrl
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
      // rightKidneyFile.fileType &&
      rightKidneyFile.displaySignedUrl
        ? {
            path: rightKidneyFile.path,
            size: rightKidneyFile.size,
            fileType: rightKidneyFile.fileType ?? "",
            signedUrl: rightKidneyFile.displaySignedUrl,
          }
        : null

    onComplete(leftImage, rightImage)
  }

  useEffect(() => {
    callCompleteIfReady()
  }, [leftKidneyFile, rightKidneyFile, onComplete])

  useEffect(() => {
    const isUploading = leftKidneyFile?.status === "uploading" || rightKidneyFile?.status === "uploading"
    onUploadingStateChange?.(isUploading)
  }, [leftKidneyFile?.status, rightKidneyFile?.status, onUploadingStateChange])

  useEffect(() => {
    if (leftKidneyFile?.path && leftKidneyFile?.status === "completed" && !leftKidneyFile?.displaySignedUrl) {
      fetchDisplaySignedUrl(leftKidneyFile.path, "left")
    }
  }, [leftKidneyFile?.path, leftKidneyFile?.status, leftKidneyFile?.displaySignedUrl])

  useEffect(() => {
    if (rightKidneyFile?.path && rightKidneyFile?.status === "completed" && !rightKidneyFile?.displaySignedUrl) {
      fetchDisplaySignedUrl(rightKidneyFile.path, "right")
    }
  }, [rightKidneyFile?.path, rightKidneyFile?.status, rightKidneyFile?.displaySignedUrl])

  if (!patient) return null

  const isUploading = leftKidneyFile?.status === "uploading" || rightKidneyFile?.status === "uploading"
  const totalUploaded =
    (leftKidneyFile?.status === "completed" ? 1 : 0) + (rightKidneyFile?.status === "completed" ? 1 : 0)

  const renderUploadedFile = (file: UploadedFile, kidney: "left" | "right") => {
    const signedUrl = file.displaySignedUrl

    return (
      <div
        key={file.id}
        className="border-2 border-solid border-green-500 bg-green-50 rounded-xl p-4"
      >
        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
          {signedUrl ? (
            <img
              src={signedUrl || "/placeholder.svg"}
              alt={`${kidney} kidney`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center text-white">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm opacity-75">Loading...</p>
            </div>
          )}
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
              <p className="text-sm font-medium text-gray-900">{truncatePath(file.name)}</p>
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
            <Trash2 className="w-5 h-5" />
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
  }

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
              {leftKidneyFile?.status === "uploading" && (
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-xs font-medium text-blue-600">Uploading...</span>
                </div>
              )}
            </div>

            {leftKidneyFile ? (
              renderUploadedFile(leftKidneyFile, "left")
            ) : (
              <button
                type="button"
                disabled={isDisabled || isUploading}
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
              disabled={isDisabled || isUploading}
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
              {rightKidneyFile?.status === "uploading" && (
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-xs font-medium text-purple-600">Uploading...</span>
                </div>
              )}
            </div>

            {rightKidneyFile ? (
              renderUploadedFile(rightKidneyFile, "right")
            ) : (
              <button
                type="button"
                disabled={isDisabled || isUploading}
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
              disabled={isDisabled || isUploading}
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
                  <li>• Ensure images are clear and high-quality</li>
                  <li>• Upload one image per kidney</li>
                  <li>• Supported formats: PNG, JPEG, DICOM</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
