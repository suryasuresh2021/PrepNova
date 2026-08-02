import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PUT(request, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { topic, topic_id, title, description, price_inr } = await request.json();

  if (!topic || !title) {
    return NextResponse.json({ error: "Topic and title are required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("tests")
    .update({
      topic,
      topic_id: topic_id || null,
      title,
      description: description || "",
      price_inr: Number(price_inr) || 0,
    })
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { error } = await supabaseAdmin.from("tests").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ deleted: true });
}
