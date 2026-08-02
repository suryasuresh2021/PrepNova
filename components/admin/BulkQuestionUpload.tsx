"use client";

import { useState } from "react";
import Papa from "papaparse";
import { Upload, Loader2, Check } from "lucide-react";
import MathText from "./MathText";

type Test = { id: string; title: string; questions_count?: number };

type ParsedRow = {
  question_text: string;
  options: string[];
  correct_option: number;
  explanation: string;
};

const TEMPLATE = `question,option1,option2,option3,option4,correct,explanation
"If 6 men can do a work in 12 days, how many days for 8 men?",6,7,8,9,4,"6x12=8x days, so days=9"
"What is $\\frac{1}{2} + \\frac{1}{3}$?",5/6,2/3,1,3/5,1,"Common denominator 6: 3/6+2/6=5/6"`;

export default function BulkQuestionUpload({ tests }: { tests: Test[] }) {
  const [testId, setTestId] = useState("");
  const [rawText, setRawText] = useState("");
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const parseCsv = (csvText: string) => {
    setParseError(null);
    setResult(null);
    const parsed = Papa.parse<Record<string, string>>(csvText.trim(), { header: true, skipEmptyLines: true });

    if (parsed.errors.length > 0) {
      setParseError(parsed.errors[0].message);
      setParsedRows([]);
      return;
    }

    const rows: ParsedRow[] = [];
    for (const row of parsed.data) {
      const question_text = row.question?.trim();
      const options = [row.option1, row.option2, row.option3, row.option4].map((o) => (o ?? "").trim());
      const correctRaw = Number(row.correct);
      if (!question_text || options.filter(Boolean).length < 2 || !correctRaw) continue;
      rows.push({ question_text, options, correct_option: correctRaw - 1, explanation: (row.explanation ?? "").trim() });
    }

    if (rows.length === 0) {
      setParseError("No valid rows found. Check the template format below.");
    }
    setParsedRows(rows);
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result);
      setRawText(text);
      parseCsv(text);
    };
    reader.readAsText(file);
  };

  const handleSave = async () => {
    if (!testId || parsedRows.length === 0) return;
    setSaving(true);
    setResult(null);

    const res = await fetch("/api/admin/questions/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test_id: testId, questions: parsedRows }),
    });

    if (res.ok) {
      const data = await res.json();
      setResult(`${data.inserted} question(s) added.`);
      setParsedRows([]);
      setRawText("");
    } else {
      const data = await res.json();
      setParseError(data.error || "Could not save questions");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <select
        required
        value={testId}
        onChange={(e) => setTestId(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
      >
        <option value="">Select a test to add these questions to…</option>
        {tests.map((t) => (
          <option key={t.id} value={t.id}>
            {t.title} — {t.questions_count ?? 0} question{t.questions_count === 1 ? "" : "s"}
          </option>
        ))}
      </select>

      <div className="rounded-lg border-2 border-dashed border-slate-300 p-6 text-center">
        <Upload size={20} className="mx-auto text-slate-400" aria-hidden="true" />
        <label className="mt-2 block cursor-pointer font-body text-sm font-medium text-teal-700 hover:text-teal-800">
          Upload a CSV file
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </label>
        <p className="font-body mt-1 text-xs text-slate-400">or paste CSV text below</p>
      </div>

      <textarea
        value={rawText}
        onChange={(e) => {
          setRawText(e.target.value);
          if (e.target.value.trim()) parseCsv(e.target.value);
          else {
            setParsedRows([]);
            setParseError(null);
          }
        }}
        placeholder={TEMPLATE}
        rows={5}
        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 font-mono text-xs focus:border-teal-500 focus:outline-none"
      />

      <details className="font-body text-xs text-slate-500">
        <summary className="cursor-pointer font-medium text-slate-600">CSV format / template</summary>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-50 p-3">{TEMPLATE}</pre>
        <p className="mt-2">
          Columns: <code>question, option1, option2, option3, option4, correct, explanation</code> —{" "}
          <code>correct</code> is the option number (1–4), <code>explanation</code> is optional. Math
          works with <code>$...$</code>.
        </p>
      </details>

      {parseError && <p className="font-body text-sm text-red-600">{parseError}</p>}

      {parsedRows.length > 0 && (
        <div>
          <p className="font-body mb-2 text-sm font-medium text-slate-700">
            Preview — {parsedRows.length} question{parsedRows.length !== 1 ? "s" : ""} ready to import
          </p>
          <ul className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-slate-100 p-3">
            {parsedRows.map((r, i) => (
              <li key={i} className="font-body text-sm text-slate-700">
                <MathText text={r.question_text} /> —{" "}
                <span className="text-teal-700">{r.options[r.correct_option]}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleSave}
            disabled={saving || !testId}
            className="font-body mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {saving ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Check size={16} aria-hidden="true" />}
            Import {parsedRows.length} Question{parsedRows.length !== 1 ? "s" : ""}
          </button>
        </div>
      )}

      {result && <p className="font-body text-sm text-teal-700">{result}</p>}
    </div>
  );
}
