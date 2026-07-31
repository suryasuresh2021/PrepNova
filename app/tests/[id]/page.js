import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import TestRunner from "@/components/TestRunner";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAccessContext, canAccessTest } from "@/lib/testAccess";

export default async function TestPage({ params }) {
  const { user, isPremium } = await getAccessContext();
  if (!user) redirect("/login");

  const { data: test } = await supabaseAdmin.from("tests").select("*").eq("id", params.id).single();
  if (!test) redirect("/tests");
  if (!canAccessTest(test, isPremium)) redirect("/#pricing");

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-3xl bg-[#FAF9F6] px-6 py-16">
        <TestRunner testId={test.id} title={test.title} />
      </main>
    </>
  );
}
