export interface AIAnalysisResult {
  egfr: number
  findings: {
    hydronephrosis: number
    calculi: number
    cysts: number
    increased_echogenicity: number
    cortical_thinning: number
    masses: number
  }
  disease: {
    diabetic_nephropathy: number
    hypertensive_nephrosclerosis: number
    glomerulonephritis: number
    polycystic_kidney_disease: number
    hydronephrosis_obstruction: number
    unknown_other: number
  },
  disease_predicted: string
}

export interface Case {
  id: string
  patient_id: string
  case_number: string
  study_description: string
  study_date: string
  total_images: number
  selected_images: number
  images: ImageAIAnalysis[]
  patient: {
    name: string
    age: string,
    sex: string
  }
}

export interface ImageAIAnalysis {
  id: string,
  image_path: string,
  ai_analysis_status: string,
  ai_analysis_result: AIAnalysisResult | null,
  signed_url: string | null
}

export interface CreateCaseType {
  patient_id?: string,
  study_description: string,
  study_date: string,
  images: string[],
  patient_type: string,
  patient_age: string,
  patient_name: string,
  patient_gender: string
}

export interface CaseListResponse {
  data: Case,
  pagination: {
    total: number,
    page: number,
    limit: number,
    totalPages: number
  }
}