/** ₹ total with Indian grouping and no decimals: ₹1,09,155. */
export function inr(n: number): string {
  const v = Number.isFinite(n) ? Math.round(n) : 0;
  return '₹' + v.toLocaleString('en-IN');
}

/** ₹ per point with 2 decimals: ₹0.58. */
export function perPoint(n: number): string {
  const v = Number.isFinite(n) ? n : 0;
  return '₹' + v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Plain number with Indian grouping: 85,000. */
export function num(n: number): string {
  const v = Number.isFinite(n) ? Math.round(n) : 0;
  return v.toLocaleString('en-IN');
}

/** Prefix for estimated values. */
export function approx(estimate: boolean | undefined): string {
  return estimate ? '~' : '';
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** 31 Mar 2027 */
export function shortDate(d: Date): string {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** YYYY-MM-DD in local time. */
export function isoDate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}
