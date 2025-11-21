"use client"

import { use, useState, useRef, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { useGetCaseQuery, useLazyGetImageAnalysisQuery } from "@/store/services/cases"
import { ImageAIAnalysis } from "@/types/case"
import { CaseDetailHeader } from "@/components/cases/case-detail-header"
import { ImageList } from "@/components/cases/image-list"
import { ImageViewer } from "@/components/cases/image-viewer"
import { AIAnalysisPanel } from "@/components/cases/ai-analysis-panel"
import { ResizeHandle } from "@/components/cases/resize-handle"
import { Button } from "@/components/ui/button"

export default function CaseDetailPage({ params }: { params: Promise<{ case_number: string }> }) {
  const { case_number } = use(params)
  const router = useRouter()

  const [selectedImage, setSelectedImage] = useState<ImageAIAnalysis | null>(null)
  const [zoom, setZoom] = useState(100)

  const [leftWidth, setLeftWidth] = useState(100) // 16rem = 256px
  const [rightWidth, setRightWidth] = useState(384) // 24rem = 384px
  const [isResizingLeft, setIsResizingLeft] = useState(false)
  const [isResizingRight, setIsResizingRight] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { data: caseData, isLoading, isError } = useGetCaseQuery(case_number)
  const [GetImageAnalysis, { data: imageAnalysisData, isLoading: isImageAnalysisLoading }] = useLazyGetImageAnalysisQuery()
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const newWidth = e.clientX - containerRect.left
        if (newWidth >= 200 && newWidth <= 500) {
          setLeftWidth(newWidth)
        }
      }
    }

    const handleMouseUp = () => {
      setIsResizingLeft(false)
    }

    if (isResizingLeft) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizingLeft])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingRight && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const newWidth = containerRect.right - e.clientX
        if (newWidth >= 300 && newWidth <= 600) {
          setRightWidth(newWidth)
        }
      }
    }

    const handleMouseUp = () => {
      setIsResizingRight(false)
    }

    if (isResizingRight) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizingRight])

  useEffect(() => {
    if (caseData && caseData.images.length > 0) {
      setSelectedImage(caseData.images[0])
    }
  }, [caseData])

  useEffect(() => {
    if (selectedImage) {
      GetImageAnalysis(selectedImage.id)
    }
  }, [selectedImage, GetImageAnalysis])

  if (isLoading) {
    return (
      <div className="h-full bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading case...</div>
      </div>
    )
  }

  if (isError || !caseData) {
    return (
      <div className="h-full bg-white flex flex-col items-center justify-center">
        <p className="text-lg text-gray-600 mb-4">Case not found</p>
        <Button onClick={() => router.push("/cases")} variant="outline">
          Back to Cases
        </Button>
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
      <CaseDetailHeader caseNumber={caseData.case_number} patientName={caseData.patient.name} />

      <div ref={containerRef} className="flex-1 flex overflow-hidden">
        <div style={{ width: leftWidth }}>
          <ImageList images={caseData.images} selectedImage={selectedImage} onSelectImage={setSelectedImage} />
        </div>

        {/* <ResizeHandle onMouseDown={() => setIsResizingLeft(true)} /> */}

        <ImageViewer selectedImage={selectedImage} zoom={zoom} onZoomChange={setZoom} />

        <ResizeHandle onMouseDown={() => setIsResizingRight(true)} />

        <div style={{ width: rightWidth }}>
            <AIAnalysisPanel
              imageId={selectedImage?.id || null}
              caseData={caseData}
            />
          {/* <AIAnalysisPanel
            imageId={selectedImage?.id}
            selectedImage={selectedImage}
            imageAnalysisData={imageAnalysisData}
            isLoading={isImageAnalysisLoading}
            caseData={caseData}
            onLoadAnalysis={() => {
              if (selectedImage) {
                GetImageAnalysis(selectedImage.id)
              }
            }}
          /> */}
        </div>
      </div>
    </div>
  )
}