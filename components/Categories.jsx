"use client";

import { motion } from "framer-motion";
import {
  Calculator,
  Brain,
  MessageSquareText,
  Users,
  Award,
  ClipboardCheck,
} from "lucide-react";
import { SectionHeading } from "./ui/SectionHeading";

const categories = [
  { icon: Calculator, title: "Quantitative Aptitude", desc: "Master numbers, speed maths, and problem solving for every placement test." },
  { icon: Brain, title: "Logical Reasoning", desc: "Sharpen pattern recognition, puzzles, and analytical thinking." },
  { icon: MessageSquareText, title: "Verbal Ability", desc: "Build grammar, vocabulary, and comprehension for top scores." },
  { icon: Users, title: "Interview Preparation", desc: "Practice HR and technical rounds with structured guidance." },
  { icon: Award, title: "UGC NET", desc: "Subject-wise modules aligned to the latest UGC NET pattern." },
  { icon: ClipboardCheck, title: "Mock Tests", desc: "Simulate real exam conditions with timed, scored practice tests." },
];

const CategoryCard = ({ icon: Icon, title, desc }) => (
  <motion.div
    whileHover={{ y: -6 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-teal-300 hover:shadow-md"
  >
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-600 group-hover:text-white">
      <Icon size={22} aria-hidden="true" />
    </div>
    <h3 className="font-display mt-5 text-lg font-semibold text-slate-900">{title}</h3>
    <p className="font-body mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
  </motion.div>
);

const Categories = () => (
  <section className="bg-white py-20">
    <div className="mx-auto max-w-7xl px-6">
      <SectionHeading
        eyebrow="What you can practice"
        title="Six pillars of preparation"
        sub="Everything a placement or exam aspirant needs, organized topic by topic."
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <CategoryCard key={c.title} {...c} />
        ))}
      </div>
    </div>
  </section>
);

export default Categories;
