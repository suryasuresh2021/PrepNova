"use client";

import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus, Save, X, Loader2, Search } from "lucide-react";

const emptyForm = { topic_id: "", topic: "", title: "", description: "", price_inr: 0 };

export default function AdminTestsManager() {
  const [tests, setTests] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [useCustomTopic, setUseCustomTopic] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  const loadAll = async () => {
    setLoading(true);
    const [testsRes, topicsRes] = await Promise.all([fetch("/api/admin/tests"), fetch("/api/admin/topics")]);
    if (testsRes.ok) setTests(await testsRes.json());
    if (topicsRes.ok) setTopics(await topicsRes.json());
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleTopicSelect = (e) => {
    const topicId = e.target.value;
    const topic = topics.find((t) => t.id === topicId);
    setForm({ ...form, topic_id: topicId, topic: topic ? topic.name : "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = useCustomTopic ? { ...form, topic_id: null } : form;
    const url = editingId ? `/api/admin/tests/${editingId}` : "/api/admin/tests";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setForm(emptyForm);
      setEditingId(null);
      setUseCustomTopic(false);
      await loadAll();
    } else {
      const data = await res.json();
      setError(data.error || "Could not save test");
    }
    setSaving(false);
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setForm({
      topic_id: t.topic_id || "",
      topic: t.topic,
      title: t.title,
      description: t.description || "",
      price_inr: t.price_inr,
    });
    setUseCustomTopic(!t.topic_id);
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setUseCustomTopic(false);
    setError(null);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/admin/tests/${id}`, { method: "DELETE" });
    if (editingId === id) cancelEdit();
    await loadAll();
  };

  const filteredTests = tests.filter((t) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      t.title.toLowerCase().includes(query) ||
      t.topic.toLowerCase().includes(query) ||
      (t.description || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="mt-8">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 p-6 sm:grid-cols-2"
      >
        {!useCustomTopic ? (
          <div className="sm:col-span-2">
            <select
              required
              value={form.topic_id}
              onChange={handleTopicSelect}
              disabled={topics.length === 0}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
            >
              <option value="">{topics.length === 0 ? "No topics yet — type a custom one below" : "Select a topic…"}</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} {t.categories?.name ? `(${t.categories.name})` : ""}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setUseCustomTopic(true)}
              className="font-body mt-1.5 text-xs font-medium text-teal-700 hover:text-teal-800"
            >
              Or type a custom topic instead
            </button>
          </div>
        ) : (
          <div className="sm:col-span-2">
            <input
              required
              placeholder="Topic (e.g. Quantitative Aptitude)"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value, topic_id: "" })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setUseCustomTopic(false);
                setForm({ ...form, topic: "", topic_id: "" });
              }}
              className="font-body mt-1.5 text-xs font-medium text-teal-700 hover:text-teal-800"
            >
              Or choose from existing topics
            </button>
          </div>
        )}

        <input
          required
          placeholder="Test title (e.g. Time & Work — Level 1)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
        />
        <input
          type="number"
          min="0"
          placeholder="Price in ₹ (0 = free)"
          value={form.price_inr}
          onChange={(e) => setForm({ ...form, price_inr: e.target.value })}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
        />
        <input
          placeholder="Short description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none sm:col-span-2"
        />

        <div className="flex items-center gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="font-body inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : editingId ? (
              <Save size={16} aria-hidden="true" />
            ) : (
              <Plus size={16} aria-hidden="true" />
            )}
            {editingId ? "Save Changes" : "Add Test"}
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

      <div className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-slate-900">Existing tests</h2>
          <div className="relative">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search tests…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <p className="font-body mt-3 text-sm text-slate-500">Loading…</p>
        ) : tests.length === 0 ? (
          <p className="font-body mt-3 text-sm text-slate-500">No tests yet — add your first one above.</p>
        ) : filteredTests.length === 0 ? (
          <p className="font-body mt-3 text-sm text-slate-500">No tests match "{searchQuery}".</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200">
            {filteredTests.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-body text-sm font-semibold text-slate-900">{t.title}</p>
                  <p className="font-body text-xs text-slate-500">
                    {t.topic} · {t.price_inr === 0 ? "Free" : `₹${t.price_inr}`} ·{" "}
                    <span className={t.questions_count > 0 ? "text-teal-700 font-medium" : "text-amber-600"}>
                      {t.questions_count ?? 0} question{t.questions_count === 1 ? "" : "s"}
                    </span>
                    {!t.topic_id && " · not linked to a Topic"}
                  </p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-3">
                  <button
                    onClick={() => startEdit(t)}
                    aria-label={`Edit ${t.title}`}
                    className="text-slate-400 transition hover:text-teal-600"
                  >
                    <Pencil size={18} aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    aria-label={`Delete ${t.title}`}
                    className="text-slate-400 transition hover:text-red-600"
                  >
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
