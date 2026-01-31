import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const supabase = await createClient()
    const { jobId } = await params

    // Get job progress from database
    const { data, error } = await supabase
      .from("ai_jobs")
      .select("*")
      .eq("id", jobId)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: data.id,
      case_id: data.case_id,
      status: data.status,
      progress: data.progress,
      error_message: data.error_message,
      started_at: data.started_at,
      completed_at: data.completed_at,
    })
  } catch (error) {
    console.error("Error fetching job progress:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
