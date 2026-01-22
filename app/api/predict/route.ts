import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const caseId = formData.get("caseId") as string
    const imageFile = formData.get("image") as File

    if (!caseId || !imageFile) {
      return NextResponse.json({ error: "Case ID and image file are required" }, { status: 400 })
    }

    console.log("Starting AI prediction for case:", caseId)

    const fastApiFormData = new FormData()
    fastApiFormData.append("file", imageFile)
    fastApiFormData.append("case_id", caseId)

    const fastApiUrl = process.env.FASTAPI_URL || "http://localhost:8000"
    console.log("Calling FastAPI at:", `${fastApiUrl}/predict`)

    const response = await fetch(`${fastApiUrl}/predict`, {
      method: "POST",
      body: fastApiFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("FastAPI error:", errorText)
      throw new Error(`FastAPI returned ${response.status}: ${errorText}`)
    }

    const predictionResult = await response.json()
    console.log("Received prediction result:", predictionResult)

    const aiAnalysis = {
      egfr: predictionResult.egfr,
      findings: predictionResult.findings,
      disease: predictionResult.disease,
      disease_predicted: predictionResult.disease_predicted
    }

    const supabase = await createClient()
    const { data: updatedCase, error: updateError } = await supabase
      .from("cases")
      .update({
        ai_analysis: aiAnalysis,
        status: "completed",
        severity: determineSeverity(aiAnalysis.egfr),
        ckd_stage: determineCKDStage(aiAnalysis.egfr),
        egfr: aiAnalysis.egfr,
        updated_at: new Date().toISOString(),
      })
      .eq("id", caseId)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating case:", updateError)
      throw new Error("Failed to update case with AI analysis")
    }

    console.log("Successfully updated case with AI analysis")

    return NextResponse.json({
      success: true,
      aiAnalysis,
      case: {
        id: updatedCase.id,
        status: updatedCase.status,
        severity: updatedCase.severity,
        ckdStage: updatedCase.ckd_stage,
        eGFR: updatedCase.egfr,
        aiAnalysis: updatedCase.ai_analysis,
      },
    })
  } catch (error) {
    console.error("Error calling prediction API:", error)
    return NextResponse.json(
      { error: "Failed to get AI prediction", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

function determineSeverity(egfr: number): "normal" | "mild" | "moderate" | "severe" | "critical" {
  if (egfr >= 90) return "normal"
  if (egfr >= 60) return "mild"
  if (egfr >= 30) return "moderate"
  if (egfr >= 15) return "severe"
  return "critical"
}

function determineCKDStage(egfr: number): number {
  if (egfr >= 90) return 1
  if (egfr >= 60) return 2
  if (egfr >= 30) return 3
  if (egfr >= 15) return 4
  return 5
}
