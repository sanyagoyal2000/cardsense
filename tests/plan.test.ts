import { describe, expect, it } from 'vitest';
import { canAddCard, canSaveRedemptionPlan, freeConsultAvailable, hasPlus, monthKey } from '../src/lib/plan';
import { buildFeed, compactCount, pollResults, timeAgo, type FeedItem } from '../src/lib/community';
import type { Post } from '../src/data/community';

describe('plan gating', () => {
  it('card limits: Free 1, Plus 5, Premium unlimited', () => {
    expect(canAddCard('free', 0)).toBe(true);
    expect(canAddCard('free', 1)).toBe(false);
    expect(canAddCard('plus', 4)).toBe(true);
    expect(canAddCard('plus', 5)).toBe(false);
    expect(canAddCard('premium', 500)).toBe(true);
  });
  it('Plus features', () => {
    expect(hasPlus('free')).toBe(false);
    expect(hasPlus('plus')).toBe(true);
    expect(hasPlus('premium')).toBe(true);
  });
  it('Free saves one redemption plan a month', () => {
    expect(canSaveRedemptionPlan('free', {}, 'a', '2026-10')).toBe(true);
    expect(canSaveRedemptionPlan('free', { a: '2026-10' }, 'b', '2026-10')).toBe(false);
    // changing the same card's plan this month is fine
    expect(canSaveRedemptionPlan('free', { a: '2026-10' }, 'a', '2026-10')).toBe(true);
    // last month's save doesn't count
    expect(canSaveRedemptionPlan('free', { a: '2026-09' }, 'b', '2026-10')).toBe(true);
    expect(canSaveRedemptionPlan('plus', { a: '2026-10', b: '2026-10' }, 'c', '2026-10')).toBe(true);
  });
  it('Premium gets one free consult per month', () => {
    expect(freeConsultAvailable('premium', [], '2026-10')).toBe(true);
    expect(freeConsultAvailable('premium', [{ free: true, month: '2026-10' }], '2026-10')).toBe(false);
    expect(freeConsultAvailable('premium', [{ free: true, month: '2026-09' }], '2026-10')).toBe(true);
    expect(freeConsultAvailable('premium', [{ free: false, month: '2026-10' }], '2026-10')).toBe(true);
    expect(freeConsultAvailable('plus', [], '2026-10')).toBe(false);
  });
  it('monthKey pads the month', () => {
    expect(monthKey(new Date(2026, 0, 5))).toBe('2026-01');
  });
});

describe('community helpers', () => {
  const H = 60 * 60 * 1000;
  const now = 1_000 * H;
  const post = (id: string, over: Partial<Post> = {}): Post => ({
    id,
    type: 'question',
    group: 'amex',
    title: id,
    body: '',
    author: 'x',
    upvotes: 0,
    extraReplies: 0,
    createdAt: now,
    ...over,
  });
  const item = (p: Post, upvotes = p.upvotes, replies = p.extraReplies): FeedItem => ({ post: p, upvotes, replies });

  it('timeAgo', () => {
    expect(timeAgo(now, now)).toBe('just now');
    expect(timeAgo(now - 5 * 60000, now)).toBe('5m ago');
    expect(timeAgo(now - 2 * H, now)).toBe('2h ago');
    expect(timeAgo(now - 49 * H, now)).toBe('2d ago');
  });
  it('compactCount', () => {
    expect(compactCount(418)).toBe('418');
    expect(compactCount(1222)).toBe('1.2k');
    expect(compactCount(2000)).toBe('2k');
  });
  it('feed: pinned first, filters by tab and group', () => {
    const items = [
      item(post('old-popular', { upvotes: 500, createdAt: now - 200 * H })),
      item(post('pinned', { pinned: true, createdAt: now - 10 * H })),
      item(post('fresh', { upvotes: 20, createdAt: now - 1 * H, extraReplies: 3 })),
      item(post('win', { type: 'win', group: 'hdfc', createdAt: now - 3 * H })),
    ];
    expect(buildFeed(items, 'trending', 'all', now).map((i) => i.post.id).slice(0, 2)).toEqual(['pinned', 'fresh']);
    expect(buildFeed(items, 'latest', 'all', now)[0].post.id).toBe('fresh');
    expect(buildFeed(items, 'wins', 'all', now).map((i) => i.post.id)).toEqual(['win']);
    expect(buildFeed(items, 'trending', 'hdfc', now).map((i) => i.post.id)).toEqual(['win']);
    expect(buildFeed(items, 'unanswered', 'all', now).map((i) => i.post.id)).not.toContain('fresh');
  });
  it('poll results include my vote', () => {
    const r = pollResults(
      [
        { label: 'A', votes: 119 },
        { label: 'B', votes: 193 },
      ],
      1,
    );
    expect(r.total).toBe(313);
    expect(r.options.map((o) => o.percent)).toEqual([38, 62]);
  });
});
