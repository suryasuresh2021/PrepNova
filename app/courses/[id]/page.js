import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryDetail from "@/components/CategoryDetail";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAccessContext } from "@/lib/testAccess";

export default async function CategoryPage({ params }) {
  const { user, isPremium } = await getAccessContext();

  const { data: cat } = await supabaseAdmin
    .from("categories")
    .select("*, topics(id, name)")
    .eq("id", params.id)
    .single();

  if (!cat) notFound();

  const [{ data: materials }, { data: tests }, { data: concepts }] = await Promise.all([
    supabaseAdmin.from("materials").select("*"),
    supabaseAdmin.from("tests").select("*"),
    supabaseAdmin.from("concepts").select("*"),
  ]);

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-5xl px-6 py-16">
        <Link href="/courses" className="font-body inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700">
          <ArrowLeft size={14} aria-hidden="true" /> All Courses
        </Link>

        <div className="mt-8">
          <CategoryDetail
            cat={cat}
            materials={materials || []}
            tests={tests || []}
            concepts={concepts || []}
            user={user}
            isPremium={isPremium}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
