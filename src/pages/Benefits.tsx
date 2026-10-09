import { Link } from 'react-router-dom';
import AlertCard from '../components/AlertCard';
import MilestoneCard, { type MilestoneState } from '../components/MilestoneCard';
import UpgradePrompt from '../components/UpgradePrompt';
import { cards, type AlertCategory, type Card } from '../data/cards';
import { milestoneProgress } from '../lib/calc';
import { inr, num } from '../lib/format';
import { isObject, KEYS, useStored } from '../lib/storage';
import { hasPlus, usePlan } from '../lib/plan';
import { validateRupees } from '../lib/validate';
import { useWallet } from '../lib/wallet';
import PageShell from './PageShell';

type Prefs = Record<AlertCategory, boolean>;

const PREF_LABELS: { key: AlertCategory; label: string }[] = [
  { key: 'devaluations', label: 'Devaluations' },
  { key: 'milestones', label: 'Milestones' },
  { key: 'lounge', label: 'Lounge rules' },
  { key: 'fees', label: 'Fee waivers' },
];

const DEFAULT_PREFS: Prefs = { devaluations: true, milestones: true, lounge: false, fees: false };

const isPrefs = (v: unknown): v is Prefs =>
  isObject(v) && PREF_LABELS.every((p) => typeof v[p.key] === 'boolean');

const isMilestoneMap = (v: unknown): v is Record<string, MilestoneState> =>
  isObject(v) &&
  Object.values(v).every(
    (m) => isObject(m) && typeof m.spend === 'string' && typeof m.periodEnd === 'string' && (m.action === null || typeof m.action === 'string'),
  );

function defaultState(card: Card): MilestoneState {
  return { spend: num(card.milestone!.exampleSpend), periodEnd: card.milestone!.examplePeriodEnd, action: null };
}

const ORDER = { remind: 0, act: 1, null: 2, dismissed: 3 } as const;

export default function Benefits() {
  const [wallet] = useWallet();
  const [milestones, setMilestones] = useStored<Record<string, MilestoneState>>(KEYS.milestones, {}, isMilestoneMap);
  const [prefs, setPrefs] = useStored<Prefs>(KEYS.alertPrefs, DEFAULT_PREFS, isPrefs);
  const today = new Date();
  const plus = hasPlus(usePlan());

  const mine = cards.filter((c) => wallet.some((w) => w.cardId === c.id));
  const others = cards.filter((c) => !mine.includes(c));

  const tracked = mine
    .filter((c) => c.milestone)
    .map((c) => ({ card: c, state: milestones[c.id] ?? defaultState(c) }))
    .sort((a, b) => ORDER[String(a.state.action) as keyof typeof ORDER] - ORDER[String(b.state.action) as keyof typeof ORDER]);

  const atRisk = tracked.reduce((sum, { card, state }) => {
    if (state.action === 'dismissed') return sum;
    const spend = validateRupees(state.spend);
    const p = milestoneProgress(card.milestone!.threshold, spend.ok ? spend.value : 0, state.periodEnd, today);
    return p.reached ? sum : sum + card.milestone!.benefitValue;
  }, 0);

  const myAlerts = mine.flatMap((c) => c.alerts);
  const otherAlerts = others.flatMap((c) => c.alerts);
  const changeCount = myAlerts.filter((a) => a.kind === 'change').length;

  return (
    <PageShell
      hero={
        <div className="container benefits-hero">
          <div className="title-block">
            <span className="eyebrow">Watchlist</span>
            <h1 className="page-title">Benefits &amp; changes</h1>
          </div>
          <div className="hero-stats">
            <div>
              <div className="stat-big">{plus ? inr(atRisk) : '—'}</div>
              <div className="stat-small">milestone value at risk</div>
            </div>
            <div>
              <div className="stat-big danger">{changeCount}</div>
              <div className="stat-small">rule {changeCount === 1 ? 'change' : 'changes'} on your cards</div>
            </div>
          </div>
        </div>
      }
    >
      <div className="container benefits-body">
        {!plus ? (
          <UpgradePrompt>
            Milestone tracking and expiry alerts are part of Plus. On Free you still see rule changes on your cards below.
          </UpgradePrompt>
        ) : tracked.length === 0 ? (
          <div className="panel notice">
            <h2>No milestones to track</h2>
            <p className="muted">
              None of the cards in your wallet has a spend milestone. <Link to="/wallet">Add a card →</Link>
            </p>
          </div>
        ) : (
          tracked.map(({ card, state }) => (
            <MilestoneCard
              key={card.id}
              card={card}
              state={state}
              today={today}
              onChange={(next) => setMilestones((m) => ({ ...m, [card.id]: next }))}
            />
          ))
        )}

        <section aria-labelledby="mine-h" className="alert-section">
          <h2 id="mine-h" className="section-title">
            On your cards
          </h2>
          {myAlerts.length === 0 ? (
            <p className="muted">No recent rule changes on the cards in your wallet.</p>
          ) : (
            <div className="alert-grid">
              {myAlerts.map((a) => (
                <AlertCard key={a.id} alert={a} />
              ))}
            </div>
          )}
        </section>

        {otherAlerts.length > 0 && (
          <details className="alert-section other-alerts">
            <summary className="section-title">Other cards we track ({otherAlerts.length})</summary>
            <div className="alert-grid">
              {otherAlerts.map((a) => (
                <AlertCard key={a.id} alert={a} />
              ))}
            </div>
          </details>
        )}

        {plus && (
        <fieldset className="panel prefs">
          <legend className="sr-only">Alert preferences</legend>
          <b aria-hidden="true">Alert me about</b>
          {PREF_LABELS.map((p) => (
            <label key={p.key} className={`pref${prefs[p.key] ? ' on' : ''}`}>
              <input
                type="checkbox"
                checked={prefs[p.key]}
                onChange={(e) => setPrefs((s) => ({ ...s, [p.key]: e.target.checked }))}
              />
              {p.label}
            </label>
          ))}
          <span className="field-hint prefs-note">Saved on this device. CardSense doesn’t send notifications yet.</span>
        </fieldset>
        )}
      </div>
    </PageShell>
  );
}
