"use client";

const HeroIllustration = () => (
  <svg viewBox="0 0 520 460" className="w-full h-auto" role="img" aria-labelledby="heroIllustrationTitle">
    <title id="heroIllustrationTitle">Illustration of a student studying with a laptop, growth chart, and books</title>
    <circle cx="260" cy="230" r="210" fill="#EAF6F2" />
    <rect x="70" y="300" width="150" height="18" rx="4" fill="#14213D" opacity="0.08" />

    {/* Books stack */}
    <rect x="80" y="270" width="120" height="20" rx="3" fill="#2FBF9F" />
    <rect x="90" y="250" width="110" height="20" rx="3" fill="#F2A93B" />
    <rect x="82" y="230" width="118" height="20" rx="3" fill="#14213D" />

    {/* Laptop */}
    <rect x="230" y="230" width="180" height="112" rx="10" fill="#FFFFFF" stroke="#14213D" strokeWidth="4" />
    <rect x="248" y="248" width="144" height="70" rx="4" fill="#14213D" />
    <path d="M215 342 h210 l-14 22 h-182 z" fill="#14213D" />
    <rect x="260" y="264" width="70" height="8" rx="4" fill="#2FBF9F" />
    <rect x="260" y="280" width="100" height="8" rx="4" fill="#F2A93B" />
    <rect x="260" y="296" width="55" height="8" rx="4" fill="#FFFFFF" opacity="0.5" />

    {/* Growth chart card */}
    <rect x="300" y="90" width="150" height="110" rx="14" fill="#FFFFFF" stroke="#14213D" strokeWidth="3" />
    <polyline points="316,180 345,150 372,165 400,120 428,100" fill="none" stroke="#2FBF9F" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="428" cy="100" r="7" fill="#F2A93B" />

    {/* Student silhouette */}
    <circle cx="150" cy="150" r="34" fill="#14213D" />
    <path d="M100 230 q50 -46 100 0 v20 h-100 z" fill="#14213D" />
    <circle cx="140" cy="142" r="6" fill="#FAF9F6" />
    <circle cx="162" cy="142" r="6" fill="#FAF9F6" />

    {/* Career growth arrow */}
    <path d="M420 330 l30 -70 l20 30 l40 -80" fill="none" stroke="#F2A93B" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M498 214 l12 -6 l4 13 z" fill="#F2A93B" />
  </svg>
);

export default HeroIllustration;
