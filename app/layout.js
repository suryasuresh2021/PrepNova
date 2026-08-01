import Script from "next/script";
import "./globals.css";
import "katex/dist/katex.min.css";

export const metadata = {
  title: "PrepNova — Prepare Smarter. Succeed Faster.",
  description:
    "One platform for Placement Preparation, Interview Readiness, and Competitive Exam Success. Practice topic-wise, take mock tests, and track your progress.",
  keywords: [
    "placement preparation",
    "interview preparation",
    "competitive exam",
    "UGC NET",
    "mock tests",
    "aptitude practice",
  ],
};

export default function RootLayout({ children }) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="en">
      <head>
        {adsenseClientId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
