export interface Patient {
  id: string
  name: string
  patientId: string
  age: number
  sex: "M" | "F"
  severity: "normal" | "mild" | "moderate" | "severe" | "critical"
  scannedOn: string
  lastUpdated: string
  ckdStage?: number
  eGFR?: number
}

export interface UltrasoundScan {
  id: string
  patientId: string
  scanDate: string
  dicomImages: string[]
  thumbnails: string[]
  metadata: {
    hospital: string
    device: string
    technician?: string
  }
}

export interface FunctionalAssessment {
  eGFR: number // 0-150 ml/min/1.73m²
  ckdStage: number // 1-5
  confidence: number // 0-1
}

export interface StructuralFindings {
  hydronephrosis: number // 0-1 probability
  calculi: number // 0-1 probability
  cysts: number // 0-1 probability
  increasedEchogenicity: number // 0-1 probability
  corticalThinning: number // 0-1 probability
  masses: number // 0-1 probability
}

export interface EtiologyClassification {
  diabeticNephropathy: number // 0-1 probability
  hypertensiveNephrosclerosis: number // 0-1 probability
  glomerulonephritis: number // 0-1 probability
  polycysticKidneyDisease: number // 0-1 probability
  hydronephrosisObstruction: number // 0-1 probability
  unknownOther: number // 0-1 probability
}

export interface AIAnalysisResult {
  scanId: string
  functional: FunctionalAssessment
  structural: StructuralFindings
  etiology: EtiologyClassification
  detectedAbnormalities: Array<{
    type: string
    location: { x: number; y: number }
    confidence: number
  }>
  analysisDate: string
  processingTime: number // milliseconds
}

export interface ProgressionData {
  patientId: string
  scans: Array<{
    date: string
    eGFR: number
    stage: number
    scanId: string
  }>
}

export interface Case {
  id: string
  patientId: string
  patientName: string
  age: number
  gender: "M" | "F"
  mrn: string // Medical Record Number
  caseNumber: string
  studyDescription: string
  accessionNumber: string
  studyDate: string
  location: string
  caseTAT: string // Case Turn Around Time
  readType: string
  clientName: string
  dueIn: string
  instructions: string
  totalImages: number
  selectedImages: number
  status: "new" | "expedited" | "stat" | "addendum" | "processing" | "completed" | "reviewed"
  severity: "normal" | "mild" | "moderate" | "severe" | "critical"
  ckdStage?: number
  eGFR?: number
  analysisResult?: AIAnalysisResult
}
