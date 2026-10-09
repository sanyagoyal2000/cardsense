# CardSense — Spec v2 additions

Adds three screens to the app described in `SPEC.md`. Same design system (dark + lime, Manrope). Designs: `design/new/*.png`, exact styling in `design/html/08-community.html`, `09-experts.html`, `10-plans.html`. New photo: `assets/expert.png`.

## Navigation (all app pages)

My wallet · Redeem · Benefits · All cards · **Community** · **Experts** · **Plans** · Feedback

## 8. Community (`/community`)

Forum for card enthusiasts. Front-end only: seed posts from `src/data/community.ts`; new posts, replies, upvotes and poll votes are saved in localStorage.

- Hero: "Ask cardholders who've done it before" + "Start a discussion" button (opens a form: title, body, card group, post type).
- Left sidebar: card groups with post counts (All, HDFC Infinia & DCB, Axis Atlas & Magnus, Amex, ICICI, Kotak & SBI, Beginners) — clicking filters the feed. House rules box.
- Feed tabs: Trending · Latest · Redemption wins · Devaluations · Unanswered.
- Post types: Question, Redemption win, Devaluation, Poll. Each post: type chip, group, title, preview, author, upvotes, reply count, time ago, "Answer by verified expert" marker.
- Pinned post shown as black tile.
- Poll post: two options with % bars; one vote per user.
- Post detail view: full post + replies + reply box.
- Right sidebar: "Need a definite answer?" → Experts; top contributors.
- Posting form must block text that looks like a 16-digit card number or an OTP and show: "Don't post card numbers or OTPs."
- Footer note: sample posts; members' opinions, not financial advice.
- Plan gating: Free = read only (posting shows an upgrade prompt to Plus); Plus and Premium = full access.

## 9. Talk to an expert (`/experts`)

Separate paid 1:1 consultation marketplace. Seed experts from `src/data/experts.ts`.

- Hero: "Get a straight answer in a 15-minute call", trust points, `assets/expert.png` with lime tag "Arjun Mehta · ★ 4.9 · Next slot: today, 6:00 pm".
- Filters: All · Card strategy · Miles & travel · Bank insiders · Disputes & fees. Lime link "Premium includes 1 free consult a month →" to Plans.
- Expert card: photo or gradient avatar, name, role, chips (VERIFIED + INDEPENDENT / BANK INSIDER · FORMER / BANK INSIDER · CURRENT), bio, rating and call count, languages, price per slot, Book button.
- Current bank staff cards show an amber note: "Discloses current employer on the call. Won't advise on their own bank's products."
- Seed experts:
  - Arjun Mehta — Miles & travel strategist, Independent, ★4.9 (312), Hindi/English, ₹499 / 20 min, photo `expert.png`
  - Meera Iyer — Ex-relationship manager, private bank, Bank insider · former, ★4.8 (198), English/Tamil, ₹799 / 30 min
  - Vikram Rao — Card operations at a private bank, Bank insider · current, disputes and fees, ₹299 / 15 min
- Booking panel (opens for the chosen expert): next 5 days (unavailable days disabled), time slots, "What do you want to discuss?" textarea, format (Video / Voice / Chat), summary line, "Confirm and pay". In the prototype, confirming shows a success state and saves the booking to localStorage; no real payment. Premium users see the price as "₹0 · uses your free monthly consult" once a month.
- "How we vet experts" box (4 points) + "Apply to become an expert" link.
- Never collect card numbers, OTPs or statements; show the warning under the booking button.
- Footer note: sample profiles and prices; expert views are their own, not financial advice.

## 10. Plans (`/plans`)

- Hero: "One good redemption pays for a year" + Infinia example. Billing toggle Monthly / Yearly (Yearly default).
- Three tier cards; Plus is the black card with lime outline and "Most popular" badge.

| | Free / Starter | CardSense Plus | CardSense Premium |
|---|---|---|---|
| Monthly | ₹0 | ₹199 | ₹499 |
| Yearly | ₹0 | ₹1,999 (≈₹167/mo) | ₹4,999 (≈₹417/mo) |
| Cards tracked | 1 | up to 5 | unlimited |
| Redemption plans | 1 per month | unlimited | unlimited |
| Basic ₹ value + route comparison | ✓ | ✓ | ✓ |
| Personalised best-redemption pick | — | ✓ | ✓ |
| Expiry + milestone alerts | — | ✓ | priority |
| Hidden caps, exclusions, benefits | — | ✓ | ✓ |
| Multi-card wallet + benefit dashboard | — | ✓ | ✓ |
| Community | read only | full | priority access |
| Transfer-partner optimisation | — | — | ✓ |
| Family card portfolio | — | — | ✓ |
| Expert consultations | pay per call | pay per call | 1 free per month |

- Free card footer ("fence"): "Upgrade for more cards, expiry and milestone alerts, hidden conditions and unlimited plans."
- Plus card footer: "Upgrade for unlimited cards, portfolio optimisation, family cards and expert help."
- Compare plans table + 3 FAQs (cancel anytime; no card details needed; banks don't pay for rankings).
- Prototype: choosing a plan sets `plan` in localStorage (no payment). Show current plan in the header.

### Plan gating to apply across the app

- Wallet: Free can add 1 card, Plus 5, Premium unlimited. Adding beyond the limit shows an upgrade prompt linking to `/plans`.
- Redeem: Free gets 1 saved redemption plan per month; the "Recommended" bar and hidden conditions are visible on Plus+ (Free sees a blurred bar with "Unlock with Plus").
- Benefits: milestone and expiry alerts need Plus+.
- Upgrade prompts: small lime-outlined box, never a blocking popup.

### Pricing belief (internal, do not show to users)

"This price is right if it is true that CardSense can help a user save at least ₹5,000 on one major redemption, making a ₹1,999 annual subscription feel small compared with the value recovered."

## Done when

- The three new pages match `design/new/*.png` at 1280px and work at 390px.
- Nav updated on every page; plan gating works when switching plans.
- Card-number/OTP blocking in community posts is unit tested.
- `npm test` and `npm run build` pass.
