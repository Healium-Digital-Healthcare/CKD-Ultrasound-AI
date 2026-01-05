import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/patients/stats
 * Fetches aggregated patient statistics for the authenticated user.
 */

export async function GET(request: NextRequest) {
  try {
    // 1. Initialize Supabase client and authenticate user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized user" }, 
        { status: 401 }
      )
    }

    // 2. Fetch only the 'severity' column for all patients belonging to this user
    // This is much faster than fetching full records (*).
    const { data: patients, error } = await supabase
      .from("patients")
      .select("severity")
      .eq("user_id", user.id)

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    // 3. Calculate groupings based on your business logic
    // Stable: normal or mild
    // Critical: critical
    // Recovering: moderate or severe
    const stats = {
      total: patients.length,
      stable: patients.filter(
        (p) => p.severity === "normal" || p.severity === "mild"
      ).length,
      critical: patients.filter(
        (p) => p.severity === "critical"
      ).length,
      recovering: patients.filter(
        (p) => p.severity === "moderate" || p.severity === "severe"
      ).length,
    }

    // 4. Return the aggregated data
    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error in /api/patients/stats:', error)
    return NextResponse.json(
      { error: "Failed to fetch patient statistics" }, 
      { status: 500 }
    )
  }
}
