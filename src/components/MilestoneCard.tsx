import { useId, useState } from 'react';
import type { Card } from '../data/cards';
import { milestoneProgress } from '../lib/calc';
import { inr, num } from '../lib/format';
import { validateRupees } from '../lib/validate';
import ProgressBar from './ProgressBar';
import SourceLine from './SourceLine';

export type MilestoneAction = 'act' | 'remind' | 'dismissed' | null;

export interface MilestoneState {
  spend: string;
  periodEnd: string;
  action: MilestoneAction;
}

interface Props {
  card: Card;
  state: MilestoneState;
  today: Date;
  onChange: (next: MilestoneState) => void;
}

const ACTION_TEXT: Record<Exclude<MilestoneAction, null>, string> = {
  act: 'Marked: you’ll act on this.',
  remind: 'We’ll keep this at the top when you come back.',
  dismissed: 'Marked not relevant. It no longer counts towards value at risk.',
};

export default function MilestoneCard({ card, state, today, onChange }: Props) {
  const m = card.milestone!;
  const id = useId();
  const [touched, setTouched] = useState(false);
  const check = validateRupees(state.spend);
  const spend = check.ok ? check.value : 0;
  const p = milestoneProgress(m.threshold, spend, state.periodEnd, today);
  const reward = m.benefitPoints ?? `${inr(m.benefitValue)} benefit`;

  const headline = p.reached
    ? `Unlocked: ${reward}`
    : `${inr(p.shortfall)} more to unlock ${m.benefitPoints ?? 'the ' + m.label.toLowerCase()}`;

  const setAction = (a: MilestoneAction) => onChange({ ...state, action: state.action === a ? null : a });

  return (
    <section className={`panel-dark dark milestone${state.action === 'dismissed' ? ' is-dismissed' : ''}`} aria-labelledby={`${id}-h`}>
      <div className="milestone-main">
        <div className="milestone-meta">
          <span className="chip chip-lime">Milestone</span>
          <span className="muted">{card.shortName}</span>
        </div>
        <h2 id={`${id}-h`}>{headline}</h2>
        <p className="milestone-text">
          {m.benefitText} {m.next}
        </p>
        <div className="milestone-actions" role="group" aria-label="What will you do?">
          <button type="button" className="btn btn-primary btn-sm" aria-pressed={state.action === 'act'} onClick={() => setAction('act')}>
            I’ll act
          </button>
          <button type="button" className="btn btn-ghost btn-sm" aria-pressed={state.action === 'remind'} onClick={() => setAction('remind')}>
            Remind me
          </button>
          <button type="button" className="btn btn-ghost btn-sm muted-text" aria-pressed={state.action === 'dismissed'} onClick={() => setAction('dismissed')}>
            Not relevant
          </button>
        </div>
        {state.action && (
          <p className="milestone-status" role="status">
            {ACTION_TEXT[state.action]}
          </p>
        )}
        <SourceLine source={m.source} className="muted milestone-source" />
      </div>

      <div className="milestone-side">
        <div className="milestone-fields">
          <div className="field">
            <label className="label" htmlFor={`${id}-spend`}>
              Spend so far
            </label>
            <input
              id={`${id}-spend`}
              className="input"
              inputMode="numeric"
              value={state.spend}
              aria-invalid={touched && !check.ok}
              aria-describedby={touched && !check.ok ? `${id}-err` : undefined}
              onChange={(e) => onChange({ ...state, spend: e.target.value })}
              onBlur={() => setTouched(true)}
            />
            {touched && !check.ok && (
              <span id={`${id}-err`} className="field-error">
                {check.error}
              </span>
            )}
          </div>
          <div className="field">
            <label className="label" htmlFor={`${id}-end`}>
              {m.periodLabel}
            </label>
            <input
              id={`${id}-end`}
              className="input"
              type="date"
              value={state.periodEnd}
              onChange={(e) => onChange({ ...state, periodEnd: e.target.value })}
            />
          </div>
        </div>
        <div className="milestone-scale">
          <span>₹0</span>
          <span className="pct">{p.percent}%</span>
          <span>{inr(m.threshold)}</span>
        </div>
        <ProgressBar percent={p.percent} tone="lime" thick label={`${card.shortName} milestone progress`} />
        <div className="milestone-stats">
          <div>
            <div className="stat-label">Remaining</div>
            <div className="stat-value">{inr(p.shortfall)}</div>
          </div>
          <div>
            <div className="stat-label">Days left</div>
            <div className="stat-value">{num(p.daysLeft)}</div>
          </div>
          <div>
            <div className="stat-label">Per day</div>
            <div className="stat-value">{p.perDay === null ? '—' : inr(Math.ceil(p.perDay))}</div>
          </div>
        </div>
        {p.perDay === null && !p.reached && <p className="field-hint">This period has ended. Update the end date.</p>}
        <p className="field-hint">
          Formula: {inr(m.threshold)} − {inr(spend)} = {inr(p.shortfall)}; ÷ {num(p.daysLeft)} days.
        </p>
      </div>
    </section>
  );
}
