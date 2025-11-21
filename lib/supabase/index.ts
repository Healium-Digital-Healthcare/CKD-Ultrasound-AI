import { createClient } from "@supabase/supabase-js"

// Use service role key for server-side operations that require elevated permissions
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PRIVATE_SUPABASE_SERVICE_ROLE_KEY!
)