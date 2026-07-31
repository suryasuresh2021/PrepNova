import MaterialsManager from "@/components/admin/MaterialsManager";

export default function MaterialsPage() {
  return (
    <div>
      <p className="font-body mb-6 text-sm text-slate-600">
        Add reading materials, links, PDFs, or videos under a Category, and mark each one Free or
        Premium.
      </p>
      <MaterialsManager />
    </div>
  );
}
