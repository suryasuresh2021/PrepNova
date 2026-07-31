import QuestionBankManager from "@/components/admin/QuestionBankManager";

export default function QuestionBankPage() {
  return (
    <div>
      <p className="font-body mb-6 text-sm text-slate-600">
        Add multiple-choice questions to a test. The test-taking experience for users comes next.
      </p>
      <QuestionBankManager />
    </div>
  );
}
