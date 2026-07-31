"use client";

import { Map, ListChecks, BarChart3, FileCheck2 } from "lucide-react";
import { SectionHeading } from "./ui/SectionHeading";

const features = [
  { icon: Map, title: "Structured Learning Paths", desc: "A clear route from fundamentals to advanced practice, topic by topic." },
  { icon: ListChecks, title: "Topic-wise Practice", desc: "Drill down into exactly the skill you need to improve today." },
  { icon: BarChart3, title: "Performance Analytics", desc: "Track accuracy, speed, and weak areas after every attempt." },
  { icon: FileCheck2, title: "Mock Tests & Assessments", desc: "Full-length, timed tests that mirror real exam conditions." },
];

const WhyChooseUs = () => (
  <section className="bg-[#FAF9F6] py-20">
    <div className="mx-auto max-w-7xl px-6">
      <SectionHeading eyebrow="Why PrepNova" title="Built for consistent, measurable progress" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-2xl bg-white p-6 border border-slate-200">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900 text-amber-400">
              <Icon size={20} aria-hidden="true" />
            </div>
            <h3 className="font-display mt-5 text-base font-semibold text-slate-900">{title}</h3>
            <p className="font-body mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
