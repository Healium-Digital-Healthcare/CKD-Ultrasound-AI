import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

/* -------------------------------------------------------------------------- */
/* Validation                                                                  */
/* -------------------------------------------------------------------------- */

const organizationSchema = z.object({
  name: z.string().min(2),
  organization_type: z.enum([
    "hospital",
    "clinic",
    "private_practice",
    "research",
  ]),
  department: z.string().optional(),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),

  phone_number: z
    .string()
    .min(5, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
})

/* -------------------------------------------------------------------------- */
/* PATCH – Create or Update Organization                                       */
/* -------------------------------------------------------------------------- */

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient()

    // 🔐 Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    // 🧪 Validate body
    const body = await req.json()
    const data = organizationSchema.parse(body)

    // 🔄 Upsert organization (RLS ensures user isolation)
    const { error } = await supabase
      .from("organization")
      .update({
        ...data
      })
      .eq("user_id", user.id)

    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { message: err.message },
        { status: 422 }
      )
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    )
  }

  const { data, error } = await supabase
    .from("organization")
    .select(`*`)
    .eq("user_id", user.id)
    .single()

  if (error && error.code !== "PGRST116") {
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json(data,
    { status: 200 }
  )
}