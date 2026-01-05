"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, CheckCircle, AlertCircle, Loader2, ImageIcon, ChevronDown } from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  file: File
  path?: string
  status: "pending" | "uploading" | "completed" | "error"
  progress: number
  error?: string
}

interface StudyImageUploadProps {
  onComplete: (leftImages: string[], rightImages: string[]) => void
  initialImages?: { leftKidney: string[]; rightKidney: string[] }
  isDisabled?: boolean
  onUploadingStateChange?: (isUploading: boolean) => void
}

export function StudyImageUpload({
  onComplete,
  initialImages,
  isDisabled,
  onUploadingStateChange,
}: StudyImageUploadProps) {
  const [leftKidneyFiles, setLeftKidneyFiles] = useState<UploadedFile[]>(() => {
    if (initialImages?.leftKidney.length) {
      return initialImages.leftKidney.map((path, index) => ({
        id: `restored-left-${index}`,
        name: path.split("/").pop() || `image-${index + 1}`,
        file: new File([], ""), // Dummy file object for restored images
        path,
        status: "completed" as const,
        progress: 100,
      }))
    }
    return []
  })

  const [rightKidneyFiles, setRightKidneyFiles] = useState<UploadedFile[]>(() => {
    if (initialImages?.rightKidney.length) {
      return initialImages.rightKidney.map((path, index) => ({
        id: `restored-right-${index}`,
        name: path.split("/").pop() || `image-${index + 1}`,
        file: new File([], ""), // Dummy file object for restored images
        path,
        status: "completed" as const,
        progress: 100,
      }))
    }
    return []
  })

  const [leftExpanded, setLeftExpanded] = useState(true)
  const [rightExpanded, setRightExpanded] = useState(true)

  const leftInputRef = useRef<HTMLInputElement>(null)
  const rightInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const leftPaths = leftKidneyFiles.filter((f) => f.status === "completed" && f.path).map((f) => f.path!)
    const rightPaths = rightKidneyFiles.filter((f) => f.status === "completed" && f.path).map((f) => f.path!)
    onComplete(leftPaths, rightPaths)
  }, [leftKidneyFiles, rightKidneyFiles, onComplete])

  useEffect(() => {
    const isAnyUploading =
      leftKidneyFiles.some((f) => f.status === "uploading") || rightKidneyFiles.some((f) => f.status === "uploading")

    onUploadingStateChange?.(isAnyUploading)
  }, [leftKidneyFiles, rightKidneyFiles, onUploadingStateChange])

  const uploadFile = async (
    file: File,
    fileId: string,
    setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>,
  ) => {
    try {
      // Get signed URL
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

      // Upload file with progress
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100
          setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress: Math.round(progress) } : f)))
        }
      })

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId ? { ...f, status: "completed", progress: 100, path: signedFile.path } : f,
            ),
          )
        } else {
          setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "error", error: "Upload failed" } : f)))
        }
      })

      xhr.addEventListener("error", () => {
        setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "error", error: "Network error" } : f)))
      })

      setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "uploading" } : f)))

      xhr.open("PUT", signedFile.signedUrl)
      xhr.setRequestHeader("Content-Type", file.type)
      xhr.send(file)
    } catch (error) {
      setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "error", error: "Upload failed" } : f)))
    }
  }

  const handleFileSelect = (files: FileList | null, kidney: "left" | "right") => {
    if (!files) return

    const setFiles = kidney === "left" ? setLeftKidneyFiles : setRightKidneyFiles

    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      file,
      status: "pending",
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Start uploads
    newFiles.forEach((file) => uploadFile(file.file, file.id, setFiles))
  }

  const removeFile = (fileId: string, kidney: "left" | "right") => {
    const setFiles = kidney === "left" ? setLeftKidneyFiles : setRightKidneyFiles
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const renderFileList = (
    files: UploadedFile[],
    kidney: "left" | "right",
    isExpanded: boolean,
    setExpanded: (expanded: boolean) => void,
  ) => (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
      >
        <span className="text-sm font-medium text-foreground">{files.length} file(s) uploaded</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      {isExpanded && (
        <div className="space-y-2 mt-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 border border-border rounded-lg bg-muted/30 transition-colors hover:bg-muted/50"
            >
              <div className="flex-shrink-0">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-foreground">{file.name}</p>
                {file.status === "uploading" && (
                  <div className="mt-2">
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-primary transition-all"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{file.progress}%</p>
                  </div>
                )}
                {file.status === "error" && <p className="text-xs text-destructive mt-1">{file.error}</p>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {file.status === "uploading" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                {file.status === "completed" && <CheckCircle className="h-4 w-4 text-green-600" />}
                {file.status === "error" && <AlertCircle className="h-4 w-4 text-destructive" />}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeFile(file.id, kidney)}
                  disabled={file.status === "uploading"}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">Upload Ultrasound Images</h2>
            <p className="text-sm text-muted-foreground mt-1">Upload images for both kidneys to continue</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Kidney */}
            <div>
              <div className="mb-4">
                <h3 className="text-base font-semibold text-foreground">Left Kidney</h3>
                <p className="text-sm text-muted-foreground">PNG, JPEG, or DICOM files</p>
              </div>

              <button
                type="button"
                disabled={isDisabled}
                className="w-full h-48 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-muted/30 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => leftInputRef.current?.click()}
              >
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Click to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">or drag and drop</p>
                </div>
              </button>
              <input
                ref={leftInputRef}
                type="file"
                multiple
                disabled={isDisabled}
                accept="image/png,image/jpeg,image/jpg,.dcm"
                onChange={(e) => handleFileSelect(e.target.files, "left")}
                className="hidden"
              />
              {leftKidneyFiles.length > 0 && renderFileList(leftKidneyFiles, "left", leftExpanded, setLeftExpanded)}
            </div>

            {/* Right Kidney */}
            <div>
              <div className="mb-4">
                <h3 className="text-base font-semibold text-foreground">Right Kidney</h3>
                <p className="text-sm text-muted-foreground">PNG, JPEG, or DICOM files</p>
              </div>

              <button
                type="button"
                disabled={isDisabled}
                className="w-full h-48 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-muted/30 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => rightInputRef.current?.click()}
              >
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Click to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">or drag and drop</p>
                </div>
              </button>
              <input
                ref={rightInputRef}
                type="file"
                multiple
                disabled={isDisabled}
                accept="image/png,image/jpeg,image/jpg,.dcm"
                onChange={(e) => handleFileSelect(e.target.files, "right")}
                className="hidden"
              />
              {rightKidneyFiles.length > 0 &&
                renderFileList(rightKidneyFiles, "right", rightExpanded, setRightExpanded)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
