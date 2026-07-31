import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAccessContext, canAccessTest } from "@/lib/testAccess";

export async function POST(request, { params }) {
  const { user, isPremium } = await getAccessContext();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const { data: test } = await supabaseAdmin.from("tests").select("*").eq("id", params.id).single();
  if (!test) return NextResponse.json({ error: "Test not found" }, { status: 404 });

  if (!canAccessTest(test, isPremium)) {
    return NextResponse.json({ error: "Premium required" }, { status: 403 });
  }

  const { answers, time_taken_seconds } = await request.json();

  // Scoring happens here, server-side, against the real correct_option —
  // the client never receives correct answers until this response.
  const { data: questions, error } = await supabaseAdmin
    .from("questions")
    .select("id, question_text, options, correct_option")
    .eq("test_id", params.id)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let score = 0;
  const results = questions.map((q) => {
    const selected = answers?.[q.id] ?? null;
    const isCorrect = selected === q.correct_option;
    if (isCorrect) score += 1;
    return {
      id: q.id,
      question_text: q.question_text,
      options: q.options,
      correct_option: q.correct_option,
      selected,
      isCorrect,
    };
  });

  await supabaseAdmin.from("test_attempts").insert({
    test_id: params.id,
    email: user.email,
    score,
    total_questions: questions.length,
    time_taken_seconds: Number(time_taken_seconds) || null,
  });

  return NextResponse.json({ score, total: questions.length, results });
}
