"use client";

import { ChevronRight } from "lucide-react";
import { PrimaryButton } from "./ui/Button";

const CTA = () => (
  <section className="bg-slate-900 py-20">
    <div className="mx-auto max-w-3xl px-6 text-center">
      <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">Start your preparation today</h2>
      <p className="font-body mt-4 text-slate-300">Join PrepNova and turn consistent practice into real results.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <PrimaryButton>Register Free</PrimaryButton>
        <button className="font-body inline-flex items-center gap-2 rounded-lg border border-slate-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
          View Courses <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  </section>
);

export default CTA;
