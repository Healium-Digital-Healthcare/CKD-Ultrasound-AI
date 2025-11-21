import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from("cases")
      .select(`*,
        patient:patients!inner(name, age, sex)
      `, { count: 'exact' })
      .order("created_at", { ascending: false })

    if (search) {
      // AND search (safe)
      query = query.ilike('case_number', `%${search}%`).ilike('patient.name', `%${search}%`)
    }

    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      data,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error("[v0] Error fetching cases:", error)
    return NextResponse.json({ error: "Failed to fetch cases" }, { status: 500 })
  }
}



export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    let patientId = body.patient_id;

    if (body.patient_type === "new") {
      const { data: newPatient, error: patientError } = await supabase
        .from("patients")
        .insert({
          name: body.patient_name,
          age: parseInt(body.patient_age),
          sex: body.patient_gender,
          patient_id:
            `${new Date().toISOString().slice(0, 10).replace(/-/g, "")}` +
            `${Math.floor(1000 + Math.random() * 9000)}`,
        })
        .select()
        .single();

      if (patientError) throw patientError;

      patientId = newPatient.id;
    }

    // 1️⃣ CREATE CASE
    const { data: caseData, error: caseError } = await supabase
      .from("cases")
      .insert({
        patient_id: patientId,
        study_description: body.study_description,
        study_date: body.study_date,
        case_number:
          `${new Date().toISOString().slice(0, 10).replace(/-/g, "")}` +
          `${Math.floor(1000 + Math.random() * 9000)}`,
        total_images: body.images.length,
        selected_images: body.images.length,
      })
      .select()
      .single();

    if (caseError) throw caseError;

    const caseId = caseData.id;

    // 2️⃣ CREATE IMAGE ANALYSIS ROWS (one per image)
    const imageAnalysisRows = body.images.map((img: string) => ({
      case_id: caseId,
      image_path: img,
      ai_analysis_status: "pending",
      ai_analysis_result: null,
    }));

    const { data: analysisData, error: analysisError } = await supabase
      .from("image_analysis")
      .insert(imageAnalysisRows)
      .select();

    if (analysisError) throw analysisError;

    // 3️⃣ FORMAT RESPONSE
    return NextResponse.json(
      {
        
        id: caseData.id,
        patient_id: caseData.patient_id,
        study_description: caseData.study_description,
        study_date: caseData.study_date,
        case_number: caseData.case_number,
        images: caseData.images,
        status: caseData.status,
        total_images: caseData.total_images,
        selected_images: caseData.selected_images,
        created_at: caseData.created_at,
        updated_at: caseData.updated_at,
        image_analysis: analysisData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating case:", error);
    return NextResponse.json(
      { error: "Failed to create case" },
      { status: 500 }
    );
  }
}
