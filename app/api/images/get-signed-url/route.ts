import { supabase } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path } = body

    if (!path || typeof path !== "string") {
      return NextResponse.json({ error: "File path is required" }, { status: 400 })
    }

    const bucket = "medical-images"

    // Generate signed download URL for the file
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 7) // Valid for 7 days

    if (error) {
      throw new Error(`Failed to create signed URL: ${error.message}`)
    }

    return NextResponse.json({ signedUrl: data.signedUrl })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate signed URL" },
      { status: 500 },
    )
  }
}