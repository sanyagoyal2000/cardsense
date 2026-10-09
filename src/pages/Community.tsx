import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Pill from '../components/Pill';
import PostCard from '../components/PostCard';
import UpgradePrompt from '../components/UpgradePrompt';
import {
  FEED_TABS,
  GROUPS,
  HOUSE_RULES,
  SEED_POSTS,
  SEED_REPLIES,
  TOP_CONTRIBUTORS,
  TYPE_LABELS,
  YOU,
  type FeedTab,
  type GroupId,
  type Post,
  type PostType,
  type Reply,
} from '../data/community';
import { buildFeed, compactCount, timeAgo, type FeedItem } from '../lib/community';
import { checkSensitive } from '../lib/moderate';
import { hasPlus, usePlan } from '../lib/plan';
import { isObject, KEYS, useStored } from '../lib/storage';
import PageShell from './PageShell';

const POST_TYPES: PostType[] = ['question', 'win', 'devaluation', 'poll'];

const isPosts = (v: unknown): v is Post[] =>
  Array.isArray(v) && v.every((p) => isObject(p) && typeof p.id === 'string' && typeof p.title === 'string');
const isReplies = (v: unknown): v is Reply[] =>
  Array.isArray(v) && v.every((r) => isObject(r) && typeof r.postId === 'string' && typeof r.body === 'string');
const isFlags = (v: unknown): v is Record<string, boolean> =>
  isObject(v) && Object.values(v).every((x) => typeof x === 'boolean');
const isPollVotes = (v: unknown): v is Record<string, number> =>
  isObject(v) && Object.values(v).every((x) => typeof x === 'number');

const READ_ONLY = 'The Free plan is read only. Upgrade to Plus to post, reply and vote.';

interface Draft {
  title: string;
  body: string;
  group: GroupId;
  type: PostType;
  options: [string, string];
}

const EMPTY_DRAFT: Draft = { title: '', body: '', group: 'beginners', type: 'question', options: ['', ''] };

export default function Community() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const plan = usePlan();
  const canWrite = hasPlus(plan);
  const [now] = useState(() => Date.now());

  const [userPosts, setUserPosts] = useStored<Post[]>(KEYS.communityPosts, [], isPosts);
  const [userReplies, setUserReplies] = useStored<Reply[]>(KEYS.communityReplies, [], isReplies);
  const [votes, setVotes] = useStored<Record<string, boolean>>(KEYS.communityVotes, {}, isFlags);
  const [pollVotes, setPollVotes] = useStored<Record<string, number>>(KEYS.pollVotes, {}, isPollVotes);

  const [tab, setTab] = useState<FeedTab>('trending');
  const [group, setGroup] = useState<GroupId | 'all'>('all');
  const [composing, setComposing] = useState(false);
  const [gate, setGate] = useState(false);
  const feedRef = useRef<HTMLElement>(null);

  const posts = [...userPosts, ...SEED_POSTS];
  const replies = [...SEED_REPLIES, ...userReplies];
  const items: FeedItem[] = posts.map((post) => ({
    post,
    upvotes: post.upvotes + (votes[post.id] ? 1 : 0),
    replies: post.extraReplies + replies.filter((r) => r.postId === post.id).length,
  }));
  const groupCount = (id: GroupId) => GROUPS.find((g) => g.id === id)!.count + userPosts.filter((p) => p.group === id).length;
  const allCount = GROUPS.reduce((s, g) => s + groupCount(g.id), 0);
  const feed = buildFeed(items, tab, group, now);

  const requirePlus = () => {
    if (canWrite) return true;
    setGate(true);
    return false;
  };
  const toggleVote = (id: string) => {
    if (!requirePlus()) return;
    setVotes((v) => {
      const next = { ...v };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });
  };
  const votePoll = (id: string, option: number) => {
    if (!requirePlus()) return;
    // One vote per user; picking the other option moves the vote.
    setPollVotes((v) => ({ ...v, [id]: option }));
  };
  const startDiscussion = () => {
    if (postId) navigate('/community');
    if (requirePlus()) setComposing(true);
    requestAnimationFrame(() => feedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const addPost = (draft: Draft) => {
    const post: Post = {
      id: `u-${Date.now()}`,
      type: draft.type,
      group: draft.group,
      title: draft.title.trim(),
      body: draft.body.trim(),
      author: YOU,
      upvotes: 0,
      extraReplies: 0,
      createdAt: Date.now(),
      ...(draft.type === 'poll' ? { poll: draft.options.map((o) => ({ label: o.trim(), votes: 0 })) } : {}),
    };
    setUserPosts((p) => [post, ...p]);
    setComposing(false);
    navigate(`/community/${post.id}`);
  };

  const cardProps = (item: FeedItem) => ({
    item,
    now,
    voted: !!votes[item.post.id],
    onVote: () => toggleVote(item.post.id),
    pollVote: pollVotes[item.post.id],
    onPollVote: (o: number) => votePoll(item.post.id, o),
  });

  const selected = postId ? items.find((i) => i.post.id === postId) : undefined;

  return (
    <PageShell
      hero={
        <div className="container community-hero">
          <div className="title-block">
            <span className="eyebrow">Community</span>
            <h1 className="page-title">Ask cardholders who’ve done it before</h1>
            <p className="hero-lede">
              Redemption wins, devaluation news and "which card should I get" questions, sorted by card and bank.
            </p>
          </div>
          <button type="button" className="btn btn-primary btn-lg community-cta" onClick={startDiscussion}>
            Start a discussion
          </button>
        </div>
      }
    >
      <div className="container community-body">
        <aside className="community-left">
          <nav className="panel side-box" aria-labelledby="groups-h">
            <h2 id="groups-h" className="box-label">
              Card groups
            </h2>
            <div className="group-list">
              <button
                type="button"
                className="group-btn"
                aria-pressed={group === 'all'}
                onClick={() => {
                  setGroup('all');
                  if (postId) navigate('/community');
                }}
              >
                <span>All discussions</span>
                <span className="group-count">{compactCount(allCount)}</span>
              </button>
              {GROUPS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  className="group-btn"
                  aria-pressed={group === g.id}
                  onClick={() => {
                    setGroup(g.id);
                    if (postId) navigate('/community');
                  }}
                >
                  <span>{g.label}</span>
                  <span className="group-count">{compactCount(groupCount(g.id))}</span>
                </button>
              ))}
            </div>
          </nav>
          <div className="panel side-box rules">
            <h2 className="box-label">House rules</h2>
            {HOUSE_RULES.map((r) => (
              <p key={r}>{r}</p>
            ))}
          </div>
        </aside>

        <section className="community-feed" ref={feedRef} aria-label={selected ? 'Discussion' : 'Discussions'}>
          {gate && !canWrite && <UpgradePrompt>{READ_ONLY}</UpgradePrompt>}

          {postId ? (
            selected ? (
              <PostDetail
                card={<PostCard {...cardProps(selected)} full />}
                replies={replies.filter((r) => r.postId === selected.post.id)}
                hidden={selected.post.extraReplies}
                now={now}
                canWrite={canWrite}
                onReply={(body) =>
                  setUserReplies((r) => [
                    ...r,
                    { id: `ur-${Date.now()}`, postId: selected.post.id, author: YOU, body, createdAt: Date.now() },
                  ])
                }
              />
            ) : (
              <div className="panel notice">
                <h2>This discussion isn’t here</h2>
                <p className="muted">
                  It may have been posted on another device. <Link to="/community">Back to all discussions →</Link>
                </p>
              </div>
            )
          ) : (
            <>
              {composing && canWrite && <Composer onCancel={() => setComposing(false)} onSubmit={addPost} />}
              <div className="filter-pills" role="group" aria-label="Sort and filter">
                {FEED_TABS.map((t) => (
                  <Pill key={t.id} pressed={tab === t.id} onClick={() => setTab(t.id)}>
                    {t.label}
                  </Pill>
                ))}
              </div>
              {feed.length === 0 ? (
                <div className="panel notice">
                  <h2>Nothing here yet</h2>
                  <p className="muted">No posts match this group and tab. Try All discussions or Latest.</p>
                </div>
              ) : (
                feed.map((item) => <PostCard key={item.post.id} {...cardProps(item)} />)
              )}
            </>
          )}
        </section>

        <aside className="community-right">
          <div className="panel-dark dark side-box expert-promo">
            <span className="box-label lime">Need a definite answer?</span>
            <b className="promo-title">Talk 1:1 with a verified card expert</b>
            <span className="promo-text">From ₹299 for 15 minutes.</span>
            <Link to="/experts" className="btn btn-primary btn-sm">
              Find an expert
            </Link>
          </div>
          <div className="panel side-box">
            <h2 className="box-label">Top contributors this month</h2>
            {TOP_CONTRIBUTORS.map((c) => (
              <div key={c.name} className="contributor">
                <span className="avatar" style={{ background: c.grad }} aria-hidden="true" />
                <div>
                  <b>{c.name}</b>
                  <div className="contributor-note">{c.note}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="footnote">Sample posts and names for this mockup. Community posts are members’ opinions, not financial advice.</p>
        </aside>
      </div>
    </PageShell>
  );
}

function Composer({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: (d: Draft) => void }) {
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [submitted, setSubmitted] = useState(false);
  const set = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));

  const safety = checkSensitive(draft.title, draft.body, ...(draft.type === 'poll' ? draft.options : []));
  const errors: Partial<Record<'title' | 'body' | 'options', string>> = {};
  if (draft.title.trim().length < 10) errors.title = 'Write a title of at least 10 characters.';
  if (draft.body.trim() === '') errors.body = 'Add some detail so people can help.';
  if (draft.type === 'poll' && draft.options.some((o) => o.trim() === '')) errors.options = 'Fill in both poll options.';
  const valid = safety.ok && Object.keys(errors).length === 0;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (valid) onSubmit(draft);
  };

  const err = (key: keyof typeof errors) =>
    submitted && errors[key] ? (
      <span id={`c-${key}-err`} className="field-error">
        {errors[key]}
      </span>
    ) : null;

  return (
    <form className="panel-dark dark composer" onSubmit={submit} noValidate aria-labelledby="composer-h">
      <h2 id="composer-h">Start a discussion</h2>
      <div className="composer-row">
        <div className="field">
          <label className="label" htmlFor="c-group">
            Card group
          </label>
          <select id="c-group" className="select" value={draft.group} onChange={(e) => set({ group: e.target.value as GroupId })}>
            {GROUPS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <span className="label" id="c-type-label">
            Post type
          </span>
          <div className="type-pills" role="group" aria-labelledby="c-type-label">
            {POST_TYPES.map((t) => (
              <Pill key={t} dark pressed={draft.type === t} onClick={() => set({ type: t })}>
                {TYPE_LABELS[t]}
              </Pill>
            ))}
          </div>
        </div>
      </div>
      <div className="field">
        <label className="label" htmlFor="c-title">
          Title
        </label>
        <input
          id="c-title"
          className="input"
          value={draft.title}
          autoComplete="off"
          onChange={(e) => set({ title: e.target.value })}
          aria-invalid={submitted && !!errors.title}
          aria-describedby={submitted && errors.title ? 'c-title-err' : undefined}
        />
        {err('title')}
      </div>
      <div className="field">
        <label className="label" htmlFor="c-body">
          Details
        </label>
        <textarea
          id="c-body"
          className="input textarea"
          rows={4}
          value={draft.body}
          onChange={(e) => set({ body: e.target.value })}
          aria-invalid={submitted && !!errors.body}
          aria-describedby={submitted && errors.body ? 'c-body-err' : undefined}
        />
        {err('body')}
      </div>
      {draft.type === 'poll' && (
        <div className="composer-row">
          {draft.options.map((o, i) => (
            <div key={i} className="field">
              <label className="label" htmlFor={`c-opt-${i}`}>
                Option {i + 1}
              </label>
              <input
                id={`c-opt-${i}`}
                className="input"
                value={o}
                autoComplete="off"
                onChange={(e) => {
                  const options: [string, string] = [...draft.options];
                  options[i] = e.target.value;
                  set({ options });
                }}
              />
            </div>
          ))}
          {err('options')}
        </div>
      )}
      {!safety.ok && (
        <p className="field-error composer-block" role="alert">
          {safety.error}
        </p>
      )}
      <div className="cta-row">
        <button type="submit" className="btn btn-primary">
          Post
        </button>
        <button type="button" className="text-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
      <span className="field-hint">Posts are public. Never share card numbers, statements or OTPs.</span>
    </form>
  );
}

interface DetailProps {
  card: ReactNode;
  replies: Reply[];
  hidden: number;
  now: number;
  canWrite: boolean;
  onReply: (body: string) => void;
}

function PostDetail({ card, replies, hidden, now, canWrite, onReply }: DetailProps) {
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const safety = checkSensitive(text);
  const empty = text.trim() === '';

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (empty || !safety.ok) return;
    onReply(text.trim());
    setText('');
    setSubmitted(false);
  };

  return (
    <>
      <Link to="/community" className="back-link">
        ← All discussions
      </Link>
      {card}
      <section className="panel replies" aria-labelledby="replies-h">
        <h2 id="replies-h" className="box-label">
          Replies
        </h2>
        {replies.length === 0 && <p className="muted">No replies yet. Be the first to answer.</p>}
        {replies.map((r) => (
          <article key={r.id} className="reply">
            <div className="reply-meta">
              <b>{r.author}</b>
              {r.expert && <span className="chip chip-good">✓ Verified expert</span>}
              <span className="muted">{timeAgo(r.createdAt, now)}</span>
            </div>
            <p>{r.body}</p>
          </article>
        ))}
        {hidden > 0 && <p className="footnote">{hidden} older replies aren’t loaded in this prototype.</p>}

        {canWrite ? (
          <form className="reply-form" onSubmit={submit} noValidate>
            <label className="box-label" htmlFor="reply-text">
              Your reply
            </label>
            <textarea
              id="reply-text"
              className="input input-light textarea"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-invalid={(submitted && empty) || !safety.ok}
              aria-describedby={!safety.ok || (submitted && empty) ? 'reply-err' : undefined}
            />
            {(!safety.ok || (submitted && empty)) && (
              <span id="reply-err" className="field-error on-light" role="alert">
                {!safety.ok ? safety.error : 'Write a reply first.'}
              </span>
            )}
            <button type="submit" className="btn btn-dark btn-sm">
              Post reply
            </button>
          </form>
        ) : (
          <UpgradePrompt>{READ_ONLY}</UpgradePrompt>
        )}
      </section>
    </>
  );
}
