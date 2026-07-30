"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "./ui/SectionHeading";

const faqs = [
  { q: "Is PrepNova free to use?", a: "Yes. You can create a free account with access to limited practice material, daily quizzes, and basic analytics. Premium unlocks the full library." },
  { q: "What does the Premium plan include?", a: "Premium gives unlimited practice, complete study materials, full-length mock tests, detailed analytics, interview preparation, and competitive exam modules like UGC NET." },
  { q: "Can I switch from Free to Premium later?", a: "Yes, you can upgrade at any time from your account, and your progress carries over automatically." },
  { q: "Are mock tests topic-wise or full-length?", a: "Both. You can practice a single topic in a few minutes or take a full-length timed mock test that mirrors the real exam." },
  { q: "How is my performance tracked?", a: "Every attempt updates your personal analytics dashboard, showing accuracy, speed, and topics that need more practice." },
];

const FAQItem = ({ q, a, isOpen, onToggle }) => (
  <div className="border-b border-slate-200 py-5">
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between text-left font-body font-medium text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-500"
      aria-expanded={isOpen}
    >
      {q}
      <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
        <ChevronDown size={18} aria-hidden="true" />
      </motion.span>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <p className="font-body pt-3 text-sm leading-relaxed text-slate-600">{a}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section className="bg-[#FAF9F6] py-20">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" center />
        <div>
          {faqs.map((f, i) => (
            <FAQItem
              key={f.q}
              q={f.q}
              a={f.a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
