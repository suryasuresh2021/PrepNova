import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryDetail from "@/components/CategoryDetail";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAccessContext } from "@/lib/testAccess";

export default async function CoursesPage() {
  const { user, isPremium } = await getAccessContext();

  const [{ data: categories }, { data: materials }, { data: tests }, { data: concepts }] = await Promise.all([
    supabaseAdmin.from("categories").select("*, topics(id, name)").order("created_at", { ascending: false }),
    supabaseAdmin.from("materials").select("*"),
    supabaseAdmin.from("tests").select("*"),
    supabaseAdmin.from("concepts").select("*"),
  ]);

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-5xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-slate-900">Courses</h1>
        <p className="font-body mt-2 text-slate-600">
          Browse by category and topic — each topic links straight to its concepts, reading
          materials, and practice tests.
        </p>

        {!categories || categories.length === 0 ? (
          <p className="font-body mt-8 text-sm text-slate-500">
            No categories have been added yet — check back soon.
          </p>
        ) : (
          <div className="mt-8 space-y-10">
            {categories.map((cat) => (
              <CategoryDetail
                key={cat.id}
                cat={cat}
                materials={materials || []}
                tests={tests || []}
                concepts={concepts || []}
                user={user}
                isPremium={isPremium}
                linkHeading
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
