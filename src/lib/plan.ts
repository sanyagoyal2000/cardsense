import { useSyncExternalStore } from 'react';
import { getPlan, PLAN_IDS, type PlanId } from '../data/plans';
import { KEYS, load, save } from './storage';

export const isPlanId = (v: unknown): v is PlanId => PLAN_IDS.includes(v as PlanId);

// One shared store so the header badge and the page update together.
const listeners = new Set<() => void>();
let current: PlanId | null = null;

function read(): PlanId {
  if (current === null) current = load<PlanId>(KEYS.plan, 'free', isPlanId);
  return current;
}

export function setPlan(id: PlanId): void {
  current = id;
  save(KEYS.plan, id);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = () => {
    current = null;
    listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

/** The chosen plan (Free until the user picks one on /plans). */
export function usePlan(): PlanId {
  return useSyncExternalStore(subscribe, read, () => 'free' as PlanId);
}

export const hasPlus = (plan: PlanId) => plan !== 'free';

export function canAddCard(plan: PlanId, cardCount: number): boolean {
  return cardCount < getPlan(plan).cardLimit;
}

/** "2026-10" in local time. */
export function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Free allows one saved redemption plan a month. Changing the plan already
 * saved this month for the same card doesn't use up another.
 * `saves` maps cardId → month the plan was saved ("2026-10").
 */
export function canSaveRedemptionPlan(
  plan: PlanId,
  saves: Record<string, string>,
  cardId: string,
  month: string,
): boolean {
  const limit = getPlan(plan).redemptionPlans;
  if (saves[cardId] === month) return true;
  const used = Object.values(saves).filter((m) => m === month).length;
  return used < limit;
}

/** Premium includes one free expert consult per calendar month. */
export function freeConsultAvailable(plan: PlanId, bookings: { free: boolean; month: string }[], month: string): boolean {
  return plan === 'premium' && !bookings.some((b) => b.free && b.month === month);
}
