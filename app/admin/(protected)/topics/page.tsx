import TopicsManager from "@/components/admin/TopicsManager";

export default function TopicsPage() {
  return (
    <div>
      <p className="font-body mb-6 text-sm text-slate-600">
        Topics sit inside a Category — this is the level Questions and Tests are organized under.
      </p>
      <TopicsManager />
    </div>
  );
}
