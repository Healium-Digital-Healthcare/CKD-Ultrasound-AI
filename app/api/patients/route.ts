import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { Patient } from "@/types/patient"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("patients").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching patients:", error)
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
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
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating patient:", error)
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 })
  }
}
