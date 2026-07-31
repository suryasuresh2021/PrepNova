export type RecentUser = {
  id: string;
  email: string;
  plan: "free" | "premium";
  created_at: string;
};

export default function RecentUsersTable({ users }: { users: RecentUser[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-display text-base font-semibold text-slate-900">Recent Users</h2>

      {users.length === 0 ? (
        <p className="font-body mt-4 text-sm text-slate-500">No users have signed up yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="pb-2 font-medium">Email</th>
                <th className="pb-2 font-medium">Plan</th>
                <th className="pb-2 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="py-3 font-body text-slate-700">{u.email}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        u.plan === "premium" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {u.plan === "premium" ? "Premium" : "Free"}
                    </span>
                  </td>
                  <td className="py-3 font-body text-slate-500">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
