import type { RouteResult } from '../lib/calc';
import { approx, inr, num, perPoint } from '../lib/format';
import ProgressBar from './ProgressBar';
import SourceLine from './SourceLine';

interface Props {
  result: RouteResult;
  /** e.g. "Best for travel". Featured cards are drawn dark. */
  badge?: string;
  featured?: boolean;
  /** Highest ₹/point on this card, used to scale the bar. */
  maxPerPoint: number;
  /** Cash route that loses value against the best route. */
  cashLoss?: boolean;
}

/** Rate as shown in formulas: 2 to 3 decimals so 14,000/24,000 reads ₹0.583. */
function rate(v: number): string {
  return '₹' + v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 3 });
}

export function formulaLines(r: RouteResult): string[] {
  const { route, balance, pointsUsed } = r;
  const lines: string[] = [];
  const afterBlock = route.fixedBlock ? Math.floor(balance / route.fixedBlock) * route.fixedBlock : balance;
  if (route.fixedBlock) {
    lines.push(`floor(${num(balance)} ÷ ${num(route.fixedBlock)}) × ${num(route.fixedBlock)} = ${num(afterBlock)} pts`);
  }
  if (route.cap !== undefined && afterBlock > route.cap) {
    lines.push(`min(${num(afterBlock)}, cap ${num(route.cap)}) = ${num(pointsUsed)} pts`);
  }
  const fee = route.fee ? ` − ${inr(route.fee)} fee` : '';
  lines.push(`${num(pointsUsed)} × ${approx(route.estimate)}${rate(route.valuePerPoint)}${fee} = ${approx(route.estimate)}${inr(r.rupeeValue)}`);
  return lines;
}

export default function RouteCard({ result, badge, featured = false, maxPerPoint, cashLoss = false }: Props) {
  const { route, eligible } = result;
  const est = approx(route.estimate);
  const barPct = maxPerPoint > 0 ? (result.perPoint / maxPerPoint) * 100 : 0;
  const tone = featured ? 'lime' : cashLoss ? 'danger' : 'ink';
  const valueClass = !eligible ? 'route-value is-muted' : cashLoss ? 'route-value is-danger' : 'route-value';

  return (
    <article className={`route-card ${featured ? 'panel-dark dark featured' : 'panel'}`}>
      <div className="chips">
        {badge && <span className="chip chip-lime">{badge}</span>}
        {eligible ? (
          <span className="chip chip-outline">Eligible</span>
        ) : (
          <span className="chip chip-bad">Not eligible</span>
        )}
        {route.estimate && <span className="chip chip-outline">Estimate</span>}
      </div>
      <h3>{route.name}</h3>
      <div className={valueClass}>
        {eligible ? `${est}${inr(result.rupeeValue)}` : '₹0'}
      </div>
      <dl className="route-stats">
        <dt>Points used</dt>
        <dd>{num(result.pointsUsed)}</dd>
        <dt>Per point</dt>
        <dd>{eligible ? `${est}${perPoint(result.perPoint)}` : '—'}</dd>
      </dl>
      <ProgressBar percent={eligible ? barPct : 0} tone={tone} label={`${route.name} value compared with the best route`} />
      <p className="route-conditions">
        {!eligible && result.ineligibleReason ? <b>{result.ineligibleReason} </b> : null}
        {route.conditions}
      </p>
      <details className="route-calc" open={featured}>
        <summary>How this is calculated</summary>
        <div className="calc-body">
          {formulaLines(result).map((l) => (
            <div key={l} className="mono formula">
              {l}
            </div>
          ))}
          <p className="calc-assume">{route.assumptions}</p>
          {route.minPoints > 1 && <p className="calc-assume">Minimum {num(route.minPoints)} points.</p>}
          <SourceLine source={route.source} className="calc-source" />
        </div>
      </details>
    </article>
  );
}
