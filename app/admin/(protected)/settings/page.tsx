import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="font-display text-base font-semibold text-slate-900">Admin Profile</h2>
      <dl className="mt-4 space-y-3">
        <div>
          <dt className="font-body text-xs uppercase tracking-wide text-slate-400">Email</dt>
          <dd className="font-body text-sm text-slate-700">{user.email}</dd>
        </div>
        <div>
          <dt className="font-body text-xs uppercase tracking-wide text-slate-400">Account created</dt>
          <dd className="font-body text-sm text-slate-700">
            {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
          </dd>
        </div>
      </dl>
      <p className="font-body mt-6 text-sm text-slate-500">
        Platform-wide settings (branding, notification preferences, additional admins) will live here next.
      </p>
    </div>
  );
}
