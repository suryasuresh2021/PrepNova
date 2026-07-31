import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAccessContext, canAccessTest } from "@/lib/testAccess";

export default async function MockTestsPage() {
  const { user, isPremium } = await getAccessContext();
  const { data: tests } = await supabaseAdmin.from("tests").select("*").order("topic", { ascending: true });

  const grouped = {};
  (tests || []).forEach((t) => {
    grouped[t.topic] = grouped[t.topic] || [];
    grouped[t.topic].push(t);
  });

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-5xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-slate-900">Mock Tests</h1>
        <p className="font-body mt-2 text-slate-600">
          Topic-wise practice tests. Free tests are open to any signed-in user — others need Premium.
        </p>

        {Object.keys(grouped).length === 0 ? (
          <p className="font-body mt-8 text-sm text-slate-500">No tests have been added yet — check back soon.</p>
        ) : (
          <div className="mt-8 space-y-10">
            {Object.entries(grouped).map(([topic, list]) => (
              <div key={topic}>
                <h2 className="font-display text-lg font-semibold text-slate-900">{topic}</h2>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {list.map((t) => {
                    const accessible = canAccessTest(t, isPremium);
                    const href = !user ? "/login" : accessible ? `/tests/${t.id}` : "/#pricing";

                    return (
                      <div key={t.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-body text-sm font-semibold text-slate-900">{t.title}</p>
                            {t.description && (
                              <p className="font-body mt-1 text-xs text-slate-500">{t.description}</p>
                            )}
                          </div>
                          {t.price_inr > 0 && (
                            <span className="flex-shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                              ₹{t.price_inr}
                            </span>
                          )}
                        </div>
                        <Link
                          href={href}
                          className="font-body mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800"
                        >
                          {accessible ? (
                            <>
                              Start Test <ArrowRight size={14} aria-hidden="true" />
                            </>
                          ) : (
                            <>
                              Unlock with Premium <Lock size={14} aria-hidden="true" />
                            </>
                          )}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
