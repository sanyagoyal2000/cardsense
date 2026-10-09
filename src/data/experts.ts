// Sample expert profiles and prices for the prototype.
import expertPhoto from '../assets/expert.jpg';

export type ExpertCategory = 'strategy' | 'travel' | 'insiders' | 'disputes';
export type ExpertKind = 'independent' | 'former' | 'current';
export type CallFormat = 'video' | 'voice' | 'chat';

export const CATEGORIES: { id: ExpertCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All experts' },
  { id: 'strategy', label: 'Card strategy' },
  { id: 'travel', label: 'Miles & travel' },
  { id: 'insiders', label: 'Bank insiders' },
  { id: 'disputes', label: 'Disputes & fees' },
];

export const KIND_LABELS: Record<ExpertKind, string> = {
  independent: 'Independent',
  former: 'Bank insider · former',
  current: 'Bank insider · current',
};

export const FORMATS: { id: CallFormat; label: string }[] = [
  { id: 'video', label: 'Video call' },
  { id: 'voice', label: 'Voice' },
  { id: 'chat', label: 'Chat' },
];

export interface Expert {
  id: string;
  name: string;
  role: string;
  kind: ExpertKind;
  categories: ExpertCategory[];
  bio: string;
  rating: number;
  calls: number;
  languages: string[];
  price: number;
  minutes: number;
  photo?: string;
  /** Avatar gradient when there is no photo. */
  grad: string;
  /** Days of the week with no slots (0 = Sunday). */
  offDays: number[];
  slots: string[];
}

export const EXPERTS: Expert[] = [
  {
    id: 'arjun',
    name: 'Arjun Mehta',
    role: 'Miles & travel strategist',
    kind: 'independent',
    categories: ['travel', 'strategy'],
    bio: '8 years optimising HDFC and Axis transfers. Business-class awards, partner sweet spots.',
    rating: 4.9,
    calls: 312,
    languages: ['Hindi', 'English'],
    price: 499,
    minutes: 20,
    photo: expertPhoto,
    grad: 'linear-gradient(135deg, #7c3aed, #ec4899)',
    offDays: [1],
    slots: ['9:00 am', '1:00 pm', '6:00 pm', '9:00 pm'],
  },
  {
    id: 'meera',
    name: 'Meera Iyer',
    role: 'Ex-relationship manager, private bank',
    kind: 'former',
    categories: ['insiders', 'strategy'],
    bio: '12 years in premium cards. Upgrades, fee waivers, eligibility and how banks review applications.',
    rating: 4.8,
    calls: 198,
    languages: ['English', 'Tamil'],
    price: 799,
    minutes: 30,
    grad: 'linear-gradient(135deg, #6ee7b7, #a3e635)',
    offDays: [3],
    slots: ['10:00 am', '11:30 am', '6:00 pm', '8:30 pm'],
  },
  {
    id: 'vikram',
    name: 'Vikram Rao',
    role: 'Card operations, works at a private bank',
    kind: 'current',
    categories: ['insiders', 'disputes'],
    bio: 'Disputes, chargebacks, reward-credit delays and fee reversals.',
    rating: 4.7,
    calls: 126,
    languages: ['English', 'Kannada'],
    price: 299,
    minutes: 15,
    grad: 'linear-gradient(135deg, #fb923c, #fde68a)',
    offDays: [2, 4],
    slots: ['7:30 am', '7:00 pm', '8:00 pm', '9:30 pm'],
  },
];

export const VETTING = [
  'ID and work history checked before listing.',
  'Bank staff must disclose their employer and confirm their employer allows outside work.',
  'No commissions or card referrals from experts.',
  'Ratings only from people who completed a call.',
];

export const TRUST_POINTS: [string, string][] = [
  ['ID + credentials checked', 'for every expert'],
  ['Conflicts disclosed', 'on every profile'],
  ['Full refund', 'if they don’t show'],
];
