import Razorpay from "razorpay";

// SERVER-ONLY. key_secret must never reach the browser.
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
