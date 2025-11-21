"use client"

import { useEffect } from "react"
import { User, Calendar, Activity, Stethoscope } from "lucide-react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreatePatientMutation, useUpdatePatientMutation } from "@/store/services/patients"
import { toast } from "sonner"
import { Patient } from "@/types/patient"

const patientFormSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  age: z.coerce.number().min(0, "Age must be positive").max(150, "Age must be less than 150"),
  sex: z.enum(["M", "F"] as const, { message: "Please select a sex" }),
  severity: z.enum(["normal", "mild", "moderate", "severe", "critical"] as const, {
    message: "Please select a severity level",
  }),
  ckdStage: z.string().optional(),
  eGFR: z.string().optional(),
})

type PatientFormValues = z.infer<typeof patientFormSchema>

interface PatientFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient?: Patient
  mode: "create" | "edit"
}

export function PatientFormDialog({ open, onOpenChange, patient, mode }: PatientFormDialogProps) {
  const [createPatient, { isLoading: isCreating, isSuccess: isCreateSuccess, isError: isCreateError }] =
    useCreatePatientMutation()
  const [updatePatient, { isLoading: isUpdating, isSuccess: isUpdateSuccess, isError: isUpdateError }] =
    useUpdatePatientMutation()

  const isLoading = isCreating || isUpdating

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema) as unknown as Resolver<PatientFormValues>,
    defaultValues: {
      patientId: patient?.patient_id || `PID${Math.floor(100000 + Math.random() * 900000)}`,
      name: patient?.name || "",
      age: patient?.age || 0,
      sex: patient?.sex || "M",
      severity: patient?.severity || "normal",
      ckdStage: patient?.ckd_stage?.toString() || "",
      eGFR: patient?.egfr?.toString() || "",
    },
  })

  useEffect(() => {
    if (isCreateSuccess) {
      form.reset()
      toast.success("Patient Created Successfully!")
      onOpenChange(false)
    }
  }, [isCreateSuccess, form, onOpenChange])

  useEffect(() => {
    if (isUpdateSuccess) {
      toast.success("Patient Updated Successfully!")
      onOpenChange(false)
    }
  }, [isUpdateSuccess, onOpenChange])

  useEffect(() => {
    if (isCreateError) {
      toast.error("Something went wrong while creating patient!")
    }
  }, [isCreateError])

  useEffect(() => {
    if (isUpdateError) {
      toast.error("Something went wrong while updating patient!")
    }
  }, [isUpdateError])

  const onSubmit = async (values: PatientFormValues) => {
    const patientData = {
      patient_id: values.patientId,
      name: values.name,
      age: values.age,
      sex: values.sex,
      severity: values.severity,
      ...(values.ckdStage && values.ckdStage !== "" && { ckd_stage: Number(values.ckdStage) }),
      ...(values.eGFR && values.eGFR !== "" && { egfr: Number(values.eGFR) }),
    }

    if (mode === "edit" && patient?.id) {
      updatePatient({ id: patient.id, data:{...patientData} })
    } else {
      createPatient(patientData)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Patient" : "Add New Patient"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Patient ID <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input {...field} readOnly={mode === "edit"} className="pl-10 bg-gray-50 cursor-not-allowed" />
                    </div>
                  </FormControl>
                  <FormDescription>Auto-generated patient ID</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Patient Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input {...field} placeholder="Enter patient full name" className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Age <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input {...field} type="number" placeholder="Enter age" className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Sex <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sex" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="F">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Severity <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <div className="relative">
                        <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10 pointer-events-none" />
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                      </div>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="mild">Mild</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="severe">Severe</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="ckdStage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CKD Stage (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input {...field} type="number" placeholder="Enter CKD stage (1-5)" className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eGFR"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>eGFR (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input {...field} type="number" step="0.1" placeholder="Enter eGFR value" className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="px-8"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" className="px-8 bg-[#687FE5] hover:bg-[#5568d3]" disabled={isLoading}>
                {isLoading
                  ? mode === "edit"
                    ? "Updating..."
                    : "Creating..."
                  : mode === "edit"
                    ? "Update Patient"
                    : "Create Patient"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
