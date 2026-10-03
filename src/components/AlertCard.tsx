import type { Alert } from '../data/cards';
import SourceLine from './SourceLine';

export default function AlertCard({ alert }: { alert: Alert }) {
  return (
    <article className="panel alert-card">
      <div className="alert-top">
        <span className={`chip chip-${alert.tone}`}>{alert.tag}</span>
        <span className="alert-date">{alert.effective}</span>
      </div>
      <h3>{alert.title}</h3>
      {alert.before !== undefined && alert.now !== undefined ? (
        <div className="before-now">
          <div className="before">
            <b>Before</b>
            {alert.before}
          </div>
          <div className={`now tone-${alert.tone}`}>
            <b>Now</b>
            {alert.now}
          </div>
        </div>
      ) : (
        alert.body && <p className="alert-body">{alert.body}</p>
      )}
      <p className="alert-action">
        <b>{alert.actionLabel ?? 'Do'}:</b> {alert.action}
      </p>
      <SourceLine source={alert.source} className="muted" />
    </article>
  );
}
