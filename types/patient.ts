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
  modality?: string,
  date_of_birth?: string 
}

export interface FetchPatientByPatienIdResponse {
  message: string,
  data: Patient
}

export interface PatientListResponse {
  data: Patient[],
  pagination: {
    total: number,
    page: number,
    limit: number,
    totalPages: number
  }
}

export interface PatientStats {
  total: number
  stable: number
  critical: number
  recovering: number
}

export interface EgfrTimelinePoint {
  date: string
  egfr: number
  study: string
}