"use client"

import { useState, useCallback, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, User, Upload, Brain, FileText, ChevronLeft, Loader2 } from "lucide-react"

import { StudyPatientSelection } from "./study-patient-selection"
import { StudyImageUpload, type UploadedFile } from "./study-image-upload"
import { StudyAIAnalysis } from "./study-ai-analysis"
import { StudyReportGeneration } from "./study-report-generation"
import { useCreateCaseMutation } from "@/store/services/cases"
import type { Patient } from "@/types/patient"

interface CreateStudySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const STEPS = [
  { number: 1, label: "Patient Selection", icon: User },
  { number: 2, label: "Image Upload", icon: Upload },
  { number: 3, label: "AI Analysis", icon: Brain },
  { number: 4, label: "Report", icon: FileText },
]

export function CreateStudySheet({ open, onOpenChange }: CreateStudySheetProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [createdCaseId, setCreatedCaseId] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false)
  const [isUploadingImages, setIsUploadingImages] = useState<boolean>(false)

  // Step data
  const [patientData, setPatientData] = useState<Patient | null>(null)
  const [imageData, setImageData] = useState<{
    leftKidney: { path: string; signedUrl: string; size: number; fileType: string } | null
    rightKidney: { path: string; signedUrl: string; size: number; fileType: string } | null
  }>({
    leftKidney: null,
    rightKidney: null,
  })
  const [imageUploadState, setImageUploadState] = useState<{
    leftKidney: UploadedFile | null
    rightKidney: UploadedFile | null
  }>({
    leftKidney: null,
    rightKidney: null,
  })

  const [analysisData, setAnalysisData] = useState<any>(null)

  const [CreateStudy, { data: createdStudy, isLoading: isStudyCreationLoading, isSuccess: isStudyCreationSuccess }] =
    useCreateCaseMutation()

  const handleClose = () => {
    setCurrentStep(1)
    setCreatedCaseId(null)
    setPatientData(null)
    setImageData({ leftKidney: null, rightKidney: null })
    setImageUploadState({ leftKidney: null, rightKidney: null })
    setAnalysisData(null)
    onOpenChange(false)
  }

  const handlePatientComplete = (data: Patient) => {
    setPatientData(data)
  }

  const handleImagesComplete = useCallback(
    (
      leftImage: { path: string; signedUrl: string; size: number; fileType: string } | null,
      rightImage: { path: string; signedUrl: string; size: number; fileType: string } | null,
    ) => {
      setImageData({ leftKidney: leftImage, rightKidney: rightImage })
    },
    [],
  )

  const handleUploadingStateChange = useCallback((isUploading: boolean) => {
    setIsUploadingImages(isUploading)
  }, [])

  const handleImageStateChange = useCallback(
    (state: { leftKidney: UploadedFile | null; rightKidney: UploadedFile | null }) => {
      setImageUploadState(state)
    },
    [],
  )

  const handleCreateStudy = async () => {
    if (!patientData || !imageData.leftKidney || !imageData.rightKidney) {
      return
    }

    const images = []
    if (imageData.leftKidney) {
      images.push({
        path: imageData.leftKidney.path,
        kidney_type: "left" as const,
        fileType: imageData.leftKidney.fileType,
      })
    }
    if (imageData.rightKidney) {
      images.push({
        path: imageData.rightKidney.path,
        kidney_type: "right" as const,
        fileType: imageData.rightKidney.fileType,
      })
    }

    await CreateStudy({
      patient_id: patientData.id,
      study_date: new Date().toISOString().split("T")[0],
      images,
    })
  }

  const handleAnalysisStateChange = (analyzing: boolean) => {
    setIsAnalyzing(analyzing)
  }

  const handleAnalysisComplete = (value: boolean) => {
    setIsAnalyzed(value)
  }

  const handleReportComplete = () => {
    onOpenChange(false)
  }

  const isStep1Valid = patientData !== null
  const isStep2Valid = imageData.leftKidney !== null && imageData.rightKidney !== null
  const isStep3Valid = analysisData !== null

  const getFooterButtons = () => {
    switch (currentStep) {
      case 1:
        return {
          showBack: false,
          continueText: "Continue to Next",
          continueDisabled: !isStep1Valid,
          continueLoading: false,
          onContinue: () => setCurrentStep(2),
        }
      case 2:
        return {
          showBack: true,
          backDisabled: isUploadingImages,
          continueText: "Create Study & Continue to Analysis",
          continueDisabled: !isStep2Valid || isStudyCreationLoading || isUploadingImages,
          continueLoading: isStudyCreationLoading,
          onContinue: handleCreateStudy,
        }
      case 3:
        return {
          showBack: false,
          continueText: "View Report",
          continueDisabled: !isAnalyzed || isAnalyzing,
          continueLoading: false,
          onContinue: () => setCurrentStep(4),
        }
      case 4:
        return {
          showBack: true,
          continueText: "Finalize",
          continueDisabled: false,
          continueLoading: false,
          onContinue: handleReportComplete,
        }
      default:
        return {
          showBack: false,
          continueText: "Continue",
          continueDisabled: true,
          continueLoading: false,
          onContinue: () => {},
        }
    }
  }

  const footerConfig = getFooterButtons()

  useEffect(() => {
    if (isStudyCreationSuccess && createdStudy) {
      setCreatedCaseId(createdStudy.id)
      setCurrentStep(3)
    }
  }, [isStudyCreationSuccess])

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent
        side="bottom"
        className="h-screen w-screen max-w-none !inset-0 !top-0 !bottom-0 !mt-0 !rounded-none p-0 flex flex-col bg-white"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="flex-shrink-0 px-6 py-4 border-b bg-white">
          <div className="flex items-center gap-40">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <SheetTitle className="text-2xl font-semibold">Create New Study</SheetTitle>
                <SheetDescription>
                  Step {currentStep} of 4: {STEPS[currentStep - 1].label}
                </SheetDescription>
              </div>
            </div>

            <div className="relative flex items-start gap-20">
              {/* Continuous background line spanning all steps */}
              <div
                className="absolute top-[18px] left-[18px] right-[18px] h-[2px] bg-border -z-0"
                style={{ width: "calc(100% - 36px)" }}
              >
                {/* Green progress line fills based on current step */}
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                />
              </div>

              {/* Step circles */}
              {STEPS.map((step) => {
                const Icon = step.icon
                const isCompleted = step.number < currentStep
                const isCurrent = step.number === currentStep

                return (
                  <div key={step.number} className="flex flex-col relative z-10">
                    {/* Step circle */}
                    <div
                      className={`
                        w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 border-2
                        ${isCompleted ? "bg-green-500 border-green-500 text-white" : ""}
                        ${isCurrent ? "border-green-500 bg-green-500 text-white shadow-lg" : ""}
                        ${!isCompleted && !isCurrent ? "border-border bg-white text-muted-foreground" : ""}
                      `}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>

                    {/* Step label below circle */}
                    <span
                      className={`text-xs font-medium whitespace-nowrap mt-2 ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-white">
          <div className="h-full">
            {currentStep === 1 && (
              <StudyPatientSelection onComplete={handlePatientComplete} defaultPatientId={patientData?.id} />
            )}
            {currentStep === 2 && (
              <StudyImageUpload
                onComplete={handleImagesComplete}
                onStateChange={handleImageStateChange}
                initialFiles={imageUploadState}
                initialImages={{
                  leftKidney: imageData.leftKidney
                    ? {
                        path: imageData.leftKidney.path,
                        size: imageData.leftKidney.size,
                        fileType: imageData.leftKidney.fileType,
                        displaySignedUrl: imageData.leftKidney.signedUrl,
                      }
                    : null,
                  rightKidney: imageData.rightKidney
                    ? {
                        path: imageData.rightKidney.path,
                        size: imageData.rightKidney.size,
                        fileType: imageData.rightKidney.fileType,
                        displaySignedUrl: imageData.rightKidney.signedUrl,
                      }
                    : null,
                }}


                
                isDisabled={isStudyCreationLoading}
                onUploadingStateChange={handleUploadingStateChange}
                patient={patientData}
              />
            )}
            {currentStep === 3 && createdCaseId && (
              <StudyAIAnalysis
                caseId={createdCaseId}
                onComplete={handleAnalysisComplete}
                onAnalyzingStateChange={handleAnalysisStateChange}
              />
            )}
            {currentStep === 4 && createdCaseId && <StudyReportGeneration caseId={createdCaseId} />}
          </div>
        </div>

        <div className="flex-shrink-0 px-6 py-4 border-t bg-white">
          <div className="flex items-center justify-end gap-4">
            {footerConfig.showBack ? (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={footerConfig.backDisabled}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            ) : (
              <div />
            )}

            <Button
              onClick={footerConfig.onContinue}
              disabled={footerConfig.continueDisabled}
              className="gap-2 min-w-[200px] bg-green-500 hover:bg-green-500"
            >
              {footerConfig.continueLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Study...
                </>
              ) : (
                footerConfig.continueText
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
