"use client";

import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus, Save, X, Loader2, Lightbulb } from "lucide-react";
import MathText from "@/components/MathText";

type Category = { id: string; name: string };
type Topic = { id: string; name: string; category_id: string };
type Concept = {
  id: string;
  topic_id: string;
  title: string;
  explanation: string;
  examples: string | null;
  is_premium: boolean;
  topics: { name: string; categories: { name: string } | null } | null;
};

const emptyForm = { category_id: "", topic_id: "", title: "", explanation: "", examples: "", is_premium: false };

export default function ConceptsManager() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [conceptsRes, categoriesRes, topicsRes] = await Promise.all([
      fetch("/api/admin/concepts"),
      fetch("/api/admin/categories"),
      fetch("/api/admin/topics"),
    ]);
    if (conceptsRes.ok) setConcepts(await conceptsRes.json());
    if (categoriesRes.ok) setCategories(await categoriesRes.json());
    if (topicsRes.ok) setTopics(await topicsRes.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const url = editingId ? `/api/admin/concepts/${editingId}` : "/api/admin/concepts";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } else {
      const data = await res.json();
      setError(data.error || "Could not save concept");
    }
    setSaving(false);
  };

  const startEdit = (c: Concept) => {
    const topic = topics.find((t) => t.id === c.topic_id);
    setEditingId(c.id);
    setForm({
      category_id: topic?.category_id || "",
      topic_id: c.topic_id,
      title: c.title,
      explanation: c.explanation,
      examples: c.examples || "",
      is_premium: c.is_premium,
    });
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/concepts/${id}`, { method: "DELETE" });
    if (editingId === id) cancelEdit();
    await load();
  };

  if (!loading && categories.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <p className="font-body text-sm text-amber-800">
          Create at least one Category first — Concepts sit under a Topic within a Category.
        </p>
      </div>
    );
  }

  const topicsForCategory = topics.filter((t) => t.category_id === form.category_id);

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2">
        <select
          required
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value, topic_id: "" })}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
        >
          <option value="">Select a category…</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          required
          value={form.topic_id}
          onChange={(e) => setForm({ ...form, topic_id: e.target.value })}
          disabled={!form.category_id}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
        >
          <option value="">{form.category_id ? "Select a topic…" : "Pick a category first"}</option>
          {topicsForCategory.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <input
          required
          placeholder="Concept title (e.g. Time & Work — Basics)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none sm:col-span-2"
        />

        <div className="sm:col-span-2">
          <textarea
            required
            placeholder="Explanation — wrap math in $...$, e.g. Work done = $\frac{1}{n}$ per day"
            value={form.explanation}
            onChange={(e) => setForm({ ...form, explanation: e.target.value })}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
          />
          {form.explanation && (
            <div className="mt-1.5 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
              <span className="mr-1 text-xs text-slate-400">Preview:</span>
              <MathText text={form.explanation} />
            </div>
          )}
        </div>

        <div className="sm:col-span-2">
          <textarea
            placeholder="Examples (optional)"
            value={form.examples}
            onChange={(e) => setForm({ ...form, examples: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
          />
          {form.examples && (
            <div className="mt-1.5 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
              <span className="mr-1 text-xs text-slate-400">Preview:</span>
              <MathText text={form.examples} />
            </div>
          )}
        </div>

        <label className="flex items-center gap-2 font-body text-sm text-slate-700 sm:col-span-2">
          <input
            type="checkbox"
            checked={form.is_premium}
            onChange={(e) => setForm({ ...form, is_premium: e.target.checked })}
            className="h-4 w-4 accent-teal-600"
          />
          Premium only (unchecked = Free, publicly viewable without login)
        </label>

        <div className="flex items-center gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="font-body inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : editingId ? (
              <Save size={16} aria-hidden="true" />
            ) : (
              <Plus size={16} aria-hidden="true" />
            )}
            {editingId ? "Save Changes" : "Add Concept"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="font-body inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              <X size={16} aria-hidden="true" /> Cancel
            </button>
          )}
        </div>

        {error && <p className="font-body text-sm text-red-600 sm:col-span-2">{error}</p>}
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-display text-base font-semibold text-slate-900">All Concepts</h2>
        {loading ? (
          <p className="font-body mt-3 text-sm text-slate-500">Loading…</p>
        ) : concepts.length === 0 ? (
          <p className="font-body mt-3 text-sm text-slate-500">No concepts yet — add your first one above.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {concepts.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-4 py-3">
                <div className="flex items-start gap-3">
                  <Lightbulb size={16} className="mt-0.5 flex-shrink-0 text-slate-400" aria-hidden="true" />
                  <div>
                    <p className="font-body text-sm font-semibold text-slate-900">{c.title}</p>
                    <p className="font-body text-xs text-slate-500">
                      {c.topics?.categories?.name} · {c.topics?.name} ·{" "}
                      <span className={c.is_premium ? "text-amber-700" : "text-teal-700"}>
                        {c.is_premium ? "Premium" : "Free"}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-shrink-0 items-center gap-3">
                  <button onClick={() => startEdit(c)} aria-label="Edit concept" className="text-slate-400 transition hover:text-teal-600">
                    <Pencil size={18} aria-hidden="true" />
                  </button>
                  <button onClick={() => handleDelete(c.id)} aria-label="Delete concept" className="text-slate-400 transition hover:text-red-600">
                    <Trash2 size={18} aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
