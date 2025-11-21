import * as z from "zod";

export const patientTypeSchema = z.object({
  patientType: z.enum(["new", "existing"]),
});

export const existingPatientSearchSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
});

export const newPatientSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  age: z.string().min(1, "Age is required"),
  gender: z.enum(["M", "F"] as const, { message: "Gender is required" }),
});

export const imageMetadataSchema = z.object({
  name: z.string(),
  path: z.string(),
  size: z.number(),
})


export const CaseSchema = z.object({
  // Step 1
  patientType: z.enum(["new", "existing"]),
  patientId: z.string().optional(),
  patientNumber: z.string().min(1, "Patient ID is required"),
  patientName: z.string().min(1, "Patient name is required"),
  age: z.string().min(1, "Age is required"),
  gender: z.enum(["M", "F"]),

  // Step 2
  studyDescription: z.string().min(1, "Study description is required"),
  studyDate: z.string().min(1, "Study date is required"),

  // Step 3
  images: z.array(imageMetadataSchema).min(1, "Please upload at least 1 image"),

})

export type CaseFormValues = z.infer<typeof CaseSchema>
