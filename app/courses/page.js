import Link from "next/link";
import {
  FolderOpen,
  BookOpen,
  Link2,
  FileText,
  Video,
  StickyNote,
  ClipboardList,
  Lock,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAccessContext, canAccessMaterial, canAccessTest } from "@/lib/testAccess";

const materialTypeIcons = { link: Link2, pdf: FileText, video: Video, note: StickyNote };

export default async function CoursesPage() {
  const { user, isPremium } = await getAccessContext();

  const [{ data: categories }, { data: materials }, { data: tests }] = await Promise.all([
    supabaseAdmin.from("categories").select("*, topics(id, name)").order("created_at", { ascending: false }),
    supabaseAdmin.from("materials").select("*"),
    supabaseAdmin.from("tests").select("*"),
  ]);

  const norm = (s) => (s || "").trim().toLowerCase();

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-5xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-slate-900">Courses</h1>
        <p className="font-body mt-2 text-slate-600">
          Browse by category and topic — each topic links straight to its reading materials and
          practice tests.
        </p>

        {!categories || categories.length === 0 ? (
          <p className="font-body mt-8 text-sm text-slate-500">
            No categories have been added yet — check back soon.
          </p>
        ) : (
          <div className="mt-8 space-y-10">
            {categories.map((cat) => (
              <div key={cat.id}>
                <div className="flex items-center gap-2">
                  <FolderOpen size={18} className="text-teal-700" aria-hidden="true" />
                  <h2 className="font-display text-lg font-semibold text-slate-900">{cat.name}</h2>
                </div>
                {cat.description && <p className="font-body mt-1 text-sm text-slate-500">{cat.description}</p>}

                {(cat.topics || []).length === 0 ? (
                  <p className="font-body mt-3 text-sm text-slate-400">No topics added yet.</p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {cat.topics.map((topic) => {
                      const topicMaterials = (materials || []).filter((m) => m.topic_id === topic.id);
                      const topicTests = (tests || []).filter(
                        (t) => t.topic_id === topic.id || (!t.topic_id && norm(t.topic) === norm(topic.name))
                      );

                      return (
                        <div key={topic.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                          <div className="flex items-center gap-2">
                            <BookOpen size={16} className="text-slate-400" aria-hidden="true" />
                            <h3 className="font-display text-base font-semibold text-slate-900">{topic.name}</h3>
                          </div>

                          {topicMaterials.length === 0 && topicTests.length === 0 ? (
                            <p className="font-body mt-2 text-sm text-slate-400">
                              No materials or tests linked to this topic yet.
                            </p>
                          ) : (
                            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                              {topicMaterials.length > 0 && (
                                <div>
                                  <p className="font-body text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Materials
                                  </p>
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
                                            <Link
                                              href="/materials"
                                              className="flex-shrink-0 text-teal-700 hover:text-teal-800"
                                              aria-label={`Open ${m.title}`}
                                            >
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
                                  <p className="font-body text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Tests
                                  </p>
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
                                            {accessible ? (
                                              <ArrowRight size={13} aria-hidden="true" />
                                            ) : (
                                              <Lock size={13} aria-hidden="true" />
                                            )}
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
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
