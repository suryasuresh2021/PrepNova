"use client";

import { useState } from "react";
import { Sparkles, Loader2, Trash2, Check } from "lucide-react";
import MathText from "./MathText";

type Test = { id: string; title: string; questions_count?: number };
type GeneratedQuestion = {
  question_text: string;
  options: string[];
  correct_option: number;
  explanation?: string;
};

export default function AIQuestionGenerator({ tests }: { tests: Test[] }) {
  const [testId, setTestId] = useState("");
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [generated, setGenerated] = useState<GeneratedQuestion[]>([]);

  const handleGenerate = async () => {
    if (!topic) return;
    setGenerating(true);
    setError(null);
    setResult(null);

    const res = await fetch("/api/admin/questions/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, count }),
    });

    if (res.ok) {
      const data = await res.json();
      setGenerated(data.questions || []);
    } else {
      const data = await res.json();
      setError(data.error || "Could not generate questions");
    }
    setGenerating(false);
  };

  const removeQuestion = (index: number) => {
    setGenerated(generated.filter((_, i) => i !== index));
  };

  const handleSaveAll = async () => {
    if (!testId || generated.length === 0) return;
    setSaving(true);
    setError(null);

    const res = await fetch("/api/admin/questions/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test_id: testId, questions: generated }),
    });

    if (res.ok) {
      const data = await res.json();
      setResult(`${data.inserted} question(s) saved.`);
      setGenerated([]);
    } else {
      const data = await res.json();
      setError(data.error || "Could not save questions");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="rounded-lg bg-slate-50 p-3">
        <p className="font-body text-xs text-slate-500">
          Uses your own Anthropic API key (set as <code>ANTHROPIC_API_KEY</code>) — separate from any Claude
          chat, billed to your Anthropic account.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <input
          placeholder="Topic (e.g. Time & Work)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none sm:col-span-2"
        />
        <input
          type="number"
          min={1}
          max={20}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={generating || !topic}
        className="font-body inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
      >
        {generating ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Sparkles size={16} aria-hidden="true" />}
        Generate Questions
      </button>

      {error && <p className="font-body text-sm text-red-600">{error}</p>}

      {generated.length > 0 && (
        <div>
          <p className="font-body mb-2 text-sm font-medium text-slate-700">
            {generated.length} question{generated.length !== 1 ? "s" : ""} generated — review before saving
          </p>
          <ul className="max-h-80 space-y-3 overflow-y-auto rounded-lg border border-slate-100 p-3">
            {generated.map((q, i) => (
              <li key={i} className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div className="font-body text-sm text-slate-700">
                  <MathText text={q.question_text} />
                  <p className="mt-1 text-xs text-teal-700">
                    Correct: <MathText text={q.options[q.correct_option]} />
                  </p>
                  {q.explanation && (
                    <p className="mt-1 text-xs text-slate-500">
                      <MathText text={q.explanation} />
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeQuestion(i)}
                  aria-label="Remove this question"
                  className="flex-shrink-0 text-slate-400 hover:text-red-600"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              required
              value={testId}
              onChange={(e) => setTestId(e.target.value)}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
            >
              <option value="">Save to which test?</option>
              {tests.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} — {t.questions_count ?? 0} question{t.questions_count === 1 ? "" : "s"}
                </option>
              ))}
            </select>
            <button
              onClick={handleSaveAll}
              disabled={saving || !testId}
              className="font-body inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
            >
              {saving ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Check size={16} aria-hidden="true" />}
              Save All to Question Bank
            </button>
          </div>
        </div>
      )}

      {result && <p className="font-body text-sm text-teal-700">{result}</p>}
    </div>
  );
}
