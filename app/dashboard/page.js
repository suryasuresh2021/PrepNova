import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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

  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-[#FAF9F6] px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-slate-900">Your Dashboard</h1>
        <SignOutButton />
      </div>
      <p className="font-body mt-2 text-slate-600">Signed in as {user.email}</p>

      <div className="mt-8 rounded-2xl border border-slate-200 p-6">
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

      <p className="font-body mt-8 text-sm text-slate-400">
        Course content and mock tests will appear here once the Super Admin adds them.
      </p>
    </main>
  );
}
