import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ analysisId: string }> }) {
  try {
    const { analysisId } = await params
    if(!analysisId) {
      return NextResponse.json({
        error: "Analysis ID is required!",
        status: 400
      })
    }

    const { measurements } = await request.json()

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
      .update({ measurements })
      .eq("id", analysisId)
      .select()
      .single()

    if (error) {
      console.error("Error saving measurements:", error)
      return NextResponse.json({ error: "Failed to save measurements" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Measurements save error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
