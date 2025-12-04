import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { supabase as serviceSupabase } from "@/lib/supabase"

export async function GET(_request: Request, { params }: { params: Promise<{ case_number: string }> }) {
  try {
    const { case_number } = await params
    if(!case_number) {
      return NextResponse.json({ error: "Case number is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: { user }} = await supabase.auth.getUser()
    if(!user) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
    }
    
    // Join patients table to get name and age
    const { data, error } = await supabase
      .from("cases")
      .select(`
        *,
        patient: patients (
          *
        ),
        images: image_analysis (
          id,
          image_path,
          ai_analysis_status,
          ai_analysis_result
        )
      `)
      .eq("case_number", case_number)
      .eq('user_id', user.id)
      .single()


    if (error) throw error

    if (data.images && data.images.length > 0) {
      const signedUrls = await Promise.all(
        data.images.map(async (image: any) => {
          const { data: urlData } = await serviceSupabase
            .storage
            .from('medical-images')
            .createSignedUrl(image.image_path, 14400) // 4 hour expiry
          
          return {
            ...image,
            signed_url: urlData?.signedUrl || null
          }
        })
      )
      
      data.images = signedUrls
    }

    return NextResponse.json(data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching case:", error)
    return NextResponse.json({ error: "Failed to fetch case" }, { status: 500 })
  }
}