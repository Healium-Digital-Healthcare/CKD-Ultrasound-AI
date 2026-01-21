import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    let query = supabase
      .from("notifications")
      .select(`
        *,
        case:cases(id, case_number),
        patient:patients(id, name, patient_id)
      `, { count: "exact" })
      .eq("user_id", user.id)
      .eq("is_read", false)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: notifications, error, count } = await query

    if (error) throw error

    // Get unread count
    const { count: unreadCount } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false)

    return NextResponse.json({
      notifications: notifications || [],
      total: count || 0,
      unread_count: unreadCount || 0,
    })
  } catch (error) {
    console.error("Failed to fetch notifications:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, title, message, case_id, patient_id } = body

    if (!type || !title || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: notification, error } = await supabase
      .from("notifications")
      .insert({
        user_id: user.id,
        type,
        title,
        message,
        case_id: case_id || null,
        patient_id: patient_id || null,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(notification)
  } catch (error) {
    console.error("Failed to create notification:", error)
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
  }
}
