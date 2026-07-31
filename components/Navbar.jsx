"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Rocket } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "./ui/Button";
import { createClient } from "@/lib/supabase/client";
import SignOutButton from "./Auth/SignOutButton";

const navLinks = [
  { label: "Home", href: "/#top" },
  { label: "Courses", href: "/courses" },
  { label: "Mock Tests", href: "/tests" },
  { label: "Pricing", href: "/#pricing" },
  { label: "About", href: "/#" },
  { label: "Contact", href: "/#" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setChecked(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4" aria-label="Primary">
        <Link href="/#top" className="flex items-center gap-2 font-display text-xl font-semibold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-amber-400">
            <Rocket size={18} aria-hidden="true" />
          </span>
          PrepNova
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="font-body text-sm font-medium text-slate-600 transition hover:text-slate-900">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          {!checked ? null : user ? (
            <>
              <Link href="/dashboard" className="font-body text-sm font-semibold text-slate-700 hover:text-slate-900">
                Dashboard
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="font-body text-sm font-semibold text-slate-700 hover:text-slate-900">
                Login
              </Link>
              <Link href="/login">
                <PrimaryButton className="px-5 py-2.5">Get Started</PrimaryButton>
              </Link>
            </>
          )}
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
                <li key={link.label}>
                  <Link href={link.href} className="block py-2 font-body text-sm font-medium text-slate-700">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 flex gap-3">
                {user ? (
                  <>
                    <Link href="/dashboard" className="flex-1">
                      <SecondaryButton className="w-full px-4 py-2.5">Dashboard</SecondaryButton>
                    </Link>
                    <SignOutButton className="flex-1 justify-center px-4 py-2.5" />
                  </>
                ) : (
                  <>
                    <Link href="/login" className="flex-1">
                      <SecondaryButton className="w-full px-4 py-2.5">Login</SecondaryButton>
                    </Link>
                    <Link href="/login" className="flex-1">
                      <PrimaryButton className="w-full px-4 py-2.5">Get Started</PrimaryButton>
                    </Link>
                  </>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
