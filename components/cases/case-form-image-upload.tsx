"use client"

import React from "react"
import { useState, useRef, useCallback, useMemo, useEffect } from "react"
import { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Upload, X, Loader2, CheckCircle, AlertCircle, Trash2 } from 'lucide-react'
import type { CaseFormValues } from "@/lib/schemas/case"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"

interface UploadedFile {
  id: string
  name: string
  originalName: string
  size: number
  type: string
  url?: string
  path?: string
  progress: number
  status: "pending" | "uploading" | "completed" | "error"
  error?: string
  file?: File
  uploadedBytes?: number
  totalBytes?: number
}

interface CaseFormImageUploadProps {
  form: UseFormReturn<CaseFormValues>;
}

const FileItem = React.memo(
  ({
    file,
    onRemove,
  }: {
    file: UploadedFile
    onRemove: (id: string) => void
  }) => {
    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 Bytes"
      const k = 1024
      const sizes = ["Bytes", "KB", "MB", "GB"]
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    const getStatusColor = (status: string) => {
      switch (status) {
        case "completed":
          return "text-green-700 bg-green-50"
        case "error":
          return "text-red-700 bg-red-50"
        case "uploading":
          return "text-blue-700 bg-blue-50"
        default:
          return "text-gray-700 bg-gray-50"
      }
    }

    const getStatusText = (status: string) => {
      switch (status) {
        case "completed":
          return "Completed"
        case "error":
          return "Failed"
        case "uploading":
          return "Uploading"
        case "pending":
          return "Pending"
        default:
          return "Unknown"
      }
    }

    const handleRemove = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onRemove(file.id)
      },
      [file.id, onRemove],
    )

    const previewUrl = file.url || (file.file ? URL.createObjectURL(file.file) : '')

    return (
      <div className="px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-gray-900 truncate pr-4" title={file.originalName}>
                {file.originalName}
              </p>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  file.status,
                )}`}
              >
                {file.status === "uploading" && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                {file.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                {file.status === "error" && <AlertCircle className="h-3 w-3 mr-1" />}
                {getStatusText(file.status)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>{formatFileSize(file.size)}</span>
              {file.status === "uploading" && (
                <span className="font-medium">{Math.round(file.progress)}%</span>
              )}
            </div>
            {file.status === "uploading" && (
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all duration-300 bg-blue-600"
                  style={{ width: `${Math.max(0, Math.min(100, file.progress))}%` }}
                />
              </div>
            )}
            {file.status === "error" && file.error && (
              <p className="text-xs text-red-600 mt-1">{file.error}</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleRemove}
            disabled={file.status === "uploading"}
            className="flex-shrink-0 p-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Remove file"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  },
)

FileItem.displayName = "FileItem"

export function CaseFormImageUpload({ form }: CaseFormImageUploadProps) {
 const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(() => {
    const existingImages = form.getValues("images") || []
    return existingImages.map((img, index) => ({
      id: `existing-${Date.now()}-${index}`,
      name: img.name,
      originalName: img.name,
      size: img.size,
      type: "image/jpeg",
      path: img.path,
      url: img.path,
      progress: 100,
      status: "completed" as const,
    }))
  })

  const [isDragOver, setIsDragOver] = useState(false)

  const activeUploadsRef = useRef(0)
  const uploadQueueRef = useRef<string[]>([])
  const processingRef = useRef(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const xhrRef = useRef<Map<string, XMLHttpRequest>>(new Map())
  const uploadProgressRef = useRef<Map<string, { bytes: number; progress: number }>>(new Map())
  const publicUrlsRef = useRef<Map<string, string>>(new Map())

  const maxConcurrentUploads = 3
  const maxFiles = 20

  const uploadFile = useCallback(
    async (fileId: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        setUploadedFiles((prev) => {
          const file = prev.find((f) => f.id === fileId)
          if (!file || !file.file) {
            reject(new Error("File not found"))
            return prev
          }

          const previousProgress = uploadProgressRef.current.get(fileId)
          const startingProgress = previousProgress?.progress || 0
          const startingBytes = previousProgress?.bytes || 0

          const xhr = new XMLHttpRequest()
          xhrRef.current.set(fileId, xhr)

          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const currentUploadProgress = (event.loaded / event.total) * 100
              const totalProgress = Math.min(
                100,
                startingProgress + currentUploadProgress * (1 - startingProgress / 100),
              )
              const totalBytes = startingBytes + event.loaded

              uploadProgressRef.current.set(fileId, {
                bytes: totalBytes,
                progress: totalProgress,
              })

              setUploadedFiles((prevFiles) =>
                prevFiles.map((f) =>
                  f.id === fileId
                    ? {
                        ...f,
                        progress: Math.round(totalProgress),
                        uploadedBytes: totalBytes,
                      }
                    : f,
                ),
              )
            }
          })

          xhr.addEventListener("load", () => {
            xhrRef.current.delete(fileId)
            uploadProgressRef.current.delete(fileId)
            
            if (xhr.status >= 200 && xhr.status < 300) {
              const filePath = publicUrlsRef.current.get(fileId)
              
              setUploadedFiles((prevFiles) =>
                prevFiles.map((f) =>
                  f.id === fileId
                    ? {
                        ...f,
                        status: "completed" as const,
                        progress: 100,
                        url: filePath,
                        path: filePath,
                        uploadedBytes: file.size,
                      }
                    : f,
                ),
              )
              resolve()
            } else {
              setUploadedFiles((prevFiles) =>
                prevFiles.map((f) =>
                  f.id === fileId
                    ? {
                        ...f,
                        status: "error" as const,
                        error: `Upload failed with status ${xhr.status}`,
                        progress: 0,
                      }
                    : f,
                ),
              )
              reject(new Error(`Upload failed with status ${xhr.status}`))
            }
          })

          xhr.addEventListener("error", () => {
            xhrRef.current.delete(fileId)
            publicUrlsRef.current.delete(fileId)
            setUploadedFiles((prevFiles) =>
              prevFiles.map((f) =>
                f.id === fileId
                  ? {
                      ...f,
                      status: "error" as const,
                      error: "Network error occurred",
                      progress: 0,
                    }
                  : f,
              ),
            )
            reject(new Error("Upload failed due to network error"))
          })

          fetch("/api/images/upload-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              files: [{ name: file.name.replace(/[^a-zA-Z0-9.-_]/g, "_") }],
              // folderName: `case-images`,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              const signedFile = data.files[0]
              if (!signedFile?.signedUrl || !signedFile.path) {
                throw new Error("Missing signed URL or file path")
              }

              publicUrlsRef.current.set(fileId, signedFile.path)

              xhr.open("PUT", signedFile.signedUrl)
              xhr.setRequestHeader("Content-Type", file.type)
              xhr.send(file.file)

              setUploadedFiles((prevFiles) =>
                prevFiles.map((f) =>
                  f.id === fileId
                    ? {
                        ...f,
                        status: "uploading" as const,
                      }
                    : f,
                ),
              )
            })
            .catch((error) => {
              xhrRef.current.delete(fileId)
              uploadProgressRef.current.delete(fileId)
              publicUrlsRef.current.delete(fileId)
              setUploadedFiles((prevFiles) =>
                prevFiles.map((f) =>
                  f.id === fileId
                    ? {
                        ...f,
                        status: "error" as const,
                        error: error.message || "Failed to initialize upload",
                        progress: 0,
                      }
                    : f,
                ),
              )
              reject(error)
            })

          return prev
        })
      })
    },
    [],
  )

  const processUploadQueue = useCallback(async () => {
    if (processingRef.current || activeUploadsRef.current >= maxConcurrentUploads) {
      return
    }

    const fileId = uploadQueueRef.current.shift()
    if (!fileId) return

    processingRef.current = true
    activeUploadsRef.current += 1

    try {
      await uploadFile(fileId)
    } catch (error) {
      // Error already handled in uploadFile
    } finally {
      activeUploadsRef.current -= 1
      processingRef.current = false
      if (uploadQueueRef.current.length > 0) {
        setTimeout(processUploadQueue, 100)
      }
    }
  }, [uploadFile])

  const validateFile = useCallback((file: File): string | null => {
    const maxFileSize = 100 * 1024 * 1024
    if (file.size > maxFileSize) {
      return `File size exceeds 100MB`
    }
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/dicom']
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.dcm']
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      return `File type not supported. Accepted: PNG, JPEG, DICOM`
    }
    return null
  }, [])

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files)
      if (uploadedFiles.length + fileArray.length > maxFiles) {
        return
      }

      const newFiles: UploadedFile[] = []

      fileArray.forEach((file) => {
        const error = validateFile(file)
        const fileId = `${Date.now()}-${Math.random()}`

        if (error) {
          newFiles.push({
            id: fileId,
            name: file.name,
            originalName: file.name,
            size: file.size,
            type: file.type,
            progress: 0,
            status: "error",
            error,
            file,
          })
        } else {
          newFiles.push({
            id: fileId,
            name: file.name,
            originalName: file.name,
            size: file.size,
            type: file.type,
            progress: 0,
            status: "pending",
            file,
            uploadedBytes: 0,
            totalBytes: file.size,
          })
          uploadQueueRef.current.push(fileId)
        }
      })

      setUploadedFiles((prev) => [...prev, ...newFiles])
      setTimeout(processUploadQueue, 100)
    },
    [uploadedFiles.length, validateFile, processUploadQueue],
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(true)
    },
    [],
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = e.dataTransfer.files
      if (files.length > 0) {
        processFiles(files)
      }
    },
    [processFiles],
  )

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        processFiles(files)
      }
      if (e.target) e.target.value = ""
    },
    [processFiles],
  )

  const handleSelectFiles = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    fileInputRef.current?.click()
  }, [])

  const removeFile = useCallback(async (id: string) => {
    const file = uploadedFiles.find(f => f.id === id)
    
    const xhr = xhrRef.current.get(id)
    if (xhr) {
      xhr.abort()
      xhrRef.current.delete(id)
    }

    uploadQueueRef.current = uploadQueueRef.current.filter((queueId) => queueId !== id)
    uploadProgressRef.current.delete(id)
    
    if (file?.status === "completed" && file.path) {
      try {
        await fetch("/api/images/delete-file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: file.path }),
        })
      } catch (error) {
        console.error('Delete error:', error)
      }
    }

    publicUrlsRef.current.delete(id)

    setUploadedFiles((prev) => {
      const file = prev.find((f) => f.id === id)
      if (file?.url && file.url.startsWith("blob:")) {
        URL.revokeObjectURL(file.url)
      }
      return prev.filter((f) => f.id !== id)
    })
  }, [uploadedFiles])

  useEffect(() => {
    const completedImages = uploadedFiles
      .filter((f) => f.status === "completed" && f.path)
      .map((f) => ({
        name: f.originalName,
        path: f.path!,
        size: f.size,
      }))

    form.setValue("images", completedImages, { shouldValidate: true })
  }, [uploadedFiles, form])
  
  const fileStats = useMemo(() => {
    const completed = uploadedFiles.filter((f) => f.status === "completed")
    const errors = uploadedFiles.filter((f) => f.status === "error")
    const uploading = uploadedFiles.filter((f) => f.status === "uploading")

    return { completed, errors, uploading }
  }, [uploadedFiles])

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Upload Images</CardTitle>
        <CardDescription>Upload ultrasound images (PNG, JPEG, or DICOM files)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <FormLabel>Images *</FormLabel>
              <FormControl>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
                    isDragOver
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="text-center">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Upload className={`h-6 w-6 ${isDragOver ? "text-blue-500" : "text-gray-400"}`} />
                    </div>
                    <p className="text-gray-600 mb-4">
                      Drag and drop your files here, or click to browse
                    </p>
                    <div className="text-xs text-gray-500 mb-4">
                      <div>Supported: PNG, JPEG, DICOM</div>
                      <div>Maximum file size: 100MB</div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSelectFiles}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Select Files
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/jpg,.dcm"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {uploadedFiles.length > 0 && (
          <Accordion type="single" collapsible defaultValue="files" className="bg-white border border-gray-200 rounded-lg">
            <AccordionItem value="files" className="border-0">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      Files ({uploadedFiles.length}/{maxFiles})
                    </h4>
                  </div>
                  <div className="flex items-center space-x-4 text-xs">
                    {fileStats.completed.length > 0 && (
                      <span className="flex items-center text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {fileStats.completed.length} completed
                      </span>
                    )}
                    {fileStats.uploading.length > 0 && (
                      <span className="flex items-center text-blue-700">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        {fileStats.uploading.length} uploading
                      </span>
                    )}
                    {fileStats.errors.length > 0 && (
                      <span className="flex items-center text-red-700">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {fileStats.errors.length} failed
                      </span>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="max-h-96 overflow-y-auto p-4 space-y-3">
                  {uploadedFiles.map((file) => (
                    <FileItem key={file.id} file={file} onRemove={removeFile} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
    </Card>
  )
}
