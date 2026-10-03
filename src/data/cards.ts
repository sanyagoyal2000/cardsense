// All card data for CardSense. This is the only place numbers live.
// Values from public reviews and issuer updates, last checked 3 Oct 2026.

export const LAST_CHECKED = '3 Oct 2026';

export type Goal = 'cash' | 'shopping' | 'travel';
export type Tone = 'bad' | 'warn' | 'good';

export interface Source {
  name: string;
  url: string;
}

export interface Route {
  id: string;
  name: string;
  /** Short label for the "Which route will you use?" picker. */
  shortName: string;
  goal: Goal;
  valuePerPoint: number;
  /** True when the ₹/point is an estimate (transfers, award seats). */
  estimate?: boolean;
  minPoints: number;
  cap?: number;
  capLabel?: string;
  fixedBlock?: number;
  fee?: number;
  conditions: string;
  assumptions: string;
  source: Source;
}

export interface Alert {
  id: string;
  kind: 'change' | 'info';
  tag: string;
  title: string;
  before?: string;
  now?: string;
  body?: string;
  effective: string;
  action: string;
  actionLabel?: 'Do' | 'Note';
  tone: Tone;
  category: AlertCategory;
  source: Source;
}

export type AlertCategory = 'devaluations' | 'milestones' | 'lounge' | 'fees';

export interface Milestone {
  label: string;
  threshold: number;
  period: 'month' | 'quarter' | 'year';
  periodLabel: string;
  benefitValue: number;
  benefitPoints?: string;
  benefitText: string;
  next?: string;
  source: Source;
  /** Example values used until the user types their own. */
  exampleSpend: number;
  examplePeriodEnd: string; // ISO date
}

export interface CardTableRow {
  fee: string;
  earn: string;
  best: string;
  cash: string;
  lounge: string;
  chip: 'BETTER' | 'CUT' | 'NOTE';
  chipTone: Tone;
  change: string;
}

export interface Card {
  id: string;
  bank: string;
  /** Short bank name for filters and lists, e.g. "HDFC". */
  bankShort: string;
  /** Name as issued, e.g. "Infinia (Metal)". */
  name: string;
  /** Bank + card, used in the wallet and selects, e.g. "HDFC Infinia". */
  shortName: string;
  /** Very short label for the coloured card chips. */
  chipName: string;
  currency: string;
  unit: string;
  grad: string;
  /** Text colour that reads on the card gradient. */
  ink: 'light' | 'dark';
  fee: string;
  earn: string;
  lounge: string;
  loungeSource: Source;
  routes: Route[];
  /** For cards with no per-point routes (shown on Redeem instead of routes). */
  earnOnlyNote?: string;
  alerts: Alert[];
  milestone?: Milestone;
  table: CardTableRow;
  lastChecked: string;
}

const S = {
  pmSmartbuy: { name: 'PointsMax', url: 'https://www.pointsmax.in/blog/hdfc-smartbuy-guide-2026' },
  pmDcb: { name: 'PointsMax', url: 'https://www.pointsmax.in/blog/hdfc-diners-club-black-credit-card-review-2026' },
  cmSmartbuy: { name: 'CardMaven', url: 'https://cardmaven.in/hdfc-smartbuy-offers-complete-guide' },
  ctHdfc: { name: 'CardTrail', url: 'https://cardtrail.in/rewards/maximize-hdfc-reward-points-2026' },
  pmathHdfc: { name: 'PointsMath', url: 'https://pointsmath.com/hdfc-bank-points-transfer-partners' },
  cmInfinia: { name: 'CardMaven', url: 'https://cardmaven.in/hdfc-bank-infinia-credit-card-review' },
  pbDcb: { name: 'Paisabazaar', url: 'https://www.paisabazaar.com/hdfc-bank/hdfc-diners-club-black-credit-card' },
  caEdge: { name: 'CardAdvisor', url: 'https://cardadvisor.in/articles/axis-edge-rewards-guide-2026' },
  caMagnus: { name: 'CardAdvisor', url: 'https://cardadvisor.in/articles/axis-magnus-credit-card-review-2026' },
  ctAxis: { name: 'CardTrail', url: 'https://cardtrail.in/news/axis-bank-miles-transfer-partners-2026' },
  cwAxis: { name: 'CardsWise', url: 'https://cardswise.in/news/axis-bank-edge-rewards-miles-partner-changes-september-2026' },
  cmAmexPt: { name: 'CardMaven', url: 'https://cardmaven.in/amex-platinum-travel-devaluation-2026' },
  ceAmexPt: { name: 'CardExpert', url: 'https://www.cardexpert.in/amex-platinum-travel-credit-card-review' },
  cmMrcc: { name: 'CardMaven', url: 'https://cardmaven.in/american-express-membership-rewards-credit-card' },
  pmathGold: { name: 'PointsMath', url: 'https://pointsmath.com/amex-gold-collection-india' },
  ciMrcc: { name: 'CardInsider', url: 'https://cardinsider.com/american-express/american-express-membership-rewards-credit-card' },
  caEmeralde: { name: 'CardAdvisor', url: 'https://cardadvisor.in/articles/icici-emeralde-private-metal-review-2026' },
  cmEmeralde: { name: 'CardMaven', url: 'https://cardmaven.in/icici-bank-emeralde-private-metal-credit-card-review' },
  caIcici: { name: 'CardAdvisor', url: 'https://cardadvisor.in/articles/icici-credit-card-ladder-guide' },
  ciSapphiro: { name: 'CardInsider', url: 'https://cardinsider.com/blog/should-you-upgrade-icici-sapphiro-icici-emeralde-private' },
  rivoIcici: { name: 'Rivo', url: 'https://rivo.pe/blog/icici-credit-card-reward-points-guide-2026' },
  pbKotakWr: { name: 'Paisabazaar', url: 'https://www.paisabazaar.com/kotak-mahindra-bank/kotak-white-reserve-credit-card' },
  ctSolitaire: { name: 'CardTrail', url: 'https://cardtrail.in/cards/kotak-solitaire-credit-card' },
  lfalSbi: { name: 'LiveFromALounge', url: 'https://livefromalounge.com/sbicards-cashback-card-imposes-new-restrictions-effective-april-1-2026' },
} satisfies Record<string, Source>;

export const SOURCES = S;

export const cards: Card[] = [
  {
    id: 'hdfc-infinia',
    bank: 'HDFC Bank',
    bankShort: 'HDFC',
    name: 'Infinia (Metal)',
    shortName: 'HDFC Infinia',
    chipName: 'HDFC Infinia',
    currency: 'Reward Points',
    unit: 'RP',
    grad: 'linear-gradient(120deg, #1e293b, #64748b)',
    ink: 'light',
    fee: '₹12,500 + GST',
    earn: '5 RP per ₹150',
    lounge: 'Unlimited, domestic + intl',
    loungeSource: S.cmInfinia,
    routes: [
      {
        id: 'smartbuy-travel',
        name: 'SmartBuy flights & hotels',
        shortName: 'SmartBuy',
        goal: 'travel',
        valuePerPoint: 1,
        minPoints: 1,
        cap: 50000,
        capLabel: '50,000 points a month',
        conditions: 'Points cover up to 70% of a booking; 50,000 points a month.',
        assumptions: 'Monthly SmartBuy cap of 50,000 points and 5 redemptions. Extra points can be used next month.',
        source: S.pmSmartbuy,
      },
      {
        id: 'apple-tanishq',
        name: 'Apple / Tanishq vouchers',
        shortName: 'Apple / Tanishq',
        goal: 'shopping',
        valuePerPoint: 1,
        minPoints: 1,
        cap: 50000,
        capLabel: '50,000 points a month (shared SmartBuy cap)',
        conditions: 'Apple and Tanishq vouchers on SmartBuy at full value.',
        assumptions: 'Voucher stock varies. Shares the 50,000-point monthly SmartBuy cap.',
        source: S.cmSmartbuy,
      },
      {
        id: 'other-vouchers',
        name: 'Other SmartBuy vouchers',
        shortName: 'Other vouchers',
        goal: 'shopping',
        valuePerPoint: 0.5,
        minPoints: 1,
        cap: 50000,
        capLabel: '50,000 points a month (shared SmartBuy cap)',
        conditions: 'Most other brand vouchers are 50 paise a point.',
        assumptions: 'Standard SmartBuy voucher rate. Shares the 50,000-point monthly SmartBuy cap.',
        source: S.ctHdfc,
      },
      {
        id: 'air-miles',
        name: 'Air miles (1:1 partners)',
        shortName: 'Air miles',
        goal: 'travel',
        valuePerPoint: 1,
        estimate: true,
        minPoints: 1,
        conditions: 'Value depends on the award seat. Air India is 2:1.',
        assumptions: 'Assumes about ₹1 of value per mile on a 1:1 partner. Award pricing varies.',
        source: S.pmathHdfc,
      },
      {
        id: 'statement-credit',
        name: 'Statement credit',
        shortName: 'Statement credit',
        goal: 'cash',
        valuePerPoint: 0.3,
        minPoints: 1,
        conditions: 'Cash is only 30 paise per point.',
        assumptions: 'Standard HDFC cash redemption rate.',
        source: S.ctHdfc,
      },
    ],
    alerts: [
      {
        id: 'infinia-cap',
        kind: 'change',
        tag: 'IMPROVED',
        title: 'HDFC Infinia: SmartBuy cap raised',
        before: 'Lower monthly SmartBuy cap',
        now: '50,000 pts/month, 5 redemptions',
        effective: 'Feb 2026',
        action: 'redeem large balances over two or more months.',
        tone: 'good',
        category: 'devaluations',
        source: S.pmSmartbuy,
      },
      {
        id: 'infinia-airindia',
        kind: 'change',
        tag: 'NOTE',
        title: 'HDFC Infinia: Air India now 2:1',
        before: 'Air India at better ratio',
        now: 'Air India transfer 2:1',
        effective: '2025',
        action: 'prefer 1:1 airline partners for transfers.',
        tone: 'warn',
        category: 'devaluations',
        source: S.pmathHdfc,
      },
    ],
    table: {
      fee: '₹12,500 + GST',
      earn: '5 RP per ₹150',
      best: '₹1.00',
      cash: '₹0.30',
      lounge: 'Unlimited, domestic + intl',
      chip: 'BETTER',
      chipTone: 'good',
      change: 'SmartBuy redemption cap raised to 50,000 pts/month (Feb 2026)',
    },
    lastChecked: LAST_CHECKED,
  },
  {
    id: 'hdfc-dcb',
    bank: 'HDFC Bank',
    bankShort: 'HDFC',
    name: 'Diners Club Black',
    shortName: 'HDFC Diners Club Black',
    chipName: 'HDFC DCB',
    currency: 'Reward Points',
    unit: 'RP',
    grad: 'linear-gradient(120deg, #111, #525252)',
    ink: 'light',
    fee: '₹10,000 + GST',
    earn: '5 RP per ₹150',
    lounge: 'Unlimited, domestic + intl',
    loungeSource: S.pbDcb,
    routes: [
      {
        id: 'smartbuy-travel',
        name: 'SmartBuy flights & hotels',
        shortName: 'SmartBuy',
        goal: 'travel',
        valuePerPoint: 1,
        minPoints: 1,
        cap: 50000,
        capLabel: '50,000 points a month',
        conditions: 'Flights and hotels on SmartBuy; 50,000 points a month.',
        assumptions: 'Monthly SmartBuy cap of 50,000 points. Extra points can be used next month.',
        source: S.pmDcb,
      },
      {
        id: 'air-miles',
        name: 'Air miles (1:1 partners)',
        shortName: 'Air miles',
        goal: 'travel',
        valuePerPoint: 1,
        estimate: true,
        minPoints: 1,
        conditions: 'Value depends on the award seat.',
        assumptions: 'Assumes about ₹1 of value per mile on a 1:1 partner.',
        source: S.pmathHdfc,
      },
      {
        id: 'smartbuy-vouchers',
        name: 'SmartBuy vouchers',
        shortName: 'Vouchers',
        goal: 'shopping',
        valuePerPoint: 0.5,
        minPoints: 1,
        cap: 50000,
        capLabel: '50,000 points a month (shared SmartBuy cap)',
        conditions: 'Brand vouchers at 50 paise a point.',
        assumptions: 'Standard SmartBuy voucher rate. Shares the 50,000-point monthly SmartBuy cap.',
        source: S.pmDcb,
      },
      {
        id: 'catalogue',
        name: 'Rewards catalogue',
        shortName: 'Catalogue',
        goal: 'shopping',
        valuePerPoint: 0.3,
        minPoints: 1,
        conditions: 'Products from the HDFC catalogue.',
        assumptions: 'Typical catalogue rate.',
        source: S.ctHdfc,
      },
      {
        id: 'statement-credit',
        name: 'Statement credit',
        shortName: 'Statement credit',
        goal: 'cash',
        valuePerPoint: 0.3,
        minPoints: 1,
        conditions: 'Cash is only 30 paise per point.',
        assumptions: 'Standard HDFC cash redemption rate.',
        source: S.ctHdfc,
      },
    ],
    alerts: [
      {
        id: 'dcb-voucher',
        kind: 'change',
        tag: 'CUT',
        title: 'HDFC DCB: voucher bonus cut',
        before: 'Up to 10,000 voucher bonus/month',
        now: '3,000/month',
        effective: '2026',
        action: 'don’t chase voucher spend beyond the 3,000-point cap.',
        tone: 'bad',
        category: 'devaluations',
        source: S.pmDcb,
      },
    ],
    milestone: {
      label: 'Quarterly spend milestone',
      threshold: 400000,
      period: 'quarter',
      periodLabel: 'Quarter ends',
      benefitValue: 10000,
      benefitPoints: '10,000 bonus points',
      benefitText: 'Worth about ₹10,000 on SmartBuy travel.',
      source: S.pmDcb,
      exampleSpend: 150000,
      examplePeriodEnd: '2026-12-31',
    },
    table: {
      fee: '₹10,000 + GST',
      earn: '5 RP per ₹150',
      best: '₹1.00',
      cash: '₹0.30',
      lounge: 'Unlimited, domestic + intl',
      chip: 'CUT',
      chipTone: 'bad',
      change: 'SmartBuy voucher earn capped at 3,000 pts/month (2026)',
    },
    lastChecked: LAST_CHECKED,
  },
  {
    id: 'axis-atlas',
    bank: 'Axis Bank',
    bankShort: 'Axis',
    name: 'Atlas',
    shortName: 'Axis Atlas',
    chipName: 'Axis Atlas',
    currency: 'EDGE Miles',
    unit: 'miles',
    grad: 'linear-gradient(120deg, #7a1f3d, #e11d48)',
    ink: 'light',
    fee: '₹5,000 + GST',
    earn: '5 miles/₹100 travel, 2 other',
    lounge: 'Check Axis terms',
    loungeSource: S.caEdge,
    routes: [
      {
        id: 'group-b',
        name: 'Group B transfer 1:2',
        shortName: 'Group B transfer',
        goal: 'travel',
        valuePerPoint: 2,
        estimate: true,
        minPoints: 500,
        cap: 120000,
        capLabel: '1,20,000 miles a year',
        fee: 235,
        conditions: 'Minimum 500 miles; ₹199 + GST transfer fee; 1,20,000 miles a year.',
        assumptions: 'Each mile becomes 2 partner points worth about ₹1 each. Fee of ₹199 + 18% GST ≈ ₹235.',
        source: S.ctAxis,
      },
      {
        id: 'travel-edge',
        name: 'Travel EDGE booking',
        shortName: 'Travel EDGE',
        goal: 'travel',
        valuePerPoint: 1,
        minPoints: 1,
        fee: 117,
        conditions: 'Book flights and hotels on Travel EDGE; ₹99 + GST fee.',
        assumptions: '1 mile = ₹1 on the portal. Fee of ₹99 + 18% GST ≈ ₹117.',
        source: S.caEdge,
      },
      {
        id: 'group-a',
        name: 'Group A transfer 2:1',
        shortName: 'Group A transfer',
        goal: 'travel',
        valuePerPoint: 0.4,
        estimate: true,
        minPoints: 1000,
        cap: 30000,
        capLabel: '30,000 miles a year',
        conditions: 'Minimum 1,000 miles; 30,000 miles a year. Devalued on 2 Apr 2026.',
        assumptions: '2 miles become 1 partner point, valued at about ₹0.80.',
        source: S.ctAxis,
      },
    ],
    alerts: [
      {
        id: 'atlas-group-a',
        kind: 'change',
        tag: 'DEVALUED',
        title: 'Axis Atlas: Group A transfers cut 75%',
        before: '1 mile : 2 pts',
        now: '2 miles : 1 pt',
        effective: '2 Apr 2026',
        action: 'use Group B partners at 1:2.',
        tone: 'bad',
        category: 'devaluations',
        source: S.ctAxis,
      },
      {
        id: 'atlas-accor',
        kind: 'change',
        tag: 'NOTE',
        title: 'Axis Atlas: Accor back at 2:1',
        before: 'Accor removed',
        now: 'Accor back at 2:1',
        effective: 'Sep 2026',
        action: 'only transfer to Accor for a specific booking.',
        tone: 'warn',
        category: 'devaluations',
        source: S.cwAxis,
      },
    ],
    table: {
      fee: '₹5,000 + GST',
      earn: '5 miles/₹100 travel, 2 other',
      best: '~₹2.00',
      cash: 'None',
      lounge: 'Check Axis terms',
      chip: 'CUT',
      chipTone: 'bad',
      change: 'Group A transfers 1:2 → 2:1 (2 Apr 2026)',
    },
    lastChecked: LAST_CHECKED,
  },
  {
    id: 'axis-magnus',
    bank: 'Axis Bank',
    bankShort: 'Axis',
    name: 'Magnus',
    shortName: 'Axis Magnus',
    chipName: 'Axis Magnus',
    currency: 'EDGE Reward Points',
    unit: 'pts',
    grad: 'linear-gradient(120deg, #4c1d95, #a78bfa)',
    ink: 'light',
    fee: '₹12,500 + GST',
    earn: '12 pts per ₹200',
    lounge: 'Spend-linked',
    loungeSource: S.caMagnus,
    routes: [
      {
        id: 'partner-5-2',
        name: 'Partner transfer 5:2',
        shortName: 'Partner 5:2',
        goal: 'travel',
        valuePerPoint: 0.4,
        estimate: true,
        minPoints: 500,
        fee: 235,
        conditions: 'Minimum 500 points; ₹199 + GST transfer fee.',
        assumptions: '5 points become 2 partner points worth about ₹1 each. Fee ≈ ₹235 with GST.',
        source: S.caMagnus,
      },
      {
        id: 'group-a-5-1',
        name: 'Group A transfer 5:1',
        shortName: 'Group A 5:1',
        goal: 'travel',
        valuePerPoint: 0.2,
        estimate: true,
        minPoints: 500,
        conditions: 'Group A partners such as Avios moved to 5:1 on 2 Apr 2026.',
        assumptions: '5 points become 1 partner point worth about ₹1.',
        source: S.caMagnus,
      },
      {
        id: 'catalogue',
        name: 'Catalogue / vouchers',
        shortName: 'Catalogue',
        goal: 'shopping',
        valuePerPoint: 0.2,
        minPoints: 1,
        conditions: 'Products and vouchers from the EDGE catalogue.',
        assumptions: 'Typical catalogue rate of 20 paise a point.',
        source: S.caEdge,
      },
    ],
    alerts: [
      {
        id: 'magnus-avios',
        kind: 'change',
        tag: 'DEVALUED',
        title: 'Axis Magnus: Avios now 5:1',
        before: '5 : 2 Avios',
        now: '5 : 1 Avios',
        effective: '2 Apr 2026',
        action: 'compare against Travel EDGE before transferring.',
        tone: 'bad',
        category: 'devaluations',
        source: S.caMagnus,
      },
    ],
    table: {
      fee: '₹12,500 + GST',
      earn: '12 pts per ₹200',
      best: '~₹0.40',
      cash: '₹0.20',
      lounge: 'Spend-linked',
      chip: 'CUT',
      chipTone: 'bad',
      change: 'Group A partners now 5:1 (2 Apr 2026)',
    },
    lastChecked: LAST_CHECKED,
  },
  {
    id: 'amex-pt',
    bank: 'American Express',
    bankShort: 'Amex',
    name: 'Platinum Travel',
    shortName: 'Amex Platinum Travel',
    chipName: 'Amex PT',
    currency: 'Membership Rewards',
    unit: 'MR',
    grad: 'linear-gradient(120deg, #94a3b8, #e2e8f0)',
    ink: 'dark',
    fee: '₹5,000 + GST',
    earn: '1 MR per ₹50',
    lounge: '8 domestic/yr, 2 per quarter',
    loungeSource: S.ceAmexPt,
    routes: [
      {
        id: 'taj-marriott',
        name: 'Taj / Marriott vouchers',
        shortName: 'Taj / Marriott',
        goal: 'travel',
        valuePerPoint: 0.5,
        minPoints: 1,
        conditions: 'Hotel vouchers from the Amex reward store.',
        assumptions: 'Voucher denominations vary; assumes 50 paise a point.',
        source: S.ceAmexPt,
      },
      {
        id: 'shopping-vouchers',
        name: 'Shopping vouchers',
        shortName: 'Shopping vouchers',
        goal: 'shopping',
        valuePerPoint: 0.3,
        minPoints: 1,
        conditions: 'Brand vouchers from the reward store.',
        assumptions: 'Typical voucher rate.',
        source: S.ceAmexPt,
      },
      {
        id: 'statement-credit',
        name: 'Statement credit / catalogue',
        shortName: 'Statement credit',
        goal: 'cash',
        valuePerPoint: 0.25,
        minPoints: 1,
        conditions: 'Cash is only 25 paise per point.',
        assumptions: 'Standard Amex cash rate.',
        source: S.ceAmexPt,
      },
    ],
    alerts: [
      {
        id: 'amexpt-milestones',
        kind: 'change',
        tag: 'DEVALUED',
        title: 'Amex Platinum Travel: milestones reworked',
        before: '₹1.9L → 7,500; ₹7L → 22,500 + ₹10k Taj',
        now: '₹4L → 10,000; ₹7L → ₹20k Taj',
        effective: '10 Sep 2026',
        action: 'only chase ₹4L if you will spend it anyway.',
        tone: 'bad',
        category: 'milestones',
        source: S.cmAmexPt,
      },
    ],
    milestone: {
      label: 'Membership-year milestone',
      threshold: 400000,
      period: 'year',
      periodLabel: 'Year ends',
      benefitValue: 5000,
      benefitPoints: '10,000 bonus points',
      benefitText: 'Worth about ₹5,000 as Taj vouchers.',
      next: 'Next tier at ₹7L gives a ₹20,000 Taj voucher.',
      source: S.cmAmexPt,
      exampleSpend: 310000,
      examplePeriodEnd: '2027-03-31',
    },
    table: {
      fee: '₹5,000 + GST',
      earn: '1 MR per ₹50',
      best: '₹0.50',
      cash: '₹0.25',
      lounge: '8 domestic/yr, 2 per quarter',
      chip: 'CUT',
      chipTone: 'bad',
      change: '₹1.9L milestone removed; ₹7L now ₹20,000 Taj voucher (10 Sep 2026)',
    },
    lastChecked: LAST_CHECKED,
  },
  {
    id: 'amex-mrcc',
    bank: 'American Express',
    bankShort: 'Amex',
    name: 'Membership Rewards',
    shortName: 'Amex Membership Rewards',
    chipName: 'Amex MRCC',
    currency: 'Membership Rewards',
    unit: 'MR',
    grad: 'linear-gradient(120deg, #1d4ed8, #93c5fd)',
    ink: 'light',
    fee: 'Waived on yearly spend',
    earn: '1 MR per ₹50 + 2,000/month bonus',
    lounge: 'Not included',
    loungeSource: S.ciMrcc,
    routes: [
      {
        id: 'gold-24k-taj',
        name: '24K Gold: Taj ₹14,000',
        shortName: '24K Taj',
        goal: 'travel',
        valuePerPoint: 14000 / 24000,
        minPoints: 24000,
        fixedBlock: 24000,
        conditions: 'Redeemed in blocks of 24,000 points for a ₹14,000 Taj voucher.',
        assumptions: 'Only whole blocks count; leftover points stay in your account.',
        source: S.pmathGold,
      },
      {
        id: 'gold-18k-taj',
        name: '18K Gold: Taj ₹9,000',
        shortName: '18K Taj',
        goal: 'travel',
        valuePerPoint: 9000 / 18000,
        minPoints: 18000,
        fixedBlock: 18000,
        conditions: 'Redeemed in blocks of 18,000 points for a ₹9,000 Taj voucher.',
        assumptions: 'Only whole blocks count; leftover points stay in your account.',
        source: S.pmathGold,
      },
      {
        id: 'gold-18k-myntra',
        name: '18K Gold: Myntra / Shoppers Stop ₹7,000',
        shortName: '18K Myntra',
        goal: 'shopping',
        valuePerPoint: 7000 / 18000,
        minPoints: 18000,
        fixedBlock: 18000,
        conditions: 'Blocks of 18,000 points for a ₹7,000 voucher.',
        assumptions: 'Only whole blocks count.',
        source: S.pmathGold,
      },
      {
        id: 'gold-18k-amazon',
        name: '18K Gold: Amazon / Flipkart ₹6,000',
        shortName: '18K Amazon',
        goal: 'shopping',
        valuePerPoint: 6000 / 18000,
        minPoints: 18000,
        fixedBlock: 18000,
        conditions: 'Blocks of 18,000 points for a ₹6,000 voucher.',
        assumptions: 'Only whole blocks count.',
        source: S.pmathGold,
      },
    ],
    alerts: [
      {
        id: 'mrcc-gold',
        kind: 'change',
        tag: 'NOTE',
        title: 'Amex MRCC: Gold Collection is vouchers only',
        before: '18K → ₹6,000 / 24K → ₹9,000 statement credit',
        now: 'Vouchers only',
        effective: '3 May 2022',
        action: 'pick the 24K Taj voucher for the best rate.',
        tone: 'warn',
        category: 'devaluations',
        source: S.pmathGold,
      },
    ],
    milestone: {
      label: 'Monthly bonus',
      threshold: 20000,
      period: 'month',
      periodLabel: 'Month ends',
      benefitValue: 500,
      benefitPoints: '1,000 bonus points',
      benefitText: 'Worth about ₹500. Another 1,000 for 4 transactions of ₹1,500+.',
      source: S.cmMrcc,
      exampleSpend: 12000,
      examplePeriodEnd: '2026-10-31',
    },
    table: {
      fee: 'Waived on yearly spend',
      earn: '1 MR per ₹50 + 2,000/month bonus',
      best: '₹0.58',
      cash: 'None',
      lounge: 'Not included',
      chip: 'NOTE',
      chipTone: 'warn',
      change: 'Gold Collection statement credit removed; vouchers only',
    },
    lastChecked: LAST_CHECKED,
  },
  {
    id: 'icici-emeralde',
    bank: 'ICICI Bank',
    bankShort: 'ICICI',
    name: 'Emeralde Private Metal',
    shortName: 'ICICI Emeralde Private Metal',
    chipName: 'ICICI Emeralde',
    currency: 'Reward Points',
    unit: 'pts',
    grad: 'linear-gradient(120deg, #064e3b, #34d399)',
    ink: 'light',
    fee: 'Invite-only; 12,500 pts on renewal',
    earn: '6 pts per ₹200',
    lounge: 'Unlimited, domestic + intl',
    loungeSource: S.cmEmeralde,
    routes: [
      {
        id: 'ishop',
        name: 'iShop flights & hotels',
        shortName: 'iShop',
        goal: 'travel',
        valuePerPoint: 1,
        minPoints: 1,
        conditions: 'Points can pay 100% of flights and 90% of hotels.',
        assumptions: '1 point = ₹1 on iShop.',
        source: S.caEmeralde,
      },
      {
        id: 'air-india',
        name: 'Air India 1:1',
        shortName: 'Air India',
        goal: 'travel',
        valuePerPoint: 1,
        estimate: true,
        minPoints: 1,
        conditions: 'Transfer 1:1 to Air India Maharaja Club.',
        assumptions: 'Assumes about ₹1 per mile; award pricing varies.',
        source: S.cmEmeralde,
      },
      {
        id: 'gift-vouchers',
        name: 'Gift vouchers',
        shortName: 'Vouchers',
        goal: 'shopping',
        valuePerPoint: 1,
        minPoints: 1,
        conditions: 'Brand vouchers at full value.',
        assumptions: '1 point = ₹1.',
        source: S.caEmeralde,
      },
      {
        id: 'statement-credit',
        name: 'Statement credit',
        shortName: 'Statement credit',
        goal: 'cash',
        valuePerPoint: 0.4,
        minPoints: 1,
        conditions: 'Cash is only 40 paise per point.',
        assumptions: 'Standard ICICI cash rate.',
        source: S.rivoIcici,
      },
    ],
    alerts: [
      {
        id: 'emeralde-categories',
        kind: 'change',
        tag: 'CAPPED',
        title: 'ICICI Emeralde: everyday categories capped',
        before: 'No caps',
        now: 'Grocery/utility/education 1,000 pts/cycle',
        effective: '2026',
        action: 'put big utility and school fees on another card.',
        tone: 'warn',
        category: 'devaluations',
        source: S.caEmeralde,
      },
      {
        id: 'emeralde-transport',
        kind: 'change',
        tag: 'CAPPED',
        title: 'ICICI Emeralde: transport rewards capped',
        before: 'Uncapped',
        now: 'Transport rewards capped at ₹20,000/month',
        effective: 'Early 2026',
        action: 'keep monthly transport spend under ₹20,000 on this card.',
        tone: 'warn',
        category: 'devaluations',
        source: S.caIcici,
      },
    ],
    table: {
      fee: 'Invite-only; 12,500 pts on renewal',
      earn: '6 pts per ₹200',
      best: '₹1.00',
      cash: '₹0.40',
      lounge: 'Unlimited, domestic + intl',
      chip: 'CUT',
      chipTone: 'warn',
      change: 'Grocery, utility, education capped at 1,000 pts/cycle (2026)',
    },
    lastChecked: LAST_CHECKED,
  },
  {
    id: 'icici-sapphiro',
    bank: 'ICICI Bank',
    bankShort: 'ICICI',
    name: 'Sapphiro',
    shortName: 'ICICI Sapphiro',
    chipName: 'ICICI Sapphiro',
    currency: 'Reward Points',
    unit: 'pts',
    grad: 'linear-gradient(120deg, #1e3a8a, #60a5fa)',
    ink: 'light',
    fee: '₹3,500 + GST',
    earn: '2 pts/₹100, 4 intl',
    lounge: 'Spend-linked',
    loungeSource: S.ciSapphiro,
    routes: [
      {
        id: 'statement-credit',
        name: 'Statement credit',
        shortName: 'Statement credit',
        goal: 'cash',
        valuePerPoint: 0.25,
        minPoints: 1,
        conditions: 'Cash at 25 paise per point.',
        assumptions: 'Standard ICICI rate for this card.',
        source: S.rivoIcici,
      },
      {
        id: 'gift-catalogue',
        name: 'Gift catalogue',
        shortName: 'Catalogue',
        goal: 'shopping',
        valuePerPoint: 0.25,
        minPoints: 1,
        conditions: 'Products and vouchers from the catalogue.',
        assumptions: 'Typical catalogue rate.',
        source: S.rivoIcici,
      },
      {
        id: 'air-india',
        name: 'Air India 6:1',
        shortName: 'Air India',
        goal: 'travel',
        valuePerPoint: 1 / 6,
        estimate: true,
        minPoints: 1,
        conditions: '6 points become 1 Air India mile.',
        assumptions: 'Assumes about ₹1 per mile.',
        source: S.rivoIcici,
      },
    ],
    alerts: [
      {
        id: 'sapphiro-bms',
        kind: 'change',
        tag: 'CUT',
        title: 'ICICI Sapphiro: BookMyShow offer removed',
        before: 'BookMyShow buy one get one',
        now: 'Largely removed',
        effective: 'Feb 2026',
        action: 'review whether the ₹3,500 fee still pays off.',
        tone: 'bad',
        category: 'devaluations',
        source: S.ciSapphiro,
      },
    ],
    milestone: {
      label: 'Yearly spend milestone',
      threshold: 400000,
      period: 'year',
      periodLabel: 'Year ends',
      benefitValue: 1000,
      benefitPoints: '4,000 bonus points',
      benefitText: 'Worth about ₹1,000.',
      source: S.ciSapphiro,
      exampleSpend: 200000,
      examplePeriodEnd: '2027-03-31',
    },
    table: {
      fee: '₹3,500 + GST',
      earn: '2 pts/₹100, 4 intl',
      best: '₹0.25',
      cash: '₹0.25',
      lounge: 'Spend-linked',
      chip: 'CUT',
      chipTone: 'bad',
      change: 'BookMyShow BOGO largely removed (Feb 2026)',
    },
    lastChecked: LAST_CHECKED,
  },
  {
    id: 'kotak-wr',
    bank: 'Kotak Mahindra Bank',
    bankShort: 'Kotak',
    name: 'White Reserve',
    shortName: 'Kotak White Reserve',
    chipName: 'Kotak White Res.',
    currency: 'White Pass',
    unit: 'White Pass',
    grad: 'linear-gradient(120deg, #f5f5f4, #a8a29e)',
    ink: 'dark',
    fee: '₹12,500 + tax (waived at ₹10L)',
    earn: 'White Pass on spend milestones, up to ₹2.5L/yr',
    lounge: 'Unlimited, domestic + intl',
    loungeSource: S.pbKotakWr,
    routes: [
      {
        id: 'white-pass-catalogue',
        name: 'White Pass catalogue',
        shortName: 'Catalogue',
        goal: 'shopping',
        valuePerPoint: 1,
        minPoints: 1,
        conditions: 'Vouchers and products from the White Pass catalogue.',
        assumptions: '1 White Pass point = ₹1.',
        source: S.pbKotakWr,
      },
      {
        id: 'cashback',
        name: 'Cashback',
        shortName: 'Cashback',
        goal: 'cash',
        valuePerPoint: 0.7,
        minPoints: 1,
        conditions: 'White Pass expires 90 days after the cycle ends.',
        assumptions: 'Cash conversion at 70 paise per point.',
        source: S.pbKotakWr,
      },
    ],
    alerts: [
      {
        id: 'kotak-lounge',
        kind: 'info',
        tag: 'LOUNGE',
        title: 'Kotak White Reserve: unlimited lounges',
        body: 'Unlimited domestic and international access. Fee ₹12,500 waived at ₹10L yearly spend.',
        effective: '2026',
        action: 'White Pass expires 90 days after the cycle ends.',
        actionLabel: 'Note',
        tone: 'good',
        category: 'lounge',
        source: S.pbKotakWr,
      },
    ],
    milestone: {
      label: 'Fee waiver',
      threshold: 1000000,
      period: 'year',
      periodLabel: 'Year ends',
      benefitValue: 12500,
      benefitText: 'Annual fee of ₹12,500 waived. White Pass tiers go up to ₹2.5L at ₹1Cr spend.',
      source: S.pbKotakWr,
      exampleSpend: 1050000,
      examplePeriodEnd: '2027-03-31',
    },
    table: {
      fee: '₹12,500 + tax (waived at ₹10L)',
      earn: 'White Pass on spend milestones, up to ₹2.5L/yr',
      best: '₹1.00',
      cash: '₹0.70',
      lounge: 'Unlimited, domestic + intl',
      chip: 'NOTE',
      chipTone: 'warn',
      change: 'White Pass expires 90 days after the anniversary cycle',
    },
    lastChecked: LAST_CHECKED,
  },
  {
    id: 'kotak-solitaire',
    bank: 'Kotak Mahindra Bank',
    bankShort: 'Kotak',
    name: 'Solitaire',
    shortName: 'Kotak Solitaire',
    chipName: 'Kotak Solitaire',
    currency: 'Air miles',
    unit: 'miles',
    grad: 'linear-gradient(120deg, #0c0a09, #b45309)',
    ink: 'light',
    fee: '₹25,000 (waived for Solitaire members)',
    earn: '~3% base as air miles, up to 10%',
    lounge: 'Unlimited, domestic + intl',
    loungeSource: S.ctSolitaire,
    routes: [],
    earnOnlyNote:
      'Solitaire earns about 3% back as air miles (up to 10% on some spends). There are no per-point redemption routes to compare, so we show the earn rate only.',
    alerts: [],
    table: {
      fee: '₹25,000 (waived for Solitaire members)',
      earn: '~3% base as air miles, up to 10%',
      best: '~3% back',
      cash: '—',
      lounge: 'Unlimited, domestic + intl',
      chip: 'NOTE',
      chipTone: 'good',
      change: 'Zero forex markup; ₹12L income needed',
    },
    lastChecked: LAST_CHECKED,
  },
  {
    id: 'sbi-cashback',
    bank: 'SBI Card',
    bankShort: 'SBI',
    name: 'Cashback',
    shortName: 'SBI Cashback',
    chipName: 'SBI Cashback',
    currency: 'Cashback (₹)',
    unit: '₹ cashback',
    grad: 'linear-gradient(120deg, #0e7490, #a3e635)',
    ink: 'light',
    fee: 'See issuer',
    earn: '5% online, 1% offline',
    lounge: 'Not a lounge card',
    loungeSource: S.lfalSbi,
    routes: [
      {
        id: 'auto-credit',
        name: 'Cashback is auto-credited',
        shortName: 'Auto-credit',
        goal: 'cash',
        valuePerPoint: 1,
        minPoints: 1,
        conditions: '5% online capped at ₹2,000 a cycle; 1% offline capped at ₹2,000.',
        assumptions: 'Enter your cashback in ₹. It is credited to your statement automatically.',
        source: S.lfalSbi,
      },
    ],
    alerts: [
      {
        id: 'sbi-cap',
        kind: 'change',
        tag: 'CAPPED',
        title: 'SBI Cashback: 5% online now capped',
        before: '₹5,000 max per cycle',
        now: '₹2,000 online + ₹2,000 offline',
        effective: '1 Apr 2026',
        action: 'move online spend above ₹40,000 a cycle elsewhere.',
        tone: 'bad',
        category: 'devaluations',
        source: S.lfalSbi,
      },
    ],
    table: {
      fee: 'See issuer',
      earn: '5% online, 1% offline',
      best: '₹1.00 (cash)',
      cash: '₹1.00',
      lounge: 'Not a lounge card',
      chip: 'CUT',
      chipTone: 'bad',
      change: 'Online 5% capped at ₹2,000/cycle; new exclusions (1 Apr 2026)',
    },
    lastChecked: LAST_CHECKED,
  },
];

const unique = (xs: string[]) => [...new Set(xs)];

/** Short bank names in data order. Built from `cards`, so new banks appear automatically. */
export const BANKS: string[] = unique(cards.map((c) => c.bankShort));

/** Full bank names in data order. */
export const BANK_NAMES: string[] = unique(cards.map((c) => c.bank));

/** "HDFC, Axis and SBI" */
export function listBanks(names: string[] = BANKS): string {
  return names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

export const GOAL_LABELS: Record<Goal, string> = {
  cash: 'Cash',
  shopping: 'Shopping',
  travel: 'Travel',
};

export function getCard(id: string | null | undefined): Card | undefined {
  return cards.find((c) => c.id === id);
}

/** Example wallet seeded on first visit. */
export const EXAMPLE_WALLET = [
  { cardId: 'hdfc-infinia', points: 85000 },
  { cardId: 'axis-atlas', points: 12000 },
  { cardId: 'kotak-wr', points: 24000 },
  { cardId: 'amex-pt', points: 22000 },
];
