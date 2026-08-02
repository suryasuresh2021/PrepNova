"use client";

import { useEffect, useState } from "react";
import { Trash2, Pencil, Search } from "lucide-react";
import SingleQuestionForm, { type QuestionFormValues } from "./SingleQuestionForm";
import BulkQuestionUpload from "./BulkQuestionUpload";
import AIQuestionGenerator from "./AIQuestionGenerator";
import MathText from "./MathText";

type Test = { id: string; title: string };
type Question = {
  id: string;
  test_id: string;
  question_text: string;
  options: string[];
  correct_option: number;
  explanation: string | null;
  tests: { title: string } | null;
};

type Tab = "single" | "bulk" | "ai";

export default function QuestionBankManager() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("single");
  const [searchQuery, setSearchQuery] = useState("");
  const [editing, setEditing] = useState<(QuestionFormValues & { id: string }) | null>(null);

  const load = async () => {
    setLoading(true);
    const [questionsRes, testsRes] = await Promise.all([
      fetch("/api/admin/questions"),
      fetch("/api/admin/tests"),
    ]);
    if (questionsRes.ok) setQuestions(await questionsRes.json());
    if (testsRes.ok) setTests(await testsRes.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
    if (editing?.id === id) setEditing(null);
    await load();
  };

  const startEdit = (q: Question) => {
    setEditing({
      id: q.id,
      test_id: q.test_id,
      question_text: q.question_text,
      options: [...q.options, "", "", "", ""].slice(0, 4),
      correct_option: q.correct_option,
      explanation: q.explanation || "",
    });
    setTab("single");
  };

  const handleSaved = async () => {
    setEditing(null);
    await load();
  };

  if (!loading && tests.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <p className="font-body text-sm text-amber-800">Create at least one Test first — questions attach to a test.</p>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "single", label: editing ? "Edit Question" : "Add Single" },
    { key: "bulk", label: "Bulk Upload" },
    { key: "ai", label: "AI Generate" },
  ];

  const filteredQuestions = questions.filter((q) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      q.question_text.toLowerCase().includes(query) ||
      (q.tests?.title || "").toLowerCase().includes(query) ||
      q.options.some((opt) => opt.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-1 rounded-lg bg-slate-100 p-1 sm:w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
              tab === t.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "single" && (
        <SingleQuestionForm
          tests={tests}
          initial={editing ?? undefined}
          onSaved={handleSaved}
          onCancelEdit={() => setEditing(null)}
        />
      )}
      {tab === "bulk" && <BulkQuestionUpload tests={tests} />}
      {tab === "ai" && <AIQuestionGenerator tests={tests} />}

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-base font-semibold text-slate-900">All Questions</h2>
          <div className="relative">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search questions…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>
        {loading ? (
          <p className="font-body mt-3 text-sm text-slate-500">Loading…</p>
        ) : questions.length === 0 ? (
          <p className="font-body mt-3 text-sm text-slate-500">No questions yet.</p>
        ) : filteredQuestions.length === 0 ? (
          <p className="font-body mt-3 text-sm text-slate-500">No questions match "{searchQuery}".</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {filteredQuestions.map((q) => (
              <li key={q.id} className="flex items-start justify-between gap-4 py-3">
                <div>
                  <p className="font-body text-xs font-medium text-teal-700">{q.tests?.title}</p>
                  <p className="font-body text-sm font-semibold text-slate-900">
                    <MathText text={q.question_text} />
                  </p>
                  <p className="font-body mt-1 text-xs text-slate-500">
                    Correct: <MathText text={q.options[q.correct_option] ?? ""} />
                  </p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-3">
                  <button
                    onClick={() => startEdit(q)}
                    aria-label="Edit question"
                    className="text-slate-400 transition hover:text-teal-600"
                  >
                    <Pencil size={18} aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    aria-label="Delete question"
                    className="text-slate-400 transition hover:text-red-600"
                  >
                    <Trash2 size={18} aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
