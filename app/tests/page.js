import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdUnit from "@/components/AdUnit";
import MockTestsBrowser from "@/components/MockTestsBrowser";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAccessContext } from "@/lib/testAccess";

export default async function MockTestsPage() {
  const { user, isPremium } = await getAccessContext();
  const { data: tests } = await supabaseAdmin.from("tests").select("*").order("topic", { ascending: true });

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-5xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-slate-900">Mock Tests</h1>
        <p className="font-body mt-2 text-slate-600">
          Topic-wise practice tests. Free tests are open to any signed-in user — others need Premium.
        </p>

        <MockTestsBrowser tests={tests || []} isLoggedIn={!!user} isPremium={isPremium} />
      </main>
      <div className="mx-auto max-w-5xl px-6">
        <AdUnit slot="0000000002" />
      </div>
      <Footer />
    </>
  );
}
