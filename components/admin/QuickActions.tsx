import Link from "next/link";
import { FolderOpen, BookOpen, ClipboardList, HelpCircle, ArrowUpRight } from "lucide-react";

const actions = [
  { label: "Add Category", href: "/admin/categories", icon: FolderOpen },
  { label: "Add Topic", href: "/admin/topics", icon: BookOpen },
  { label: "Add Test", href: "/admin/tests", icon: ClipboardList },
  { label: "Add Question", href: "/admin/question-bank", icon: HelpCircle },
];

export default function QuickActions() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-display text-base font-semibold text-slate-900">Quick Actions</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {actions.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="group flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm font-medium text-slate-700 transition hover:border-teal-300 hover:bg-teal-50"
          >
            <span className="flex items-center gap-2">
              <Icon size={16} className="text-teal-700" aria-hidden="true" />
              {label}
            </span>
            <ArrowUpRight
              size={14}
              className="text-slate-300 transition group-hover:text-teal-600"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
