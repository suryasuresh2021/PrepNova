import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function UsersPage() {
  const [{ data: profiles }, { data: activeSubs }] = await Promise.all([
    supabaseAdmin.from("profiles").select("id, email, is_admin, created_at").order("created_at", { ascending: false }),
    supabaseAdmin.from("subscriptions").select("email").eq("status", "active").eq("plan", "premium"),
  ]);

  const premiumEmails = new Set((activeSubs ?? []).map((s) => s.email));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="font-display text-base font-semibold text-slate-900">All Users</h2>
      <p className="font-body mt-1 text-sm text-slate-500">Read-only for now — user management actions come next.</p>

      {!profiles || profiles.length === 0 ? (
        <p className="font-body mt-4 text-sm text-slate-500">No users have signed up yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="pb-2 font-medium">Email</th>
                <th className="pb-2 font-medium">Role</th>
                <th className="pb-2 font-medium">Plan</th>
                <th className="pb-2 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {profiles.map((p) => (
                <tr key={p.id}>
                  <td className="py-3 font-body text-slate-700">{p.email}</td>
                  <td className="py-3 font-body text-slate-500">{p.is_admin ? "Admin" : "User"}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        premiumEmails.has(p.email) ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {premiumEmails.has(p.email) ? "Premium" : "Free"}
                    </span>
                  </td>
                  <td className="py-3 font-body text-slate-500">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
