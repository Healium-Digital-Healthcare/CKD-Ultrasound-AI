// app/api/cases/[case_id]/analyze/route.ts
import { supabase as serviceSupabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

function generateReport(analysis: any, kidneyType: string): any {
  const findings = analysis?.findings || {}
  const ckdRisk = analysis?.ckdRisk || "MODERATE"
  const egfr = analysis?.egfr || 60
  const ckdStage = analysis?.ckdStage || "Stage 3a"

  return {
    findings: {
      size: egfr < 45 ? "Slightly reduced" : "Normal",
      echogenicity: ckdRisk === "HIGH" ? "Increased" : "Normal",
      cortex: findings.cortical_thinning > 0.5 ? "8 mm (reduced)" : "Normal thickness",
      hydronephrosis: findings.hydronephrosis > 0.5 ? "Mild to moderate" : "None",
      calculi: findings.calculi > 0.5 ? "Present" : "None",
      cysts: findings.cysts > 0.5 ? "Present" : "None",
    },
    assessment: `The bilateral renal changes are consistent with chronic kidney disease. The ${
      ckdRisk === "HIGH" ? "increased echogenicity and reduced" : "maintained"
    } corticomedullary differentiation suggest ${
      ckdRisk === "HIGH" ? "chronic parenchymal damage" : "early renal changes"
    }. Estimated GFR of ${egfr} mL/min/1.73m² indicates CKD ${ckdStage}.`,
    impression: [
      `Chronic kidney disease, ${ckdStage} (${ckdRisk.toLowerCase()} risk)`,
      ...(analysis?.etiology || []).slice(0, 2).map((e: any) => `${e.name} - ${e.percentage}% probability`),
    ],
    recommendations: [
      "Nephrology consultation recommended",
      "Serial monitoring of renal function",
      "Blood pressure optimization",
      ...(ckdRisk === "HIGH" ? ["Urgent follow-up within 1 week"] : []),
    ],
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ case_id: string }> }) {
  try {
    const { case_id } = await params

    if (!case_id) {
      return NextResponse.json({ error: "Case ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

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
      // Mock AI analysis result - in production, call your AI service
      const mockAnalysis = {
        ckdRisk: Math.random() > 0.5 ? "HIGH" : "MODERATE",
        ckdStage: "Stage 3b",
        egfr: Math.floor(Math.random() * 30) + 30,
        confidence: Math.floor(Math.random() * 15) + 85,
        range: "35-50",
        findings: [
          { name: "Hydronephrosis", severity: "Mild", hasIssue: Math.random() > 0.5 },
          { name: "Calculi", severity: "None", hasIssue: false },
          { name: "Cysts", severity: "Moderate", hasIssue: Math.random() > 0.3 },
          { name: "Cortical thin.", severity: "Mild", hasIssue: true },
        ],
        etiology: [
          { name: "Medical_CKD", percentage: 68 },
          { name: "Hydronephrosis", percentage: 24 },
          { name: "Polycystic", percentage: 8 },
        ],
        notes: "",
      }

      const report = generateReport(mockAnalysis, image.kidney_type)

      // Update image with analysis and report
      const { data: updatedImage, error } = await supabase
        .from("image_analysis")
        .update({
          ai_analysis_status: "completed",
          ai_analysis_result: mockAnalysis,
          report: report, // Store generated report
        })
        .eq("id", image.id)
        .select()
        .single()

        console.log('errrr',error)

      updatedImages.push(updatedImage)
    }

    // Update case to mark as analyzed
    await supabase
      .from("cases")
      .update({
        analyzed_by_ai: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", case_id)

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
        ai_analysis_result
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