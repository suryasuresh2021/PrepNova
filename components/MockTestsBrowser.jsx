"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, ArrowRight, Search } from "lucide-react";
import { canAccessTest } from "@/lib/accessRules";

export default function MockTestsBrowser({ tests, isLoggedIn, isPremium }) {
  const [searchQuery, setSearchQuery] = useState("");

  const query = searchQuery.trim().toLowerCase();
  const filtered = tests.filter((t) => {
    if (!query) return true;
    return (
      t.title.toLowerCase().includes(query) ||
      t.topic.toLowerCase().includes(query) ||
      (t.description || "").toLowerCase().includes(query)
    );
  });

  const grouped = {};
  filtered.forEach((t) => {
    grouped[t.topic] = grouped[t.topic] || [];
    grouped[t.topic].push(t);
  });

  return (
    <>
      <div className="relative mt-6 max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search tests by title or topic…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-teal-500 focus:outline-none"
        />
      </div>

      {tests.length === 0 ? (
        <p className="font-body mt-8 text-sm text-slate-500">No tests have been added yet — check back soon.</p>
      ) : Object.keys(grouped).length === 0 ? (
        <p className="font-body mt-8 text-sm text-slate-500">No tests match "{searchQuery}".</p>
      ) : (
        <div className="mt-8 space-y-10">
          {Object.entries(grouped).map(([topic, list]) => (
            <div key={topic}>
              <h2 className="font-display text-lg font-semibold text-slate-900">{topic}</h2>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {list.map((t) => {
                  const accessible = canAccessTest(t, isPremium);
                  const href = !isLoggedIn ? "/login" : accessible ? `/tests/${t.id}` : "/#pricing";

                  return (
                    <div key={t.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-body text-sm font-semibold text-slate-900">{t.title}</p>
                          {t.description && (
                            <p className="font-body mt-1 text-xs text-slate-500">{t.description}</p>
                          )}
                        </div>
                        {t.price_inr > 0 && (
                          <span className="flex-shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            ₹{t.price_inr}
                          </span>
                        )}
                      </div>
                      <Link
                        href={href}
                        className="font-body mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800"
                      >
                        {accessible ? (
                          <>
                            Start Test <ArrowRight size={14} aria-hidden="true" />
                          </>
                        ) : (
                          <>
                            Unlock with Premium <Lock size={14} aria-hidden="true" />
                          </>
                        )}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
