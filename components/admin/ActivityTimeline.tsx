import { UserPlus, ClipboardList, IndianRupee, type LucideIcon } from "lucide-react";

export type ActivityEvent = {
  id: string;
  type: "signup" | "test_created" | "payment";
  description: string;
  created_at: string;
};

const iconByType: Record<ActivityEvent["type"], LucideIcon> = {
  signup: UserPlus,
  test_created: ClipboardList,
  payment: IndianRupee,
};

function timeAgo(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ActivityTimeline({ events }: { events: ActivityEvent[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-display text-base font-semibold text-slate-900">Recent Activity</h2>

      {events.length === 0 ? (
        <p className="font-body mt-4 text-sm text-slate-500">Nothing to show yet.</p>
      ) : (
        <ol className="mt-4 space-y-4">
          {events.map((event) => {
            const Icon = iconByType[event.type];
            return (
              <li key={event.id} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                  <Icon size={14} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-body text-sm text-slate-700">{event.description}</p>
                  <p className="font-body text-xs text-slate-400">{timeAgo(event.created_at)}</p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
