export type RecentTest = {
  id: string;
  title: string;
  topic: string;
  price_inr: number;
  created_at: string;
};

export default function RecentTestsTable({ tests }: { tests: RecentTest[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-display text-base font-semibold text-slate-900">Recent Tests</h2>

      {tests.length === 0 ? (
        <p className="font-body mt-4 text-sm text-slate-500">No tests created yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="pb-2 font-medium">Title</th>
                <th className="pb-2 font-medium">Topic</th>
                <th className="pb-2 font-medium">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tests.map((t) => (
                <tr key={t.id}>
                  <td className="py-3 font-body text-slate-700">{t.title}</td>
                  <td className="py-3 font-body text-slate-500">{t.topic}</td>
                  <td className="py-3 font-body text-slate-700">
                    {t.price_inr === 0 ? "Free" : `₹${t.price_inr}`}
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
