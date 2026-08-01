"use client";

import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus, Loader2, X, Link2, FileText, Video, StickyNote } from "lucide-react";

type Category = { id: string; name: string };
type Material = {
  id: string;
  category_id: string;
  title: string;
  description: string | null;
  material_type: "link" | "pdf" | "video" | "note";
  url: string | null;
  content: string | null;
  is_premium: boolean;
  categories: { name: string } | null;
};

const emptyForm = {
  category_id: "",
  title: "",
  description: "",
  material_type: "link" as Material["material_type"],
  url: "",
  content: "",
  is_premium: false,
};

const typeIcons: Record<Material["material_type"], typeof Link2> = {
  link: Link2,
  pdf: FileText,
  video: Video,
  note: StickyNote,
};

export default function MaterialsManager() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [materialsRes, categoriesRes] = await Promise.all([
      fetch("/api/admin/materials"),
      fetch("/api/admin/categories"),
    ]);
    if (materialsRes.ok) setMaterials(await materialsRes.json());
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

    const url = editingId ? `/api/admin/materials/${editingId}` : "/api/admin/materials";
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
      setError(data.error || "Could not save material");
    }
    setSaving(false);
  };

  const startEdit = (m: Material) => {
    setEditingId(m.id);
    setForm({
      category_id: m.category_id,
      title: m.title,
      description: m.description || "",
      material_type: m.material_type,
      url: m.url || "",
      content: m.content || "",
      is_premium: m.is_premium,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/materials/${id}`, { method: "DELETE" });
    if (editingId === id) cancelEdit();
    await load();
  };

  if (!loading && categories.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <p className="font-body text-sm text-amber-800">
          Create at least one Category first — Materials sit under a Category.
        </p>
      </div>
    );
  }

  const needsUrl = form.material_type === "link" || form.material_type === "pdf" || form.material_type === "video";

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2">
        <select
          required
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
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
          value={form.material_type}
          onChange={(e) => setForm({ ...form, material_type: e.target.value as Material["material_type"] })}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
        >
          <option value="link">Link</option>
          <option value="pdf">PDF</option>
          <option value="video">Video</option>
          <option value="note">Note (text)</option>
        </select>

        <input
          required
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none sm:col-span-2"
        />

        <input
          placeholder="Short description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none sm:col-span-2"
        />

        {needsUrl ? (
          <input
            placeholder="URL (https://...) — optional, can be added later"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none sm:col-span-2"
          />
        ) : (
          <textarea
            placeholder="Note content (optional, can be added later)"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={3}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none sm:col-span-2"
          />
        )}

        <label className="flex items-center gap-2 font-body text-sm text-slate-700 sm:col-span-2">
          <input
            type="checkbox"
            checked={form.is_premium}
            onChange={(e) => setForm({ ...form, is_premium: e.target.checked })}
            className="h-4 w-4 accent-teal-600"
          />
          Premium only (unchecked = Free, visible to everyone)
        </label>

        <div className="flex items-center gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="font-body inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {saving ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
            {editingId ? "Save Changes" : "Add Material"}
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
        <h2 className="font-display text-base font-semibold text-slate-900">All Materials</h2>
        {loading ? (
          <p className="font-body mt-3 text-sm text-slate-500">Loading…</p>
        ) : materials.length === 0 ? (
          <p className="font-body mt-3 text-sm text-slate-500">No materials yet — add your first one above.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {materials.map((m) => {
              const Icon = typeIcons[m.material_type] || Link2;
              return (
                <li key={m.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex items-start gap-3">
                    <Icon size={16} className="mt-0.5 flex-shrink-0 text-slate-400" aria-hidden="true" />
                    <div>
                      <p className="font-body text-sm font-semibold text-slate-900">{m.title}</p>
                      <p className="font-body text-xs text-slate-500">
                        {m.categories?.name} ·{" "}
                        <span className={m.is_premium ? "text-amber-700" : "text-teal-700"}>
                          {m.is_premium ? "Premium" : "Free"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3">
                    <button onClick={() => startEdit(m)} aria-label="Edit material" className="text-slate-400 transition hover:text-teal-600">
                      <Pencil size={18} aria-hidden="true" />
                    </button>
                    <button onClick={() => handleDelete(m.id)} aria-label="Delete material" className="text-slate-400 transition hover:text-red-600">
                      <Trash2 size={18} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
