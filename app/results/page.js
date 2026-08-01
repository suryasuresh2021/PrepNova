import { redirect } from "next/navigation";
import { TrendingUp, Target, Award } from "lucide-react";
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
  const percentages = list.map((a) => (a.total_questions > 0 ? (a.score / a.total_questions) * 100 : 0));
  const averagePercent = percentages.length > 0 ? Math.round(percentages.reduce((s, p) => s + p, 0) / percentages.length) : 0;
  const bestPercent = percentages.length > 0 ? Math.round(Math.max(...percentages)) : 0;

  const stats = [
    { label: "Tests Attempted", value: list.length.toString(), icon: Target },
    { label: "Average Score", value: `${averagePercent}%`, icon: TrendingUp },
    { label: "Best Score", value: `${bestPercent}%`, icon: Award },
  ];

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
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-body text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-amber-400">
                      <Icon size={16} aria-hidden="true" />
                    </span>
                  </div>
                  <p className="font-display mt-2 text-2xl font-semibold text-slate-900">{value}</p>
                </div>
              ))}
            </div>

            <h2 className="font-display mt-8 text-lg font-semibold text-slate-900">Attempt History</h2>
            <ul className="mt-3 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
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
                      <p className="font-body text-xs text-slate-400">Marks</p>
                      <p className="font-display text-sm font-semibold text-slate-900">
                        {a.score}/{a.total_questions}
                      </p>
                      <p className="font-body mt-1 text-xs text-slate-400">Percentage</p>
                      <p
                        className={`font-display text-sm font-semibold ${
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
