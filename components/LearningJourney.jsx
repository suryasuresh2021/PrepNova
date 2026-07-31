"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { BookOpen, ListChecks, BarChart3, TrendingUp, GraduationCap, ChevronDown } from "lucide-react";
import { SectionHeading } from "./ui/SectionHeading";

const journey = [
  { label: "Learn", icon: BookOpen },
  { label: "Practice", icon: ListChecks },
  { label: "Analyze", icon: BarChart3 },
  { label: "Improve", icon: TrendingUp },
  { label: "Achieve Success", icon: GraduationCap },
];

const LearningJourney = () => (
  <section className="bg-white py-20">
    <div className="mx-auto max-w-7xl px-6">
      <SectionHeading eyebrow="The path" title="Your learning journey" center />

      {/* Desktop horizontal timeline */}
      <div className="relative hidden lg:block">
        <div className="absolute left-0 right-0 top-8 h-0.5 bg-slate-200" />
        <motion.div
          className="absolute left-0 top-8 h-0.5 bg-teal-500 origin-left"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
        <div className="relative grid grid-cols-5">
          {journey.map(({ label, icon: Icon }, i) => (
            <motion.div
              key={label}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
            >
              <div className="z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-teal-600 text-white shadow-sm">
                <Icon size={24} aria-hidden="true" />
              </div>
              <p className="font-body mt-4 text-sm font-semibold text-slate-800">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile vertical timeline */}
      <div className="flex flex-col items-center gap-2 lg:hidden">
        {journey.map(({ label, icon: Icon }, i) => (
          <Fragment key={label}>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-white">
                <Icon size={20} aria-hidden="true" />
              </div>
              <p className="font-body text-sm font-semibold text-slate-800">{label}</p>
            </div>
            {i < journey.length - 1 && <ChevronDown className="text-slate-300" size={18} aria-hidden="true" />}
          </Fragment>
        ))}
      </div>
    </div>
  </section>
);

export default LearningJourney;
