import { Target, BookOpen, TrendingUp, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const pillars = [
  {
    icon: Target,
    title: "Focused practice",
    desc: "Every topic is broken down so you always know exactly what to work on next, instead of guessing what to study.",
  },
  {
    icon: BookOpen,
    title: "One place, not ten tabs",
    desc: "Concepts, reading materials, and mock tests live together, organized the same way from category down to topic.",
  },
  {
    icon: TrendingUp,
    title: "Progress you can see",
    desc: "Every test you take and every material you read feeds into a real performance picture, not just a score you forget.",
  },
  {
    icon: Users,
    title: "Built for real exams",
    desc: "Placement drives, interviews, and competitive exams like UGC NET — the content is shaped around what's actually asked.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-3xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-slate-900">About PrepNova</h1>
        <p className="font-body mt-4 text-lg leading-relaxed text-slate-600">
          PrepNova exists for one reason: preparation for placements, interviews, and competitive
          exams shouldn't mean juggling five different apps, a dozen PDFs, and a spreadsheet to
          track it all. We built one platform that holds the concepts, the materials, and the
          practice tests together — organized the same way, from category down to topic, so you
          always know where you are.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {pillars.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900 text-amber-400">
                <Icon size={20} aria-hidden="true" />
              </div>
              <h2 className="font-display mt-4 text-base font-semibold text-slate-900">{title}</h2>
              <p className="font-body mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-slate-200 bg-[#FAF9F6] p-6">
          <h2 className="font-display text-base font-semibold text-slate-900">Free and Premium</h2>
          <p className="font-body mt-2 text-sm leading-relaxed text-slate-600">
            A solid foundation is free — sign up and start practicing at no cost, no card required.
            Premium unlocks the complete library: every mock test, every topic's materials, and the
            full concept catalog, all in one subscription.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
