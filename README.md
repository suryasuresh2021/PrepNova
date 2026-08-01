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
- Editing an existing Category/Topic/Test (Questions can be edited — see Section 8)
- Making the Premium price editable from the dashboard instead of in code
- Search and notifications in the top bar are visual only — not wired to real data yet
- A "My Results" page for students to see their own past attempts (the data exists in
  `test_attempts` already — this just needs a page querying it by the logged-in user's email)


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
Upload, AI Generate, and the question list — and now also on the student-facing test page (Section 9).


## 9. Connected! Courses, Mock Tests, and the test-taking flow

The Navbar's **Courses** and **Mock Tests** links now go to real pages instead of the homepage:

- **`/courses`** — shows every Category and its Topics, exactly as created in `/admin/categories`
  and `/admin/topics`
- **`/tests`** — shows every Test, grouped by topic, with its price. Free tests (₹0) show a
  "Start Test" button for any signed-in user; priced tests show "Unlock with Premium" and send
  non-Premium users to the Pricing section instead
- **`/tests/[id]`** — the actual test-taking page: renders each question (math included) with
  radio-button options, lets the student answer at their own pace, then submits for scoring

**How scoring stays secure:** the correct answer is never sent to the browser while the student is
taking the test — only after they submit. Two API routes handle this:
- `GET /api/tests/[id]/questions` returns only `question_text` and `options`, deliberately leaving
  out `correct_option`
- `POST /api/tests/[id]/submit` receives the student's answers, checks them against the real
  answers server-side, saves the attempt to `test_attempts`, and only then returns which were right

Both routes re-check access on every request (signed in, and either the test is free or the user's
Premium subscription is active) — so a Free user can't reach a paid test's questions just by
guessing the URL.

The student Dashboard now links to both pages under "Browse Courses" / "Browse Mock Tests".

### Still open
- Only one question type (single-answer multiple choice) — no partial credit, negative marking, or
  a timer that cuts off a test (time is only recorded, not enforced)
- The "Free vs Premium" rule is a simple flag per item — no per-category or time-limited free trial


## 12. PDF upload, question explanations, and Topic → Materials/Tests linking

**PDF upload for Materials** — when adding a Material and choosing type **PDF**, there's now an
actual "Upload a PDF file" button (up to 15MB), not just a link field. It uploads to a Supabase
Storage bucket called `materials`, which **creates itself automatically** the first time you upload
— no manual bucket setup needed. The URL field is still there too, so you can paste an external PDF
link instead if you'd rather not host the file yourself.

**Explanations in the Question Bank** — every question (Add Single, Bulk Upload, and AI Generate)
now has an optional Explanation field, with the same live math preview as the question text. This
is shown to students on their results/review screen after they submit — never before, so it can't
be used to guess the answer early. The Bulk Upload CSV template has a new optional `explanation`
column; AI-generated questions come with one automatically.

**Topics now link to real Materials and Tests** — on `/courses`, each Topic under a Category shows
the Materials and Tests that actually belong to it, with the same lock/unlock and Free/Premium
logic used everywhere else on the site.
- **Materials → Topic**: when adding a Material, there's an optional "Topic" dropdown (filtered to
  the selected Category). Pick one and it shows up under that Topic on `/courses`.
- **Tests → Topic**: when adding a Test in `/admin/tests`, there's now a **Topic dropdown** (pulled
  from `/admin/topics`) as the primary way to set a test's topic — pick one and it's a real,
  permanent link. A "type a custom topic instead" fallback is still there underneath, for a topic
  that doesn't exist yet; tests created that way aren't linked to a Topic record and the admin
  Tests list flags them as "not linked to a Topic" so they're easy to spot and fix later by editing
  the test's topic via SQL or recreating it through the dropdown.
- Existing tests created before this update (with only the old free-text topic, no `topic_id`)
  still show up correctly — `/courses` falls back to matching by name for those, so nothing that
  already worked stopped working.


## 11. Performance Analysis, Materials progress, and AdSense

**Performance Analysis** — `/results` (now titled "Performance Analysis" on the page itself) got
a real upgrade: a **Score Trend** bar chart of the last 10 attempts, and a **Topic-wise Breakdown**
showing average score per topic. There's also now a **"Performance"** link in the navbar itself
(next to Dashboard, visible once signed in) — no need to dig for it. The Dashboard's own summary
card links straight through to this page too.

**Materials reading progress** — every accessible material on `/materials` now has a "Mark as read"
toggle. Each Category shows "X of Y read" with a small progress bar, computed only from materials
the student can actually access (locked Premium items don't count against them). This is stored per
user in a new `material_progress` table — re-run `supabase/schema.sql` to pick it up (safe to run
the whole file again, as always).

**Google AdSense** — wired up and inactive by default. Three placements: one on the homepage
(between Testimonials and FAQ), one on Mock Tests, one on Materials — all just below the main
content, not interrupting anything.

To activate it:
1. Apply at [adsense.google.com](https://adsense.google.com) — **this requires your site to
   already be live with real content**; Google reviews the actual deployed site before approving,
   so this is a step for after you've got courses/materials/tests actually populated, not before
2. Once approved, copy your Publisher ID (format `ca-pub-XXXXXXXXXXXXXXXX`)
3. Add it as `NEXT_PUBLIC_ADSENSE_CLIENT_ID` in `.env.local` and in Vercel
4. Edit `public/ads.txt` — replace `pub-0000000000000000` with your real ID (Google checks this
   file to confirm you own the site)
5. Redeploy

Until you complete this, the ad code doesn't load at all — verified by testing a build with the
variable unset. Nothing about the site changes or breaks either way.

The `slot` values in each `<AdUnit>` (in `app/page.js`, `app/tests/page.js`, `app/materials/page.js`)
are placeholders — once you've created actual ad units in your AdSense dashboard, swap in the real
slot IDs from there.


## 10. Materials, feedback messages, and result analysis

**Materials** (`/admin/materials` for the admin, `/materials` for students) — a new content type
alongside Tests, sitting under a Category:
- Four types: **Link**, **PDF**, **Video** (all just a URL, opened in a new tab), or **Note** (plain
  text, shown in an expandable "Read note" section right on the page)
- Each one is marked **Free** or **Premium** with a checkbox — Premium items show a locked state to
  non-subscribers, and — same security approach as Tests — **the actual URL is never sent to the
  browser** for someone who isn't allowed to see it. It's not just hidden with CSS; it's absent
  from the page's HTML entirely for a Free user looking at a Premium item.
- New nav link: **Materials**, alongside Courses and Mock Tests

**Post-test feedback** — when a student finishes a test, they now see a reaction pulled from three
score-based pools (≥80%, 50–79%, below 50%), each with an emoji and a short message — genuinely
encouraging for a strong score, still kind and lightly humorous for a weak one (never mocking).
A new one is picked at random each time, so it doesn't feel repetitive. Edit the message pools
directly in `lib/resultMessages.js` any time.

**Result analysis** — the results screen now shows, beyond right/wrong per question:
- Score as a percentage, with a progress bar
- Correct / Incorrect / Unanswered counts, side by side
- Time taken to complete the test

**My Results** (`/results`) — a new page where a student sees every test they've ever attempted,
their score on each, and their average percentage across all attempts. Linked from the Dashboard.
