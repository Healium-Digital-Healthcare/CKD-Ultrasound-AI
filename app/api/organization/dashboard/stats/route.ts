import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // ---- Today range (server-side filtering) ----
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfTomorrow = new Date(startOfToday)
    startOfTomorrow.setDate(startOfToday.getDate() + 1)

    const { data: cases, error } = await supabase
      .from("cases")
      .select(`
        id,
        image_analysis (
          ai_analysis_result
        )
      `)
      .eq("user_id", user.id)
      .gte("study_date", startOfToday.toISOString())
      .lt("study_date", startOfTomorrow.toISOString())

    if (error) throw error

    const { count: newPatients, error: patientsError } = await supabase
      .from("patients")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startOfToday.toISOString())
      .lt("created_at", startOfTomorrow.toISOString())

    if (patientsError) throw patientsError

    let ckdDetected = 0
    let normal = 0

    for (const c of cases ?? []) {
      for (const img of c.image_analysis ?? []) {
        if (img.ai_analysis_result?.ckdRisk === "HIGH") {
          ckdDetected++
          break
        }
        if (img.ai_analysis_result?.ckdRisk === "LOW") {
          normal++
          break
        }
      }
    }

    return NextResponse.json({
      total: cases?.length ?? 0,
      ckdDetected,
      normal,
      newPatients: newPatients ?? 0,
      range: "today",
    })
  } catch (error) {
    console.error("[dashboard-stats] error:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    )
  }
}
