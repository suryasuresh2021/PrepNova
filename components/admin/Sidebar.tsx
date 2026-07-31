"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  FolderOpen,
  BookOpen,
  HelpCircle,
  ClipboardList,
  Users,
  TrendingUp,
  CreditCard,
  Settings,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  X,
  Rocket,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { NavItem } from "./types";

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: BarChart3 },
  { label: "Categories", href: "/admin/categories", icon: FolderOpen },
  { label: "Topics", href: "/admin/topics", icon: BookOpen },
  { label: "Question Bank", href: "/admin/question-bank", icon: HelpCircle },
  { label: "Tests", href: "/admin/tests", icon: ClipboardList },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Results", href: "/admin/results", icon: TrendingUp },
  { label: "Premium Plans", href: "/admin/premium-plans", icon: CreditCard },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

type SidebarProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const renderContent = (forceExpanded: boolean) => {
    const showLabels = forceExpanded || !collapsed;
    return (
      <div className="flex h-full flex-col bg-slate-900 text-slate-300">
        <div className="flex items-center gap-2 px-4 py-5">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-amber-400 text-slate-900">
            <Rocket size={18} aria-hidden="true" />
          </span>
          {showLabels && <span className="font-display text-lg font-semibold text-white">PrepNova</span>}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2" aria-label="Admin navigation">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                title={showLabels ? undefined : item.label}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <Icon size={18} className="flex-shrink-0" aria-hidden="true" />
                {showLabels && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 px-3 py-3">
          <button
            onClick={handleLogout}
            title={showLabels ? undefined : "Logout"}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-slate-800/60 hover:text-white"
          >
            <LogOut size={18} className="flex-shrink-0" aria-hidden="true" />
            {showLabels && <span>Logout</span>}
          </button>

          {!forceExpanded && (
            <button
              onClick={onToggleCollapse}
              className="mt-1 hidden w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-800/60 hover:text-white lg:flex"
            >
              {collapsed ? (
                <ChevronsRight size={18} className="flex-shrink-0" aria-hidden="true" />
              ) : (
                <>
                  <ChevronsLeft size={18} className="flex-shrink-0" aria-hidden="true" />
                  <span>Collapse</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop: fixed sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 76 : 240 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="sticky top-0 hidden h-screen flex-shrink-0 lg:block"
      >
        {renderContent(false)}
      </motion.aside>

      {/* Mobile: drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
            >
              <div className="relative h-full">
                <button
                  onClick={onCloseMobile}
                  aria-label="Close menu"
                  className="absolute right-3 top-4 z-10 rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X size={18} aria-hidden="true" />
                </button>
                {renderContent(true)}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
