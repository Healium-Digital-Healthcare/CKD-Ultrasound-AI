import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params
    if(!id) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // ✅ Auth check (important)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // ✅ Call RPC
    const { data, error } = await supabase.rpc(
      "get_patient_egfr_timeline",
      {
        p_patient_id: id,
      }
    )

    if (error) {
      console.error("RPC error:", error)
      return NextResponse.json(
        { error: "Failed to fetch eGFR timeline" },
        { status: 500 }
      )
    }

    return NextResponse.json(data ?? [])
  } catch (err) {
    console.error("API error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
