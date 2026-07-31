"use client";

import { useState } from "react";
import { CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { PrimaryButton } from "../ui/Button";

const PREMIUM_PRICE_DISPLAY = "₹999"; // keep in sync with lib amount in create-order/route.js

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-checkout-script")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-checkout-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PremiumCheckout({ className = "" }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // null | "need-email" | "success" | "error"

  const handlePay = async () => {
    if (!email) {
      setStatus("need-email");
      return;
    }
    setLoading(true);
    setStatus(null);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setLoading(false);
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const order = await res.json();
      if (!order?.id) throw new Error("Order creation failed");

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "PrepNova",
        description: "Premium subscription",
        order_id: order.id,
        prefill: { email },
        theme: { color: "#14213D" },
        // Razorpay checkout shows all of these as tabs automatically — including
        // "Scan QR" and "Enter UPI ID" under the UPI tab. No extra setup needed.
        method: { upi: true, card: true, netbanking: true, wallet: true },
        handler: function () {
          setStatus("success");
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      });

      rzp.on("payment.failed", function () {
        setStatus("error");
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      console.error("Checkout error:", err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <label htmlFor="checkout-email" className="font-body mb-2 block text-xs font-medium text-slate-300">
        Email for your receipt
      </label>
      <input
        id="checkout-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="mb-3 w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
      />

      <PrimaryButton onClick={handlePay} disabled={loading} className="w-full disabled:opacity-60">
        {loading ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <CreditCard size={16} aria-hidden="true" />}
        Pay {PREMIUM_PRICE_DISPLAY} &amp; Upgrade
      </PrimaryButton>

      <p className="font-body mt-3 flex items-center gap-1.5 text-xs text-slate-400">
        <ShieldCheck size={14} aria-hidden="true" /> UPI (scan or ID), cards, netbanking &amp; wallets — via Razorpay
      </p>

      {status === "need-email" && <p className="font-body mt-2 text-xs text-red-400">Enter your email first.</p>}
      {status === "success" && (
        <p className="font-body mt-2 text-xs text-teal-400">
          Payment received — your account will be upgraded within a minute.
        </p>
      )}
      {status === "error" && (
        <p className="font-body mt-2 text-xs text-red-400">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
