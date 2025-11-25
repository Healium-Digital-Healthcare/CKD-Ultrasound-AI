import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(_request: Request, { params }: { params: Promise<{ analysisId: string }> }) {
  try {
    const { analysisId } = await params
    if(!analysisId) {
      return NextResponse.json({
        error: "Analysis ID is required!",
        status: 400
      })
    }

    const supabase = await createClient()

    const { data: { user }} = await supabase.auth.getUser()
    if(!user) {
      return NextResponse.json({
        error: "Unauthorized user!",
        status: 401
      })
    }

    const { data, error } = await supabase
      .from("image_analysis")
      .select(`*`)
      .eq("id", analysisId)
      .eq("user_id", user.id)
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch case" }, { status: 500 })
  }
}