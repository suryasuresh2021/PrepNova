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

## 5. Login system (Super Admin + Users)

There are now two separate logins:
- **`/login`** — regular users, sign up or sign in (with a "Forgot to confirm your email?" style
  confirmation step built in)
- **`/admin/login`** — Super Admin only. This is not linked anywhere in the public navigation on
  purpose — you go to it directly by typing the URL.

Protected pages:
- **`/dashboard`** — any signed-in user; shows their plan (Free/Premium) from the `subscriptions`
  table the Razorpay webhook writes to
- **`/admin`** — only accessible to a user whose `profiles.is_admin` is `true`; this is where you
  create topic-wise tests and set a price per test (₹0 = free)

### One-time setup

1. **Run the updated `supabase/schema.sql`** in Supabase SQL Editor (it now also creates a
   `profiles` table and a `tests` table — safe to re-run even if you ran an earlier version before,
   since it uses `if not exists` / `drop ... if exists`).
2. **Make yourself the admin:**
   - Go to your live site's `/login`, switch to **Sign Up**, create an account with your own email
   - Check your email and click the confirmation link (Supabase sends this by default)
   - In Supabase → **Table Editor → profiles**, find the row with your email, edit it, and set
     `is_admin` to `true`
   - Now go to `/admin/login` and sign in with that same email/password — you're in.
3. **Check Supabase Auth URL settings** (this trips people up): go to Supabase →
   **Authentication → URL Configuration**, and set:
   - **Site URL**: `https://your-vercel-domain.vercel.app`
   - **Redirect URLs**: add `https://your-vercel-domain.vercel.app/auth/callback`
   Without this, the email confirmation link will redirect to the wrong place.

No new environment variables are needed for this — it reuses the same `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` you already set up.

### What's still a placeholder
- The admin panel currently lets you create a test's **topic, title, description, and price** —
  it does not yet include a question-builder (adding actual MCQs) or a page where users take the
  test. That's the natural next step once you're ready.
- There's no "Forgot password" flow yet.
- Premium gating (hiding a test's content until the user's plan is Premium) isn't wired into a
  public course page yet, since that page doesn't exist yet either — this only gates `/dashboard`
  and `/admin` so far.



## 6. Notes

- Login is fully wired up now (see Section 5) — Login/Get Started take you to `/login`, and the
  navbar shows Dashboard/Sign out once you're signed in.
- Colors, fonts, and copy are easy to change in `tailwind.config.js` and the component files.
- All images are hand-drawn SVG (no external image dependencies), so the site loads fast.


## 7. Super Admin Dashboard

`/admin` is now a full dashboard, not just a single test-creation form. New TypeScript files live
alongside the existing JavaScript ones — Next.js supports both in the same project, so nothing
needed to change in the pages built earlier.

**Layout:** collapsible sidebar (desktop) / drawer (mobile), with active-page highlighting, plus a
top bar with search, notifications, and a profile dropdown. All of `/admin/*` is protected both by
`middleware.js` and by a layout-level check — a non-admin (or logged-out visitor) is bounced to
`/admin/login` at the server level before any admin content ever renders.

**Pages:**
- **Dashboard** (`/admin`) — 8 live stat cards (Total Users, Premium Users, Categories, Topics,
  Questions, Tests, Revenue, Tests Attempted Today), a Recent Users table, Recent Tests table,
  Quick Actions, and a Recent Activity timeline — all pulling real numbers from Supabase, not
  placeholder data.
- **Categories** / **Topics** — full create/delete management, with Topics nested under a Category
- **Tests** — the topic-wise test + pricing tool from before, now inside the new shell
- **Question Bank** — add multiple-choice questions (4 options + correct answer) to a specific test
- **Users** — read-only list of everyone who's signed up, with their Free/Premium status
- **Results** — read-only list of test attempts (empty until the test-taking flow exists)
- **Premium Plans** — shows current subscriber count and revenue; price itself is still set in code
  (see the page for exactly where)
- **Settings** — basic admin profile info for now

**One more SQL step:** the dashboard's stats need a few more tables (`categories`, `topics`,
`questions`, `test_attempts`, `payments`). Re-run `supabase/schema.sql` in the SQL Editor — it's
safe to run the whole file again even though earlier parts already exist, thanks to the
`drop ... if exists` guards throughout.

### What's still not built
- **The actual test-taking experience for regular users** — right now the admin can create tests
  and add questions, but there's no page where a logged-in user takes a test and gets a score.
  This is the biggest remaining piece.
- Editing an existing Category/Topic/Test (Questions can now be edited — see Section 8)
- Making the Premium price editable from the dashboard instead of in code
- Search and notifications in the top bar are visual only — not wired to real data yet


## 8. Question Bank: bulk upload, editing, AI generation, and math

The Question Bank (`/admin/question-bank`) now has three ways to add questions, plus editing:

**Add Single** — the original one-at-a-time form, now with a live preview underneath the question
and each option, so you can see math render as you type. Existing questions can be edited too —
click the pencil icon next to any question in the list below.

**Bulk Upload** — pick a test, then either upload a `.csv` file or paste CSV text directly. Columns:
`question, option1, option2, option3, option4, correct` (correct = option number, 1–4). Click the
"CSV format / template" toggle on the page for a copyable example. Shows a preview of every parsed
question before anything is saved.

**AI Generate** — type a topic and a count, and it drafts multiple-choice questions for you to
review, edit out any you don't like, and save. **This needs your own Anthropic API key**, separate
from any Claude chat interface:
1. Go to [console.anthropic.com](https://console.anthropic.com) → **API Keys** → create a key
   (this requires setting up billing on your Anthropic account — usage is billed to you directly)
2. Add it as `ANTHROPIC_API_KEY` in `.env.local` and in Vercel's Environment Variables
3. Redeploy

Without this key set, every other feature (Bulk Upload, Add Single, Edit, the rest of the site)
still works fine — only the "AI Generate" tab needs it.

**Math equations** — anywhere you type a question or option, wrap math in single `$` for inline
(`$\frac{1}{2}$`) or double `$$` for a centered block equation. This renders using KaTeX, the same
math typesetting engine used by many textbooks and course platforms. This works in Add Single, Bulk
Upload, AI Generate, and the question list — but not yet on a public-facing test page, since that
page doesn't exist yet (see Section 7's "What's still not built").
