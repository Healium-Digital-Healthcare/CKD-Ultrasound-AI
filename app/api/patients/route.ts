import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { Patient } from "@/types/patient"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }} = await supabase.auth.getUser()
    
    if(!user) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from("patients")
      .select(`*`, { count: 'exact' })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false})

    if(search) {
      // OR search (safe)
      if (search) {
        query = query.or(`patient_id.ilike.%${search}%,name.ilike.%${search}%`)
      }

    }

    query = query.range(from, to)

    const { data, error, count} = await query

    if (error) throw error

    return NextResponse.json({
      data,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.log('errrr', error)
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }} = await supabase.auth.getUser()

    if(!user) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
    }

    const body = (await request.json()) as Partial<Patient>

    const { data, error } = await supabase
      .from("patients")
      .insert({
        name: body.name,
        patient_id: body.patient_id,
        age: body.age,
        sex: body.sex,
        severity: body.severity,
        scanned_on: body.scanned_on || new Date().toISOString(),
        last_updated: new Date().toISOString(),
        ckd_stage: body.ckd_stage,
        egfr: body.egfr,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 })
  }
}