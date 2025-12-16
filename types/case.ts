import { Patient } from "./patient"

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
  images: ImageAnalysis[]
  patient: Patient
  analyzed_by_ai: boolean
}

export type Finding = {
  name: string;
  severity: string;
  hasIssue: boolean;
};

export type Etiology = {
  name: string;
  percentage: number;
};

export type AiAnalysisResult = {
  ckdRisk: "HIGH" | "MODERATE" | "LOW";
  ckdStage: string;
  egfr: number;
  confidence: number;
  range: string;
  findings: Finding[];
  etiology: Etiology[];
  notes: string;
};

export interface Report {
  findings: {
    size: string
    echogenicity: string
    cortex: string
    hydronephrosis: string
    calculi: string
    cysts: string
  }
  assessment: string
  impression: string[]
  recommendations: string[]
}

export type ImageAnalysis = {
  id: string
  image_path: string
  kidney_type: "left" | "right"
  ai_analysis_status: "pending" | "completed"
  ai_analysis_result: AiAnalysisResult | null
  signed_url: string | null
  length: number | null,
  width: number | null,
  thinkness: number | null,
  area: number | null,
  report: Report | null
};


export interface CreateImageAnalysis {
  path: string,
  kidney_type: "left" | "right"
}

export interface CreateCaseType {
  patient_id?: string,
  study_date: string,
  images: CreateImageAnalysis[],
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