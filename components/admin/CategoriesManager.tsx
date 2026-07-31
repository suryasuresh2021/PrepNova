"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Loader2 } from "lucide-react";

type Category = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
};

const emptyForm = { name: "", description: "" };

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    if (res.ok) setCategories(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm(emptyForm);
      await load();
    } else {
      const data = await res.json();
      setError(data.error || "Could not save category");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2"
      >
        <input
          required
          placeholder="Category name (e.g. Quantitative Aptitude)"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
        />
        <input
          placeholder="Short description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={saving}
          className="font-body inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 sm:col-span-2"
        >
          {saving ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
          Add Category
        </button>
        {error && <p className="font-body text-sm text-red-600 sm:col-span-2">{error}</p>}
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-display text-base font-semibold text-slate-900">All Categories</h2>
        {loading ? (
          <p className="font-body mt-3 text-sm text-slate-500">Loading…</p>
        ) : categories.length === 0 ? (
          <p className="font-body mt-3 text-sm text-slate-500">No categories yet — add your first one above.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-body text-sm font-semibold text-slate-900">{c.name}</p>
                  {c.description && <p className="font-body text-xs text-slate-500">{c.description}</p>}
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  aria-label={`Delete ${c.name}`}
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
