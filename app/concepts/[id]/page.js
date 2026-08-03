import Link from "next/link";
import { notFound } from "next/navigation";
import { Lightbulb, Lock, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MathText from "@/components/admin/MathText";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAccessContext, canAccessConcept } from "@/lib/testAccess";

export default async function ConceptPage({ params }) {
  const { isPremium } = await getAccessContext();

  const { data: concept } = await supabaseAdmin
    .from("concepts")
    .select("*, topics(name, categories(name))")
    .eq("id", params.id)
    .single();

  if (!concept) notFound();

  const accessible = canAccessConcept(concept, isPremium);

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-3xl px-6 py-16">
        <Link href="/courses" className="font-body inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700">
          <ArrowLeft size={14} aria-hidden="true" /> Back to Courses
        </Link>

        <p className="font-body mt-6 text-xs font-semibold uppercase tracking-wide text-teal-700">
          {concept.topics?.categories?.name} · {concept.topics?.name}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <Lightbulb size={22} className="flex-shrink-0 text-amber-500" aria-hidden="true" />
          <h1 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">{concept.title}</h1>
        </div>

        {!accessible ? (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
            <Lock size={20} className="mx-auto text-amber-600" aria-hidden="true" />
            <p className="font-body mt-2 text-sm font-semibold text-amber-800">This concept is Premium</p>
            <Link href="/#pricing" className="font-body mt-3 inline-block text-sm font-semibold text-teal-700 hover:text-teal-800">
              Upgrade to Premium →
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {concept.explanation && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-slate-500">Explanation</h2>
                <div className="font-body mt-2 whitespace-pre-wrap text-base leading-relaxed text-slate-700">
                  <MathText text={concept.explanation} />
                </div>
              </div>
            )}
            {concept.examples && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-slate-500">Example</h2>
                <div className="font-body mt-2 whitespace-pre-wrap text-base leading-relaxed text-slate-700">
                  <MathText text={concept.examples} />
                </div>
              </div>
            )}
            {!concept.explanation && !concept.examples && (
              <p className="font-body text-sm text-slate-400">Content coming soon.</p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
