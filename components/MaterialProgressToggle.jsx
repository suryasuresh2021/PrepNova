"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Circle, Loader2 } from "lucide-react";

export default function MaterialProgressToggle({ materialId, initialCompleted }) {
  const router = useRouter();
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/materials/${materialId}/progress`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setCompleted(data.completed);
        router.refresh(); // updates the category "X of Y completed" counts
      }
    } catch {
      // silently ignore — button just won't update if this fails
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`font-body mt-3 inline-flex items-center gap-1.5 text-xs font-semibold transition disabled:opacity-60 ${
        completed ? "text-teal-700 hover:text-teal-800" : "text-slate-400 hover:text-slate-600"
      }`}
    >
      {loading ? (
        <Loader2 size={13} className="animate-spin" aria-hidden="true" />
      ) : completed ? (
        <Check size={13} aria-hidden="true" />
      ) : (
        <Circle size={13} aria-hidden="true" />
      )}
      {completed ? "Marked as read" : "Mark as read"}
    </button>
  );
}
