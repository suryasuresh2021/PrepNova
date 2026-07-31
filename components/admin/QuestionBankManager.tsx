"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Loader2, Search } from "lucide-react";

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

  const [search, setSearch] = useState("");
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        test_id: testId,
        question_text: questionText,
        options,
        correct_option: correctOption,
      }),
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
    if (!confirm("Are you sure you want to delete this question?")) return;

    await fetch(`/api/admin/questions/${id}`, {
      method: "DELETE",
    });

    await load();
  };

  const filteredQuestions = questions.filter((q) =>
    q.question_text.toLowerCase().includes(search.toLowerCase())
  );

  if (!loading && tests.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <p className="text-sm text-amber-800">
          Create at least one Test first — questions attach to a test.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Add Question */}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6"
      >
        <select
          required
          value={testId}
          onChange={(e) => setTestId(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm"
        >
          <option value="">Select Test</option>

          {tests.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>

        <textarea
          required
          rows={3}
          placeholder="Enter Question"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm"
        />

        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="radio"
                checked={correctOption === i}
                onChange={() => setCorrectOption(i)}
              />

              <input
                value={opt}
                placeholder={`Option ${i + 1}`}
                onChange={(e) => {
                  const next = [...options];
                  next[i] = e.target.value;
                  setOptions(next);
                }}
                className="w-full rounded-lg border border-slate-300 px-4 py-2"
              />
            </div>
          ))}
        </div>

        <button
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-white"
        >
          {saving ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Plus size={18} />
          )}

          Add Question
        </button>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
      </form>

      {/* Question List */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6">

        <div className="mb-5 flex items-center justify-between">

          <h2 className="text-lg font-semibold">
            All Questions ({filteredQuestions.length})
          </h2>

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-2.5 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search Questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-72 rounded-lg border border-slate-300 pl-10 pr-4 py-2 text-sm"
            />

          </div>

        </div>

        {loading ? (
          <p>Loading...</p>
        ) : filteredQuestions.length === 0 ? (
          <p>No Questions Found.</p>
        ) : (
          <ul className="divide-y divide-slate-200">

            {filteredQuestions.map((q) => (

              <li
                key={q.id}
                className="flex items-start justify-between py-4"
              >

                <div>

                  <p className="text-xs font-semibold text-teal-700">
                    {q.tests?.title}
                  </p>

                  <p className="mt-1 font-medium">
                    {q.question_text}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    ✅ Correct Answer : {q.options[q.correct_option]}
                  </p>

                </div>

                <button
                  onClick={() => handleDelete(q.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>

              </li>

            ))}

          </ul>
        )}

      </div>

    </div>
  );
}