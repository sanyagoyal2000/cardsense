import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Header';
import Footer from '../components/Footer';
import { isObject, KEYS, load, remove, save, useStored } from '../lib/storage';

export type Trust = 'Yes' | 'Somewhat' | 'No';
export type Preference = 'type' | 'connect';

export interface SurveyAnswers {
  rating: number | null;
  trust: Trust | null;
  trustWhy: string;
  useful: string[];
  confusing: string;
  preference: Preference | null;
  buildNext: string;
}

interface Draft {
  step: number;
  answers: SurveyAnswers;
}

const EMPTY: SurveyAnswers = {
  rating: null,
  trust: null,
  trustWhy: '',
  useful: [],
  confusing: '',
  preference: null,
  buildNext: '',
};

const USEFUL = [
  'Wallet total in ₹',
  'Route recommendation',
  'Milestone tracker',
  'Devaluation alerts',
  'Sources and dates shown',
  'All-cards comparison',
];
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

const STEPS = [
  'Rate the rupee comparison (1–5)',
  'Did you trust the numbers? Why?',
  'Most useful parts',
  'What didn’t work or was confusing?',
  'What should we build next? Type points or connect account?',
];

const isDraft = (v: unknown): v is Draft =>
  isObject(v) && typeof v.step === 'number' && v.step >= 0 && v.step < STEPS.length && isObject(v.answers) && Array.isArray(v.answers.useful);

export default function Survey() {
  const navigate = useNavigate();
  const [draft, setDraft] = useStored<Draft>(KEYS.surveyDraft, { step: 0, answers: EMPTY }, isDraft);
  const [error, setError] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  const { step, answers } = draft;

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const set = (patch: Partial<SurveyAnswers>) => {
    setError('');
    setDraft((d) => ({ ...d, answers: { ...d.answers, ...patch } }));
  };

  const validate = (): string => {
    if (step === 0 && answers.rating === null) return 'Pick a number from 1 to 5.';
    if (step === 1 && answers.trust === null) return 'Choose Yes, Somewhat or No.';
    return '';
  };

  const next = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    if (step < STEPS.length - 1) {
      setDraft((d) => ({ ...d, step: d.step + 1 }));
      return;
    }
    const responses = load<unknown[]>(KEYS.surveyResponses, [], Array.isArray);
    save(KEYS.surveyResponses, [...responses, { ...answers, submittedAt: new Date().toISOString() }]);
    remove(KEYS.surveyDraft);
    navigate('/feedback/thanks');
  };

  const back = () => {
    setError('');
    setDraft((d) => ({ ...d, step: Math.max(0, d.step - 1) }));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    const target = e.target as HTMLElement;
    if (e.key === 'Enter' && !e.shiftKey && target.tagName !== 'BUTTON' && target.tagName !== 'A') {
      e.preventDefault();
      next();
      return;
    }
    // Letter shortcuts for the multi-select question
    if (step === 2 && target.tagName !== 'TEXTAREA' && !e.metaKey && !e.ctrlKey) {
      const i = LETTERS.indexOf(e.key.toUpperCase());
      if (i >= 0) toggleUseful(USEFUL[i]);
    }
  };

  const toggleUseful = (item: string) =>
    set({ useful: answers.useful.includes(item) ? answers.useful.filter((x) => x !== item) : [...answers.useful, item] });

  const pct = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="survey dark">
      <a href="#main" className="skip-link">
        Skip to question
      </a>
      <header className="container site-header survey-header">
        <Logo />
        <span className="survey-meta">Feedback · about 2 min</span>
        <Link to="/wallet" className="survey-close">
          Close <span aria-hidden="true">✕</span>
        </Link>
      </header>
      <div className="container">
        <div
          className="survey-progress"
          role="progressbar"
          aria-label="Survey progress"
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-valuenow={step + 1}
          aria-valuetext={`Question ${step + 1} of ${STEPS.length}`}
        >
          <span style={{ width: `${pct}%` }} />
        </div>
      </div>

      <main id="main" className="survey-main">
        <form
          className="survey-form"
          onSubmit={(e) => {
            e.preventDefault();
            next();
          }}
          onKeyDown={onKeyDown}
          noValidate
        >
          <span className="survey-step">
            Question {step + 1} of {STEPS.length}
          </span>

          {step === 0 && (
            <fieldset className="q">
              <legend>
                <h1 ref={headingRef} tabIndex={-1}>
                  How useful was the rupee comparison?
                </h1>
              </legend>
              <p className="q-hint">1 is not useful, 5 is very useful.</p>
              <div className="opt-row rating">
                {[1, 2, 3, 4, 5].map((n) => (
                  <label key={n} className={`opt opt-rating${answers.rating === n ? ' selected' : ''}`}>
                    <input type="radio" name="rating" className="sr-only" checked={answers.rating === n} onChange={() => set({ rating: n })} />
                    {n}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {step === 1 && (
            <fieldset className="q">
              <legend>
                <h1 ref={headingRef} tabIndex={-1}>
                  Did you trust the numbers?
                </h1>
              </legend>
              <div className="opt-row">
                {(['Yes', 'Somewhat', 'No'] as Trust[]).map((t, i) => (
                  <label key={t} className={`opt${answers.trust === t ? ' selected' : ''}`}>
                    <input type="radio" name="trust" className="sr-only" checked={answers.trust === t} onChange={() => set({ trust: t })} />
                    <span className="opt-key">{LETTERS[i]}</span>
                    {t}
                  </label>
                ))}
              </div>
              <label className="label" htmlFor="s-why">
                Why? (optional)
              </label>
              <textarea
                id="s-why"
                className="input textarea"
                rows={3}
                value={answers.trustWhy}
                onChange={(e) => set({ trustWhy: e.target.value })}
                placeholder="For example: the sources and dates made it easy to check."
              />
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="q">
              <legend>
                <h1 ref={headingRef} tabIndex={-1}>
                  Which parts of CardSense were most useful to you?
                </h1>
              </legend>
              <p className="q-hint">Pick all that apply.</p>
              <div className="opt-grid">
                {USEFUL.map((item, i) => {
                  const on = answers.useful.includes(item);
                  return (
                    <label key={item} className={`opt${on ? ' selected' : ''}`}>
                      <input type="checkbox" className="sr-only" checked={on} onChange={() => toggleUseful(item)} />
                      <span className="opt-key">{LETTERS[i]}</span>
                      {item}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {step === 3 && (
            <div className="q">
              <h1 ref={headingRef} tabIndex={-1}>
                <label htmlFor="s-confusing">What didn’t work or was confusing?</label>
              </h1>
              <p className="q-hint">Optional. Shift + Enter for a new line.</p>
              <textarea
                id="s-confusing"
                className="input textarea"
                rows={4}
                value={answers.confusing}
                onChange={(e) => set({ confusing: e.target.value })}
              />
            </div>
          )}

          {step === 4 && (
            <fieldset className="q">
              <legend>
                <h1 ref={headingRef} tabIndex={-1}>
                  Would you rather type your points or connect your account later?
                </h1>
              </legend>
              <div className="opt-row">
                {(
                  [
                    ['type', 'Keep typing points'],
                    ['connect', 'Connect my account later'],
                  ] as [Preference, string][]
                ).map(([v, label], i) => (
                  <label key={v} className={`opt${answers.preference === v ? ' selected' : ''}`}>
                    <input
                      type="radio"
                      name="pref"
                      className="sr-only"
                      checked={answers.preference === v}
                      onChange={() => set({ preference: v })}
                    />
                    <span className="opt-key">{LETTERS[i]}</span>
                    {label}
                  </label>
                ))}
              </div>
              <label className="label" htmlFor="s-next">
                What should we build next?
              </label>
              <textarea
                id="s-next"
                className="input textarea"
                rows={3}
                value={answers.buildNext}
                onChange={(e) => set({ buildNext: e.target.value })}
              />
            </fieldset>
          )}

          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}

          <div className="survey-nav">
            <button type="submit" className="btn btn-primary btn-lg survey-next">
              {step === STEPS.length - 1 ? 'Submit' : 'Next →'}
            </button>
            {step > 0 && (
              <button type="button" className="text-btn back" onClick={back}>
                ← Back
              </button>
            )}
            <span className="enter-hint">Press Enter ↵ to continue</span>
          </div>
        </form>
      </main>

      <section className="container survey-steps" aria-label="Questions">
        <ol>
          {STEPS.map((s, i) => (
            <li key={s} className={i < step ? 'done' : i === step ? 'current' : ''} aria-current={i === step ? 'step' : undefined}>
              <b>{i + 1}</b> {s}
            </li>
          ))}
        </ol>
      </section>
      <Footer />
    </div>
  );
}
