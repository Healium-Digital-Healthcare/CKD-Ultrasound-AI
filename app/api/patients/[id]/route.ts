import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if(!id) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user }} = await supabase.auth.getUser()
    
    if(!user) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
    }
    
    const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching patient:", error)
    return NextResponse.json({ error: "Failed to fetch patient" }, { status: 500 })
  }
}

export async function PUT(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if(!id) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 })
    }
    
    const body = await _request.json()
    const supabase = await createClient()
    const { data: { user }} = await supabase.auth.getUser()
    
    if(!user) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
    }

    const { data, error } = await supabase
    .from("patients")
    .update(body)
    .eq("id", id)
    .eq("user_id", user.id)
    .select().single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update patient" }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if(!id) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user }} = await supabase.auth.getUser()
    
    if(!user) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
    }
    const { error } = await supabase
    .from("patients")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting patient:", error)
    return NextResponse.json({ error: "Failed to delete patient" }, { status: 500 })
  }
}
