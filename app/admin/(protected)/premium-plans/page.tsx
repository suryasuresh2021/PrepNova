import { IndianRupee } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function PremiumPlansPage() {
  const { data: payments } = await supabaseAdmin.from("payments").select("amount_inr");
  const { count: premiumCount } = await supabaseAdmin
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")
    .eq("plan", "premium");

  const totalRevenue = (payments ?? []).reduce((sum, p) => sum + (p.amount_inr || 0), 0);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-amber-400">
            <IndianRupee size={18} aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-display text-base font-semibold text-slate-900">Premium Plan</h2>
            <p className="font-body text-sm text-slate-500">{premiumCount ?? 0} active subscribers · ₹{totalRevenue.toLocaleString()} total revenue</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <p className="font-body text-sm text-amber-800">
          The price is currently set directly in the code (₹999), in two places that must be kept in
          sync:
        </p>
        <ul className="font-body mt-2 list-disc pl-5 text-sm text-amber-800">
          <li><code>app/api/razorpay/create-order/route.js</code> — <code>PREMIUM_AMOUNT_PAISE</code></li>
          <li><code>components/Payment/PremiumCheckout.jsx</code> — <code>PREMIUM_PRICE_DISPLAY</code></li>
        </ul>
        <p className="font-body mt-2 text-sm text-amber-800">
          Making this editable from here (instead of in code) is a natural next step.
        </p>
      </div>
    </div>
  );
}
