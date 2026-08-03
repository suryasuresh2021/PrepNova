import Link from "next/link";
import { Lightbulb, ArrowRight } from "lucide-react";
import { SectionHeading } from "./ui/SectionHeading";
import MathText from "./admin/MathText";

export default function LatestConcepts({ concepts }) {
  if (!concepts || concepts.length === 0) return null;

  return (
    <section className="bg-[#FAF9F6] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Fresh content"
          title="Latest Concepts"
          sub="New explanations and examples, added as they're published — free to read, no sign-up needed."
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {concepts.map((c) => (
            <Link
              key={c.id}
              href={`/concepts/${c.id}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-teal-300 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Lightbulb size={18} aria-hidden="true" />
              </div>
              <p className="font-body mt-4 text-xs font-semibold uppercase tracking-wide text-teal-700">
                {c.topics?.categories?.name} · {c.topics?.name}
              </p>
              <h3 className="font-display mt-1 text-lg font-semibold text-slate-900">{c.title}</h3>
              {c.explanation && (
                <p className="font-body mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                  <MathText text={c.explanation} />
                </p>
              )}
              <span className="font-body mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 group-hover:text-teal-800">
                Read more <ArrowRight size={14} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
