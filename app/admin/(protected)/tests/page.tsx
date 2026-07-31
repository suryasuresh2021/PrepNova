import AdminTestsManager from "@/components/admin/AdminTestsManager";

export default function TestsPage() {
  return (
    <div>
      <p className="font-body mb-6 text-sm text-slate-600">
        Create topic-wise practice tests and set a price for each one (₹0 = included in the Free plan).
      </p>
      <AdminTestsManager />
    </div>
  );
}
