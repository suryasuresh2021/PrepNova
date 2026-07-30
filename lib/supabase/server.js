import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Use this inside Server Components and app/api/**/route.js files.
// Reads the logged-in user's session from cookies (set by middleware.js).
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component that can't set cookies directly —
            // safe to ignore since middleware.js already refreshes the session.
          }
        },
      },
    }
  );
}
