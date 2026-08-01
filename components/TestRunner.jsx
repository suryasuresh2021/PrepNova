"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, CheckCircle2, XCircle, MinusCircle, Clock } from "lucide-react";
import MathText from "./admin/MathText";
import { PrimaryButton } from "./ui/Button";
import { getResultMessage } from "@/lib/resultMessages";

export default function TestRunner({ testId, title }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    fetch(`/api/tests/${testId}/questions`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else {
          setQuestions(data.questions || []);
          startTimeRef.current = Date.now();
        }
      })
      .catch(() => setError("Could not load questions"))
      .finally(() => setLoading(false));
  }, [testId]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    const timeTakenSeconds = startTimeRef.current ? Math.round((Date.now() - startTimeRef.current) / 1000) : null;

    try {
      const res = await fetch(`/api/tests/${testId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, time_taken_seconds: timeTakenSeconds }),
      });
      const data = await res.json();
      if (res.ok) setResult({ ...data, timeTakenSeconds });
      else setError(data.error || "Could not submit");
    } catch {
      setError("Could not submit");
    }
    setSubmitting(false);
  };

  if (loading) return <p className="font-body text-sm text-slate-500">Loading…</p>;
  if (error && !result) return <p className="font-body text-sm text-red-600">{error}</p>;

  if (result) {
    const percent = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;
    const incorrectCount = result.results.filter((r) => !r.isCorrect && r.selected !== null).length;
    const unansweredCount = result.results.filter((r) => r.selected === null).length;
    const { emoji, message } = getResultMessage(percent);
    const minutes = result.timeTakenSeconds ? Math.floor(result.timeTakenSeconds / 60) : 0;
    const seconds = result.timeTakenSeconds ? result.timeTakenSeconds % 60 : 0;

    return (
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-900">{title} — Results</h1>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 text-center">
          <p className="text-4xl" aria-hidden="true">{emoji}</p>
          <p className="font-display mt-2 text-xl font-semibold text-slate-900">{message}</p>

          <div className="mx-auto mt-5 grid max-w-xs grid-cols-2 gap-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="font-body text-xs uppercase tracking-wide text-slate-500">Marks</p>
              <p className="font-display mt-1 text-2xl font-bold text-slate-900">
                {result.score}/{result.total}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="font-body text-xs uppercase tracking-wide text-slate-500">Percentage</p>
              <p className="font-display mt-1 text-2xl font-bold text-teal-700">{percent}%</p>
            </div>
          </div>

          <div className="mx-auto mt-4 h-2.5 w-full max-w-sm overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-teal-600" style={{ width: `${percent}%` }} />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-display text-lg font-semibold text-teal-700">{result.score}</p>
              <p className="font-body text-xs text-slate-500">Correct</p>
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-red-600">{incorrectCount}</p>
              <p className="font-body text-xs text-slate-500">Incorrect</p>
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-slate-500">{unansweredCount}</p>
              <p className="font-body text-xs text-slate-500">Unanswered</p>
            </div>
          </div>

          {result.timeTakenSeconds != null && (
            <p className="font-body mt-4 inline-flex items-center gap-1.5 text-xs text-slate-400">
              <Clock size={12} aria-hidden="true" /> Completed in {minutes}m {seconds}s
            </p>
          )}
        </div>

        <h2 className="font-display mt-8 text-lg font-semibold text-slate-900">Review</h2>
        <ul className="mt-4 space-y-4">
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
                {r.selected === null && (
                  <p className="font-body flex items-center gap-2 text-xs text-slate-400">
                    <MinusCircle size={12} aria-hidden="true" /> Not answered
                  </p>
                )}
              </div>
              {r.explanation && (
                <div className="mt-3 rounded-lg bg-slate-50 p-3">
                  <p className="font-body text-xs font-semibold text-slate-500">Explanation</p>
                  <p className="font-body mt-1 text-sm text-slate-700">
                    <MathText text={r.explanation} />
                  </p>
                </div>
              )}
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
