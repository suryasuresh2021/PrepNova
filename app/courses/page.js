import { FolderOpen, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function CoursesPage() {
  const { data: categories } = await supabaseAdmin
    .from("categories")
    .select("*, topics(id, name)")
    .order("created_at", { ascending: false });

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-5xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-slate-900">Courses</h1>
        <p className="font-body mt-2 text-slate-600">Browse everything, organized by category and topic.</p>

        {!categories || categories.length === 0 ? (
          <p className="font-body mt-8 text-sm text-slate-500">
            No categories have been added yet — check back soon.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {categories.map((c) => (
              <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2">
                  <FolderOpen size={18} className="text-teal-700" aria-hidden="true" />
                  <h2 className="font-display text-lg font-semibold text-slate-900">{c.name}</h2>
                </div>
                {c.description && <p className="font-body mt-1 text-sm text-slate-500">{c.description}</p>}

                <ul className="mt-4 space-y-2">
                  {(c.topics || []).length === 0 ? (
                    <li className="font-body text-sm text-slate-400">No topics yet</li>
                  ) : (
                    c.topics.map((t) => (
                      <li key={t.id} className="flex items-center gap-2 font-body text-sm text-slate-700">
                        <BookOpen size={14} className="flex-shrink-0 text-slate-400" aria-hidden="true" />
                        {t.name}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
