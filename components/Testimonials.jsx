"use client";

import { Quote } from "lucide-react";
import { SectionHeading } from "./ui/SectionHeading";

const testimonials = [
  { name: "Ananya Rao", role: "Placed at a product company", quote: "The topic-wise tests helped me fix my weak areas before campus placements." },
  { name: "Vignesh Kumar", role: "UGC NET qualified", quote: "Structured subject modules made revision far less overwhelming." },
  { name: "Sneha Iyer", role: "Cleared 3 technical interviews", quote: "Interview practice gave me the confidence I was missing earlier." },
];

const initials = (name) => name.split(" ").map((n) => n[0]).join("");

const Testimonials = () => (
  <section className="bg-white py-20">
    <div className="mx-auto max-w-7xl px-6">
      <SectionHeading eyebrow="Success stories" title="Aspirants who prepared with us" center />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.name} className="rounded-2xl border border-slate-200 bg-[#FAF9F6] p-6">
            <Quote size={20} className="text-teal-600" aria-hidden="true" />
            <p className="font-body mt-4 text-sm leading-relaxed text-slate-700">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 font-body text-xs font-semibold text-amber-400">
                {initials(t.name)}
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-slate-900">{t.name}</p>
                <p className="font-body text-xs text-slate-500">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
