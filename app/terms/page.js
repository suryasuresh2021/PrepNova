import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-3xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-slate-900">Terms & Conditions</h1>
        <p className="font-body mt-2 text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="font-body prose prose-slate mt-8 max-w-none space-y-6 text-sm leading-relaxed text-slate-700">
          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900">1. Using PrepNova</h2>
            <p className="mt-2">
              By creating an account or using this platform, you agree to these terms. PrepNova provides
              placement preparation, interview readiness, and competitive exam materials, tests, and
              concept explanations on a Free and Premium basis.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900">2. Accounts</h2>
            <p className="mt-2">
              You're responsible for keeping your account credentials secure and for all activity under
              your account. Provide accurate information when signing up. One account is for one person —
              please don't share logins.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900">3. Free and Premium plans</h2>
            <p className="mt-2">
              The Free plan gives access to limited practice content. Premium is a paid subscription that
              unlocks the complete library of tests, materials, and concepts, billed as shown at checkout.
              Prices are listed in Indian Rupees (₹) and may change with notice on the Pricing page.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900">4. Payments and refunds</h2>
            <p className="mt-2">
              Payments are processed securely through Razorpay. Because Premium access is granted
              immediately upon successful payment, subscriptions are generally non-refundable once
              activated, except where required by law or at our discretion in cases of a genuine billing
              error. If you believe you were charged incorrectly, contact us at the email below.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900">5. Acceptable use</h2>
            <p className="mt-2">You agree not to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Share your Premium account access with others</li>
              <li>Copy, redistribute, or resell our tests, materials, or concept content</li>
              <li>Attempt to interfere with or disrupt the platform's normal operation</li>
              <li>Use the platform for any unlawful purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900">6. Content</h2>
            <p className="mt-2">
              All tests, questions, explanations, and materials on PrepNova are owned by us or licensed to
              us, and are provided for your personal exam preparation only. Some questions may be generated
              with AI assistance and reviewed by our team; while we aim for accuracy, we can't guarantee
              every question or explanation is error-free — always cross-check critical facts against your
              official exam syllabus.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900">7. No guarantee of results</h2>
            <p className="mt-2">
              PrepNova is a study aid. We don't guarantee any particular exam score, interview outcome, or
              placement result from using the platform.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900">8. Termination</h2>
            <p className="mt-2">
              We may suspend or terminate accounts that violate these terms. You can stop using the
              platform and request account deletion at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900">9. Limitation of liability</h2>
            <p className="mt-2">
              PrepNova is provided "as is." To the extent permitted by law, we aren't liable for indirect
              or consequential damages arising from your use of the platform.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900">10. Governing law</h2>
            <p className="mt-2">These terms are governed by the laws of India.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900">11. Contact</h2>
            <p className="mt-2">
              Questions about these terms can be sent to{" "}
              <a href="mailto:prepnova.co.support@gmail.com" className="font-semibold text-teal-700 hover:text-teal-800">
                prepnova.co.support@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
