import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getCard } from '../data/cards';
import { COMPARE_ROWS, FAQS, getPlan, PLANS, type Billing, type Plan } from '../data/plans';
import { inr, num } from '../lib/format';
import { setPlan, usePlan } from '../lib/plan';
import PageShell from './PageShell';

// Hero example: 85,000 Infinia points, SmartBuy travel vs statement credit.
const EXAMPLE_POINTS = 85000;
const infinia = getCard('hdfc-infinia')!;
const rate = (id: string) => infinia.routes.find((r) => r.id === id)!.valuePerPoint;
const EXAMPLE_GAIN = EXAMPLE_POINTS * (rate('smartbuy-travel') - rate('statement-credit'));

const YEARLY_SAVING = Math.round(
  Math.max(...PLANS.filter((p) => p.monthly > 0).map((p) => (1 - p.yearly / (p.monthly * 12)) * 100)),
);

function Price({ plan, billing }: { plan: Plan; billing: Billing }) {
  if (plan.monthly === 0) {
    return (
      <div className="tier-price is-inline">
        <span className="tier-amount">₹0</span>
        <span className="tier-per"> forever</span>
      </div>
    );
  }
  const saving = Math.round((1 - plan.yearly / (plan.monthly * 12)) * 100);
  return (
    <div className="tier-price">
      <div>
        <span className="tier-amount">{inr(billing === 'yearly' ? plan.yearly : plan.monthly)}</span>
        <span className="tier-per"> / {billing === 'yearly' ? 'year' : 'month'}</span>
      </div>
      <span className="tier-sub">
        {billing === 'yearly'
          ? `≈ ${inr(plan.yearly / 12)} a month · or ${inr(plan.monthly)} billed monthly`
          : `or ${inr(plan.yearly)} billed yearly, save ${saving}%`}
      </span>
    </div>
  );
}

const MUTED = ['Read only', 'Pay per call'];

function Mark({ value }: { value: string }) {
  if (value === '✓') return <span aria-label="Included">✓</span>;
  if (value === '—') return <span className="cmp-none" aria-label="Not included">—</span>;
  if (MUTED.includes(value)) return <span className="muted">{value}</span>;
  return <>{value}</>;
}

export default function Plans() {
  const current = usePlan();
  const [billing, setBilling] = useState<Billing>('yearly');
  const [status, setStatus] = useState('');

  const choose = (plan: Plan) => {
    setPlan(plan.id);
    setStatus(
      plan.id === 'free'
        ? 'You’re on the Free plan.'
        : `You’re on ${plan.name} (${billing}). This is a prototype, so no payment was taken.`,
    );
  };

  return (
    <PageShell
      hero={
        <div className="container plans-hero">
          <span className="eyebrow">Plans</span>
          <h1 className="plans-title">One good redemption pays for a year</h1>
          <p className="hero-lede">
            Moving {num(EXAMPLE_POINTS)} Infinia points from statement credit to SmartBuy travel is worth {inr(EXAMPLE_GAIN)}{' '}
            more. Plus costs {inr(getPlan('plus').yearly)} a year.
          </p>
          <div className="billing-toggle" role="group" aria-label="Billing period">
            <button type="button" aria-pressed={billing === 'monthly'} onClick={() => setBilling('monthly')}>
              Monthly
            </button>
            <button type="button" aria-pressed={billing === 'yearly'} onClick={() => setBilling('yearly')}>
              Yearly · save up to {YEARLY_SAVING}%
            </button>
          </div>
        </div>
      }
    >
      <div className="container plans-body">
        <div className="tier-grid">
          {PLANS.map((p) => {
            const popular = p.id === 'plus';
            const isCurrent = p.id === current;
            return (
              <article
                key={p.id}
                className={`tier ${popular ? 'panel-dark dark is-popular' : 'panel'}`}
                aria-labelledby={`tier-${p.id}`}
              >
                {popular && <span className="tier-badge">Most popular</span>}
                <div className="tier-head">
                  <span className="tier-eyebrow">{p.eyebrow}</span>
                  <h2 id={`tier-${p.id}`}>{p.name}</h2>
                  <span className="tier-tagline">{p.tagline}</span>
                </div>
                <Price plan={p} billing={billing} />
                <button
                  type="button"
                  className={`btn tier-cta ${p.id === 'free' ? 'btn-outline' : popular ? 'btn-primary' : 'btn-dark'}`}
                  disabled={isCurrent}
                  onClick={() => choose(p)}
                >
                  {isCurrent ? 'Your current plan' : p.cta}
                </button>
                <ul className="tier-features">
                  {p.features.map((f, i) => (
                    <li key={f} className={p.leadFeature && i === 0 ? 'lead' : undefined}>
                      <span className="tick" aria-hidden="true">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                {p.fence && <p className="tier-fence">{p.fence}</p>}
              </article>
            );
          })}
        </div>
        <p className="plans-status" role="status">
          {status && (
            <>
              {status} <Link to="/wallet">Go to my wallet →</Link>
            </>
          )}
        </p>

        <section className="compare" aria-labelledby="compare-h">
          <h2 id="compare-h" className="compare-title">
            Compare plans
          </h2>
          <div className="panel table-wrap" tabIndex={0} aria-labelledby="compare-h">
            <table className="table compare-table">
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  {PLANS.map((p) => (
                    <th key={p.id} scope="col" className={p.id === 'plus' ? 'col-plus' : undefined}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.feature} className={row.bold ? 'is-bold' : undefined}>
                    <th scope="row">{row.feature}</th>
                    {row.values.map((v, i) => (
                      <td key={i} className={i === 1 ? 'col-plus' : undefined}>
                        <Mark value={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="faqs" aria-label="Questions">
          {FAQS.map((f) => (
            <div key={f.q} className="faq">
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </section>
      </div>
    </PageShell>
  );
}
