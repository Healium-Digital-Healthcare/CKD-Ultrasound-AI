export interface Patient {
  id: string
  name: string
  patient_id?: string
  age: number
  sex: "M" | "F"
  severity?: "normal" | "mild" | "moderate" | "severe" | "critical"
  scanned_on?: string
  last_updated?: string
  ckd_stage?: number
  egfr?: number,
  avatar?: string,
  email?: string,
  phone?: string,
  date_of_birth?: string 
}

export interface FetchPatientByPatienIdResponse {
  message: string,
  data: Patient
}