import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') || 'all' // 'all' | 'patients' | 'studies'
    const limit = parseInt(searchParams.get('limit') || '5')

    if (!query || query.length < 2) {
      return NextResponse.json({ patients: [], studies: [] })
    }

    const results: { patients: any[], studies: any[] } = { patients: [], studies: [] }

    // Search patients
    if (type === 'all' || type === 'patients') {
      const { data: patients, error: patientsError } = await supabase
        .from("patients")
        .select("id, name, patient_id, age, sex")
        .eq("user_id", user.id)
        .or(`patient_id.ilike.%${query}%,name.ilike.%${query}%`)
        .limit(limit)

      if (!patientsError && patients) {
        results.patients = patients
      }
    }

    // Search studies/cases
    if (type === 'all' || type === 'studies') {
      const { data: studies, error: studiesError } = await supabase
        .from("cases")
        .select(`
          id,
          case_number,
          study_date,
          patient:patients!inner(name, patient_id)
        `)
        .eq("user_id", user.id)
        .ilike("case_number", `%${query}%`)
        .limit(limit)

      if (!studiesError && studies) {
        results.studies = studies
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
