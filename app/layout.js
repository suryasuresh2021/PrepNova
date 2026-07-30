import "./globals.css";

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
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
