import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Pill from '../components/Pill';
import RouteCard from '../components/RouteCard';
import { cards, getCard, GOAL_LABELS, LAST_CHECKED, type Goal } from '../data/cards';
import { rankRoutes, recommend } from '../lib/calc';
import { approx, inr, num } from '../lib/format';
import { isObject, KEYS, useStored } from '../lib/storage';
import { validatePoints } from '../lib/validate';
import { useWallet } from '../lib/wallet';
import PageShell from './PageShell';

interface RedeemState {
  cardId: string;
  points: string;
  goal: Goal;
}

const GOALS: Goal[] = ['cash', 'shopping', 'travel'];

const isRedeemState = (v: unknown): v is RedeemState =>
  isObject(v) &&
  typeof v.cardId === 'string' &&
  getCard(v.cardId) !== undefined &&
  typeof v.points === 'string' &&
  GOALS.includes(v.goal as Goal);

const isChoices = (v: unknown): v is Record<string, string> =>
  isObject(v) && Object.values(v).every((x) => typeof x === 'string');

export default function Redeem() {
  const [params, setParams] = useSearchParams();
  const [wallet, setWallet] = useWallet();
  const walletPoints = (id: string) => wallet.find((w) => w.cardId === id)?.points;

  const [state, setState] = useStored<RedeemState>(
    KEYS.redeem,
    () => {
      const first = wallet[0] ?? { cardId: cards[0].id, points: 85000 };
      return { cardId: first.cardId, points: num(first.points), goal: 'travel' };
    },
    isRedeemState,
  );
  const [choices, setChoices] = useStored<Record<string, string>>(KEYS.routeChoices, {}, isChoices);
  const [touched, setTouched] = useState(false);

  // ?card=<id> from the wallet "Compare" button
  const paramCard = params.get('card');
  useEffect(() => {
    if (paramCard && getCard(paramCard)) {
      const p = walletPoints(paramCard);
      setState((s) => ({ ...s, cardId: paramCard, points: p !== undefined ? num(p) : s.points }));
      setParams({}, { replace: true });
    }
  }, [paramCard]);

  const card = getCard(state.cardId) ?? cards[0];
  const check = validatePoints(state.points);
  const balance = check.ok ? check.value : 0;
  const showError = (touched || state.points !== '') && !check.ok;

  const ranked = useMemo(() => rankRoutes(card.routes, balance), [card, balance]);
  const rec = check.ok ? recommend(card.routes, balance, state.goal) : null;
  const ordered = rec ? [rec.pick, ...ranked.filter((r) => r.route.id !== rec.pick.route.id)] : ranked;
  const maxPerPoint = Math.max(0, ...ranked.map((r) => r.perPoint));
  const chosenId = choices[card.id];
  const chosen = ranked.find((r) => r.route.id === chosenId);
  const savedBalance = walletPoints(card.id);

  const changeCard = (id: string) => {
    const p = walletPoints(id);
    setState((s) => ({ ...s, cardId: id, points: p !== undefined ? num(p) : s.points }));
  };

  const saveToWallet = () => {
    if (!check.ok) return;
    setWallet((w) =>
      w.some((x) => x.cardId === card.id)
        ? w.map((x) => (x.cardId === card.id ? { ...x, points: check.value } : x))
        : [...w, { cardId: card.id, points: check.value }],
    );
  };

  return (
    <PageShell
      hero={
        <div className="container redeem-hero">
          <h1 className="page-title">What are my points worth?</h1>
          <div className="redeem-inputs">
            <div className="field f-card">
              <label className="label" htmlFor="r-card">
                Card
              </label>
              <select id="r-card" className="select" value={card.id} onChange={(e) => changeCard(e.target.value)}>
                {cards.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.bankShort} {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field f-points">
              <label className="label" htmlFor="r-points">
                Points balance
              </label>
              <input
                id="r-points"
                className="input"
                inputMode="numeric"
                autoComplete="off"
                value={state.points}
                onChange={(e) => setState((s) => ({ ...s, points: e.target.value }))}
                onBlur={() => setTouched(true)}
                aria-invalid={showError}
                aria-describedby={showError ? 'r-points-err' : undefined}
              />
            </div>
            <div className="field f-goal">
              <span className="label" id="r-goal-label">
                I want
              </span>
              <div className="goal-pills" role="group" aria-labelledby="r-goal-label">
                {GOALS.map((g) => (
                  <Pill key={g} dark pressed={state.goal === g} onClick={() => setState((s) => ({ ...s, goal: g }))}>
                    {GOAL_LABELS[g]}
                  </Pill>
                ))}
              </div>
            </div>
          </div>
          {showError && !check.ok && (
            <span id="r-points-err" className="field-error redeem-error">
              {check.error}
            </span>
          )}
          {check.ok && savedBalance !== check.value && card.routes.length > 0 && (
            <button type="button" className="text-btn" onClick={saveToWallet}>
              {savedBalance === undefined ? 'Add this card to my wallet' : 'Save this balance to my wallet'}
            </button>
          )}
        </div>
      }
    >
      <div className="container redeem-body">
        {card.routes.length === 0 ? (
          <div className="panel notice">
            <h2>{card.shortName} has no points to redeem</h2>
            <p>{card.earnOnlyNote}</p>
            <p className="muted">
              Earn rate: {card.earn}. Checked {LAST_CHECKED}.{' '}
              <Link to="/cards">Compare all cards →</Link>
            </p>
          </div>
        ) : !check.ok ? (
          <div className="panel notice">
            <h2>Enter your points balance</h2>
            <p className="muted">Type the balance shown on your statement, for example 25,000. We’ll rank every route in ₹.</p>
          </div>
        ) : (
          <>
            <div className="rec-bar" role="status">
              <span className="rec-label">Recommended</span>
              {rec ? (
                <span>
                  <b>{rec.pick.route.name}</b>: {rec.reason}
                </span>
              ) : (
                <span>
                  No route is open for {num(balance)} points yet. The smallest minimum on this card is{' '}
                  {num(Math.min(...card.routes.map((r) => r.minPoints)))} points.
                </span>
              )}
            </div>

            <div className="route-grid">
              {ordered.map((r) => (
                <RouteCard
                  key={r.route.id}
                  result={r}
                  featured={rec?.pick.route.id === r.route.id}
                  badge={
                    rec?.pick.route.id === r.route.id
                      ? rec.fallback
                        ? 'Best overall'
                        : `Best for ${GOAL_LABELS[state.goal].toLowerCase()}`
                      : undefined
                  }
                  maxPerPoint={maxPerPoint}
                  cashLoss={r.route.goal === 'cash' && r.eligible && r.perPoint < maxPerPoint}
                />
              ))}
            </div>

            <div className="panel choose-route">
              <b id="choose-label">Which route will you use?</b>
              <div className="choose-pills" role="group" aria-labelledby="choose-label">
                {ranked.map((r) => (
                  <Pill
                    key={r.route.id}
                    pressed={chosenId === r.route.id}
                    onClick={() =>
                      setChoices((c) => {
                        const next = { ...c };
                        if (next[card.id] === r.route.id) delete next[card.id];
                        else next[card.id] = r.route.id;
                        return next;
                      })
                    }
                  >
                    {r.route.shortName}
                  </Pill>
                ))}
              </div>
              <span className="choose-status muted" role="status">
                {chosen
                  ? `Saved: ${chosen.route.shortName}, ${chosen.eligible ? `${approx(chosen.route.estimate)}${inr(chosen.rupeeValue)}` : 'not eligible yet'}.`
                  : ''}
              </span>
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}
