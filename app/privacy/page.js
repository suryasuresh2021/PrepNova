import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-3xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-slate-900">Privacy Policy</h1>
        <p className="font-body mt-2 text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="font-body prose prose-slate mt-8 max-w-none space-y-6 text-sm leading-relaxed text-slate-700">
          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900">1. What we collect</h2>
            <p className="mt-2">
              When you create an account, we collect your email address and password (handled securely by
              our authentication provider — we never see or store your password in plain text). When you
              take a test, read a material, or use other features, we record your activity (scores, attempts,
              and progress) so we can show it back to you on your Dashboard and Performance pages.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900">2. Payments</h2>
            <p className="mt-2">
              Premium subscription payments are processed by Razorpay, a licensed payment gateway. We do
              not store your card, UPI, or bank details ourselves — Razorpay handles that directly and
              shares with us only your email address and confirmation that a payment succeeded, which we
              use to activate your Premium access.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900">3. How we use your information</h2>
            <p className="mt-2">We use the information above to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Provide your account, track your test/material progress, and show your performance analytics</li>
              <li>Confirm and activate Premium subscriptions</li>
              <li>Respond to support requests sent to our contact email</li>
              <li>Improve the platform based on how it's actually used</li>
            </ul>
            <p className="mt-2">We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900">4. Third-party services</h2>
            <p className="mt-2">This site relies on a small number of third-party services to operate:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li><strong>Supabase</strong> — hosts our database and handles account authentication</li>
              <li><strong>Razorpay</strong> — processes Premium subscription payments</li>
              <li><strong>Google AdSense</strong> — may display advertisements and use cookies to do so;
                see Google's own privacy policy for how it handles data collected through ads</li>
              <li><strong>Anthropic</strong> — may be used by our team to help generate practice questions; no
                personal user data is sent to this service</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900">5. Cookies</h2>
            <p className="mt-2">
              We use essential cookies to keep you signed in. If Google AdSense is active, it may also set
              its own cookies to show relevant ads — you can control ad personalization through your Google
              account settings.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900">6. Your rights</h2>
            <p className="mt-2">
              You can request a copy of the personal data we hold about you, ask us to correct it, or ask us
              to delete your account and associated data, by emailing us at the address below. We'll respond
              within a reasonable time.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900">7. Contact</h2>
            <p className="mt-2">
              Questions about this policy or your data can be sent to{" "}
              <a href="mailto:prepnova.co.support@gmail.com" className="font-semibold text-teal-700 hover:text-teal-800">
                prepnova.co.support@gmail.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900">8. Changes to this policy</h2>
            <p className="mt-2">
              We may update this policy as the platform evolves. Material changes will be reflected by
              updating the "Last updated" date above.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
