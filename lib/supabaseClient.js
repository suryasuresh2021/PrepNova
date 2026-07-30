import { createClient } from "@supabase/supabase-js";

// Uses the public anon key — safe to expose in the browser.
// Row Level Security policies (see supabase/schema.sql) control what it can read/write.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
