// Sample community posts. Names and posts are made up for the prototype.
// New posts, replies and votes are saved in localStorage, not here.

export type PostType = 'question' | 'win' | 'devaluation' | 'poll';
export type GroupId = 'hdfc' | 'axis' | 'amex' | 'icici' | 'kotak-sbi' | 'beginners';
export type FeedTab = 'trending' | 'latest' | 'wins' | 'devaluations' | 'unanswered';

export interface Group {
  id: GroupId;
  label: string;
  /** Posts in the group before this device's posts are added. */
  count: number;
}

export const GROUPS: Group[] = [
  { id: 'hdfc', label: 'HDFC Infinia & DCB', count: 418 },
  { id: 'axis', label: 'Axis Atlas & Magnus', count: 302 },
  { id: 'amex', label: 'Amex', count: 196 },
  { id: 'icici', label: 'ICICI', count: 121 },
  { id: 'kotak-sbi', label: 'Kotak & SBI', count: 88 },
  { id: 'beginners', label: 'Beginners', count: 97 },
];

export const TYPE_LABELS: Record<PostType, string> = {
  question: 'Question',
  win: 'Redemption win',
  devaluation: 'Devaluation',
  poll: 'Poll',
};

export const FEED_TABS: { id: FeedTab; label: string }[] = [
  { id: 'trending', label: 'Trending' },
  { id: 'latest', label: 'Latest' },
  { id: 'wins', label: 'Redemption wins' },
  { id: 'devaluations', label: 'Devaluations' },
  { id: 'unanswered', label: 'Unanswered' },
];

export interface Reply {
  id: string;
  postId: string;
  author: string;
  body: string;
  createdAt: number;
  expert?: boolean;
}

export interface PollOption {
  label: string;
  votes: number;
}

export interface Post {
  id: string;
  type: PostType;
  group: GroupId;
  title: string;
  body: string;
  author: string;
  authorNote?: string;
  upvotes: number;
  /** Replies not loaded in the prototype; shown in the count only. */
  extraReplies: number;
  createdAt: number;
  pinned?: boolean;
  /** A verified expert has answered. */
  expertAnswer?: boolean;
  poll?: PollOption[];
}

const HOUR = 60 * 60 * 1000;
const NOW = Date.now();
const ago = (hours: number) => NOW - hours * HOUR;

export const SEED_POSTS: Post[] = [
  {
    id: 'atlas-group-a',
    type: 'devaluation',
    group: 'axis',
    pinned: true,
    title: 'Atlas Group A cut to 2:1: where are you moving your miles now?',
    body: 'Group B partners still convert at 1:2. Sharing my test transfers to Hilton and SpiceJet below, with dates.\n\nHilton: transferred 10,000 EDGE Miles on 28 Sep, credited in 2 days. SpiceJet: 5,000 miles on 30 Sep, credited the same evening. Accor is still Group A, so I’m holding until I have a booking.',
    author: 'Rohan M.',
    authorNote: 'Atlas holder',
    upvotes: 214,
    extraReplies: 84,
    createdAt: ago(2),
  },
  {
    id: 'infinia-singapore',
    type: 'win',
    group: 'hdfc',
    title: 'Booked Delhi–Singapore business with 70,000 Infinia points via 1:1 transfer',
    body: 'Cash fare was ₹1,18,000. That’s about ₹1.69 a point. Steps and dates inside.\n\n1. Checked award space on the partner site first.\n2. Transferred 70,000 points 1:1. It took about 36 hours.\n3. Booked the same day. Taxes were ₹6,400 paid in cash.',
    author: 'Priya S.',
    upvotes: 142,
    extraReplies: 53,
    createdAt: ago(5),
    expertAnswer: true,
  },
  {
    id: 'sbi-cashback-cap',
    type: 'question',
    group: 'beginners',
    title: 'I spend ₹60k a month, mostly online. SBI Cashback after the April cap, or something else?',
    body: '5% is now capped at ₹2,000 online, so anything above ₹40k earns less.\n\nMost of it is Amazon, Swiggy and flights. I don’t want an annual fee above ₹1,000.',
    author: 'Ankit R.',
    upvotes: 67,
    extraReplies: 22,
    createdAt: ago(24),
  },
  {
    id: 'amex-milestone-poll',
    type: 'devaluation',
    group: 'amex',
    title: 'Platinum Travel lost the ₹1.9L milestone. Keeping it or cancelling?',
    body: 'The 15,000-point bonus at ₹1.9 lakh is gone from this cardmember year. The ₹4 lakh Taj voucher milestone stays.',
    author: 'Neha K.',
    upvotes: 51,
    extraReplies: 40,
    createdAt: ago(48),
    poll: [
      { label: 'Keeping it', votes: 119 },
      { label: 'Cancelling', votes: 193 },
    ],
  },
  {
    id: 'icici-emeralde-lounge',
    type: 'question',
    group: 'icici',
    title: 'Does the Emeralde Private lounge spend rule count the previous quarter?',
    body: 'Got turned away at T3 even though I spent ₹80k last quarter. Which quarter do they check?',
    author: 'Sahil D.',
    upvotes: 6,
    extraReplies: 0,
    createdAt: ago(20),
  },
  {
    id: 'dcb-smartbuy-hotels',
    type: 'win',
    group: 'hdfc',
    title: 'DCB 10X on SmartBuy hotels still works after the cap change',
    body: 'Booked 3 nights in Goa through SmartBuy hotels. 10X posted within a week, within the new monthly cap.',
    author: 'Karan V.',
    upvotes: 39,
    extraReplies: 11,
    createdAt: ago(60),
  },
  {
    id: 'kotak-white-fee',
    type: 'devaluation',
    group: 'kotak-sbi',
    title: 'Kotak White fee waiver threshold went up',
    body: 'Notice says the waiver now needs ₹5 lakh spend, up from ₹4 lakh. Effective from my next anniversary.',
    author: 'Divya P.',
    upvotes: 24,
    extraReplies: 0,
    createdAt: ago(70),
  },
];

export const SEED_REPLIES: Reply[] = [
  {
    id: 'r1',
    postId: 'atlas-group-a',
    author: 'Meera I.',
    body: 'Same experience with SpiceJet. For Group A I’d only transfer against a specific booking now.',
    createdAt: ago(1.5),
  },
  {
    id: 'r2',
    postId: 'atlas-group-a',
    author: 'Ankit R.',
    body: 'Is Marriott still in Group B?',
    createdAt: ago(1),
  },
  {
    id: 'r3',
    postId: 'infinia-singapore',
    author: 'Arjun Mehta',
    body: 'Good use. Tip for others: check the partner’s fuel surcharge before transferring, it varies a lot by route.',
    createdAt: ago(4),
    expert: true,
  },
  {
    id: 'r4',
    postId: 'sbi-cashback-cap',
    author: 'Priya S.',
    body: 'Keep SBI for the first ₹40k online, then put the rest on a flat-rate card.',
    createdAt: ago(20),
  },
  {
    id: 'r5',
    postId: 'amex-milestone-poll',
    author: 'Rohan M.',
    body: 'Keeping it only for the ₹4 lakh Taj voucher. If you don’t reach that, it’s hard to justify.',
    createdAt: ago(40),
  },
];

export const TOP_CONTRIBUTORS = [
  { name: 'Rohan M.', note: 'Miles transfers · 2.1k helpful', grad: 'linear-gradient(135deg, #6ee7b7, #a3e635)' },
  { name: 'Priya S.', note: 'SmartBuy · 1.4k helpful', grad: 'linear-gradient(135deg, #fb923c, #f472b6)' },
  { name: 'Karan V.', note: 'Amex · 980 helpful', grad: 'linear-gradient(135deg, #93c5fd, #c4b5fd)' },
];

export const HOUSE_RULES = [
  'Never post card numbers, statements or OTPs.',
  'No referral links or selling.',
  'Share sources for rule changes.',
];

/** Name shown on posts made from this device. */
export const YOU = 'You';
