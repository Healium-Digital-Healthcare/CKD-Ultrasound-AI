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
  id: string,
  patient_id: string,
  case_number: string,
  study_description: string,
  study_date: string,
  total_images: number,
  selected_images: number,
  images: ImageAnalysis[],
  patient: Patient,
  analyzed_by_ai: boolean,
  modality?: string,
  status?: string,
  report?: Report | null,
  report_html?: string,
  ai_analysis_status?: "pending" | "completed",
  ai_analysis_result?: AiAnalysisResult | null
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

// export interface Report {
//   findings: {
//     size: string
//     echogenicity: string
//     cortex: string
//     hydronephrosis: string
//     calculi: string
//     cysts: string
//   }
//   assessment: string
//   impression: string[]
//   recommendations: string[]
// }

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
  report: Report | null,
  report_html?: string
  measurements: Measurement[]
};

export interface Measurement {
  id: string
  tool: "linear" | "area" | "ellipse" | "angle" | "freehand"
  points: Array<{ x: number; y: number }>
  value?: number
  unit?: string
  label?: string
  color: string
  createdAt: string
}

export interface CreateImageAnalysis {
  path: string,
  kidney_type: "left" | "right"
}

export interface CreateCaseType {
  patient_id?: string,
  study_date: string,
  images: CreateImageAnalysis[],
}

export interface CaseListResponse {
  data: Case[],
  pagination: {
    total: number,
    page: number,
    limit: number,
    totalPages: number
  }
}

export interface Report {
  // General Details
  generalDetails: {
    patientName: string
    centre: string
    referringPhysician: string
    age: string
    gender: string
    reportGenerationDate: string
    scanDate: string
    patientId: string
  }

  // Clinical History
  clinicalHistory: {
    chiefComplaint: string
    diabetesMellitus: string
    hypertension: string
    familyHistory: string
    previousKidneyIssues: string
    currentMedications: string
  }

  // Intelliscan AI Scores
  aiScores: {
    predictedEgfr: number
    ckdStatus: "YES" | "NO"
    ckdStage: string
    modelConfidence: number
    imageQuality: string
  }

  // Kidney Morphology
  morphology: {
    rightKidney: {
      length: number
      width: number
      corticalThickness: number
      echogenicity: string
      cmd: string // Corticomedullary Differentiation
      hydronephrosis: string
      stones: number
      cysts: string
    }
    leftKidney: {
      length: number
      width: number
      corticalThickness: number
      echogenicity: string
      cmd: string
      hydronephrosis: string
      stones: number
      cysts: string
    }
  }

  // Etiology Classification
  etiologyClassification: {
    name: string
    percentage: number
    confidence: "High" | "Moderate" | "Low"
  }[]

  // Structural Findings
  structuralFindings: {
    name: string
    present: boolean
    status: string
    location: string
    clinicalSignificance: string
  }[]

  // Stone Detection
  stoneDetection: {
    stones: {
      number: number
      location: string
      size: string
      confidence: number
      characteristics: string
    }[]
    totalStones: number
    largestStone: string
    recommendedAction: string
  }

  // Clinical Impression
  clinicalImpression: {
    rightKidney: string
    leftKidney: string
    overall: string
  }

  // Recommendations
  recommendations: string[]

  // Images (for annotated ultrasound display)
  images: {
    id: string
    kidney: "left" | "right"
    view: string
    dimensions: string
    notes: string
  }[]

  // Report metadata
  reportId: string
  generatedAt: string
  hospitalName: string
  departmentName: string
}

export interface CaseStats {
  total: number
  today: number,
  last7Days: number,
  last30Days: number,
}