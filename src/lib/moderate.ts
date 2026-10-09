export const SENSITIVE_ERROR = 'Don’t post card numbers or OTPs.';

export type SafetyResult = { ok: true } | { ok: false; error: string };

/** 13–19 digits, optionally split by single spaces, dots or dashes ("4111 1111 1111 1111"). */
const CARD_RUN = /(?:\d[ .-]?){12,18}\d/g;
/** Four groups of four with some masked ("4111 XXXX XXXX 1111"). */
const MASKED_CARD = /\b[\dXx*•]{4}([ -]?)[\dXx*•]{4}\1[\dXx*•]{4}\1[\dXx*•]{4}\b/g;

const OTP_WORD = String.raw`(?:otp|one[\s-]?time[\s-]?(?:password|passcode|pin|code)|verification\s+code|cvv|cvc)`;
/** "OTP is 482913", "my CVV: 123" */
const OTP_THEN_CODE = new RegExp(String.raw`\b${OTP_WORD}s?\b[^\d\n]{0,30}\b\d{3,8}\b`, 'i');
/** "482913 is the OTP" */
const CODE_THEN_OTP = new RegExp(String.raw`\b\d{4,8}\b[^\d\n]{0,20}\b${OTP_WORD}\b`, 'i');

function hasCardNumber(text: string): boolean {
  for (const m of text.match(CARD_RUN) ?? []) {
    const digits = m.replace(/\D/g, '');
    if (digits.length >= 13 && digits.length <= 19) return true;
  }
  for (const m of text.match(MASKED_CARD) ?? []) {
    if (m.replace(/\D/g, '').length >= 4) return true;
  }
  return false;
}

function hasOtp(text: string): boolean {
  return OTP_THEN_CODE.test(text) || CODE_THEN_OTP.test(text);
}

/**
 * Blocks text that looks like a card number or a one-time password.
 * Talking about OTPs in general ("never share your OTP") is allowed.
 */
export function checkSensitive(...parts: (string | null | undefined)[]): SafetyResult {
  const text = parts.filter(Boolean).join('\n');
  if (hasCardNumber(text) || hasOtp(text)) return { ok: false, error: SENSITIVE_ERROR };
  return { ok: true };
}
