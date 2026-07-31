"use client";

export const Eyebrow = ({ children, dark }) => (
  <p
    className={`font-body text-xs font-semibold tracking-[0.2em] uppercase mb-3 ${
      dark ? "text-amber-300" : "text-teal-700"
    }`}
  >
    {children}
  </p>
);

export const SectionHeading = ({ eyebrow, title, sub, dark, center }) => (
  <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""} mb-12`}>
    <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
    <h2
      className={`font-display text-3xl sm:text-4xl font-semibold leading-tight ${
        dark ? "text-white" : "text-slate-900"
      }`}
    >
      {title}
    </h2>
    {sub && (
      <p
        className={`font-body mt-4 text-base leading-relaxed ${
          dark ? "text-slate-300" : "text-slate-600"
        }`}
      >
        {sub}
      </p>
    )}
  </div>
);
