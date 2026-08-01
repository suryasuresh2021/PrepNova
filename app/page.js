import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import WhyChooseUs from "@/components/WhyChooseUs";
import LearningJourney from "@/components/LearningJourney";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import AdUnit from "@/components/AdUnit";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <WhyChooseUs />
        <LearningJourney />
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
