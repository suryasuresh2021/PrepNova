import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { generateQuestions } from "@/lib/anthropic";

export async function POST(request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { topic, count } = await request.json();

  if (!topic) return NextResponse.json({ error: "Topic is required" }, { status: 400 });

  const safeCount = Math.min(Math.max(Number(count) || 5, 1), 20);

  try {
    const questions = await generateQuestions(topic, safeCount);
    return NextResponse.json({ questions });
  } catch (err) {
    console.error("AI question generation failed:", err);
    return NextResponse.json({ error: err.message || "Could not generate questions" }, { status: 500 });
  }
}
