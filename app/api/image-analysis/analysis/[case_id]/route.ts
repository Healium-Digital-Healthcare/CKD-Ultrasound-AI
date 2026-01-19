// app/api/cases/[case_id]/analyze/route.ts
import { supabase as serviceSupabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { generateDummyHealiumReport, generateHealiumReportHTML } from "@/lib/services/report-generator"
import { Report } from "@/types/case";

const mockAnalysis = {
  ckdRisk: Math.random() > 0.5 ? "HIGH" : "MODERATE",
  ckdStage: "Stage 3b",
  egfr: Math.floor(Math.random() * 30) + 30,
  confidence: Math.floor(Math.random() * 15) + 85,
  range: "35-50",
  imageQuality: "Good",
  findings: [
    { name: "Hydronephrosis", severity: "Mild", hasIssue: Math.random() > 0.5 },
    { name: "Calculi", severity: "None", hasIssue: false },
    { name: "Cysts", severity: "Moderate", hasIssue: Math.random() > 0.3 },
    { name: "Cortical thin.", severity: "Mild", hasIssue: true },
  ],
  etiology: [
    { name: "Diabetes", percentage: 68 },
    { name: "Glomerulonephritis", percentage: 10 },
    { name: "Hydronephrosis", percentage: 6 },
    { name: "Hypertension", percentage: 9 },
    { name: "Polycystic", percentage: 7 },
  ],
  notes: "",
}

const mapCkdRiskToSeverity = (ckdRisk: string): string => {
  switch (ckdRisk) {
    case "HIGH":
      return "severe"
    case "MODERATE":
      return "moderate"
    case "LOW":
      return "normal"
    case "CRITICAL":
      return "critical"
    default:
      return "moderate"
  }
}


export async function POST(request: NextRequest, { params }: { params: Promise<{ case_id: string }> }) {
  try {
    const { case_id } = await params

    if (!case_id) {
      return NextResponse.json({ error: "Case ID is required" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
    }

    const { data: organization, error: orgError } = await supabase
    .from('organization')
    .select('*')
    .eq('user_id', user.id)
    .single()

    if(!organization || orgError) {
      return NextResponse.json({error: "Organization details not found"}, { status: 400 })
    }

    const { data: caseDetial, error: caseDetailError} = await supabase
    .from('cases')
    .select(`
      *,
      patient:patients!inner(patient_id, name, age, sex)
    `)
    .eq('id', case_id)
    .single()

    if(!caseDetial || caseDetailError) {
      return NextResponse.json({error: "Case not found"}, { status: 400 })
    }
    
    // Get all images for this case
    const { data: images, error: imagesError } = await supabase
      .from("image_analysis")
      .select("*")
      .eq("case_id", case_id)
      .order("created_at", { ascending: true })

    if (imagesError || !images || images.length === 0) {
      return NextResponse.json({ error: "No images found for this case" }, { status: 404 })
    }

    // Call AI analysis API for each image (mock implementation for now)
    const updatedImages = []
    for (const image of images) {
      const report:Report = {
          generalDetails: {
            patientName: caseDetial.patient.name,
            centre: organization.name,
            referringPhysician: "Unknown",
            age: caseDetial.patient.age,
            gender: caseDetial.patient.sex,
            reportGenerationDate: new Date().toDateString(),
            scanDate: new Date(caseDetial.study_date).toDateString(),
            patientId: caseDetial.patient.patient_id
          },
          clinicalHistory: {
            chiefComplaint: "Bilateral flank pain, reduced urine output",
            diabetesMellitus: "Yes (Type 2, 12 years)",
            hypertension: "Yes (8 years, on medication)",
            familyHistory: "Father — ESRD on dialysis",
            previousKidneyIssues: "Kidney stone (2019, passed)",
            currentMedications: "Metformin, Amlodipine, Losartan",
          },
          aiScores: {
            predictedEgfr: mockAnalysis.egfr,
            ckdStatus: "YES",
            ckdStage: mockAnalysis.ckdStage,
            modelConfidence: mockAnalysis.confidence,
            imageQuality: mockAnalysis.imageQuality,
          },
          morphology: {
            rightKidney: {
              length: 9.8,
              width: 4.2,
              corticalThickness: 0.9,
              echogenicity: "Increased",
              cmd: "Reduced",
              hydronephrosis: "None",
              stones: 0,
              cysts: "No",
            },
            leftKidney: {
              length: 10.2,
              width: 4.5,
              corticalThickness: 0.8,
              echogenicity: "Increased",
              cmd: "Reduced",
              hydronephrosis: "Mild (Grade I)",
              stones: 2,
              cysts: "Yes (1.2 cm)",
            },
          },
          etiologyClassification: [
            { name: "Hypertensive Nephrosclerosis", percentage: 82, confidence: "High" },
            { name: "Diabetic Nephropathy", percentage: 78, confidence: "High" },
            { name: "Obstructive Uropathy", percentage: 45, confidence: "Moderate" },
            { name: "Glomerulonephritis", percentage: 12, confidence: "Low" },
            { name: "Polycystic Kidney Disease", percentage: 8, confidence: "Low" },
          ],
          structuralFindings: [
            {
              name: "Hydronephrosis",
              present: true,
              status: "Present",
              location: "Left Kidney",
              clinicalSignificance: "Mild (Grade I), likely secondary to distal obstruction",
            },
            { name: "Calculi", present: false, status: "Absent", location: "—", clinicalSignificance: "—" },
            {
              name: "Cysts",
              present: true,
              status: "Present",
              location: "Left Kidney, Lower Pole",
              clinicalSignificance: "Simple cyst (1.2 cm), Bosniak I — benign",
            },
            {
              name: "Increased Echogenicity",
              present: true,
              status: "Present",
              location: "Bilateral",
              clinicalSignificance: "Consistent with chronic parenchymal disease",
            },
            {
              name: "Cortical Thinning",
              present: true,
              status: "Present",
              location: "Bilateral",
              clinicalSignificance: "< 1 cm, indicative of chronic damage",
            },
            { name: "Masses", present: false, status: "Absent", location: "—", clinicalSignificance: "—" },
          ],
          stoneDetection: {
            stones: [
              {
                number: 1,
                location: "Left Kidney — Lower Pole",
                size: "4.2 mm",
                confidence: 96,
                characteristics: "Echogenic focus with posterior shadowing",
              },
              {
                number: 2,
                location: "Left Kidney — Mid Pole",
                size: "2.8 mm",
                confidence: 89,
                characteristics: "Small echogenic focus, minimal shadowing",
              },
            ],
            totalStones: 2,
            largestStone: "4.2 mm — Lower Pole",
            recommendedAction: "Conservative management, increased hydration, follow-up in 3 months",
          },
          clinicalImpression: {
            rightKidney:
              "The right kidney measures 9.8 × 4.2 cm with preserved size but shows signs of chronic parenchymal changes. Cortical thickness is reduced at 0.9 cm with increased echogenicity and poor corticomedullary differentiation. No hydronephrosis, stones, or masses detected.",
            leftKidney:
              "The left kidney measures 10.2 × 4.5 cm with similar chronic changes as the right. Cortical thickness is further reduced at 0.8 cm. Mild grade I hydronephrosis is present, likely secondary to distal obstruction from identified stones. Two stones detected: 4.2 mm (lower pole) and 2.8 mm (mid pole). A simple cortical cyst (1.2 cm, Bosniak I) is noted in the lower pole.",
            overall:
              "Bilateral chronic kidney disease with evidence of advanced parenchymal damage consistent with Stage 3b CKD. Primary etiologies are likely hypertensive nephrosclerosis and diabetic nephropathy given patient history and imaging findings. Left-sided hydronephrosis and stone burden require urological evaluation.",
          },
          recommendations: [
            "Urgent nephrology referral for CKD Stage 3b management and treatment optimization",
            "Urology consultation for left-sided stone management and hydronephrosis evaluation",
            "Comprehensive metabolic panel including serum creatinine, BUN, electrolytes",
            "24-hour urine protein quantification to assess proteinuria",
            "Strict blood pressure and glucose control with medication adjustment as needed",
            "Dietary modifications: low sodium, protein restriction, adequate hydration",
            "Follow-up ultrasound in 3 months to monitor stone progression and hydronephrosis",
            "Consider CT urography if hydronephrosis persists or worsens",
          ],
          images: [
            {
              id: "1",
              kidney: "right",
              view: "Longitudinal",
              dimensions: "9.8 × 4.2 cm",
              notes: "No stones detected | Echogenicity: Increased",
            },
            {
              id: "2",
              kidney: "left",
              view: "Longitudinal",
              dimensions: "10.2 × 4.5 cm",
              notes: "2 stones detected | Mild hydronephrosis",
            },
            {
              id: "3",
              kidney: "right",
              view: "Transverse",
              dimensions: "4.2 × 3.8 cm",
              notes: "Reduced CMD | Cortical thinning",
            },
            {
              id: "4",
              kidney: "left",
              view: "Transverse",
              dimensions: "4.5 × 4.1 cm",
              notes: "Simple cyst (1.2 cm) | Grade I hydronephrosis",
            },
          ],
          reportId: `${caseDetial.case_number}${Date.now()}`,
          generatedAt: new Date().toDateString(),
          hospitalName: organization.name,
          departmentName: organization.department || "",
      }
      
      const reportHTML = generateHealiumReportHTML(report)

      // Update image with analysis and report
      const { data: updatedImage, error } = await supabase
        .from("image_analysis")
        .update({
          ai_analysis_status: "completed",
          ai_analysis_result: mockAnalysis,
          report: report,
          report_html: reportHTML, // Store generated HTML
        })
        .eq("id", image.id)
        .select()
        .single()
      if (error) {
        console.error("Error updating image analysis:", error)
        continue
      }
      updatedImages.push(updatedImage)
    }

    // Update case to mark as analyzed
    await supabase
      .from("cases")
      .update({
        analyzed_by_ai: true,
        updated_at: new Date().toISOString(),
        status: "completed",
      })
      .eq("id", case_id)

    await supabase
      .from("patients")
      .update({
        egfr: mockAnalysis.egfr,
        scanned_on: caseDetial.study_date,
        severity: mapCkdRiskToSeverity(mockAnalysis.ckdRisk),
        last_updated: new Date().toISOString(),
        ckd_stage: mockAnalysis.ckdStage,
      })
      .eq("id", caseDetial.patient.id)

    return NextResponse.json({
      success: true,
      message: "Analysis completed successfully",
      images: updatedImages,
    })
  } catch (error) {
    console.error("[v0] Error running analysis:", error)
    return NextResponse.json(
      { error: "Failed to run analysis", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ case_id: string }> }) {
  try {
    const { case_id } = await params;

    if (!case_id) {
      return NextResponse.json({ error: "Case ID is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });
    }

    // Fetch all image_analysis for this case
    const { data: images, error } = await supabase
      .from("image_analysis")
      .select(`
        id,
        image_path,
        kidney_type,
        ai_analysis_status,
        ai_analysis_result,
        report,
        report_html
      `)
      .eq("case_id", case_id);

    if (error) throw error;
    if (!images || images.length === 0) {
      return NextResponse.json({ error: "No images found for this case" }, { status: 404 });
    }

    // Generate signed URLs
    const signedImages = await Promise.all(
      images.map(async (img: any) => {
        const { data: urlData } = await serviceSupabase
          .storage
          .from("medical-images")
          .createSignedUrl(img.image_path, 14400); // 4h expiry

        return {
          ...img,
          signed_url: urlData?.signedUrl || null,
        };
      })
    );

    return NextResponse.json(signedImages);
  } catch (err) {
    console.error("[API] Error fetching images:", err);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}