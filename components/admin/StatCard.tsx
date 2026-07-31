import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
};

export default function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="font-body text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-amber-400">
          <Icon size={16} aria-hidden="true" />
        </span>
      </div>
      <p className="font-display mt-3 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
