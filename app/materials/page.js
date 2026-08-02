import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdUnit from "@/components/AdUnit";
import MaterialsBrowser from "@/components/MaterialsBrowser";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAccessContext } from "@/lib/testAccess";

export default async function MaterialsPage() {
  const { user, isPremium } = await getAccessContext();

  const [{ data: categories }, { data: materials }, progressRes] = await Promise.all([
    supabaseAdmin.from("categories").select("id, name").order("created_at", { ascending: false }),
    supabaseAdmin.from("materials").select("*").order("created_at", { ascending: false }),
    user
      ? supabaseAdmin.from("material_progress").select("material_id").eq("email", user.email)
      : Promise.resolve({ data: [] }),
  ]);

  const completedIds = (progressRes.data || []).map((p) => p.material_id);

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-5xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-slate-900">Materials</h1>
        <p className="font-body mt-2 text-slate-600">
          Reading materials, links, and notes organized by category. Free materials are open to
          everyone — Premium ones need an active subscription.
        </p>

        <MaterialsBrowser
          categories={categories || []}
          materials={materials || []}
          completedIds={completedIds}
          isLoggedIn={!!user}
          isPremium={isPremium}
        />
      </main>
      <div className="mx-auto max-w-5xl px-6">
        <AdUnit slot="0000000001" />
      </div>
      <Footer />
    </>
  );
}
