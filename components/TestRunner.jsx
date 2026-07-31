"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import MathText from "./admin/MathText";
import { PrimaryButton } from "./ui/Button";

export default function TestRunner({ testId, title }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/tests/${testId}/questions`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setQuestions(data.questions || []);
      })
      .catch(() => setError("Could not load questions"))
      .finally(() => setLoading(false));
  }, [testId]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/tests/${testId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (res.ok) setResult(data);
      else setError(data.error || "Could not submit");
    } catch {
      setError("Could not submit");
    }
    setSubmitting(false);
  };

  if (loading) return <p className="font-body text-sm text-slate-500">Loading…</p>;
  if (error && !result) return <p className="font-body text-sm text-red-600">{error}</p>;

  if (result) {
    return (
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-900">{title} — Results</h1>
        <p className="font-body mt-2 text-lg font-semibold text-teal-700">
          Score: {result.score} / {result.total}
        </p>

        <ul className="mt-6 space-y-4">
          {result.results.map((r) => (
            <li key={r.id} className="rounded-xl border border-slate-200 p-4">
              <p className="font-body text-sm font-semibold text-slate-900">
                <MathText text={r.question_text} />
              </p>
              <div className="mt-2 space-y-1.5">
                {r.options.map((opt, i) => {
                  const isSelected = r.selected === i;
                  const isCorrect = r.correct_option === i;
                  return (
                    <p
                      key={i}
                      className={`font-body flex items-center gap-2 text-sm ${
                        isCorrect ? "font-medium text-teal-700" : isSelected ? "text-red-600" : "text-slate-600"
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 size={14} aria-hidden="true" />
                      ) : isSelected ? (
                        <XCircle size={14} aria-hidden="true" />
                      ) : (
                        <span className="w-3.5 flex-shrink-0" aria-hidden="true" />
                      )}
                      <MathText text={opt} />
                    </p>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-slate-900">{title}</h1>

      {questions.length === 0 ? (
        <p className="font-body mt-4 text-sm text-slate-500">No questions have been added to this test yet.</p>
      ) : (
        <>
          <div className="mt-6 space-y-6">
            {questions.map((q, qi) => (
              <div key={q.id} className="rounded-xl border border-slate-200 p-5">
                <p className="font-body text-sm font-semibold text-slate-900">
                  {qi + 1}. <MathText text={q.question_text} />
                </p>
                <div className="mt-3 space-y-2">
                  {q.options.map((opt, i) => (
                    <label key={i} className="flex items-center gap-2 font-body text-sm text-slate-700">
                      <input
                        type="radio"
                        name={q.id}
                        checked={answers[q.id] === i}
                        onChange={() => setAnswers({ ...answers, [q.id]: i })}
                        className="h-4 w-4 accent-teal-600"
                      />
                      <MathText text={opt} />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <PrimaryButton onClick={handleSubmit} disabled={submitting} className="mt-6 disabled:opacity-60">
            {submitting && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
            Submit Test
          </PrimaryButton>

          {error && <p className="font-body mt-2 text-sm text-red-600">{error}</p>}
        </>
      )}
    </div>
  );
}
