"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type TopbarProps = {
  title: string;
  adminEmail: string;
  onOpenMobileSidebar: () => void;
};

export default function Topbar({ title, adminEmail, onOpenMobileSidebar }: TopbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          aria-label="Open menu"
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={20} aria-hidden="true" />
        </button>
        <h1 className="font-display text-lg font-semibold text-slate-900 sm:text-xl">{title}</h1>
      </div>

      <div className="hidden flex-1 max-w-md items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
        <Search size={16} className="text-slate-400" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search users, tests, topics…"
          className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
          aria-label="Global search"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          aria-label="Notifications"
          className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          <Bell size={20} aria-hidden="true" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-400" aria-hidden="true" />
        </button>

        <div className="relative">
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-2 hover:bg-slate-100"
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-amber-400">
              {adminEmail.slice(0, 2).toUpperCase()}
            </span>
            <span className="hidden font-body text-sm font-medium text-slate-700 sm:inline">Super Admin</span>
            <ChevronDown size={16} className="text-slate-400" aria-hidden="true" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} aria-hidden="true" />
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg"
                >
                  <div className="border-b border-slate-100 px-3 py-2">
                    <p className="font-body text-xs text-slate-400">Signed in as</p>
                    <p className="font-body truncate text-sm font-medium text-slate-800">{adminEmail}</p>
                  </div>
                  <Link
                    href="/admin/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <User size={16} aria-hidden="true" /> Profile
                  </Link>
                  <Link
                    href="/admin/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <Settings size={16} aria-hidden="true" /> Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} aria-hidden="true" /> Logout
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
