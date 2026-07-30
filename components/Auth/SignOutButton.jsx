"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton({ className = "" }) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className={`font-body inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900 ${className}`}
    >
      <LogOut size={16} aria-hidden="true" /> Sign out
    </button>
  );
}
