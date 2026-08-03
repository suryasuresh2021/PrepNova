import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PUT(request, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { topic_id, title, explanation, examples, is_premium } = await request.json();

  if (!topic_id || !title || !explanation) {
    return NextResponse.json({ error: "Topic, title, and explanation are required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("concepts")
    .update({
      topic_id,
      title,
      explanation,
      examples: examples || null,
      is_premium: Boolean(is_premium),
    })
    .eq("id", params.id)
    .select("*, topics(name, categories(name))")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { error } = await supabaseAdmin.from("concepts").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ deleted: true });
}
