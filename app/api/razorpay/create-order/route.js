import { NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";

// Called by the client before opening Razorpay checkout.
// Amount must be recalculated here, never trusted from the browser.
const PREMIUM_AMOUNT_PAISE = 99900; // ₹999.00 — change this to your real price

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount: PREMIUM_AMOUNT_PAISE,
      currency: "INR",
      receipt: `prepnova_${Date.now()}`,
      notes: { email, plan: "premium" },
    });

    return NextResponse.json(order);
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }
}
