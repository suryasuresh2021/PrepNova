"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "./ui/Button";
import { SectionHeading } from "./ui/SectionHeading";
import PremiumCheckout from "./Payment/PremiumCheckout";

const freeFeatures = ["Limited Practice", "Daily Quiz", "Basic Analytics", "Community Access"];
const premiumFeatures = [
  "Unlimited Practice",
  "Complete Study Materials",
  "Full Mock Tests",
  "Performance Analytics",
  "Interview Preparation",
  "Competitive Exam Modules",
];

const Pricing = () => {
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <section className="bg-[#FAF9F6] py-20">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading eyebrow="Plans" title="Simple, honest pricing" center />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <h3 className="font-display text-xl font-semibold text-slate-900">Free</h3>
            <p className="font-body mt-1 text-sm text-slate-500">Get started at no cost</p>
            <ul className="mt-6 space-y-3">
              {freeFeatures.map((item) => (
                <li key={item} className="flex items-start gap-3 font-body text-sm text-slate-700">
                  <Check size={16} className="mt-0.5 flex-shrink-0 text-teal-600" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <SecondaryButton className="mt-8 w-full">Register Free</SecondaryButton>
          </div>

          <div className="relative rounded-2xl border-2 border-amber-400 bg-slate-900 p-8">
            <span className="absolute -top-3 left-8 rounded-full bg-amber-400 px-3 py-1 font-body text-xs font-semibold text-slate-900">
              Most popular
            </span>
            <h3 className="font-display text-xl font-semibold text-white">Premium</h3>
            <p className="font-body mt-1 text-sm text-slate-300">Full access, every category</p>
            <ul className="mt-6 space-y-3">
              {premiumFeatures.map((item) => (
                <li key={item} className="flex items-start gap-3 font-body text-sm text-slate-200">
                  <Check size={16} className="mt-0.5 flex-shrink-0 text-amber-400" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            {!showCheckout ? (
              <PrimaryButton className="mt-8 w-full" onClick={() => setShowCheckout(true)}>
                Upgrade to Premium
              </PrimaryButton>
            ) : (
              <div className="mt-8 border-t border-slate-700 pt-6">
                <PremiumCheckout />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
