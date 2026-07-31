import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAccessContext, canAccessTest } from "@/lib/testAccess";

export async function GET(request, { params }) {
  const { user, isPremium } = await getAccessContext();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const { data: test } = await supabaseAdmin.from("tests").select("*").eq("id", params.id).single();
  if (!test) return NextResponse.json({ error: "Test not found" }, { status: 404 });

  if (!canAccessTest(test, isPremium)) {
    return NextResponse.json({ error: "Premium required", requiresPremium: true }, { status: 403 });
  }

  // Deliberately select only these columns — correct_option is never sent before submission.
  const { data: questions, error } = await supabaseAdmin
    .from("questions")
    .select("id, question_text, options")
    .eq("test_id", params.id)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ test, questions });
}
