import type { FeedTab, GroupId, PollOption, Post, PostType } from '../data/community';

const HOUR = 60 * 60 * 1000;

/** "just now", "5m ago", "2h ago", "3d ago", "4w ago" */
export function timeAgo(then: number, now: number): string {
  const mins = Math.max(0, Math.floor((now - then) / 60000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

/** 1222 → "1.2k", 418 → "418" */
export function compactCount(n: number): string {
  if (n < 1000) return String(n);
  const k = Math.round(n / 100) / 10;
  return `${k % 1 === 0 ? k.toFixed(0) : k}k`;
}

/** Upvotes decay with age so fresh posts can climb. */
export function trendingScore(upvotes: number, createdAt: number, now: number): number {
  const hours = Math.max(0, (now - createdAt) / HOUR);
  return upvotes / Math.pow(hours + 2, 1.3);
}

export interface FeedItem {
  post: Post;
  upvotes: number;
  replies: number;
}

const TAB_TYPE: Partial<Record<FeedTab, PostType>> = { wins: 'win', devaluations: 'devaluation' };

/** Filters by group and tab, then sorts. Pinned posts stay on top except in Latest. */
export function buildFeed(items: FeedItem[], tab: FeedTab, group: GroupId | 'all', now: number): FeedItem[] {
  let list = group === 'all' ? items : items.filter((i) => i.post.group === group);
  const type = TAB_TYPE[tab];
  if (type) list = list.filter((i) => i.post.type === type);
  if (tab === 'unanswered') list = list.filter((i) => i.replies === 0);

  const byScore = (a: FeedItem, b: FeedItem) =>
    trendingScore(b.upvotes, b.post.createdAt, now) - trendingScore(a.upvotes, a.post.createdAt, now);
  const byDate = (a: FeedItem, b: FeedItem) => b.post.createdAt - a.post.createdAt;
  const pinnedFirst = (a: FeedItem, b: FeedItem) => Number(!!b.post.pinned) - Number(!!a.post.pinned);

  if (tab === 'latest') return [...list].sort(byDate);
  return [...list].sort((a, b) => pinnedFirst(a, b) || (tab === 'trending' ? byScore(a, b) : byDate(a, b)));
}

/** Whole-number percentages for each option, with the user's vote added. */
export function pollResults(options: PollOption[], myVote: number | undefined) {
  const counts = options.map((o, i) => o.votes + (myVote === i ? 1 : 0));
  const total = counts.reduce((s, c) => s + c, 0);
  return {
    total,
    options: options.map((o, i) => ({
      label: o.label,
      votes: counts[i],
      percent: total === 0 ? 0 : Math.round((counts[i] / total) * 100),
    })),
  };
}
