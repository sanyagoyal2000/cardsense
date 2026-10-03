import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import CardChip from '../components/CardChip';
import { cards, EXAMPLE_WALLET } from '../data/cards';
import { walletSummary } from '../lib/calc';
import { approx, inr, num } from '../lib/format';
import { validatePoints } from '../lib/validate';
import { useWallet } from '../lib/wallet';
import PageShell from './PageShell';

const STACK_HEIGHTS = [160, 130, 100, 70];

export default function Wallet() {
  const [wallet, setWallet] = useWallet();
  const summary = walletSummary(wallet, cards);
  const changes = summary.rows.reduce((n, r) => n + r.card.alerts.filter((a) => a.kind === 'change').length, 0);
  const stack = summary.rows.slice(0, 4);

  const firstMissing = cards.find((c) => !wallet.some((w) => w.cardId === c.id)) ?? cards[0];
  const [cardId, setCardId] = useState(firstMissing.id);
  const [points, setPoints] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState('');
  const check = validatePoints(points);
  const showError = submitted && !check.ok;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!check.ok) return;
    const card = cards.find((c) => c.id === cardId)!;
    const exists = wallet.some((w) => w.cardId === cardId);
    setWallet((w) =>
      exists ? w.map((x) => (x.cardId === cardId ? { ...x, points: check.value } : x)) : [...w, { cardId, points: check.value }],
    );
    setStatus(exists ? `Updated ${card.shortName} to ${num(check.value)} ${card.unit}.` : `Added ${card.shortName}.`);
    setPoints('');
    setSubmitted(false);
  };

  const removeCard = (id: string) => {
    const card = cards.find((c) => c.id === id)!;
    setWallet((w) => w.filter((x) => x.cardId !== id));
    setStatus(`Removed ${card.shortName}.`);
  };

  return (
    <PageShell
      hero={
        <div className="container wallet-hero">
          <div className="wallet-total">
            <h1 className="sr-only">My wallet</h1>
            <span className="eyebrow">Your points are worth up to</span>
            <div className="big-total">{inr(summary.totalBest)}</div>
            <p className="wallet-sub">
              {summary.rows.length === 0 ? (
                'Add a card to see what your points are worth.'
              ) : (
                <>
                  Across {summary.rows.length} {summary.rows.length === 1 ? 'card' : 'cards'} using the best route on each.
                  Cashing out would give <b>{inr(summary.totalCash)}</b>.
                </>
              )}
            </p>
            <div className="cta-row">
              <Link to="/redeem" className="btn btn-primary">
                Plan a redemption
              </Link>
              {changes > 0 && (
                <Link to="/benefits" className="link-arrow">
                  {changes} {changes === 1 ? 'change' : 'changes'} to review →
                </Link>
              )}
            </div>
          </div>
          {stack.length > 0 && (
            <div className="wallet-stack" aria-hidden="true">
              {stack.map((r, i) => (
                <CardChip key={r.card.id} card={r.card} style={{ height: STACK_HEIGHTS[i] }}>
                  <span className="mono">{r.best ? `${approx(r.best.route.estimate)}${inr(r.best.rupeeValue)}` : '—'}</span>
                </CardChip>
              ))}
            </div>
          )}
        </div>
      }
    >
      <div className="container wallet-body">
        <div className="panel wallet-table-panel">
          {summary.rows.length === 0 ? (
            <div className="empty">
              <h2>Your wallet is empty</h2>
              <p className="muted">Add a card on the right, or start from the example wallet.</p>
              <button type="button" className="btn btn-dark" onClick={() => setWallet(EXAMPLE_WALLET)}>
                Load example wallet
              </button>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table wallet-table">
                <caption className="sr-only">Cards in your wallet with their best route and cash value</caption>
                <thead>
                  <tr>
                    <th scope="col">Card</th>
                    <th scope="col">Balance</th>
                    <th scope="col">Best route</th>
                    <th scope="col">Worth</th>
                    <th scope="col">As cash</th>
                    <th scope="col">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {summary.rows.map((r) => (
                    <tr key={r.card.id}>
                      <th scope="row">{r.card.shortName}</th>
                      <td>
                        {num(r.points)} {r.card.unit}
                      </td>
                      <td>{r.best ? r.best.route.name : <span className="muted">Earn-rate only</span>}</td>
                      <td className="worth">{r.best ? `${approx(r.best.route.estimate)}${inr(r.best.rupeeValue)}` : '—'}</td>
                      <td className={r.cash && r.best && r.cash.rupeeValue < r.best.rupeeValue ? 'cash-loss' : 'muted'}>
                        {r.cash ? inr(r.cash.rupeeValue) : 'No cash route'}
                      </td>
                      <td className="row-actions">
                        <Link to={`/redeem?card=${r.card.id}`} className="pill">
                          Compare
                        </Link>
                        <button
                          type="button"
                          className="pill"
                          onClick={() => removeCard(r.card.id)}
                          aria-label={`Remove ${r.card.shortName}`}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <form className="panel-dark dark add-card" onSubmit={onSubmit} noValidate>
          <h2>Add a card</h2>
          <div className="field">
            <label className="label" htmlFor="w-card">
              Card
            </label>
            <select id="w-card" className="select" value={cardId} onChange={(e) => setCardId(e.target.value)}>
              {cards.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.bankShort} {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="label" htmlFor="w-pts">
              Points balance
            </label>
            <input
              id="w-pts"
              className="input"
              inputMode="numeric"
              autoComplete="off"
              placeholder="For example 25,000"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              aria-invalid={showError}
              aria-describedby={showError ? 'w-pts-err' : undefined}
            />
            {showError && !check.ok && (
              <span id="w-pts-err" className="field-error">
                {check.error}
              </span>
            )}
          </div>
          <button type="submit" className="btn btn-primary">
            {wallet.some((w) => w.cardId === cardId) ? 'Update balance' : 'Add to wallet'}
          </button>
          <p className="sr-only" role="status">
            {status}
          </p>
          {status && <span className="field-hint" aria-hidden="true">{status}</span>}
          <span className="field-hint">We never ask for card numbers, OTPs or logins.</span>
        </form>
      </div>
    </PageShell>
  );
}
