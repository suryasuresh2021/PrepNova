"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "./ui/Button";
import { Eyebrow } from "./ui/SectionHeading";
import HeroIllustration from "./HeroIllustration";

const Hero = () => (
  <section id="top" className="relative overflow-hidden bg-[#FAF9F6]">
    <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Eyebrow>Placement · Interview · Competitive Exams</Eyebrow>
        <h1 className="font-display text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-[3.4rem]">
          Prepare Smarter.
          <br />
          Succeed Faster.
        </h1>
        <p className="font-body mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
          One platform for Placement Preparation, Interview Readiness, and Competitive Exam Success.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/login">
            <PrimaryButton>
              Start Free <ArrowRight size={16} aria-hidden="true" />
            </PrimaryButton>
          </Link>
          <Link href="/courses">
            <SecondaryButton>Explore Courses</SecondaryButton>
          </Link>
        </div>
        <div className="mt-10 flex items-center gap-6 font-body text-sm text-slate-500">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="fill-amber-400 text-amber-400" aria-hidden="true" />
            ))}
          </div>
          <span>Rated by aspirants preparing for placements &amp; UGC NET</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        <HeroIllustration />
      </motion.div>
    </div>
  </section>
);

export default Hero;
