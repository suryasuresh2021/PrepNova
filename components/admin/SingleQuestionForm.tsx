"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, X } from "lucide-react";
import MathText from "./MathText";

type Test = { id: string; title: string };

export type QuestionFormValues = {
  test_id: string;
  question_text: string;
  options: string[];
  correct_option: number;
  explanation?: string;
};

type SingleQuestionFormProps = {
  tests: Test[];
  initial?: QuestionFormValues & { id?: string };
  onSaved: () => void;
  onCancelEdit?: () => void;
};

const emptyValues: QuestionFormValues = {
  test_id: "",
  question_text: "",
  options: ["", "", "", ""],
  correct_option: 0,
  explanation: "",
};

export default function SingleQuestionForm({ tests, initial, onSaved, onCancelEdit }: SingleQuestionFormProps) {
  const [values, setValues] = useState<QuestionFormValues>(initial ?? emptyValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(initial?.id);

  useEffect(() => {
    setValues(initial ?? emptyValues);
  }, [initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const url = isEditing ? `/api/admin/questions/${initial!.id}` : "/api/admin/questions";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      if (!isEditing) setValues(emptyValues);
      onSaved();
    } else {
      const data = await res.json();
      setError(data.error || "Could not save question");
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <select
        required
        value={values.test_id}
        onChange={(e) => setValues({ ...values, test_id: e.target.value })}
        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
      >
        <option value="">Select a test…</option>
        {tests.map((t) => (
          <option key={t.id} value={t.id}>
            {t.title}
          </option>
        ))}
      </select>

      <div>
        <textarea
          required
          placeholder="Question text — wrap math in $...$, e.g. What is $\frac{1}{2} + \frac{1}{3}$?"
          value={values.question_text}
          onChange={(e) => setValues({ ...values, question_text: e.target.value })}
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
        />
        {values.question_text && (
          <p className="font-body mt-1.5 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <span className="mr-1 text-xs text-slate-400">Preview:</span>
            <MathText text={values.question_text} />
          </p>
        )}
      </div>

      <div className="space-y-2">
        {values.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="radio"
              name="correct_option"
              checked={values.correct_option === i}
              onChange={() => setValues({ ...values, correct_option: i })}
              aria-label={`Mark option ${i + 1} as correct`}
              className="h-4 w-4 flex-shrink-0 accent-teal-600"
            />
            <input
              placeholder={`Option ${i + 1}${i < 2 ? " (required)" : ""}`}
              value={opt}
              onChange={(e) => {
                const next = [...values.options];
                next[i] = e.target.value;
                setValues({ ...values, options: next });
              }}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
            />
            {opt && <MathText text={opt} className="flex-shrink-0 text-sm text-slate-500" />}
          </div>
        ))}
        <p className="font-body text-xs text-slate-400">
          Select the radio button next to the correct answer. Math works in options too.
        </p>
      </div>

      <div>
        <textarea
          placeholder="Explanation (optional) — shown to students after they submit the test"
          value={values.explanation || ""}
          onChange={(e) => setValues({ ...values, explanation: e.target.value })}
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
        />
        {values.explanation && (
          <p className="font-body mt-1.5 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <span className="mr-1 text-xs text-slate-400">Preview:</span>
            <MathText text={values.explanation} />
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="font-body inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          {saving ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
          {isEditing ? "Save Changes" : "Add Question"}
        </button>
        {isEditing && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="font-body inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            <X size={16} aria-hidden="true" /> Cancel
          </button>
        )}
      </div>

      {error && <p className="font-body text-sm text-red-600">{error}</p>}
    </form>
  );
}
