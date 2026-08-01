import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { data, error } = await supabaseAdmin
    .from("questions")
    .select("*, tests(title)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { test_id, question_text, options, correct_option, explanation } = await request.json();

  if (!test_id || !question_text || !Array.isArray(options) || options.filter(Boolean).length < 2) {
    return NextResponse.json(
      { error: "Test, question text, and at least 2 options are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("questions")
    .insert({
      test_id,
      question_text,
      options: options.filter(Boolean),
      correct_option: Number(correct_option) || 0,
      explanation: explanation || null,
    })
    .select("*, tests(title)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
