export type ValidationResult = { ok: true; value: number } | { ok: false; error: string };

const MAX = 1_000_000_000;

/** Removes thousands separators (commas, spaces) and a leading ₹. */
function clean(raw: string): string {
  return raw.trim().replace(/^₹\s*/, '').replace(/[,\s]/g, '');
}

/** "-500", "-12.5" */
const isNegative = (s: string) => /^-(\d+\.?\d*|\.\d+)$/.test(s);
/** "12.5", "12.", ".5" */
const isDecimal = (s: string) => /^(\d+\.\d*|\.\d+)$/.test(s);

/** Validates a reward-points balance. Commas are allowed ("85,000"). */
export function validatePoints(raw: string | null | undefined): ValidationResult {
  if (raw == null || raw.trim() === '') return { ok: false, error: 'Enter your points balance.' };
  const s = clean(raw);
  if (isNegative(s)) return { ok: false, error: "Balance can't be negative." };
  if (isDecimal(s)) return { ok: false, error: 'Points are whole numbers. Remove the decimal.' };
  if (!/^\d+$/.test(s)) return { ok: false, error: 'Use digits only, for example 25000.' };
  const value = Number(s);
  if (value === 0) return { ok: false, error: 'A balance of 0 has nothing to redeem.' };
  if (value > MAX) return { ok: false, error: 'That looks too large. Check the number.' };
  return { ok: true, value };
}

/** Validates a rupee amount such as spend so far. 0 is allowed. */
export function validateRupees(raw: string | null | undefined): ValidationResult {
  if (raw == null || raw.trim() === '') return { ok: false, error: 'Enter your spend so far.' };
  const s = clean(raw);
  if (isNegative(s)) return { ok: false, error: "Spend can't be negative." };
  if (isDecimal(s)) return { ok: false, error: 'Use whole rupees. Remove the decimal.' };
  if (!/^\d+$/.test(s)) return { ok: false, error: 'Use digits only, for example 310000.' };
  const value = Number(s);
  if (value > MAX) return { ok: false, error: 'That looks too large. Check the number.' };
  return { ok: true, value };
}
