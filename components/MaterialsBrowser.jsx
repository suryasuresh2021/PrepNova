"use client";

import { useState } from "react";
import { FolderOpen, Link2, FileText, Video, StickyNote, Lock, ExternalLink, Search } from "lucide-react";
import MaterialProgressToggle from "@/components/MaterialProgressToggle";
import { canAccessMaterial } from "@/lib/accessRules";

const typeIcons = { link: Link2, pdf: FileText, video: Video, note: StickyNote };
const typeLabels = { link: "Link", pdf: "PDF", video: "Video", note: "Note" };

export default function MaterialsBrowser({ categories, materials, completedIds, isLoggedIn, isPremium }) {
  const [searchQuery, setSearchQuery] = useState("");
  const completedSet = new Set(completedIds);

  const query = searchQuery.trim().toLowerCase();
  const filteredMaterials = materials.filter((m) => {
    if (!query) return true;
    return m.title.toLowerCase().includes(query) || (m.description || "").toLowerCase().includes(query);
  });

  const byCategory = {};
  filteredMaterials.forEach((m) => {
    byCategory[m.category_id] = byCategory[m.category_id] || [];
    byCategory[m.category_id].push(m);
  });

  const hasAnyResults = Object.values(byCategory).some((items) => items.length > 0);

  return (
    <>
      <div className="relative mt-6 max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search materials…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-teal-500 focus:outline-none"
        />
      </div>

      {categories.length === 0 ? (
        <p className="font-body mt-8 text-sm text-slate-500">No categories have been added yet.</p>
      ) : !hasAnyResults ? (
        <p className="font-body mt-8 text-sm text-slate-500">No materials match "{searchQuery}".</p>
      ) : (
        <div className="mt-8 space-y-10">
          {categories.map((cat) => {
            const items = byCategory[cat.id] || [];
            if (items.length === 0) return null;

            const accessibleItems = items.filter((m) => canAccessMaterial(m, isPremium));
            const completedCount = accessibleItems.filter((m) => completedSet.has(m.id)).length;

            return (
              <div key={cat.id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FolderOpen size={18} className="text-teal-700" aria-hidden="true" />
                    <h2 className="font-display text-lg font-semibold text-slate-900">{cat.name}</h2>
                  </div>
                  {isLoggedIn && accessibleItems.length > 0 && (
                    <span className="font-body text-xs font-medium text-slate-500">
                      {completedCount} of {accessibleItems.length} read
                    </span>
                  )}
                </div>

                {isLoggedIn && accessibleItems.length > 0 && (
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-teal-600"
                      style={{ width: `${Math.round((completedCount / accessibleItems.length) * 100)}%` }}
                    />
                  </div>
                )}

                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {items.map((m) => {
                    const accessible = canAccessMaterial(m, isPremium);
                    const Icon = typeIcons[m.material_type] || Link2;

                    return (
                      <div key={m.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2">
                            <Icon size={16} className="mt-0.5 flex-shrink-0 text-slate-400" aria-hidden="true" />
                            <div>
                              <p className="font-body text-sm font-semibold text-slate-900">{m.title}</p>
                              {m.description && (
                                <p className="font-body mt-1 text-xs text-slate-500">{m.description}</p>
                              )}
                              <p className="font-body mt-1 text-xs text-slate-400">{typeLabels[m.material_type]}</p>
                            </div>
                          </div>
                          {m.is_premium && (
                            <span className="flex-shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                              Premium
                            </span>
                          )}
                        </div>

                        {!accessible ? (
                          <p className="font-body mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400">
                            <Lock size={14} aria-hidden="true" /> Unlock with Premium
                          </p>
                        ) : (
                          <>
                            {m.material_type === "note" ? (
                              m.content ? (
                                <details className="mt-4">
                                  <summary className="cursor-pointer font-body text-sm font-semibold text-teal-700 hover:text-teal-800">
                                    Read note
                                  </summary>
                                  <p className="font-body mt-2 whitespace-pre-wrap text-sm text-slate-700">
                                    {m.content}
                                  </p>
                                </details>
                              ) : (
                                <p className="font-body mt-4 text-sm text-slate-400">Content coming soon</p>
                              )
                            ) : m.url ? (
                              <a
                                href={m.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-body mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800"
                              >
                                Open <ExternalLink size={14} aria-hidden="true" />
                              </a>
                            ) : (
                              <p className="font-body mt-4 text-sm text-slate-400">Link coming soon</p>
                            )}

                            {isLoggedIn && (
                              <MaterialProgressToggle materialId={m.id} initialCompleted={completedSet.has(m.id)} />
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
