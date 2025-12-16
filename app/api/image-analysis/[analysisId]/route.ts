import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ analysisId: string }> }) {
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

    // Get the image path before deleting
    const { data: imageData, error: fetchError } = await supabase
      .from("image_analysis")
      .select("image_path")
      .eq("id", analysisId)
      .single()

    // Delete from storage
    if (imageData?.image_path) {
      await supabase.storage.from("medical-images").remove([imageData.image_path])
    }

    // Delete from database
    const { error: deleteError } = await supabase.from("image_analysis").delete().eq("id", analysisId).eq("user_id", user.id)

    if (deleteError) {
      return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


export async function PUT(_request: Request, { params }: { params: Promise<{ analysisId: string }> }) {
  try {
    const { analysisId } = await params
    if (!analysisId) {
      return NextResponse.json({ error: "Analysis ID is required" }, { status: 400 })
    }

    const body = await _request.json()
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("image_analysis")
      .update({
        ai_analysis_result: body.ai_analysis_result,
      })
      .eq("id", analysisId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating image analysis:", error)
    return NextResponse.json({ error: "Failed to update image analysis" }, { status: 500 })
  }
}