"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Loader2 } from "lucide-react";

type Category = { id: string; name: string };
type Topic = {
  id: string;
  name: string;
  category_id: string;
  created_at: string;
  categories: { name: string } | null;
};

export default function TopicsManager() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [topicsRes, categoriesRes] = await Promise.all([
      fetch("/api/admin/topics"),
      fetch("/api/admin/categories"),
    ]);
    if (topicsRes.ok) setTopics(await topicsRes.json());
    if (categoriesRes.ok) setCategories(await categoriesRes.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch("/api/admin/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category_id: categoryId }),
    });

    if (res.ok) {
      setName("");
      await load();
    } else {
      const data = await res.json();
      setError(data.error || "Could not save topic");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/topics/${id}`, { method: "DELETE" });
    await load();
  };

  if (!loading && categories.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <p className="font-body text-sm text-amber-800">
          Create at least one Category first — Topics need to sit under a Category.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2"
      >
        <input
          required
          placeholder="Topic name (e.g. Time & Work)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
        />
        <select
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
        >
          <option value="">Select a category…</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={saving}
          className="font-body inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 sm:col-span-2"
        >
          {saving ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
          Add Topic
        </button>
        {error && <p className="font-body text-sm text-red-600 sm:col-span-2">{error}</p>}
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-display text-base font-semibold text-slate-900">All Topics</h2>
        {loading ? (
          <p className="font-body mt-3 text-sm text-slate-500">Loading…</p>
        ) : topics.length === 0 ? (
          <p className="font-body mt-3 text-sm text-slate-500">No topics yet — add your first one above.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {topics.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-body text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="font-body text-xs text-slate-500">{t.categories?.name}</p>
                </div>
                <button
                  onClick={() => handleDelete(t.id)}
                  aria-label={`Delete ${t.name}`}
                  className="flex-shrink-0 text-slate-400 transition hover:text-red-600"
                >
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
