"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PrimaryButton } from "@/components/ui/Button";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const notAdminRedirect = searchParams.get("error") === "not_admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    notAdminRedirect ? "That account isn't authorized as an admin." : null
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", signInData.user.id)
      .single();

    if (!profile?.is_admin) {
      await supabase.auth.signOut();
      setError("That account isn't authorized as an admin.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2 font-display text-xl font-semibold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400 text-slate-900">
            <ShieldCheck size={18} aria-hidden="true" />
          </span>
          Super Admin
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                required
                type="email"
                placeholder="admin@prepnova.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div className="relative">
              <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                required
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <PrimaryButton type="submit" disabled={loading} className="w-full disabled:opacity-60">
              {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
              Sign In
            </PrimaryButton>

            {error && <p className="font-body text-sm text-red-400">{error}</p>}
          </form>
        </div>

        <p className="font-body mt-6 text-center text-xs text-slate-500">
          Not an admin?{" "}
          <Link href="/login" className="font-semibold text-slate-300 hover:text-white">
            User sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}
