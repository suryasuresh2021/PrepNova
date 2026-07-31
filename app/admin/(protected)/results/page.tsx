import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function ResultsPage() {
  const { data: attempts } = await supabaseAdmin
    .from("test_attempts")
    .select("*, tests(title)")
    .order("attempted_at", { ascending: false })
    .limit(50);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="font-display text-base font-semibold text-slate-900">Test Results</h2>
      <p className="font-body mt-1 text-sm text-slate-500">
        Fills in automatically once the test-taking flow is built and users start attempting tests.
      </p>

      {!attempts || attempts.length === 0 ? (
        <p className="font-body mt-4 text-sm text-slate-500">No attempts recorded yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="pb-2 font-medium">User</th>
                <th className="pb-2 font-medium">Test</th>
                <th className="pb-2 font-medium">Score</th>
                <th className="pb-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attempts.map((a) => (
                <tr key={a.id}>
                  <td className="py-3 font-body text-slate-700">{a.email}</td>
                  <td className="py-3 font-body text-slate-500">{a.tests?.title}</td>
                  <td className="py-3 font-body text-slate-700">
                    {a.score}/{a.total_questions}
                  </td>
                  <td className="py-3 font-body text-slate-500">{new Date(a.attempted_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
