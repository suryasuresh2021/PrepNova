# PrepNova

**Prepare Smarter. Succeed Faster.**

One platform for Placement Preparation, Interview Readiness, and Competitive Exam Success.

This repo currently contains the **public homepage only** — no login, no database, no payments yet.
It's built with Next.js (App Router), Tailwind CSS, Framer Motion, and Lucide icons.

---

## 1. What's inside

```
prepnova/
├── app/
│   ├── layout.js        # Page shell + SEO metadata
│   ├── page.js           # Home page — assembles all sections
│   └── globals.css       # Tailwind + fonts
├── components/
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── HeroIllustration.jsx
│   ├── Categories.jsx
│   ├── WhyChooseUs.jsx
│   ├── LearningJourney.jsx
│   ├── Pricing.jsx
│   ├── Testimonials.jsx
│   ├── FAQ.jsx
│   ├── CTA.jsx
│   ├── Footer.jsx
│   └── ui/
│       ├── Button.jsx
│       └── SectionHeading.jsx
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.mjs
└── jsconfig.json
```

Every section of the homepage is its own component file, so you (or Claude Code later) can edit one
section without touching the rest.

---

## 2. Try it on your own computer (optional)

You'll need [Node.js](https://nodejs.org) installed (version 18 or higher).

```bash
npm install
npm run dev
```

Then open **http://localhost:3000** in your browser.

---

## 3. Push this to GitHub (step by step)

You don't need to know Git deeply — just follow these commands in order, in a terminal, inside this
`prepnova` folder.

**Step 1 — Create a new empty repository on GitHub**
Go to [github.com/new](https://github.com/new), name it (e.g. `prepnova`), leave it empty
(no README, no .gitignore — this project already has one), and click **Create repository**.

**Step 2 — Push your local folder**

```bash
cd prepnova
git init
git add .
git commit -m "Initial commit: PrepNova homepage"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/prepnova.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username, and `prepnova` with whatever you named
the repository.

**Step 3 — Deploy it live (free, easiest option)**
Go to [vercel.com](https://vercel.com), sign in with your GitHub account, click **Add New → Project**,
select your `prepnova` repo, and click **Deploy**. Vercel is made by the creators of Next.js, so it
needs zero configuration — you'll get a live URL in about a minute.

---

## 4. Premium payment (Razorpay + UPI)

The "Upgrade to Premium" button on the Pricing section now opens a real checkout. It uses
**Razorpay**, which is the standard payment gateway for Indian businesses and supports UPI
natively — the person paying sees a "Scan QR" tab *and* an "Enter UPI ID" tab automatically,
plus cards, netbanking, and wallets. No custom QR code needed; Razorpay generates it per-transaction.

Unlike a plain UPI QR sticker, this setup **automatically confirms** when a payment succeeds —
Razorpay calls a webhook in this app, which verifies the payment and marks the user "premium" in
Supabase. Nobody has to check a bank app manually.

### One-time setup

**A. Razorpay account**
1. Sign up at [razorpay.com](https://razorpay.com) (Indian business/individual KYC required to go
   live; you can test everything first in **Test Mode** with no KYC).
2. Go to **Settings → API Keys** and generate a key pair. Copy the Key ID and Key Secret.
3. Go to **Settings → Webhooks**, click **Add New Webhook**:
   - URL: `https://YOUR-DEPLOYED-DOMAIN/api/razorpay/webhook`
   - Active events: check `payment.captured`
   - Set a Secret (any string) — you'll paste this into `RAZORPAY_WEBHOOK_SECRET`

**B. Supabase project**
1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste the contents of `supabase/schema.sql` from this repo, and run it.
3. Go to **Project Settings → API** and copy the Project URL, `anon` public key, and
   `service_role` secret key.

**C. Add the keys to this project**
1. Copy `.env.example` to a new file named `.env.local` and fill in every value from steps A & B.
2. On Vercel: **Project Settings → Environment Variables** — add the same variables there so the
   live site can use them (the webhook only works once deployed, since Razorpay needs a public URL).

**D. Change the price**
The amount is set in two places (keep them matching):
- `app/api/razorpay/create-order/route.js` → `PREMIUM_AMOUNT_PAISE` (in paise, e.g. `99900` = ₹999)
- `components/Payment/PremiumCheckout.jsx` → `PREMIUM_PRICE_DISPLAY` (just the label shown to users)

### Test it
In Razorpay Test Mode, use their [test card/UPI numbers](https://razorpay.com/docs/payments/payments/test-card-upi-details/)
to simulate a full payment without moving real money.

### What still needs Claude Code
This wires up *payment* only. To fully close the loop you still need:
- Super Admin login (upload content & topic-wise tests, set price per topic)
- User login with Free vs Premium tiers, reading the `subscriptions` table this webhook writes to
- Admin dashboard for content/test uploads
- Gating Premium categories based on `subscriptions.status`

**Recommended next step:** open this repo in **Claude Code** and ask it to build the above on top
of the `subscriptions` table and Supabase project you just created. Describe what you want in plain
English — it writes and commits the code, and can push straight to this GitHub repo.

---

## 5. Notes

- The Login and Get Started buttons on the homepage are currently placeholders (no backend wired up).
- Colors, fonts, and copy are easy to change in `tailwind.config.js` and the component files.
- All images are hand-drawn SVG (no external image dependencies), so the site loads fast.
