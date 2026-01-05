import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
    }

    // Fetch all cases for this user to calculate date-based stats
    // We only select 'study_date' to keep the payload small
    const { data: cases, error, count } = await supabase
      .from("cases")
      .select("study_date", { count: 'exact' })
      .eq("user_id", user.id)

    if (error) throw error

    const now = new Date()
    // Start of today (00:00:00)
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    
    // 7 days ago from today's start
    const sevenDaysAgo = todayStart - 7 * 24 * 60 * 60 * 1000
    
    // 30 days ago from today's start
    const thirtyDaysAgo = todayStart - 30 * 24 * 60 * 60 * 1000

    const stats = {
      total: count || 0,
      today: 0,
      last7Days: 0,
      last30Days: 0,
    }

    cases.forEach((c) => {
      if (!c.study_date) return
      
      // Parse the study_date from the database
      const studyDate = new Date(c.study_date).getTime()

      // Today: study_date is today or later
      if (studyDate >= todayStart) {
        stats.today++
      }

      // Last 7 Days: study_date is within the last 7 days
      if (studyDate >= sevenDaysAgo) {
        stats.last7Days++
      }

      // Last 30 Days: study_date is within the last 30 days
      if (studyDate >= thirtyDaysAgo) {
        stats.last30Days++
      }
    })

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching case stats:', error)
    return NextResponse.json({ error: "Failed to fetch case statistics" }, { status: 500 })
  }
}


