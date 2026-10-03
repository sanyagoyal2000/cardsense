import { describe, expect, it } from 'vitest';
import { validatePoints, validateRupees } from '../src/lib/validate';
import { inr, num, perPoint } from '../src/lib/format';

describe('validatePoints', () => {
  it('accepts plain digits', () => {
    expect(validatePoints('25000')).toEqual({ ok: true, value: 25000 });
  });
  it('accepts commas and surrounding spaces', () => {
    expect(validatePoints(' 85,000 ')).toEqual({ ok: true, value: 85000 });
    expect(validatePoints('1,20,000')).toEqual({ ok: true, value: 120000 });
  });
  it('blank', () => {
    for (const v of ['', '   ', null, undefined]) {
      expect(validatePoints(v)).toEqual({ ok: false, error: 'Enter your points balance.' });
    }
  });
  it('non-numeric', () => {
    for (const v of ['abc', '12a', '1e5', '₹', '--5', ',,,', '5-']) {
      expect(validatePoints(v)).toEqual({ ok: false, error: 'Use digits only, for example 25000.' });
    }
  });
  it('negative', () => {
    for (const v of ['-500', '-1,000', '-12.5']) {
      expect(validatePoints(v)).toEqual({ ok: false, error: "Balance can't be negative." });
    }
  });
  it('decimal', () => {
    for (const v of ['12.5', '100.', '.5', '1,000.25']) {
      expect(validatePoints(v)).toEqual({ ok: false, error: 'Points are whole numbers. Remove the decimal.' });
    }
  });
  it('zero', () => {
    for (const v of ['0', '000', '0,000']) {
      expect(validatePoints(v)).toEqual({ ok: false, error: 'A balance of 0 has nothing to redeem.' });
    }
  });
  it('too large', () => {
    expect(validatePoints('99999999999').ok).toBe(false);
  });
});

describe('validateRupees', () => {
  it('accepts ₹ and Indian grouping', () => {
    expect(validateRupees('₹3,10,000')).toEqual({ ok: true, value: 310000 });
  });
  it('allows zero spend', () => {
    expect(validateRupees('0')).toEqual({ ok: true, value: 0 });
  });
  it('rejects bad input', () => {
    expect(validateRupees('')).toEqual({ ok: false, error: 'Enter your spend so far.' });
    expect(validateRupees('-10')).toEqual({ ok: false, error: "Spend can't be negative." });
    expect(validateRupees('10.5')).toEqual({ ok: false, error: 'Use whole rupees. Remove the decimal.' });
    expect(validateRupees('lots')).toEqual({ ok: false, error: 'Use digits only, for example 310000.' });
  });
});

describe('format', () => {
  it('formats rupees the Indian way', () => {
    expect(inr(109155)).toBe('₹1,09,155');
    expect(inr(23764.6)).toBe('₹23,765');
    expect(inr(NaN)).toBe('₹0');
  });
  it('formats ₹ per point with 2 decimals', () => {
    expect(perPoint(0.3)).toBe('₹0.30');
    expect(perPoint(14000 / 24000)).toBe('₹0.58');
  });
  it('formats plain numbers', () => {
    expect(num(85000)).toBe('85,000');
  });
});
