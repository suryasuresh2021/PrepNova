import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAccessContext, canAccessMaterial } from "@/lib/testAccess";

export async function POST(request, { params }) {
  const { user, isPremium } = await getAccessContext();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const { data: material } = await supabaseAdmin.from("materials").select("*").eq("id", params.id).single();
  if (!material) return NextResponse.json({ error: "Material not found" }, { status: 404 });
  if (!canAccessMaterial(material, isPremium)) {
    return NextResponse.json({ error: "Premium required" }, { status: 403 });
  }

  const { data: existing } = await supabaseAdmin
    .from("material_progress")
    .select("id")
    .eq("email", user.email)
    .eq("material_id", params.id)
    .maybeSingle();

  if (existing) {
    await supabaseAdmin.from("material_progress").delete().eq("id", existing.id);
    return NextResponse.json({ completed: false });
  }

  await supabaseAdmin.from("material_progress").insert({ email: user.email, material_id: params.id });
  return NextResponse.json({ completed: true });
}
