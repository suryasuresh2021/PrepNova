import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function getAccessContext() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, isPremium: false };

  const { data: sub } = await supabaseAdmin
    .from("subscriptions")
    .select("plan, status")
    .eq("email", user.email)
    .maybeSingle();

  const isPremium = sub?.status === "active" && sub?.plan === "premium";
  return { user, isPremium };
}

export function canAccessTest(test, isPremium) {
  return test.price_inr === 0 || isPremium;
}
