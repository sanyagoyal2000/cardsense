# Prompt for the new features (paste into Claude Code in this folder)

---

Add three new features to the CardSense app in this folder: Community, Talk to an expert, and Plans.

- Read `SPEC-v2.md` first. It lists the screens, seed data, plan tiers and how plans gate features. `SPEC.md` still applies for everything else.
- Match `design/new/8 · Community.png`, `design/new/9 · Talk to an expert.png` and `design/new/10 · Plans & pricing.png`. Exact colours and spacing are in `design/html/08-community.html`, `09-experts.html` and `10-plans.html`. Reuse the existing components and theme; don't copy inline styles.
- Use `assets/expert.png` for Arjun Mehta.
- Add Community, Experts and Plans to the header nav on every page.
- Put seed data in `src/data/community.ts`, `src/data/experts.ts` and `src/data/plans.ts`. Save posts, votes, bookings and the chosen plan in localStorage. No backend, no real payments.
- Apply plan gating as described in SPEC-v2 (card limits, alerts, recommendations, community posting, free monthly consult on Premium), with soft upgrade prompts linking to /plans.
- Block community posts that contain something like a card number or OTP, and add unit tests for that check.
- Don't break existing pages. First tell me your plan in a few lines, then build it. When done, run `npm test` and `npm run build`, fix any failures, and tell me what changed.

---

If the app hasn't been built yet, run `PROMPT.md` first, then this one.
