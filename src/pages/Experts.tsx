import { useRef, useState, type FormEvent, type RefObject } from 'react';
import { Link } from 'react-router-dom';
import Pill from '../components/Pill';
import expertPhoto from '../assets/expert.jpg';
import {
  CATEGORIES,
  EXPERTS,
  FORMATS,
  KIND_LABELS,
  TRUST_POINTS,
  VETTING,
  type CallFormat,
  type Expert,
  type ExpertCategory,
} from '../data/experts';
import { inr, isoDate } from '../lib/format';
import { checkSensitive } from '../lib/moderate';
import { freeConsultAvailable, monthKey, usePlan } from '../lib/plan';
import { isObject, KEYS, useStored } from '../lib/storage';
import PageShell from './PageShell';

interface Booking {
  id: string;
  expertId: string;
  date: string;
  time: string;
  format: CallFormat;
  topic: string;
  price: number;
  free: boolean;
  /** Month the booking was made, for the Premium free-consult allowance. */
  month: string;
  createdAt: number;
}

const isBookings = (v: unknown): v is Booking[] =>
  Array.isArray(v) &&
  v.every((b) => isObject(b) && typeof b.expertId === 'string' && typeof b.free === 'boolean' && typeof b.month === 'string');

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** The next five days, starting tomorrow. */
function nextDays(from: Date): Date[] {
  return Array.from({ length: 5 }, (_, i) => new Date(from.getFullYear(), from.getMonth(), from.getDate() + 1 + i));
}

const dayLabel = (d: Date) => `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;

function Avatar({ expert, size }: { expert: Expert; size?: 'lg' }) {
  const cls = `avatar${size ? ' ' + size : ''}`;
  return expert.photo ? (
    <img className={`${cls} avatar-photo`} src={expert.photo} alt="" />
  ) : (
    <span className={cls} style={{ background: expert.grad }} aria-hidden="true" />
  );
}

export default function Experts() {
  const plan = usePlan();
  const [bookings, setBookings] = useStored<Booking[]>(KEYS.bookings, [], isBookings);
  const [filter, setFilter] = useState<ExpertCategory | 'all'>('all');
  const [expertId, setExpertId] = useState('meera');
  const panelRef = useRef<HTMLHeadingElement>(null);

  const today = new Date();
  const days = nextDays(today);
  const shown = filter === 'all' ? EXPERTS : EXPERTS.filter((e) => e.categories.includes(filter));
  const expert = EXPERTS.find((e) => e.id === expertId)!;
  const freeAvailable = freeConsultAvailable(plan, bookings, monthKey(today));

  const book = (id: string) => {
    setExpertId(id);
    requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      panelRef.current?.focus({ preventScroll: true });
    });
  };

  return (
    <PageShell
      hero={
        <div className="container experts-hero">
          <div className="title-block experts-copy">
            <span className="eyebrow">Talk to an expert</span>
            <h1 className="page-title">Get a straight answer in a 15-minute call</h1>
            <p className="hero-lede">
              Book verified card specialists and current or former bank staff for one-to-one advice on which card to hold,
              how to redeem, or how to handle a devaluation.
            </p>
            <ul className="trust-points">
              {TRUST_POINTS.map(([b, rest]) => (
                <li key={b}>
                  <b>{b}</b> {rest}
                </li>
              ))}
            </ul>
          </div>
          <figure className="experts-photo">
            <img src={expertPhoto} alt="Arjun Mehta, a card expert, smiling at an office desk" />
            <figcaption className="photo-tag">
              <b>Arjun Mehta · ★ 4.9</b>
              <span>Next slot: today, 6:00 pm</span>
            </figcaption>
          </figure>
        </div>
      }
    >
      <div className="container experts-body">
        <div className="experts-filters">
          <div className="filter-pills" role="group" aria-label="Filter experts">
            {CATEGORIES.map((c) => (
              <Pill key={c.id} pressed={filter === c.id} onClick={() => setFilter(c.id)}>
                {c.label}
              </Pill>
            ))}
          </div>
          <Link to="/plans" className="lime-link">
            {plan === 'premium'
              ? freeAvailable
                ? 'Your free consult this month is ready →'
                : 'Free consult used this month · see plans →'
              : 'Premium includes 1 free consult a month →'}
          </Link>
        </div>

        <div className="expert-grid">
          {shown.map((e) => {
            const chosen = e.id === expertId;
            return (
              <article key={e.id} className={`expert-card ${chosen ? 'panel-dark dark' : 'panel'}`}>
                <div className="expert-head">
                  <Avatar expert={e} />
                  <div>
                    <h2 className="expert-name">{e.name}</h2>
                    <div className="expert-role">{e.role}</div>
                  </div>
                </div>
                <div className="chips-row">
                  <span className={`chip ${chosen ? 'chip-lime' : 'chip-good'}`}>✓ Verified</span>
                  <span
                    className={`chip ${e.kind === 'current' ? 'chip-warn' : chosen ? 'chip-outline' : 'chip-neutral'}`}
                  >
                    {KIND_LABELS[e.kind]}
                  </span>
                </div>
                <p className="expert-bio">{e.bio}</p>
                {e.kind === 'current' && (
                  <p className="conflict-note">Discloses current employer on the call. Won’t advise on their own bank’s products.</p>
                )}
                <div className="expert-stats">
                  ★ {e.rating} ({e.calls} calls) · {e.languages.join(', ')}
                </div>
                <div className="expert-foot">
                  <span>
                    <b className="expert-price">{inr(e.price)}</b> <span className="expert-mins">/ {e.minutes} min</span>
                  </span>
                  <button
                    type="button"
                    className={`btn btn-sm ${chosen ? 'btn-primary' : 'btn-dark'}`}
                    aria-pressed={chosen}
                    onClick={() => book(e.id)}
                  >
                    Book<span className="sr-only"> {e.name}</span>
                  </button>
                </div>
              </article>
            );
          })}
          {shown.length === 0 && <p className="muted">No experts in this category yet.</p>}
        </div>

        <section className="experts-lower">
          <BookingPanel
            key={expert.id}
            expert={expert}
            days={days}
            freeAvailable={freeAvailable}
            headingRef={panelRef}
            bookingCount={bookings.length}
            onConfirm={(b) => setBookings((list) => [...list, b])}
          />
          <div className="panel-dark dark vet-box">
            <h2 className="box-label lime">How we vet experts</h2>
            <ol className="vet-list">
              {VETTING.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ol>
            <Link to="/feedback" className="vet-apply">
              Apply to become an expert →
            </Link>
          </div>
        </section>
        <p className="footnote">Sample expert profiles and prices for this mockup. Expert views are their own and not financial advice.</p>
      </div>
    </PageShell>
  );
}

interface PanelProps {
  expert: Expert;
  days: Date[];
  freeAvailable: boolean;
  headingRef: RefObject<HTMLHeadingElement | null>;
  bookingCount: number;
  onConfirm: (b: Booking) => void;
}

function BookingPanel({ expert, days, freeAvailable, headingRef, bookingCount, onConfirm }: PanelProps) {
  const isOpen = (d: Date) => !expert.offDays.includes(d.getDay());
  const [day, setDay] = useState(() => Math.max(0, days.findIndex(isOpen)));
  const [slot, setSlot] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState<CallFormat>('video');
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState<Booking | null>(null);

  const safety = checkSensitive(topic);
  const date = days[day];
  const priceText = freeAvailable ? '₹0 · uses your free monthly consult' : inr(expert.price);

  const confirm = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!slot || !safety.ok) return;
    const now = new Date();
    const booking: Booking = {
      id: `b-${now.getTime()}`,
      expertId: expert.id,
      date: isoDate(date),
      time: slot,
      format,
      topic: topic.trim(),
      price: freeAvailable ? 0 : expert.price,
      free: freeAvailable,
      month: monthKey(now),
      createdAt: now.getTime(),
    };
    onConfirm(booking);
    setDone(booking);
  };

  const heading = (
    <h2 className="booking-title" ref={headingRef} tabIndex={-1}>
      Book {expert.name} · {expert.minutes} min
    </h2>
  );

  if (done) {
    return (
      <div className="panel booking">
        {heading}
        <div className="booking-done" role="status">
          <span className="chip chip-good">✓ Booked</span>
          <p>
            <b>
              {dayLabel(date)} · {done.time} · {FORMATS.find((f) => f.id === done.format)!.label}
            </b>
          </p>
          <p className="muted">
            {done.free ? '₹0, using your free monthly consult.' : `${inr(done.price)}.`} This is a prototype, so no payment was
            taken. {bookingCount} {bookingCount === 1 ? 'booking' : 'bookings'} saved on this device.
          </p>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => {
              setDone(null);
              setSlot(null);
              setTopic('');
              setSubmitted(false);
            }}
          >
            Book another call
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="panel booking" onSubmit={confirm} noValidate>
      <div className="booking-head">
        {heading}
        <span className="muted booking-tz">Times in IST</span>
      </div>
      <div className="day-grid" role="group" aria-label="Day">
        {days.map((d, i) => (
          <button
            key={d.toISOString()}
            type="button"
            className="day-btn"
            aria-pressed={day === i}
            disabled={!isOpen(d)}
            onClick={() => {
              setDay(i);
              setSlot(null);
            }}
          >
            {WEEKDAYS[d.getDay()]}
            <b>{d.getDate()}</b>
            {!isOpen(d) && <span className="sr-only"> (unavailable)</span>}
          </button>
        ))}
      </div>
      <div className="slot-row" role="group" aria-label="Time">
        {expert.slots.map((s) => (
          <button key={s} type="button" className="slot-btn" aria-pressed={slot === s} onClick={() => setSlot(s)}>
            {s}
          </button>
        ))}
      </div>
      {submitted && !slot && <span className="field-error on-light">Pick a time.</span>}
      <div className="field">
        <label className="box-label" htmlFor="b-topic">
          What do you want to discuss?
        </label>
        <textarea
          id="b-topic"
          className="input input-light textarea"
          rows={3}
          value={topic}
          placeholder="For example: I hold Infinia and Amex Platinum Travel. After the Amex change, should I keep both?"
          onChange={(e) => setTopic(e.target.value)}
          aria-invalid={!safety.ok}
          aria-describedby={!safety.ok ? 'b-topic-err' : undefined}
        />
        {!safety.ok && (
          <span id="b-topic-err" className="field-error on-light" role="alert">
            {safety.error}
          </span>
        )}
      </div>
      <fieldset className="format-row">
        <legend>Format:</legend>
        {FORMATS.map((f) => (
          <label key={f.id}>
            <input type="radio" name="format" checked={format === f.id} onChange={() => setFormat(f.id)} /> {f.label}
          </label>
        ))}
      </fieldset>
      <div className="booking-summary">
        <span>
          {dayLabel(date)} · {slot ?? 'pick a time'} · <b>{priceText}</b>
        </span>
        <button type="submit" className="btn btn-primary">
          {freeAvailable ? 'Confirm booking' : 'Confirm and pay'}
        </button>
      </div>
      <p className="footnote">Don’t share card numbers, OTPs or statements on the call. Experts never ask for them.</p>
    </form>
  );
}
