import { useEffect, useState } from 'react';

const PREFIX = 'cardsense.';

export const KEYS = {
  wallet: 'wallet',
  redeem: 'redeem',
  routeChoices: 'routeChoices',
  milestones: 'milestones',
  alertPrefs: 'alertPrefs',
  surveyDraft: 'surveyDraft',
  surveyResponses: 'surveyResponses',
} as const;

export function load<T>(key: string, fallback: T, isValid?: (v: unknown) => v is T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (isValid && !isValid(parsed)) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage may be full or blocked (private mode). The app still works for this visit.
  }
}

export function remove(key: string): void {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
}

/** useState that persists to localStorage. */
export function useStored<T>(key: string, fallback: T | (() => T), isValid?: (v: unknown) => v is T) {
  const [value, setValue] = useState<T>(() => {
    const fb = typeof fallback === 'function' ? (fallback as () => T)() : fallback;
    return load(key, fb, isValid);
  });
  useEffect(() => {
    save(key, value);
  }, [key, value]);
  return [value, setValue] as const;
}

export const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
