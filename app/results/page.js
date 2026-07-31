import { redirect } from "next/navigation";
import { TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function MyResultsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: attempts } = await supabaseAdmin
    .from("test_attempts")
    .select("*, tests(title, topic)")
    .eq("email", user.email)
    .order("attempted_at", { ascending: false });

  const list = attempts || [];
  const averagePercent =
    list.length > 0
      ? Math.round(
          (list.reduce((sum, a) => sum + (a.total_questions > 0 ? a.score / a.total_questions : 0), 0) / list.length) *
            100
        )
      : 0;

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-3xl bg-[#FAF9F6] px-6 py-16">
        <h1 className="font-display text-2xl font-semibold text-slate-900">My Results</h1>
        <p className="font-body mt-1 text-sm text-slate-600">Signed in as {user.email}</p>

        {list.length === 0 ? (
          <p className="font-body mt-8 text-sm text-slate-500">
            You haven't attempted any tests yet — head to Mock Tests to get started.
          </p>
        ) : (
          <>
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-amber-400">
                <TrendingUp size={18} aria-hidden="true" />
              </span>
              <div>
                <p className="font-body text-xs text-slate-500">Average score across {list.length} attempt{list.length !== 1 ? "s" : ""}</p>
                <p className="font-display text-lg font-semibold text-slate-900">{averagePercent}%</p>
              </div>
            </div>

            <ul className="mt-6 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
              {list.map((a) => {
                const percent = a.total_questions > 0 ? Math.round((a.score / a.total_questions) * 100) : 0;
                return (
                  <li key={a.id} className="flex items-center justify-between gap-4 p-4">
                    <div>
                      <p className="font-body text-sm font-semibold text-slate-900">{a.tests?.title}</p>
                      <p className="font-body text-xs text-slate-500">
                        {a.tests?.topic} · {new Date(a.attempted_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="font-display text-sm font-semibold text-slate-900">
                        {a.score}/{a.total_questions}
                      </p>
                      <p
                        className={`font-body text-xs font-semibold ${
                          percent >= 80 ? "text-teal-700" : percent >= 50 ? "text-amber-700" : "text-red-600"
                        }`}
                      >
                        {percent}%
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </main>
    </>
  );
}
