"use client"

import { useEffect } from "react"
import { User, Calendar, Activity, Stethoscope } from "lucide-react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { useCreatePatientMutation } from "@/store/services/patients"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"

const patientFormSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  age: z.coerce.number().min(0, "Age must be positive").max(150, "Age must be less than 150"),
  sex: z.enum(["M", "F"] as const, { message: "Please select a sex" }),
})

type PatientFormValues = z.infer<typeof patientFormSchema>

interface CreatePatientSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePatientSheet({ open, onOpenChange }: CreatePatientSheetProps) {
  const [createPatient, { isLoading, isSuccess, isError }] = useCreatePatientMutation()

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema) as unknown as Resolver<PatientFormValues>,
    defaultValues: {
      patientId: `${new Date().toISOString().slice(0, 10).replace(/-/g, "")}` + `${Math.floor(1000 + Math.random() * 9000)}`,
      name: "",
      age: 0,
      sex: "M",
    },
  })

  useEffect(() => {
    if (isSuccess) {
      form.reset({
        patientId: `PID${Math.floor(100000 + Math.random() * 900000)}`,
        name: "",
        age: 0,
        sex: "M"
      })
      toast.success("Patient Created Successfully!")
      onOpenChange(false)
    }
  }, [isSuccess, onOpenChange, form])

  useEffect(() => {
    if (isError) {
      toast.error("Something wrong happened while creating a patient!")
    }
  }, [isError])

  const onSubmit = async (values: PatientFormValues) => {
    const newPatient = {
      patient_id: values.patientId,
      name: values.name,
      age: values.age,
      sex: values.sex
    }

    createPatient(newPatient)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
      side="right" 
      className="w-full sm:w-[600px] sm:max-w-[600px] p-0"
      onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="px-8 pt-8 pb-6 border-b border-gray-200">
          <SheetTitle className="text-2xl font-semibold text-gray-900">Add New Patient</SheetTitle>
          <SheetDescription className="text-sm text-gray-600">Fill in the patient information below</SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="px-8 pt-2 pb-20">
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
                          <Input {...field} readOnly className="pl-10 bg-gray-50 cursor-not-allowed" />
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

                <div className="grid grid-cols-2 gap-4">
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
                          Gender <span className="text-red-500">*</span>
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
              </form>
            </Form>
          </div>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 px-8 py-6 bg-white border-t border-gray-200">
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              className="px-6"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Patient"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
