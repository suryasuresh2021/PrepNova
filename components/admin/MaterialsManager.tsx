"use client";

import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus, Loader2, X, Link2, FileText, Video, StickyNote, Upload, CheckCircle2 } from "lucide-react";

type Category = { id: string; name: string };
type Topic = { id: string; name: string; category_id: string };
type Material = {
  id: string;
  category_id: string;
  topic_id: string | null;
  title: string;
  description: string | null;
  material_type: "link" | "pdf" | "video" | "note";
  url: string | null;
  video_url: string | null;
  content: string | null;
  is_premium: boolean;
  categories: { name: string } | null;
  topics: { name: string } | null;
};

const emptyForm = {
  category_id: "",
  topic_id: "",
  title: "",
  description: "",
  material_type: "link" as Material["material_type"],
  url: "",
  video_url: "",
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
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [materialsRes, categoriesRes, topicsRes] = await Promise.all([
      fetch("/api/admin/materials"),
      fetch("/api/admin/categories"),
      fetch("/api/admin/topics"),
    ]);
    if (materialsRes.ok) setMaterials(await materialsRes.json());
    if (categoriesRes.ok) setCategories(await categoriesRes.json());
    if (topicsRes.ok) setTopics(await topicsRes.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.url && !form.video_url && !form.content) {
      setError("Add at least one of: a document/link, a video URL, or note content.");
      return;
    }

    setSaving(true);
    setError(null);

    const url = editingId ? `/api/admin/materials/${editingId}` : "/api/admin/materials";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, topic_id: form.topic_id || null }),
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

  const handlePdfUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);

    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/admin/materials/upload", { method: "POST", body });
      const data = await res.json();
      if (res.ok) {
        setForm((f) => ({ ...f, url: data.url }));
      } else {
        setUploadError(data.error || "Upload failed");
      }
    } catch {
      setUploadError("Upload failed");
    }
    setUploading(false);
  };

  const startEdit = (m: Material) => {
    setEditingId(m.id);
    setForm({
      category_id: m.category_id,
      topic_id: m.topic_id || "",
      title: m.title,
      description: m.description || "",
      material_type: m.material_type,
      url: m.url || "",
      video_url: m.video_url || "",
      content: m.content || "",
      is_premium: m.is_premium,
    });
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
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
          value={form.topic_id}
          onChange={(e) => setForm({ ...form, topic_id: e.target.value })}
          disabled={!form.category_id}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
        >
          <option value="">No specific topic (category-wide)</option>
          {topicsForCategory.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
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

        <select
          value={form.material_type}
          onChange={(e) => setForm({ ...form, material_type: e.target.value as Material["material_type"] })}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none sm:col-span-2"
        >
          <option value="link">Icon: Link</option>
          <option value="pdf">Icon: PDF</option>
          <option value="video">Icon: Video</option>
          <option value="note">Icon: Note</option>
        </select>
        <p className="-mt-2 font-body text-xs text-slate-400 sm:col-span-2">
          This only picks which icon shows to students — fill in any combination of the fields
          below, they all work together on one material.
        </p>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
          <p className="font-body mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <FileText size={14} aria-hidden="true" /> Document / PDF
          </p>
          <div className="rounded-lg border-2 border-dashed border-slate-300 bg-white p-4 text-center">
            <Upload size={18} className="mx-auto text-slate-400" aria-hidden="true" />
            <label className="mt-1.5 block cursor-pointer font-body text-sm font-medium text-teal-700 hover:text-teal-800">
              {uploading ? "Uploading…" : "Upload a PDF file"}
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                disabled={uploading}
                onChange={(e) => e.target.files?.[0] && handlePdfUpload(e.target.files[0])}
              />
            </label>
            <p className="font-body mt-1 text-xs text-slate-400">Up to 15MB</p>
            {form.url && (
              <p className="font-body mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700">
                <CheckCircle2 size={13} aria-hidden="true" /> File/link ready
              </p>
            )}
            {uploadError && <p className="font-body mt-2 text-xs text-red-600">{uploadError}</p>}
          </div>
          <input
            placeholder="…or paste a document/link URL directly"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            className="mt-3 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
          <p className="font-body mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <Video size={14} aria-hidden="true" /> Video link
          </p>
          <input
            placeholder="https://youtube.com/watch?v=... (or any video URL)"
            value={form.video_url}
            onChange={(e) => setForm({ ...form, video_url: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
          <p className="font-body mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <StickyNote size={14} aria-hidden="true" /> Note text
          </p>
          <textarea
            placeholder="Optional written note or summary"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>

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
              const resourceCount = [m.url, m.video_url, m.content].filter(Boolean).length;
              return (
                <li key={m.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex items-start gap-3">
                    <Icon size={16} className="mt-0.5 flex-shrink-0 text-slate-400" aria-hidden="true" />
                    <div>
                      <p className="font-body text-sm font-semibold text-slate-900">{m.title}</p>
                      <p className="font-body text-xs text-slate-500">
                        {m.categories?.name}
                        {m.topics?.name ? ` · ${m.topics.name}` : ""} · {resourceCount} resource
                        {resourceCount === 1 ? "" : "s"} ·{" "}
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
