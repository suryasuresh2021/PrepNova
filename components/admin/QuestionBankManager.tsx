"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Loader2 } from "lucide-react";

type Test = { id: string; title: string };
type Question = {
  id: string;
  question_text: string;
  options: string[];
  correct_option: number;
  tests: { title: string } | null;
};

const emptyOptions = ["", "", "", ""];

export default function QuestionBankManager() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testId, setTestId] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<string[]>(emptyOptions);
  const [correctOption, setCorrectOption] = useState(0);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch("/api/admin/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test_id: testId, question_text: questionText, options, correct_option: correctOption }),
    });

    if (res.ok) {
      setQuestionText("");
      setOptions(emptyOptions);
      setCorrectOption(0);
      await load();
    } else {
      const data = await res.json();
      setError(data.error || "Could not save question");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
    await load();
  };

  if (!loading && tests.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <p className="font-body text-sm text-amber-800">Create at least one Test first — questions attach to a test.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        <select
          required
          value={testId}
          onChange={(e) => setTestId(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
        >
          <option value="">Select a test…</option>
          {tests.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>

        <textarea
          required
          placeholder="Question text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
        />

        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name="correct_option"
                checked={correctOption === i}
                onChange={() => setCorrectOption(i)}
                aria-label={`Mark option ${i + 1} as correct`}
                className="h-4 w-4 flex-shrink-0 accent-teal-600"
              />
              <input
                placeholder={`Option ${i + 1}${i < 2 ? " (required)" : ""}`}
                value={opt}
                onChange={(e) => {
                  const next = [...options];
                  next[i] = e.target.value;
                  setOptions(next);
                }}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
          ))}
          <p className="font-body text-xs text-slate-400">Select the radio button next to the correct answer.</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="font-body inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          {saving ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
          Add Question
        </button>

        {error && <p className="font-body text-sm text-red-600">{error}</p>}
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-display text-base font-semibold text-slate-900">All Questions</h2>
        {loading ? (
          <p className="font-body mt-3 text-sm text-slate-500">Loading…</p>
        ) : questions.length === 0 ? (
          <p className="font-body mt-3 text-sm text-slate-500">No questions yet — add your first one above.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {questions.map((q) => (
              <li key={q.id} className="flex items-start justify-between gap-4 py-3">
                <div>
                  <p className="font-body text-xs font-medium text-teal-700">{q.tests?.title}</p>
                  <p className="font-body text-sm font-semibold text-slate-900">{q.question_text}</p>
                  <p className="font-body mt-1 text-xs text-slate-500">
                    Correct: {q.options[q.correct_option]}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(q.id)}
                  aria-label="Delete question"
                  className="flex-shrink-0 text-slate-400 transition hover:text-red-600"
                >
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
