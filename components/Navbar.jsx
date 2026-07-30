"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Rocket } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "./ui/Button";

const navLinks = ["Home", "Courses", "Mock Tests", "Pricing", "About", "Contact"];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4" aria-label="Primary">
        <a href="#top" className="flex items-center gap-2 font-display text-xl font-semibold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-amber-400">
            <Rocket size={18} aria-hidden="true" />
          </span>
          PrepNova
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link}>
              <a href="#" className="font-body text-sm font-medium text-slate-600 transition hover:text-slate-900">
                {link}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <button className="font-body text-sm font-semibold text-slate-700 hover:text-slate-900">
            Login
          </button>
          <PrimaryButton className="px-5 py-2.5">Get Started</PrimaryButton>
        </div>

        <button
          className="lg:hidden rounded-md p-2 text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-500"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-200 lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="block py-2 font-body text-sm font-medium text-slate-700">
                    {link}
                  </a>
                </li>
              ))}
              <li className="mt-2 flex gap-3">
                <SecondaryButton className="flex-1 px-4 py-2.5">Login</SecondaryButton>
                <PrimaryButton className="flex-1 px-4 py-2.5">Get Started</PrimaryButton>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
