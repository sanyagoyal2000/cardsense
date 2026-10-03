# CardSense

See what your Indian credit-card reward points are worth in rupees, pick the best redemption route, track spend milestones and catch rule changes.

Prototype for an ISB Software Product Management course. Values from public sources, last checked 3 Oct 2026. Not financial advice. Not affiliated with any bank.

## Run

```bash
npm install
npm run dev      # local dev server
npm test         # Vitest: calc + validation
npm run build    # production build into dist/
```

## Stack

React + TypeScript + Vite, React Router, plain CSS, Vitest. No backend: wallet, inputs and survey answers are saved in `localStorage`.

## Adding cards

All card data lives in `src/data/cards.ts`. Add an entry to `cards` and it appears everywhere (Wallet, Redeem, Benefits, All cards, bank filters).

## Deploy

`vercel.json` is included (Vite build, SPA rewrites so routes like `/wallet` load directly).
