import Link from "next/link";
import { redirect } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import SignOutButton from "@/components/Auth/SignOutButton";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("email", user.email)
    .maybeSingle();

  const isPremium = subscription?.status === "active" && subscription?.plan === "premium";

  const { data: attempts } = await supabaseAdmin
    .from("test_attempts")
    .select("score, total_questions, attempted_at, tests(title)")
    .eq("email", user.email)
    .order("attempted_at", { ascending: false });

  const attemptList = attempts || [];
  const averagePercent =
    attemptList.length > 0
      ? Math.round(
          (attemptList.reduce((sum, a) => sum + (a.total_questions > 0 ? a.score / a.total_questions : 0), 0) /
            attemptList.length) *
            100
        )
      : 0;
  const lastAttempt = attemptList[0];
  const lastPercent =
    lastAttempt && lastAttempt.total_questions > 0
      ? Math.round((lastAttempt.score / lastAttempt.total_questions) * 100)
      : null;

  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-[#FAF9F6] px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-slate-900">Your Dashboard</h1>
        <SignOutButton />
      </div>
      <p className="font-body mt-2 text-slate-600">Signed in as {user.email}</p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <p className="font-body text-sm text-slate-500">Current plan</p>
        <p className="font-display mt-1 text-xl font-semibold capitalize text-slate-900">
          {isPremium ? "Premium" : "Free"}
        </p>
        {!isPremium && (
          <Link
            href="/#pricing"
            className="font-body mt-4 inline-block text-sm font-semibold text-teal-700 hover:text-teal-800"
          >
            Upgrade to Premium →
          </Link>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-teal-700" aria-hidden="true" />
          <h2 className="font-display text-base font-semibold text-slate-900">Result Analysis</h2>
        </div>

        {attemptList.length === 0 ? (
          <p className="font-body mt-3 text-sm text-slate-500">
            No tests attempted yet — take a mock test to see your analysis here.
          </p>
        ) : (
          <>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="font-body text-xs uppercase tracking-wide text-slate-500">Tests Taken</p>
                <p className="font-display mt-1 text-xl font-bold text-slate-900">{attemptList.length}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="font-body text-xs uppercase tracking-wide text-slate-500">Average</p>
                <p className="font-display mt-1 text-xl font-bold text-teal-700">{averagePercent}%</p>
              </div>
              {lastAttempt && (
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="font-body text-xs uppercase tracking-wide text-slate-500">Last Score</p>
                  <p className="font-display mt-1 text-xl font-bold text-slate-900">
                    {lastAttempt.score}/{lastAttempt.total_questions}{" "}
                    <span className="text-sm font-semibold text-slate-500">({lastPercent}%)</span>
                  </p>
                </div>
              )}
            </div>
            <Link
              href="/results"
              className="font-body mt-4 inline-block text-sm font-semibold text-teal-700 hover:text-teal-800"
            >
              View full history →
            </Link>
          </>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/courses" className="font-body text-sm font-semibold text-slate-700 hover:text-slate-900">
          Browse Courses →
        </Link>
        <Link href="/materials" className="font-body text-sm font-semibold text-slate-700 hover:text-slate-900">
          Browse Materials →
        </Link>
        <Link href="/tests" className="font-body text-sm font-semibold text-slate-700 hover:text-slate-900">
          Browse Mock Tests →
        </Link>
      </div>
    </main>
  );
}

