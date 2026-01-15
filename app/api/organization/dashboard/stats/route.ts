import { createClient } from "@/lib/supabase/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
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
        ai_analysis_result
      `)
      .eq("user_id", user.id)
      .gte("study_date", startOfToday.toISOString())
      .lt("study_date", startOfTomorrow.toISOString())

    if (error) throw error

    let ckdDetected = 0
    let normal = 0

    for (const c of cases ?? []) {
      if (c.ai_analysis_result?.ckdRisk === "HIGH") {
        ckdDetected++
        break
      }
      if (c.ai_analysis_result?.ckdRisk === "LOW") {
        normal++
        break
      }
    }

    return NextResponse.json({
      total: cases?.length ?? 0,
      ckdDetected,
      normal,
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
