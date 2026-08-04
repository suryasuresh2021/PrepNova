import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import WhyChooseUs from "@/components/WhyChooseUs";
import LearningJourney from "@/components/LearningJourney";
import LatestConcepts from "@/components/LatestConcepts";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import dynamic from "next/dynamic";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const AdUnit = dynamic(() => import("@/components/AdUnit"), { ssr: false });
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function Home() {
  const [{ data: categories }, { data: latestConcepts }] = await Promise.all([
    supabaseAdmin.from("categories").select("id, name"),
    supabaseAdmin
      .from("concepts")
      .select("id, title, explanation, topics(name, categories(name))")
      .eq("is_premium", false)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const categoryLinks = {};
  (categories || []).forEach((c) => {
    categoryLinks[c.name.toLowerCase()] = `/courses/${c.id}`;
  });

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Categories categoryLinks={categoryLinks} />
        <WhyChooseUs />
        <LearningJourney />
        <LatestConcepts concepts={latestConcepts || []} />
        <Pricing />
        <Testimonials />
        <div className="mx-auto max-w-4xl px-6">
          <AdUnit slot="0000000000" />
        </div>
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}