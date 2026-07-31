import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { data, error } = await supabaseAdmin
    .from("topics")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { name, category_id } = await request.json();
  if (!name || !category_id) {
    return NextResponse.json({ error: "Name and category are required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("topics")
    .insert({ name, category_id })
    .select("*, categories(name)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
