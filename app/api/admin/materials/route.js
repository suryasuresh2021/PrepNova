import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { data, error } = await supabaseAdmin
    .from("materials")
    .select("*, categories(name), topics(name)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { category_id, topic_id, title, description, material_type, url, video_url, content, is_premium } =
    await request.json();

  if (!category_id || !title) {
    return NextResponse.json({ error: "Category and title are required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("materials")
    .insert({
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
    .select("*, categories(name), topics(name)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
