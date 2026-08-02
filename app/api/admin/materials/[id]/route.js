import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PUT(request, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { category_id, topic_id, title, description, material_type, url, video_url, content, is_premium } =
    await request.json();

  if (!category_id || !title) {
    return NextResponse.json({ error: "Category and title are required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("materials")
    .update({
      category_id,
      topic_id: topic_id || null,
      title,
      description: description || "",
      material_type: material_type || "link",
      url: url || null,
      video_url: video_url || null,
      content: content || null,
      is_premium: Boolean(is_premium),
    })
    .eq("id", params.id)
    .select("*, categories(name), topics(name)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { error } = await supabaseAdmin.from("materials").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ deleted: true });
}
