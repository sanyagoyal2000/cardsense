# CardSense — Build Spec

CardSense helps Indian credit-card holders see what their reward points are worth **in rupees**, pick the best redemption route, track spend milestones, and catch rule changes (devaluations) on their cards.

Prototype for an ISB Software Product Management course. Card values come from public reviews and issuer updates, **last checked 3 Oct 2026**. Not financial advice. Not affiliated with any bank.

---

## 1. Tech stack

- React + TypeScript + Vite
- React Router (one route per screen)
- Plain CSS with variables (no UI library needed)
- Vitest for unit tests
- No backend, no auth, no database, no external APIs
- User inputs (wallet, spend, alert choices, survey answers) saved in `localStorage`; every read/write wrapped in try/catch

## 2. Folder layout

```
src/
  data/cards.ts       all card data (typed). The ONLY place numbers live.
  lib/calc.ts         pure functions: route value, eligibility, recommendation, milestone
  lib/validate.ts     points / rupee input validation
  lib/format.ts       Indian ₹ formatting (₹1,09,155)
  lib/storage.ts      localStorage helpers
  components/         Header, Footer, RouteCard, AlertCard, MilestoneCard, ProgressBar, CardChip, Pill
  pages/              Landing, Wallet, Redeem, Benefits, AllCards, Survey, SurveyDone
  styles/theme.css
  assets/             the 4 photos from /assets
tests/
  calc.test.ts
  validate.test.ts
```

## 3. Design system (match the PNGs in `/design`)

| Token | Value | Use |
|---|---|---|
| ink | `#0d0f12` | dark sections, text, inverted tiles |
| hero bg | radial-gradient(900px 340px at 85% 10%, `#1b1f26`, `#050608` 70%) | top band of every page |
| lime | `#d9f24f` | primary buttons, active nav, highlights |
| page bg | `#f4f5f6` | light content area |
| surface | `#ffffff` | tables, light cards |
| line | `#dfe3e7` | borders |
| muted | `#6b737c` / on dark `#9aa3ad` | secondary text |
| danger | `#b0322a` on `#fbe7e5` | cash-out values, "devalued" chips |
| warn | `#8a5300` on `#fdf1dc` | notes |

- Font: **Manrope** (Google Fonts) 400–800; numbers in **JetBrains Mono** on cards.
- Eyebrow labels: 12–13px, weight 700, letter-spacing .3em, uppercase, lime on dark.
- Buttons: pill (border-radius 99px); primary = lime bg + ink text; secondary = text link with →.
- Cards in hero: rotated gradient rectangles (purple→pink→orange, peach→blue, mint→lime). No bank logos, no real card art, no card numbers.
- Recommended route = black tile with lime accent; others white with border.
- Responsive: works at 390px wide with no horizontal scroll; grids collapse to one column; wide tables scroll inside their own box.
- Keyboard accessible, visible focus ring (lime outline on dark, ink on light).

## 4. Screens

Screenshots are the PNGs in `/design` (e.g. `design/3 · Redeem points.png`); reference HTML is in `/design/html`.

1. **Landing** (`/`) — hero with headline, two CTAs, stats, gradient card stack; bank-name strip; feature grid + "Stop cashing out at 30 paise a point"; photo strip (tap.png, phone.png, cashback.png); How it works with woman.png; footer disclaimer.
2. **My wallet** (`/wallet`) — total "worth up to" across user's cards, cash-out comparison, card stack; table (card, balance, best route, worth, as cash, Compare/Remove); "Add a card" form (card select + points). Seed example wallet on first visit: Infinia 85,000; Atlas 12,000; Kotak White Reserve 24,000; Amex Platinum Travel 22,000.
3. **Redeem** (`/redeem`) — inputs: card, points, goal (Cash / Shopping / Travel pills). Lime recommendation bar with plain-English reason. One route card per route: points used, ₹ value, ₹/point, bar, conditions, eligibility chip, expandable "How this is calculated" (formula, assumptions, source link, last-checked date). "Which route will you use?" selector at bottom (save choice).
4. **Benefits & changes** (`/benefits`) — summary (₹ at risk, number of changes); milestone tracker per card with milestone (spend so far input, period end date, progress bar, remaining, days left, ₹/day, reward; buttons I'll act / Remind me / Not relevant); change alerts (before/now, effective date, what to do, source); alert preference toggles (Devaluations, Milestones, Lounge rules, Fee waivers).
5. **All cards** (`/cards`) — bank filter pills; table: card, annual fee, earn rate, best ₹/pt, cash ₹/pt, lounge, latest change chip. Data = `cards-data.json`.
6. **Survey** (`/feedback`) — full-screen dark, one question per step, progress bar, Back/Next, Enter to continue:
   1. How useful was the rupee comparison? (1–5)
   2. Did you trust the numbers? (Yes / Somewhat / No) + why (text)
   3. Which parts were most useful? (multi-select A–F: Wallet total, Route recommendation, Milestone tracker, Devaluation alerts, Sources and dates, All-cards comparison)
   4. What didn't work or was confusing? (text, optional)
   5. Would you rather type points or connect your account later? + What should we build next? (text)
7. **Survey thanks** — tick over gradient cards, "Back to my wallet", "Browse all cards". Answers saved in localStorage with timestamp.

Header nav on all app pages: My wallet · Redeem · Benefits · All cards · Feedback. Footer disclaimer on every page.

## 5. Calculation rules (`lib/calc.ts`)

```
pointsUsed  = balance
              → if route.fixedBlock: floor(balance / block) * block
              → if route.cap: min(pointsUsed, cap)
eligible    = balance >= route.minPoints && pointsUsed > 0
rupeeValue  = eligible ? max(0, pointsUsed * valuePerPoint - (route.fee ?? 0)) : 0
perPoint    = rupeeValue / pointsUsed
recommend   = highest rupeeValue among eligible routes whose goal == selected goal;
              if none for goal → best eligible overall, say so;
              if best overall beats goal pick → explain trade-off with ₹ difference
milestoneShortfall = max(0, threshold - eligibleSpend)
daysLeft    = max(0, ceil((periodEnd - today) / 1 day))
perDay      = shortfall / daysLeft
```

Currency: `toLocaleString('en-IN')` with ₹, no decimals for totals, 2 decimals for ₹/point.

Validation (inline error under the field):
- blank → "Enter your points balance."
- non-numeric → "Use digits only, for example 25000."
- negative → "Balance can't be negative."
- decimal → "Points are whole numbers. Remove the decimal."
- zero → "A balance of 0 has nothing to redeem."
Commas are allowed ("85,000").

## 6. Card data (`src/data/cards.ts`)

Each card: `id, bank, name, currency, fee, earn, lounge, loungeSource, routes[], alerts[], milestone?, lastChecked`.
Each route: `id, name, goal ('cash'|'shopping'|'travel'), valuePerPoint, minPoints, cap?, fixedBlock?, fee?, conditions, source`.
Each alert: `title, before, now, effective, action, tone ('bad'|'warn'|'good'), source`.
Milestone: `label, threshold, period ('month'|'quarter'|'year'), benefitValue, benefitText, next?, source`.

### Redemption routes (₹ per point)

| Card | Route (goal) | ₹/pt | Notes |
|---|---|---|---|
| HDFC Infinia | SmartBuy flights & hotels (travel) | 1.00 | cap 50,000/month; up to 70% of booking |
| | Apple / Tanishq vouchers (shopping) | 1.00 | |
| | Other SmartBuy vouchers (shopping) | 0.50 | |
| | Air miles 1:1 (travel) | ~1.00 | Air India 2:1 |
| | Statement credit (cash) | 0.30 | |
| HDFC Diners Club Black | SmartBuy flights & hotels (travel) | 1.00 | cap 50,000/month |
| | Air miles 1:1 (travel) | ~1.00 | |
| | SmartBuy vouchers (shopping) | 0.50 | |
| | Catalogue (shopping) | 0.30 | |
| | Statement credit (cash) | 0.30 | |
| Axis Atlas | Group B transfer 1:2 (travel) | ~2.00 est. | min 500; ₹199+GST fee (use ₹235); 1,20,000/yr |
| | Travel EDGE booking (travel) | 1.00 | ₹99+GST fee (use ₹117) |
| | Group A transfer 2:1 (travel) | ~0.40 est. | min 1,000; 30,000/yr |
| Axis Magnus | Partner transfer 5:2 (travel) | ~0.40 est. | min 500; ₹235 fee |
| | Group A 5:1 (travel) | ~0.20 | |
| | Catalogue / vouchers (shopping) | 0.20 | |
| Amex Platinum Travel | Taj / Marriott vouchers (travel) | 0.50 | |
| | Shopping vouchers (shopping) | 0.30 | |
| | Statement credit / catalogue (cash) | 0.25 | |
| Amex MRCC | 24K Gold: Taj ₹14,000 (travel) | 0.583 | fixedBlock 24,000 |
| | 18K Gold: Taj ₹9,000 (travel) | 0.50 | fixedBlock 18,000 |
| | 18K Gold: Myntra/Shoppers Stop ₹7,000 (shopping) | 0.389 | fixedBlock 18,000 |
| | 18K Gold: Amazon/Flipkart ₹6,000 (shopping) | 0.333 | fixedBlock 18,000 |
| ICICI Emeralde Private Metal | iShop flights & hotels (travel) | 1.00 | 100% flights, 90% hotels |
| | Air India 1:1 (travel) | 1.00 | |
| | Gift vouchers (shopping) | 1.00 | |
| | Statement credit (cash) | 0.40 | |
| ICICI Sapphiro | Statement credit (cash) | 0.25 | |
| | Gift catalogue (shopping) | 0.25 | |
| | Air India 6:1 (travel) | 0.167 | |
| Kotak White Reserve | White Pass catalogue (shopping) | 1.00 | |
| | Cashback (cash) | 0.70 | White Pass expires 90 days after cycle |
| Kotak Solitaire | Air miles (travel) | ~3% back | show as earn-rate only; no per-point routes |
| SBI Cashback | Cashback is auto-credited (cash) | 1.00 | 5% online cap ₹2,000/cycle; 1% offline cap ₹2,000 |

### Milestones

| Card | Threshold | Period | Reward |
|---|---|---|---|
| HDFC Diners Club Black | ₹4,00,000 | quarter | 10,000 RP (≈₹10,000 on SmartBuy) |
| Amex Platinum Travel | ₹4,00,000 | membership year | 10,000 MR (≈₹5,000 Taj); next ₹7,00,000 → ₹20,000 Taj voucher |
| Amex MRCC | ₹20,000 | month | 1,000 MR (≈₹500); +1,000 for 4 txns of ₹1,500+ |
| ICICI Sapphiro | ₹4,00,000 | year | 4,000 RP (≈₹1,000) |
| Kotak White Reserve | spend-based tiers | year | White Pass up to ₹2.5L at ₹1Cr spend; fee waived at ₹10L |

### Rule-change alerts

| Card | Before | Now | Effective | Tone |
|---|---|---|---|---|
| HDFC Infinia | lower monthly SmartBuy cap | 50,000 pts/month, 5 redemptions | Feb 2026 | good |
| HDFC Infinia | — | Air India transfer 2:1 | 2025 | warn |
| HDFC DCB | up to 10,000 voucher bonus/month | 3,000/month | 2026 | bad |
| Axis Atlas | 1 mile : 2 pts (Group A) | 2 miles : 1 pt | 2 Apr 2026 | bad |
| Axis Atlas | Accor removed | Accor back at 2:1 | Sep 2026 | warn |
| Axis Magnus | 5 : 2 Avios | 5 : 1 Avios | 2 Apr 2026 | bad |
| Amex Platinum Travel | ₹1.9L→7,500; ₹7L→22,500 + ₹10k Taj | ₹4L→10,000; ₹7L→₹20k Taj | 10 Sep 2026 | bad |
| Amex MRCC | 18K→₹6,000 / 24K→₹9,000 statement credit | vouchers only | 3 May 2022 | warn |
| ICICI Emeralde PM | no caps | grocery/utility/education 1,000 pts/cycle | 2026 | warn |
| ICICI Emeralde PM | uncapped | transport rewards capped ₹20,000/month | early 2026 | warn |
| ICICI Sapphiro | BookMyShow BOGO | largely removed | Feb 2026 | bad |
| SBI Cashback | ₹5,000 max/cycle | ₹2,000 online + ₹2,000 offline; gaming, tolls, govt excluded | 1 Apr 2026 | bad |

### Lounge

Infinia, Diners Club Black, Emeralde Private Metal, Kotak White Reserve, Kotak Solitaire: unlimited domestic + international. Amex Platinum Travel: 8 domestic/year, max 2/quarter. Magnus, Sapphiro: spend-linked. Atlas: check issuer. MRCC, SBI Cashback: none.

Full per-card table (fees, earn rates, chips): `cards-data.json`.

## 7. Sources

- HDFC: pointsmax.in/blog/hdfc-smartbuy-guide-2026 · pointsmax.in/blog/hdfc-diners-club-black-credit-card-review-2026 · cardmaven.in/hdfc-smartbuy-offers-complete-guide · cardtrail.in/rewards/maximize-hdfc-reward-points-2026 · pointsmath.com/hdfc-bank-points-transfer-partners · cardmaven.in/hdfc-bank-infinia-credit-card-review · paisabazaar.com/hdfc-bank/hdfc-diners-club-black-credit-card
- Axis: cardadvisor.in/articles/axis-edge-rewards-guide-2026 · cardadvisor.in/articles/axis-magnus-credit-card-review-2026 · cardtrail.in/news/axis-bank-miles-transfer-partners-2026 · cardswise.in/news/axis-bank-edge-rewards-miles-partner-changes-september-2026 · myflightoffers.com (Axis flight guide 2026)
- Amex: cardmaven.in/amex-platinum-travel-devaluation-2026 · cardexpert.in/amex-platinum-travel-credit-card-review · cardmaven.in/american-express-membership-rewards-credit-card · pointsmath.com/amex-gold-collection-india · cardinsider.com/american-express/american-express-membership-rewards-credit-card · investingpro.in/rewards/american-express-membership-rewards
- ICICI: cardadvisor.in/articles/icici-emeralde-private-metal-review-2026 · cardadvisor.in/articles/icici-credit-card-ladder-guide · cardmaven.in/icici-bank-emeralde-private-metal-credit-card-review · cardinsider.com/blog/should-you-upgrade-icici-sapphiro-icici-emeralde-private · rivo.pe/blog/icici-credit-card-reward-points-guide-2026
- Kotak: paisabazaar.com/kotak-mahindra-bank/kotak-white-reserve-credit-card · cardtrail.in/cards/kotak-solitaire-credit-card
- SBI: livefromalounge.com/sbicards-cashback-card-imposes-new-restrictions-effective-april-1-2026

## 8. Rules

- Never ask for card number, CVV, OTP, bank login or password.
- No bank logos or real card artwork. Bank names as plain text only.
- Every ₹ result shows its formula, source link and last-checked date.
- No ads, affiliate links or sponsored rankings.
- Out of scope: login, real bank APIs, statement upload, card applications, payments, notifications.

## 9. Done when

- All 7 screens match the screenshots closely at 1280px and work at 390px.
- `npm test` passes (calc + validation), `npm run build` succeeds.
- Every card in the data file works on the Redeem page.
