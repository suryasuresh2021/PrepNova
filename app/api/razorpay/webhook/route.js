import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Configure this exact URL in Razorpay Dashboard > Settings > Webhooks:
//   https://YOUR-DOMAIN/api/razorpay/webhook
// Subscribe to the "payment.captured" event, and set the same secret you put
// in RAZORPAY_WEBHOOK_SECRET below.

export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  if (!signature || expectedSignature !== signature) {
    console.error("Razorpay webhook: signature mismatch");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "payment.captured") {
    const payment = event.payload?.payment?.entity;
    const email = payment?.notes?.email || payment?.email;

    if (email) {
      const { error } = await supabaseAdmin.from("subscriptions").upsert(
        {
          email,
          plan: "premium",
          status: "active",
          last_payment_id: payment.id,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      );

      if (error) {
        console.error("Supabase upsert failed:", error);
        // Still return 200 so Razorpay doesn't endlessly retry — log this for manual follow-up.
      }
    } else {
      console.error("Razorpay webhook: no email found in payment notes");
    }
  }

  return NextResponse.json({ received: true });
}
