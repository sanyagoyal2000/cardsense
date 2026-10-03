# Prompt to paste into Claude Code

Open Claude Code in this folder, then paste:

---

Build CardSense as a React + TypeScript + Vite app in this folder.

- Read `SPEC.md` first. It has the screens, design tokens, calculation rules and all card data.
- Match the designs in the PNG screenshots in `design/` closely. The HTML in `design/html/` has the exact colours, fonts and spacing; use it as reference, but rebuild it as React components (don't copy the inline styles verbatim, move them into CSS).
- Put all card data in `src/data/cards.ts` (typed). `cards-data.json` has the All Cards table values.
- Put the maths in `src/lib/calc.ts` as pure functions and cover them with Vitest tests, including invalid inputs.
- Use the photos in `assets/`.
- Save user inputs and survey answers in localStorage. No backend, no login.
- First tell me your plan in a few lines, then build it end to end.
- When done, run `npm test` and `npm run build`, fix any failures, and tell me how to run it.

---

Tip: after the first build, review with `npm run dev` and ask for fixes one screen at a time, for example "make the Redeem page match design/3 · Redeem points.png more closely".
