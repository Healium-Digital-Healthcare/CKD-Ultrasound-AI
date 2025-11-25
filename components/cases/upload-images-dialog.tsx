"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X, CheckCircle2, Loader2 } from "lucide-react"
import { useAddImagesToCaseMutation } from "@/store/services/cases"

interface UploadImagesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  caseId: string
}

interface UploadFile {
  id: string
  file: File
  status: "pending" | "uploading" | "completed" | "failed"
  progress: number
  path?: string
}

export function UploadImagesDialog({ open, onOpenChange, caseId }: UploadImagesDialogProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [addImages, { isLoading: isSaving }] = useAddImagesToCaseMutation()

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles: UploadFile[] = Array.from(selectedFiles).map((file) => ({
      id: Math.random().toString(36),
      file,
      status: "pending",
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...newFiles])
    processFiles(newFiles)
  }

  const processFiles = async (filesToProcess: UploadFile[]) => {
    for (const fileItem of filesToProcess) {
      try {
        setFiles((prev) => prev.map((f) => (f.id === fileItem.id ? { ...f, status: "uploading" } : f)))

        // Get signed URL
        const uploadResponse = await fetch("/api/images/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            files: [{ name: fileItem.file.name }],
            folderName: `case-${caseId}`,
          }),
        })

        if (!uploadResponse.ok) throw new Error("Failed to get upload URL")

        const { files: signedFiles } = await uploadResponse.json()
        const signedFile = signedFiles[0]

        // Upload to Supabase
        const xhr = new XMLHttpRequest()
        await new Promise<void>((resolve, reject) => {
          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              const progress = (e.loaded / e.total) * 100
              setFiles((prev) => prev.map((f) => (f.id === fileItem.id ? { ...f, progress } : f)))
            }
          })

          xhr.addEventListener("load", () => {
            if (xhr.status === 200) {
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === fileItem.id ? { ...f, status: "completed", progress: 100, path: signedFile.path } : f,
                ),
              )
              resolve()
            } else {
              reject(new Error("Upload failed"))
            }
          })

          xhr.addEventListener("error", () => reject(new Error("Upload failed")))

          xhr.open("PUT", signedFile.signedUrl)
          xhr.setRequestHeader("Content-Type", fileItem.file.type)
          xhr.send(fileItem.file)
        })
      } catch (error) {
        setFiles((prev) => prev.map((f) => (f.id === fileItem.id ? { ...f, status: "failed" } : f)))
      }
    }
  }

  const handleSave = async () => {
    const completedFiles = files.filter((f) => f.status === "completed" && f.path)
    if (completedFiles.length === 0) return

    try {
      await addImages({
        caseId,
        images: completedFiles.map((f) => ({
          image_path: f.path!,
          case_id: caseId,
        })),
      }).unwrap()

      setFiles([])
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to save images:", error)
    }
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Upload Additional Images</DialogTitle>
        </DialogHeader>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-gray-300"
          }`}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            handleFileSelect(e.dataTransfer.files)
          }}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-sm text-gray-600 mb-2">Drag and drop images here, or click to select</p>
          <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            Select Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>

        {files.length > 0 && (
          <div className="flex-1 overflow-y-auto space-y-2 mt-4">
            {files.map((file) => (
              <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium truncate">{file.file.name}</p>
                  {file.status === "uploading" && <Progress value={file.progress} className="mt-2" />}
                </div>

                {file.status === "completed" && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                {file.status === "uploading" && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                {file.status === "failed" && <span className="text-xs text-red-600">Failed</span>}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(file.id)}
                  disabled={file.status === "uploading"}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={files.every((f) => f.status !== "completed") || isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Images"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
