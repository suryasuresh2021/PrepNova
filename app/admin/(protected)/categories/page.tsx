import CategoriesManager from "@/components/admin/CategoriesManager";

export default function CategoriesPage() {
  return (
    <div>
      <p className="font-body mb-6 text-sm text-slate-600">
        Top-level groupings that Topics and Tests sit under (e.g. Quantitative Aptitude, Verbal Ability).
      </p>
      <CategoriesManager />
    </div>
  );
}
