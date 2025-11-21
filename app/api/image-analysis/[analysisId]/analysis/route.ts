import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(_request: Request, { params }: { params: Promise<{ analysisId: string }> }) {
  try {
    const { analysisId } = await params
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("image_analysis")
      .select(`*`)
      .eq("id", analysisId)
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching case:", error)
    return NextResponse.json({ error: "Failed to fetch case" }, { status: 500 })
  }
}