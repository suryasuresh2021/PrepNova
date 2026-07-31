"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const titleMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/categories": "Categories",
  "/admin/topics": "Topics",
  "/admin/materials": "Materials",
  "/admin/question-bank": "Question Bank",
  "/admin/tests": "Tests",
  "/admin/users": "Users",
  "/admin/results": "Results",
  "/admin/premium-plans": "Premium Plans",
  "/admin/settings": "Settings",
};

function getTitle(pathname: string) {
  if (titleMap[pathname]) return titleMap[pathname];
  const match = Object.keys(titleMap).find((key) => key !== "/admin" && pathname.startsWith(key));
  return match ? titleMap[match] : "Admin";
}

export default function AdminShell({
  adminEmail,
  children,
}: {
  adminEmail: string;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#FAF9F6]">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar title={getTitle(pathname)} adminEmail={adminEmail} onOpenMobileSidebar={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
