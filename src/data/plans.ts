// CardSense plan tiers. Prototype only: choosing a plan never takes a payment.

export type PlanId = 'free' | 'plus' | 'premium';
export type Billing = 'monthly' | 'yearly';

export interface Plan {
  id: PlanId;
  eyebrow: string;
  name: string;
  tagline: string;
  /** ₹ per month when billed monthly. */
  monthly: number;
  /** ₹ per year when billed yearly. */
  yearly: number;
  /** Cards that can be tracked in the wallet. Infinity = unlimited. */
  cardLimit: number;
  /** Saved redemption plans per month. Infinity = unlimited. */
  redemptionPlans: number;
  cta: string;
  features: string[];
  /** First feature drawn bold ("Everything in Plus"). */
  leadFeature?: boolean;
  /** Footer line nudging the next tier. */
  fence?: string;
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    eyebrow: 'Starter',
    name: 'Free',
    tagline: 'For checking one card’s points.',
    monthly: 0,
    yearly: 0,
    cardLimit: 1,
    redemptionPlans: 1,
    cta: 'Start free',
    features: [
      'Track one credit card',
      'Compare basic redemption options',
      'Estimated ₹ value of your points',
      'One redemption plan a month',
      'Basic benefit information',
    ],
    fence: 'Upgrade for more cards, expiry and milestone alerts, hidden conditions and unlimited plans.',
  },
  {
    id: 'plus',
    eyebrow: 'CardSense Plus',
    name: 'Plus',
    tagline: 'For people with a few cards who redeem often.',
    monthly: 199,
    yearly: 1999,
    cardLimit: 5,
    redemptionPlans: Infinity,
    cta: 'Get Plus',
    features: [
      'Track up to 5 credit cards',
      'Unlimited redemption comparisons',
      'Personalised best-redemption pick',
      'Point-expiry and milestone alerts',
      'Hidden benefits, caps and exclusions',
      'Multi-card wallet and benefit dashboard',
      'CardSense community access',
    ],
    fence: 'Upgrade for unlimited cards, portfolio optimisation, family cards and expert help.',
  },
  {
    id: 'premium',
    eyebrow: 'CardSense Premium',
    name: 'Premium',
    tagline: 'For large portfolios and complex travel redemptions.',
    monthly: 499,
    yearly: 4999,
    cardLimit: Infinity,
    redemptionPlans: Infinity,
    cta: 'Get Premium',
    leadFeature: true,
    features: [
      'Everything in Plus',
      'Unlimited credit cards',
      'Advanced travel and transfer-partner optimisation',
      'Family credit-card portfolio',
      'Priority alerts for high-value opportunities',
      'One expert consultation every month',
      'Priority access to experienced users and bank experts',
    ],
  },
];

export const PLAN_IDS: PlanId[] = PLANS.map((p) => p.id);

export function getPlan(id: PlanId): Plan {
  return PLANS.find((p) => p.id === id)!;
}

/** Cell values: '✓' and '—' are drawn as marks. */
export const COMPARE_ROWS: { feature: string; values: [string, string, string]; bold?: boolean }[] = [
  { feature: 'Cards you can track', values: ['1', 'Up to 5', 'Unlimited'] },
  { feature: 'Redemption plans', values: ['1 a month', 'Unlimited', 'Unlimited'] },
  { feature: '₹ value and basic route comparison', values: ['✓', '✓', '✓'] },
  { feature: 'Personalised best-redemption pick', values: ['—', '✓', '✓'] },
  { feature: 'Expiry and milestone alerts', values: ['—', '✓', 'Priority'] },
  { feature: 'Hidden caps, exclusions and benefits', values: ['—', '✓', '✓'] },
  { feature: 'Community', values: ['Read only', 'Full access', 'Priority access'] },
  { feature: 'Transfer-partner optimisation', values: ['—', '—', '✓'] },
  { feature: 'Family card portfolio', values: ['—', '—', '✓'] },
  { feature: 'Expert consultations', values: ['Pay per call', 'Pay per call', '1 free a month'] },
  { feature: 'Price', values: ['₹0', '₹199/mo · ₹1,999/yr', '₹499/mo · ₹4,999/yr'], bold: true },
];

export const FAQS: { q: string; a: string }[] = [
  { q: 'Can I cancel anytime?', a: 'Yes. You keep access until the end of the period you paid for.' },
  {
    q: 'Do you need my card details?',
    a: 'No. You type your points balance. We never ask for card numbers, OTPs or bank logins.',
  },
  { q: 'Do banks pay you to rank cards?', a: 'No. Plans are paid by members only, so recommendations aren’t sponsored.' },
];
