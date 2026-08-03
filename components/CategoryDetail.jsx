import Link from "next/link";
import {
  FolderOpen,
  BookOpen,
  Link2,
  FileText,
  Video,
  StickyNote,
  ClipboardList,
  Lightbulb,
  Lock,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { canAccessMaterial, canAccessTest, canAccessConcept } from "@/lib/testAccess";

const materialTypeIcons = { link: Link2, pdf: FileText, video: Video, note: StickyNote };

function norm(s) {
  return (s || "").trim().toLowerCase();
}

export default function CategoryDetail({ cat, materials, tests, concepts, user, isPremium, linkHeading = false }) {
  const categoryMaterials = materials.filter((m) => m.category_id === cat.id);
  const generalMaterials = categoryMaterials.filter((m) => !m.topic_id);

  const categoryTopicIds = new Set((cat.topics || []).map((t) => t.id));
  const categoryTopicNames = new Set((cat.topics || []).map((t) => norm(t.name)));
  const categoryTests = tests.filter(
    (t) => (t.topic_id && categoryTopicIds.has(t.topic_id)) || (!t.topic_id && categoryTopicNames.has(norm(t.topic)))
  );
  const categoryConcepts = concepts.filter((c) => categoryTopicIds.has(c.topic_id));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FolderOpen size={18} className="text-teal-700" aria-hidden="true" />
          {linkHeading ? (
            <Link href={`/courses/${cat.id}`} className="font-display text-lg font-semibold text-slate-900 hover:text-teal-700">
              {cat.name}
            </Link>
          ) : (
            <h2 className="font-display text-lg font-semibold text-slate-900">{cat.name}</h2>
          )}
        </div>
        <span className="font-body text-xs font-medium text-slate-500">
          {categoryMaterials.length} material{categoryMaterials.length === 1 ? "" : "s"} · {categoryTests.length} test
          {categoryTests.length === 1 ? "" : "s"} · {categoryConcepts.length} concept{categoryConcepts.length === 1 ? "" : "s"}
        </span>
      </div>
      {cat.description && <p className="font-body mt-1 text-sm text-slate-500">{cat.description}</p>}

      <div className="mt-4 space-y-4">
        {generalMaterials.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <FolderOpen size={16} className="text-slate-400" aria-hidden="true" />
              <h3 className="font-display text-base font-semibold text-slate-900">General {cat.name} Materials</h3>
            </div>
            <p className="font-body mt-1 text-xs text-slate-400">Not tied to a specific topic</p>
            <ul className="mt-3 space-y-2">
              {generalMaterials.map((m) => {
                const accessible = canAccessMaterial(m, isPremium);
                const Icon = materialTypeIcons[m.material_type] || Link2;
                return (
                  <li key={m.id} className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 font-body text-sm text-slate-700">
                      <Icon size={14} className="flex-shrink-0 text-slate-400" aria-hidden="true" />
                      {m.title}
                    </span>
                    {!accessible ? (
                      <Lock size={13} className="flex-shrink-0 text-slate-400" aria-hidden="true" />
                    ) : (
                      <Link href="/materials" className="flex-shrink-0 text-teal-700 hover:text-teal-800" aria-label={`Open ${m.title}`}>
                        <ExternalLink size={13} aria-hidden="true" />
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {(cat.topics || []).length === 0
          ? generalMaterials.length === 0 && <p className="font-body text-sm text-slate-400">No topics added yet.</p>
          : cat.topics.map((topic) => {
              const topicMaterials = materials.filter((m) => m.topic_id === topic.id);
              const topicTests = tests.filter(
                (t) => t.topic_id === topic.id || (!t.topic_id && norm(t.topic) === norm(topic.name))
              );
              const topicConcepts = concepts.filter((c) => c.topic_id === topic.id);

              return (
                <div key={topic.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-slate-400" aria-hidden="true" />
                    <h3 className="font-display text-base font-semibold text-slate-900">{topic.name}</h3>
                  </div>

                  {topicMaterials.length === 0 && topicTests.length === 0 && topicConcepts.length === 0 ? (
                    <p className="font-body mt-2 text-sm text-slate-400">Nothing linked to this topic yet.</p>
                  ) : (
                    <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {topicConcepts.length > 0 && (
                        <div>
                          <p className="font-body text-xs font-semibold uppercase tracking-wide text-slate-400">Concepts</p>
                          <ul className="mt-2 space-y-2">
                            {topicConcepts.map((c) => {
                              const accessible = canAccessConcept(c, isPremium);
                              return (
                                <li key={c.id} className="flex items-center justify-between gap-2">
                                  <span className="flex items-center gap-2 font-body text-sm text-slate-700">
                                    <Lightbulb size={14} className="flex-shrink-0 text-amber-500" aria-hidden="true" />
                                    {c.title}
                                  </span>
                                  <Link
                                    href={`/concepts/${c.id}`}
                                    className="flex-shrink-0 text-teal-700 hover:text-teal-800"
                                    aria-label={accessible ? `Read ${c.title}` : `Unlock ${c.title} with Premium`}
                                  >
                                    {accessible ? <ArrowRight size={13} aria-hidden="true" /> : <Lock size={13} aria-hidden="true" />}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {topicMaterials.length > 0 && (
                        <div>
                          <p className="font-body text-xs font-semibold uppercase tracking-wide text-slate-400">Materials</p>
                          <ul className="mt-2 space-y-2">
                            {topicMaterials.map((m) => {
                              const accessible = canAccessMaterial(m, isPremium);
                              const Icon = materialTypeIcons[m.material_type] || Link2;
                              return (
                                <li key={m.id} className="flex items-center justify-between gap-2">
                                  <span className="flex items-center gap-2 font-body text-sm text-slate-700">
                                    <Icon size={14} className="flex-shrink-0 text-slate-400" aria-hidden="true" />
                                    {m.title}
                                  </span>
                                  {!accessible ? (
                                    <Lock size={13} className="flex-shrink-0 text-slate-400" aria-hidden="true" />
                                  ) : (
                                    <Link href="/materials" className="flex-shrink-0 text-teal-700 hover:text-teal-800" aria-label={`Open ${m.title}`}>
                                      <ExternalLink size={13} aria-hidden="true" />
                                    </Link>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {topicTests.length > 0 && (
                        <div>
                          <p className="font-body text-xs font-semibold uppercase tracking-wide text-slate-400">Tests</p>
                          <ul className="mt-2 space-y-2">
                            {topicTests.map((t) => {
                              const accessible = canAccessTest(t, isPremium);
                              const href = !user ? "/login" : accessible ? `/tests/${t.id}` : "/#pricing";
                              return (
                                <li key={t.id} className="flex items-center justify-between gap-2">
                                  <span className="flex items-center gap-2 font-body text-sm text-slate-700">
                                    <ClipboardList size={14} className="flex-shrink-0 text-slate-400" aria-hidden="true" />
                                    {t.title}
                                  </span>
                                  <Link
                                    href={href}
                                    className="flex-shrink-0 text-teal-700 hover:text-teal-800"
                                    aria-label={accessible ? `Start ${t.title}` : `Unlock ${t.title} with Premium`}
                                  >
                                    {accessible ? <ArrowRight size={13} aria-hidden="true" /> : <Lock size={13} aria-hidden="true" />}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
      </div>
    </div>
  );
}
