import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { test_id, questions } = await request.json();

  if (!test_id || !Array.isArray(questions) || questions.length === 0) {
    return NextResponse.json({ error: "A test and at least one question are required" }, { status: 400 });
  }

  const rows = questions
    .filter((q) => q.question_text && Array.isArray(q.options) && q.options.filter(Boolean).length >= 2)
    .map((q) => ({
      test_id,
      question_text: q.question_text,
      options: q.options.filter(Boolean),
      correct_option: Number(q.correct_option) || 0,
      explanation: q.explanation || null,
    }));

  if (rows.length === 0) {
    return NextResponse.json({ error: "No valid questions to insert" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.from("questions").insert(rows).select("id");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ inserted: data.length });
}
