import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { data, error } = await supabaseAdmin
    .from("concepts")
    .select("*, topics(name, categories(name))")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { topic_id, title, explanation, examples, is_premium } = await request.json();

  if (!topic_id || !title || !explanation) {
    return NextResponse.json({ error: "Topic, title, and explanation are required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("concepts")
    .insert({
      topic_id,
      title,
      explanation,
      examples: examples || null,
      is_premium: Boolean(is_premium),
    })
    .select("*, topics(name, categories(name))")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
