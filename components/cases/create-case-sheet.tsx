"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Check, CheckCircle2, FileSearch, FileText, ImageIcon, User } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

import { CaseFormPatientInfo } from "@/components/cases/case-form-patient-info"
import { CaseFormStudyInfo } from "@/components/cases/case-form-study-info"
import { CaseFormImageUpload } from "@/components/cases/case-form-image-upload"

import { type CaseFormValues, CaseSchema } from "@/lib/schemas/case"
import { useCreateCaseMutation } from "@/store/services/cases"

interface CreateCaseSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const STEPS = [
  { number: 1, label: "Patient Info", icon: User },
  { number: 2, label: "Study Details", icon: FileText },
  { number: 3, label: "Upload Images", icon: ImageIcon },
]

export function CreateCaseSheet({ open, onOpenChange }: CreateCaseSheetProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [caseNumber, setCaseNumber] = useState<string>("")

  const [createCase, { isLoading, isSuccess, isError, data, error }] = useCreateCaseMutation()

  const form = useForm<CaseFormValues>({
    resolver: zodResolver(CaseSchema),
    mode: "onChange",
    defaultValues: {
      patientType: "new",
      patientId: "",
      patientName: "",
      age: "",
      gender: "M",
      studyDescription: "",
      studyDate: new Date().toISOString().split("T")[0],
      images: [],
    },
  })

  useEffect(() => {
    if (isSuccess && data) {
      setCaseNumber(data.case_number)
      setShowSuccessDialog(true)
    //   onOpenChange(false)
    }
  }, [isSuccess, data, onOpenChange])

  const getStepFields = (step: number): (keyof CaseFormValues)[] => {
    switch (step) {
      case 1:
        const patientType = form.getValues("patientType")
        if (patientType === "existing") {
          return ["patientType", "patientId"]
        }
        return ["patientType", "patientName", "age", "gender"]
      case 2:
        return ["studyDescription", "studyDate"]
      case 3:
        return ["images"]
      default:
        return []
    }
  }

  const validateStep = async () => {
    const fields = getStepFields(currentStep)
    const isValid = await form.trigger(fields)
    return isValid
  }

  const nextStep = async () => {
    const valid = await validateStep()
    if (valid) {
      setCurrentStep((s) => s + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep((s) => s - 1)
  }

  const onSubmit = async (data: CaseFormValues) => {
    // await createCase({
    //     patient_id: data.patientType === "existing" ? data.patientId : undefined,
    //     study_description: data.studyDescription,
    //     study_date: data.studyDate,
    //     images: data.images.map((img) => img.path),
    //     patient_type: data.patientType,
    //     patient_age: data.age,
    //     patient_name: data.patientName,
    //     patient_gender: data.gender
    // })
  }

  const handleTrackCase = () => {
    setShowSuccessDialog(false)
    router.push(`/cases/${caseNumber}`)
  }

  const handleCreateAnother = () => {
    setShowSuccessDialog(false)
    form.reset()
    setCurrentStep(1)
    onOpenChange(true)
  }

  const handleClose = () => {
    form.reset()
    setCurrentStep(1)
    onOpenChange(false)
  }

  return (
    <>
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent 
        side="right" 
        className="w-[800px] sm:max-w-[800px] p-0"
        onInteractOutside={(e) => e.preventDefault()}
        >
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle className="text-2xl font-semibold">Create New Case</SheetTitle>
            <SheetDescription>Fill in the patient and study information to create a new case</SheetDescription>
          </SheetHeader>

          <div className="border-b pb-4">
            <div className="relative">
              <div className="flex justify-between relative">
                {STEPS.map((step, index) => {
                  const Icon = step.icon
                  const isCompleted = step.number < currentStep
                  const isCurrent = step.number === currentStep

                  return (
                    <div key={step.number} className="flex flex-col items-center gap-2 relative flex-1">
                      {/* Connecting line between steps */}
                      {index < STEPS.length - 1 && (
                        <div className="absolute left-1/2 top-5 w-full h-[2px] -z-0">
                          {/* Background line */}
                          <div className="h-full bg-border" />
                          {/* Progress line overlay */}
                          {step.number < currentStep && (
                            <div className="absolute top-0 left-0 h-full w-full bg-green-500 transition-all duration-300" />
                          )}
                        </div>
                      )}

                      {/* Step circle */}
                      <div
                        className={`
                            w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 relative z-10 bg-background
                            ${isCompleted ? "bg-green-500 text-white" : ""}
                            ${isCurrent ? "bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20" : ""}
                            ${!isCompleted && !isCurrent ? "bg-muted text-muted-foreground" : ""}
                          `}
                      >
                        {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>

                      {/* Step label */}
                      <div className="flex flex-col items-center">
                        <span
                          className={`
                              text-xs font-medium transition-colors
                              ${isCurrent ? "text-foreground" : "text-muted-foreground"}
                            `}
                        >
                          {step.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground">Step {step.number}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <ScrollArea className="h-[calc(80vh-180px)]">
            <div className="px-6 pb-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {currentStep === 1 && <CaseFormPatientInfo form={form} />}
                  {currentStep === 2 && <CaseFormStudyInfo form={form} />}
                  {currentStep === 3 && <CaseFormImageUpload form={form} />}
                </form>
              </Form>
            </div>
          </ScrollArea>


          <div className="absolute bottom-0 left-0 right-0 px-8 py-6 bg-white border-t border-gray-200">
            
            <div className="flex items-center justify-end gap-3">
                {currentStep > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                </Button>
                ) : (
                <div />
                )}

                {currentStep < 3 ? (
                <Button type="button" onClick={nextStep}>
                    Next
                </Button>
                ) : (
                <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Case"}
                </Button>
                )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md border-0 shadow-xl">
          <div className="flex flex-col items-center text-center py-6">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 className="h-12 w-12 text-green-500" strokeWidth={1.5} />
            </div>

            <h2 className="text-2xl font-semibold mb-2">Case Created</h2>
            <p className="text-sm text-muted-foreground mb-6">Your case has been submitted successfully</p>

            <div className="w-full rounded-lg border bg-muted/30 p-6 mb-6">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-medium">Case Number</p>
              <p className="text-4xl font-bold tabular-nums">{caseNumber}</p>
            </div>

            <div className="flex flex-col w-full gap-2">
              <Button onClick={handleTrackCase} size="lg" className="w-full">
                Track Case
              </Button>
              <Button onClick={handleCreateAnother} variant="ghost" size="lg" className="w-full">
                Create Another
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
