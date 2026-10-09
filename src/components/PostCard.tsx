import { Link } from 'react-router-dom';
import { GROUPS, TYPE_LABELS, type PostType } from '../data/community';
import { pollResults, timeAgo, type FeedItem } from '../lib/community';
import { num } from '../lib/format';
import ProgressBar from './ProgressBar';

interface Props {
  item: FeedItem;
  now: number;
  voted: boolean;
  onVote: () => void;
  pollVote?: number;
  onPollVote: (option: number) => void;
  /** Detail view: full body, title not a link. */
  full?: boolean;
}

const CHIP: Record<PostType, string> = {
  question: 'chip-neutral',
  win: 'chip-good',
  devaluation: 'chip-bad',
  poll: 'chip-neutral',
};

export default function PostCard({ item, now, voted, onVote, pollVote, onPollVote, full = false }: Props) {
  const { post, upvotes, replies } = item;
  const group = GROUPS.find((g) => g.id === post.group)?.label;
  const paragraphs = post.body.split(/\n+/).filter(Boolean);
  const body = full ? paragraphs : paragraphs.slice(0, 1);
  const poll = post.poll ? pollResults(post.poll, pollVote) : null;
  const pinned = !!post.pinned;
  const href = `/community/${post.id}`;

  const voteBtn = (
    <button
      type="button"
      className={pinned ? 'vote-inline' : 'vote-btn'}
      aria-pressed={voted}
      aria-label={`${voted ? 'Remove upvote' : 'Upvote'}: ${num(upvotes)} upvotes`}
      onClick={onVote}
    >
      ▲{pinned && ` ${num(upvotes)}`}
    </button>
  );

  return (
    <article className={`post ${pinned ? 'panel-dark dark is-pinned' : 'panel'}`}>
      {!pinned && (
        <div className="post-votes">
          {voteBtn}
          <span aria-hidden="true">{num(upvotes)}</span>
        </div>
      )}
      <div className="post-main">
        <div className="post-tags">
          <span className={`chip ${pinned ? 'chip-lime' : CHIP[post.type]}`}>
            {pinned ? `Pinned · ${TYPE_LABELS[post.type]}` : TYPE_LABELS[post.type]}
          </span>
          <span className="post-group">{group}</span>
        </div>
        {full ? (
          <h1 className="post-title">{post.title}</h1>
        ) : (
          <h2 className="post-title">
            <Link to={href}>{post.title}</Link>
          </h2>
        )}
        {body.map((p, i) => (
          <p key={i} className="post-body">
            {p}
          </p>
        ))}
        {poll && (
          <div className="poll" role="group" aria-label="Poll">
            {poll.options.map((o, i) => (
              <button
                key={o.label}
                type="button"
                className="poll-option"
                aria-pressed={pollVote === i}
                onClick={() => onPollVote(i)}
              >
                <span className="poll-row">
                  <span>
                    {o.label}
                    {pollVote === i && <span className="poll-mine"> · your vote</span>}
                  </span>
                  <b>{o.percent}%</b>
                </span>
                <ProgressBar percent={o.percent} tone={i === 0 ? 'ink' : 'lime'} label={`${o.label}: ${o.percent}%`} />
              </button>
            ))}
          </div>
        )}
        <div className="post-meta">
          {pinned && <span className="avatar sm" style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }} aria-hidden="true" />}
          <span>
            {post.author}
            {post.authorNote && ` · ${post.authorNote}`}
          </span>
          {pinned && voteBtn}
          {poll ? (
            <span>{num(poll.total)} votes</span>
          ) : (
            <span>
              {num(replies)} {replies === 1 ? 'reply' : 'replies'}
            </span>
          )}
          <span>{timeAgo(post.createdAt, now)}</span>
          {post.expertAnswer && <span className="expert-mark">✓ Answer by verified expert</span>}
          {!full && !pinned && post.body.includes('\n') && (
            <Link to={href} className="post-more">
              Read more<span className="sr-only">: {post.title}</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
