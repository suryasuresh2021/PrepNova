import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { data, error } = await supabaseAdmin
    .from("tests")
    .select("*, questions(count)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const withCounts = (data || []).map((t) => ({
    ...t,
    questions_count: t.questions?.[0]?.count ?? 0,
    questions: undefined,
  }));

  return NextResponse.json(withCounts);
}

export async function POST(request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { topic, topic_id, title, description, price_inr } = await request.json();

  if (!topic || !title) {
    return NextResponse.json({ error: "Topic and title are required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("tests")
    .insert({ topic, topic_id: topic_id || null, title, description: description || "", price_inr: Number(price_inr) || 0 })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
