import type { Card, Goal, Route } from '../data/cards';
import { GOAL_LABELS } from '../data/cards';

export interface RouteResult {
  route: Route;
  balance: number;
  pointsUsed: number;
  eligible: boolean;
  rupeeValue: number;
  perPoint: number;
  /** Points the cap held back (e.g. SmartBuy monthly cap). */
  cappedLeftover: number;
  /** Points left over because only whole blocks can be redeemed. */
  blockLeftover: number;
  /** Plain reason when not eligible. */
  ineligibleReason?: string;
}

/** Turns any input into a safe whole, non-negative balance. Invalid → 0. */
export function safeBalance(balance: unknown): number {
  if (typeof balance !== 'number' || !Number.isFinite(balance) || balance < 0) return 0;
  return Math.floor(balance);
}

export function pointsUsedFor(route: Route, balance: number): number {
  const b = safeBalance(balance);
  let used = b;
  if (route.fixedBlock && route.fixedBlock > 0) {
    used = Math.floor(b / route.fixedBlock) * route.fixedBlock;
  }
  if (route.cap !== undefined && route.cap >= 0) {
    used = Math.min(used, route.cap);
  }
  return used;
}

export function routeValue(route: Route, balance: number): RouteResult {
  const b = safeBalance(balance);
  const afterBlock = route.fixedBlock ? Math.floor(b / route.fixedBlock) * route.fixedBlock : b;
  const pointsUsed = pointsUsedFor(route, b);
  const eligible = b >= route.minPoints && pointsUsed > 0;
  const raw = pointsUsed * route.valuePerPoint - (route.fee ?? 0);
  const rupeeValue = eligible ? Math.max(0, Math.round(raw)) : 0;
  const perPoint = pointsUsed > 0 ? rupeeValue / pointsUsed : 0;

  let ineligibleReason: string | undefined;
  if (!eligible) {
    if (b === 0) ineligibleReason = 'Enter a balance to see this route.';
    else ineligibleReason = `Needs at least ${route.minPoints.toLocaleString('en-IN')} points.`;
  }

  return {
    route,
    balance: b,
    pointsUsed,
    eligible,
    rupeeValue,
    perPoint,
    cappedLeftover: afterBlock - pointsUsed,
    blockLeftover: b - afterBlock,
    ineligibleReason,
  };
}

/**
 * Ranks routes best first: higher ₹ per point, then confirmed values before
 * estimates, then higher total ₹. Ineligible routes go last.
 */
export function compareResults(a: RouteResult, b: RouteResult): number {
  if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
  const pa = Math.round(a.perPoint * 100);
  const pb = Math.round(b.perPoint * 100);
  if (pa !== pb) return pb - pa;
  const ea = a.route.estimate ? 1 : 0;
  const eb = b.route.estimate ? 1 : 0;
  if (ea !== eb) return ea - eb;
  return b.rupeeValue - a.rupeeValue;
}

export function rankRoutes(routes: Route[], balance: number): RouteResult[] {
  return routes.map((r) => routeValue(r, balance)).sort(compareResults);
}

export interface Recommendation {
  pick: RouteResult;
  /** True when no eligible route matched the goal and we fell back to best overall. */
  fallback: boolean;
  /** Best overall route when it beats the goal pick on ₹. */
  better?: RouteResult;
  /** ₹ difference between `better` and `pick`. */
  difference: number;
  reason: string;
}

export function recommend(routes: Route[], balance: number, goal: Goal): Recommendation | null {
  const ranked = rankRoutes(routes, balance).filter((r) => r.eligible);
  if (ranked.length === 0) return null;
  const overall = ranked[0];
  const forGoal = ranked.filter((r) => r.route.goal === goal);
  const fallback = forGoal.length === 0;
  const pick = fallback ? overall : forGoal[0];
  const better =
    !fallback && overall.route.id !== pick.route.id && overall.rupeeValue > pick.rupeeValue ? overall : undefined;
  const difference = better ? better.rupeeValue - pick.rupeeValue : 0;
  return { pick, fallback, better, difference, reason: explain(pick, goal, fallback, better, difference) };
}

function explain(pick: RouteResult, goal: Goal, fallback: boolean, better: RouteResult | undefined, diff: number): string {
  const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
  const pts = (n: number) => n.toLocaleString('en-IN');
  const approx = pick.route.estimate ? 'about ' : '';
  const parts: string[] = [];

  if (fallback) {
    parts.push(`No ${GOAL_LABELS[goal].toLowerCase()} route is available for this balance, so this is the best overall.`);
  }

  if (pick.cappedLeftover > 0) {
    const period = pick.route.capLabel?.includes('year') ? 'next year' : 'next month';
    parts.push(
      `${approx}${inr(pick.rupeeValue)} for ${pts(pick.pointsUsed)} points ${period === 'next year' ? 'this year' : 'this month'}. Redeem the other ${pts(pick.cappedLeftover)} ${period} to stay under the cap.`,
    );
  } else if (pick.blockLeftover > 0) {
    parts.push(
      `${approx}${inr(pick.rupeeValue)} for ${pts(pick.pointsUsed)} points. The other ${pts(pick.blockLeftover)} points don't fill a whole block, so keep them for later.`,
    );
  } else {
    parts.push(`${approx}${inr(pick.rupeeValue)} for ${pts(pick.pointsUsed)} points, the best ${fallback ? 'rate' : GOAL_LABELS[goal].toLowerCase() + ' rate'} on this card.`);
  }

  if (better) {
    parts.push(`${better.route.name} would give ${inr(diff)} more if a ${GOAL_LABELS[better.route.goal].toLowerCase()} redemption works for you.`);
  }
  return parts.join(' ');
}

/** Best eligible route across all goals. */
export function bestRoute(card: Card, balance: number): RouteResult | null {
  const ranked = rankRoutes(card.routes, balance).filter((r) => r.eligible);
  return ranked[0] ?? null;
}

/** Best eligible cash route, or null when the card has none. */
export function cashRoute(card: Card, balance: number): RouteResult | null {
  const cash = card.routes.filter((r) => r.goal === 'cash');
  const ranked = rankRoutes(cash, balance).filter((r) => r.eligible);
  return ranked[0] ?? null;
}

export interface WalletEntry {
  cardId: string;
  points: number;
}

export interface WalletRow {
  card: Card;
  points: number;
  best: RouteResult | null;
  cash: RouteResult | null;
}

export interface WalletSummary {
  rows: WalletRow[];
  totalBest: number;
  totalCash: number;
}

export function walletSummary(entries: WalletEntry[], allCards: Card[]): WalletSummary {
  const rows: WalletRow[] = [];
  for (const e of entries) {
    const card = allCards.find((c) => c.id === e.cardId);
    if (!card) continue;
    const points = safeBalance(e.points);
    rows.push({ card, points, best: bestRoute(card, points), cash: cashRoute(card, points) });
  }
  const totalBest = rows.reduce((s, r) => s + (r.best?.rupeeValue ?? 0), 0);
  const totalCash = rows.reduce((s, r) => s + (r.cash?.rupeeValue ?? 0), 0);
  return { rows, totalBest, totalCash };
}

export interface MilestoneProgress {
  shortfall: number;
  daysLeft: number;
  /** ₹ to spend per day; null when no days are left or the date is invalid. */
  perDay: number | null;
  /** 0–100, rounded down. */
  percent: number;
  reached: boolean;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function toDate(d: Date | string): Date | null {
  const date = typeof d === 'string' ? parseISODate(d) : d;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

/** Parses YYYY-MM-DD as a local date (not UTC). */
export function parseISODate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const date = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (date.getMonth() !== Number(m[2]) - 1) return null;
  return date;
}

export function daysLeft(periodEnd: Date | string, today: Date | string): number {
  const end = toDate(periodEnd);
  const now = toDate(today);
  if (!end || !now) return 0;
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.max(0, Math.ceil((endDay.getTime() - startOfToday.getTime()) / DAY_MS));
}

export function milestoneProgress(
  threshold: number,
  eligibleSpend: number,
  periodEnd: Date | string,
  today: Date | string,
): MilestoneProgress {
  const t = Number.isFinite(threshold) && threshold > 0 ? threshold : 0;
  const spend = Number.isFinite(eligibleSpend) && eligibleSpend > 0 ? eligibleSpend : 0;
  const shortfall = Math.max(0, t - spend);
  const days = daysLeft(periodEnd, today);
  const perDay = shortfall === 0 ? 0 : days > 0 ? shortfall / days : null;
  const percent = t === 0 ? 100 : Math.min(100, Math.floor((spend / t) * 100));
  return { shortfall, daysLeft: days, perDay, percent, reached: shortfall === 0 };
}
