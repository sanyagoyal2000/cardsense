import { describe, expect, it } from 'vitest';
import { checkSensitive, SENSITIVE_ERROR } from '../src/lib/moderate';

const blocked = { ok: false, error: SENSITIVE_ERROR };

describe('checkSensitive: card numbers', () => {
  it('blocks a 16-digit number in any common format', () => {
    for (const v of [
      '4111111111111111',
      'my card 4111 1111 1111 1111 got declined',
      '4111-1111-1111-1111',
      '4111.1111.1111.1111',
    ]) {
      expect(checkSensitive(v)).toEqual(blocked);
    }
  });
  it('blocks 15-digit Amex and 19-digit numbers', () => {
    expect(checkSensitive('Amex 3782 822463 10005')).toEqual(blocked);
    expect(checkSensitive('6011000990139424123')).toEqual(blocked);
  });
  it('blocks partly masked card numbers', () => {
    expect(checkSensitive('Card 4111 XXXX XXXX 1111 was charged twice')).toEqual(blocked);
  });
  it('checks every part passed in (title, body, poll options)', () => {
    expect(checkSensitive('Fine title', 'Fine body', '4111111111111111')).toEqual(blocked);
  });
  it('allows normal money, points and phone-length numbers', () => {
    for (const v of [
      'Cash fare was ₹1,18,000. That’s about ₹1.69 a point.',
      'Booked with 70,000 Infinia points on 2026-10-09',
      'Call the bank at +91 98765 43210',
      'Card ending 1234 got the bonus',
      'Spent ₹3,10,000 of ₹4,00,000',
    ]) {
      expect(checkSensitive(v)).toEqual({ ok: true });
    }
  });
});

describe('checkSensitive: OTPs', () => {
  it('blocks an OTP followed by a code', () => {
    for (const v of ['OTP is 482913', 'my otp: 4829', 'One-time password 123456 not working', 'CVV 123', 'verification code - 99812']) {
      expect(checkSensitive(v)).toEqual(blocked);
    }
  });
  it('blocks a code followed by OTP', () => {
    expect(checkSensitive('482913 is the OTP I got')).toEqual(blocked);
  });
  it('allows talking about OTPs without a code', () => {
    for (const v of ['Never share your OTP with anyone', 'Got 3 OTPs in a row, is that normal?', 'OTP took 2 minutes']) {
      expect(checkSensitive(v)).toEqual({ ok: true });
    }
  });
  it('ignores empty input', () => {
    expect(checkSensitive('', undefined, null)).toEqual({ ok: true });
  });
});
