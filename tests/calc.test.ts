import { describe, expect, it } from 'vitest';
import { BANKS, cards, getCard, EXAMPLE_WALLET, listBanks, type Route } from '../src/data/cards';
import {
  bestRoute,
  cashRoute,
  daysLeft,
  milestoneProgress,
  pointsUsedFor,
  rankRoutes,
  recommend,
  routeValue,
  safeBalance,
  walletSummary,
} from '../src/lib/calc';

const route = (over: Partial<Route> = {}): Route => ({
  id: 'r',
  name: 'Test route',
  shortName: 'Test',
  goal: 'travel',
  valuePerPoint: 1,
  minPoints: 1,
  conditions: '',
  assumptions: '',
  source: { name: 'x', url: 'https://example.com' },
  ...over,
});

const infinia = getCard('hdfc-infinia')!;
const atlas = getCard('axis-atlas')!;
const mrcc = getCard('amex-mrcc')!;

describe('safeBalance', () => {
  it('passes whole positive numbers through', () => {
    expect(safeBalance(85000)).toBe(85000);
  });
  it('turns invalid input into 0', () => {
    expect(safeBalance(-5)).toBe(0);
    expect(safeBalance(NaN)).toBe(0);
    expect(safeBalance(Infinity)).toBe(0);
    expect(safeBalance('100')).toBe(0);
    expect(safeBalance(undefined)).toBe(0);
  });
  it('floors decimals', () => {
    expect(safeBalance(12.9)).toBe(12);
  });
});

describe('pointsUsedFor', () => {
  it('uses the full balance by default', () => {
    expect(pointsUsedFor(route(), 85000)).toBe(85000);
  });
  it('applies a cap', () => {
    expect(pointsUsedFor(route({ cap: 50000 }), 85000)).toBe(50000);
    expect(pointsUsedFor(route({ cap: 50000 }), 20000)).toBe(20000);
  });
  it('applies fixed blocks', () => {
    expect(pointsUsedFor(route({ fixedBlock: 24000 }), 50000)).toBe(48000);
    expect(pointsUsedFor(route({ fixedBlock: 24000 }), 23999)).toBe(0);
  });
  it('applies blocks before the cap', () => {
    expect(pointsUsedFor(route({ fixedBlock: 18000, cap: 30000 }), 60000)).toBe(30000);
  });
});

describe('routeValue', () => {
  it('Infinia SmartBuy is capped at ₹50,000 for 85,000 points', () => {
    const r = routeValue(infinia.routes.find((x) => x.id === 'smartbuy-travel')!, 85000);
    expect(r.pointsUsed).toBe(50000);
    expect(r.rupeeValue).toBe(50000);
    expect(r.perPoint).toBe(1);
    expect(r.cappedLeftover).toBe(35000);
  });

  it('Infinia statement credit is ₹25,500', () => {
    const r = routeValue(infinia.routes.find((x) => x.id === 'statement-credit')!, 85000);
    expect(r.rupeeValue).toBe(25500);
    expect(r.perPoint).toBeCloseTo(0.3);
  });

  it('subtracts the fee: Atlas Group B 12,000 miles = ₹23,765', () => {
    const r = routeValue(atlas.routes.find((x) => x.id === 'group-b')!, 12000);
    expect(r.rupeeValue).toBe(23765);
    expect(r.perPoint).toBeCloseTo(23765 / 12000);
  });

  it('never goes below ₹0 when the fee exceeds the value', () => {
    const r = routeValue(route({ fee: 235, valuePerPoint: 0.4 }), 100);
    expect(r.eligible).toBe(true);
    expect(r.rupeeValue).toBe(0);
  });

  it('is ineligible below the minimum', () => {
    const r = routeValue(atlas.routes.find((x) => x.id === 'group-a')!, 999);
    expect(r.eligible).toBe(false);
    expect(r.rupeeValue).toBe(0);
    expect(r.ineligibleReason).toMatch(/1,000/);
  });

  it('MRCC 24K block: 30,000 points uses 24,000 for ₹14,000', () => {
    const r = routeValue(mrcc.routes.find((x) => x.id === 'gold-24k-taj')!, 30000);
    expect(r.pointsUsed).toBe(24000);
    expect(r.rupeeValue).toBe(14000);
    expect(r.blockLeftover).toBe(6000);
  });

  it('MRCC block not filled is ineligible', () => {
    const r = routeValue(mrcc.routes.find((x) => x.id === 'gold-18k-taj')!, 17999);
    expect(r.eligible).toBe(false);
    expect(r.rupeeValue).toBe(0);
  });

  it('handles invalid balances without NaN', () => {
    for (const bad of [0, -100, NaN, Infinity]) {
      const r = routeValue(route(), bad);
      expect(r.eligible).toBe(false);
      expect(r.rupeeValue).toBe(0);
      expect(r.perPoint).toBe(0);
      expect(Number.isNaN(r.perPoint)).toBe(false);
    }
  });
});

describe('rankRoutes', () => {
  it('puts ineligible routes last', () => {
    const ranked = rankRoutes([route({ id: 'a', minPoints: 1000, valuePerPoint: 5 }), route({ id: 'b' })], 500);
    expect(ranked.map((r) => r.route.id)).toEqual(['b', 'a']);
  });
  it('prefers confirmed values over estimates at the same ₹/point', () => {
    const ranked = rankRoutes(infinia.routes.filter((r) => r.goal === 'travel'), 85000);
    expect(ranked[0].route.id).toBe('smartbuy-travel');
    expect(ranked[1].route.id).toBe('air-miles');
  });
});

describe('recommend', () => {
  it('Infinia travel → SmartBuy with the cap explained', () => {
    const rec = recommend(infinia.routes, 85000, 'travel')!;
    expect(rec.pick.route.id).toBe('smartbuy-travel');
    expect(rec.fallback).toBe(false);
    expect(rec.reason).toContain('35,000');
    expect(rec.reason).toContain('next month');
  });

  it('Infinia cash → statement credit, with the trade-off in ₹', () => {
    const rec = recommend(infinia.routes, 85000, 'cash')!;
    expect(rec.pick.route.id).toBe('statement-credit');
    expect(rec.better?.route.id).toBe('smartbuy-travel');
    expect(rec.difference).toBe(50000 - 25500);
    expect(rec.reason).toContain('₹24,500 more');
  });

  it('falls back to the best overall when no route matches the goal', () => {
    const rec = recommend(atlas.routes, 12000, 'cash')!;
    expect(rec.fallback).toBe(true);
    expect(rec.pick.route.id).toBe('group-b');
    expect(rec.reason).toMatch(/No cash route/);
  });

  it('returns null when nothing is eligible', () => {
    expect(recommend(mrcc.routes, 1000, 'travel')).toBeNull();
    expect(recommend([], 1000, 'travel')).toBeNull();
    expect(recommend(infinia.routes, -5, 'travel')).toBeNull();
  });

  it('explains leftover points on block routes', () => {
    const rec = recommend(mrcc.routes, 30000, 'travel')!;
    expect(rec.pick.route.id).toBe('gold-24k-taj');
    expect(rec.reason).toContain('6,000');
  });

  it('works for every card in the data file', () => {
    for (const card of cards) {
      for (const goal of ['cash', 'shopping', 'travel'] as const) {
        const rec = recommend(card.routes, 50000, goal);
        if (card.routes.length === 0) {
          expect(rec).toBeNull();
        } else {
          expect(rec).not.toBeNull();
          expect(rec!.pick.rupeeValue).toBeGreaterThan(0);
          expect(rec!.reason.length).toBeGreaterThan(10);
        }
      }
    }
  });
});

describe('bestRoute / cashRoute / walletSummary', () => {
  it('Atlas has no cash route', () => {
    expect(cashRoute(atlas, 12000)).toBeNull();
    expect(bestRoute(atlas, 12000)?.route.id).toBe('group-b');
  });

  it('example wallet totals', () => {
    const s = walletSummary(EXAMPLE_WALLET, cards);
    expect(s.rows).toHaveLength(4);
    // 50,000 + 23,765 + 24,000 + 11,000
    expect(s.totalBest).toBe(108765);
    // 25,500 + 0 + 16,800 + 5,500
    expect(s.totalCash).toBe(47800);
  });

  it('skips unknown cards and bad balances', () => {
    const s = walletSummary(
      [
        { cardId: 'nope', points: 100 },
        { cardId: 'hdfc-infinia', points: -1 },
      ],
      cards,
    );
    expect(s.rows).toHaveLength(1);
    expect(s.totalBest).toBe(0);
  });
});

describe('milestones', () => {
  it('Amex PT example: ₹90,000 short, 179 days, ₹503/day', () => {
    const p = milestoneProgress(400000, 310000, '2027-03-31', new Date(2026, 9, 3));
    expect(p.shortfall).toBe(90000);
    expect(p.daysLeft).toBe(179);
    expect(Math.round(p.perDay!)).toBe(503);
    expect(p.percent).toBe(77);
    expect(p.reached).toBe(false);
  });

  it('reached milestone has no shortfall', () => {
    const p = milestoneProgress(400000, 450000, '2027-03-31', '2026-10-03');
    expect(p.shortfall).toBe(0);
    expect(p.perDay).toBe(0);
    expect(p.percent).toBe(100);
    expect(p.reached).toBe(true);
  });

  it('past or invalid end date gives 0 days and no per-day figure', () => {
    expect(daysLeft('2026-01-01', '2026-10-03')).toBe(0);
    expect(daysLeft('not a date', '2026-10-03')).toBe(0);
    expect(daysLeft('2026-02-30', '2026-01-01')).toBe(0);
    const p = milestoneProgress(400000, 100000, 'bad', '2026-10-03');
    expect(p.perDay).toBeNull();
  });

  it('treats negative or NaN spend as 0', () => {
    expect(milestoneProgress(20000, -500, '2026-10-31', '2026-10-03').shortfall).toBe(20000);
    expect(milestoneProgress(20000, NaN, '2026-10-31', '2026-10-03').shortfall).toBe(20000);
  });

  it('ends today counts as 0 days left', () => {
    expect(daysLeft('2026-10-03', '2026-10-03')).toBe(0);
    expect(daysLeft('2026-10-04', '2026-10-03')).toBe(1);
  });
});

describe('card data', () => {
  it('derives the bank list from the cards, without duplicates', () => {
    expect(BANKS).toEqual([...new Set(cards.map((c) => c.bankShort))]);
    for (const c of cards) expect(BANKS).toContain(c.bankShort);
  });
  it('card ids are unique', () => {
    expect(new Set(cards.map((c) => c.id)).size).toBe(cards.length);
  });
  it('lists banks in plain English', () => {
    expect(listBanks(['HDFC'])).toBe('HDFC');
    expect(listBanks(['HDFC', 'Axis', 'SBI'])).toBe('HDFC, Axis and SBI');
  });
});
