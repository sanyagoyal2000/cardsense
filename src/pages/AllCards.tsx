import { useState } from 'react';
import { CardSwatch } from '../components/CardChip';
import Pill from '../components/Pill';
import { BANKS, cards, LAST_CHECKED } from '../data/cards';
import PageShell from './PageShell';

export default function AllCards() {
  const [filter, setFilter] = useState('All');
  const shown = filter === 'All' ? cards : cards.filter((c) => c.bankShort === filter);

  return (
    <PageShell
      hero={
        <div className="container simple-hero">
          <span className="eyebrow">
            Multiple cards · more coming
          </span>
          <h1 className="page-title">Popular cards, compared in ₹</h1>
          <p className="hero-lede">
            Best and cash value per point, lounge access and the latest rule change for each card. Checked {LAST_CHECKED}.
          </p>
        </div>
      }
    >
      <div className="container cards-body">
        <div className="filter-pills" role="group" aria-label="Filter by bank">
          {['All', ...BANKS].map((b) => (
            <Pill key={b} pressed={filter === b} onClick={() => setFilter(b)}>
              {b}
            </Pill>
          ))}
        </div>

        <div className="panel table-wrap" tabIndex={0} role="region" aria-label="Card comparison table">
          <table className="table cards-table">
            <caption className="sr-only">
              {shown.length} cards: annual fee, earn rate, best and cash value per point, lounge access and latest change
            </caption>
            <thead>
              <tr>
                <th scope="col">Card</th>
                <th scope="col">Annual fee</th>
                <th scope="col">Earn rate</th>
                <th scope="col">Best ₹/pt</th>
                <th scope="col">Cash ₹/pt</th>
                <th scope="col">Lounge</th>
                <th scope="col">Latest change</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((c) => (
                <tr key={c.id}>
                  <th scope="row">
                    <div className="card-cell">
                      <CardSwatch card={c} />
                      <div>
                        <b>{c.name}</b>
                        <div className="bank-name">{c.bank}</div>
                      </div>
                    </div>
                  </th>
                  <td>{c.table.fee}</td>
                  <td>{c.table.earn}</td>
                  <td className="mono">{c.table.best}</td>
                  <td className="mono cash-loss">{c.table.cash}</td>
                  <td>{c.table.lounge}</td>
                  <td>
                    <span className={`chip chip-${c.table.chipTone}`}>{c.table.chip}</span>
                    <div className="change-text">{c.table.change}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="footnote">
          Transfer values (Axis miles, airline partners) are estimates. Sources: PointsMax, CardMaven, CardAdvisor, CardTrail,
          Paisabazaar, LiveFromALounge. Not affiliated with any bank.
        </p>
      </div>
    </PageShell>
  );
}
