import { Mail, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-slate-900">Contact Us</h1>
        <p className="font-body mt-4 text-lg leading-relaxed text-slate-600">
          Questions about your account, a Premium subscription, or something that isn't working
          right — we're happy to help.
        </p>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-slate-900 text-amber-400">
              <Mail size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="font-body text-sm text-slate-500">Email us at</p>
              <a
                href="mailto:prepnova.co.support@gmail.com"
                className="font-display text-xl font-semibold text-slate-900 hover:text-teal-700"
              >
                prepnova.co.support@gmail.com
              </a>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-4 border-t border-slate-100 pt-6">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <Clock size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="font-body text-sm text-slate-500">Response time</p>
              <p className="font-body text-sm text-slate-700">We typically reply within 1–2 business days.</p>
            </div>
          </div>
        </div>

        <p className="font-body mt-6 text-sm text-slate-500">
          Tip: if your question is about a payment, include the email address you used to sign up —
          it helps us find your account faster.
        </p>
      </main>
      <Footer />
    </>
  );
}
