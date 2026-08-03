import ConceptsManager from "@/components/admin/ConceptsManager";

export default function ConceptsPage() {
  return (
    <div>
      <p className="font-body mb-6 text-sm text-slate-600">
        Add explanations, worked examples, and educational content under a Topic. Concepts are
        public and viewable without login by default — check "Premium only" to restrict one.
      </p>
      <ConceptsManager />
    </div>
  );
}
