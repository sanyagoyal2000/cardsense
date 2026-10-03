import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { BANK_NAMES, BANKS, getCard, listBanks } from '../data/cards';
import { rankRoutes } from '../lib/calc';
import { inr } from '../lib/format';
import tap from '../assets/tap.jpg';
import phone from '../assets/phone.jpg';
import cashback from '../assets/cashback.jpg';
import woman from '../assets/woman.jpg';

const EXAMPLE_POINTS = 85000;

export default function Landing() {
  const infinia = getCard('hdfc-infinia')!;
  const ranked = rankRoutes(infinia.routes, EXAMPLE_POINTS);
  const cash = ranked.find((r) => r.route.goal === 'cash')!;
  const bestPerPoint = ranked[0].perPoint;
  const multiple = (bestPerPoint / cash.perPoint).toFixed(1);
  const smartbuyUncapped = EXAMPLE_POINTS * infinia.routes[0].valuePerPoint;

  return (
    <div className="app landing-page">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <section className="hero landing-hero dark">
        <Header landing />
        <div className="container landing-hero-body">
          <div className="landing-copy">
            <span className="eyebrow">Reward points, in rupees</span>
            <h1>Your card points are worth more than you think.</h1>
            <div className="landing-lede">
              <p>
                See every redemption route for {listBanks()} cards side by side in ₹, and get warned
                before a milestone lapses or a bank changes the rules.
              </p>
              <div className="cta-row">
                <Link to="/wallet" className="btn btn-primary btn-lg">
                  Check my points
                </Link>
                <Link to="/benefits" className="link-arrow">
                  See recent changes →
                </Link>
              </div>
            </div>
            <div className="landing-stats">
              <div>
                <div className="stat-big">Multiple cards</div>
                <div className="stat-small">
                  <span className="dot" aria-hidden="true">●</span> {BANKS.join(' · ')} · more coming
                </div>
              </div>
              <div>
                <div className="stat-big">{multiple}×</div>
                <div className="stat-small">Best route vs cash on Infinia</div>
              </div>
            </div>
          </div>
          <div className="hero-cards" aria-hidden="true">
            <div className="hero-card hc-1">
              <div className="hc-top">
                <span className="hc-chip" />
                <b>Travel card</b>
              </div>
              <div className="mono hc-num">85,000 pts</div>
              <div className="hc-foot">
                <span>Worth up to</span>
                <b>₹85,000</b>
              </div>
            </div>
            <div className="hero-card hc-2">
              <span className="hc-chip" />
              <div className="mono hc-num">22,000 MR</div>
              <div className="hc-foot">Milestone: ₹90,000 to go</div>
            </div>
            <div className="hero-card hc-3">
              <span className="hc-chip" />
              <div className="mono hc-num">12,000 miles</div>
              <div className="hc-foot">Transfer at 1:2 to save more</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bank-strip" aria-label="Banks covered">
        <div className="container bank-strip-inner">
          {BANK_NAMES.map((b) => (
            <span key={b}>{b}</span>
          ))}
          <span className="bank-note">Cards we cover (names only, no affiliation)</span>
        </div>
      </section>

      <main id="main">
        <section className="container features">
          <div className="feature-grid">
            <div className="feature dark-tile">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#6ee7b7" strokeWidth="2" aria-hidden="true">
                <rect x="4" y="9" width="32" height="22" rx="3" />
                <path d="M4 16h32" />
              </svg>
              <h3>Rupee comparison</h3>
              <p>Every route as ₹ value and ₹ per point.</p>
            </div>
            <div className="feature">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#ec4899" strokeWidth="2" aria-hidden="true">
                <circle cx="20" cy="20" r="15" />
                <path d="M20 11v9l6 4" />
              </svg>
              <h3>Milestone tracker</h3>
              <p>Spend left, days left, value at risk.</p>
            </div>
            <div className="feature">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#fb923c" strokeWidth="2" aria-hidden="true">
                <path d="M20 5l15 28H5z" />
                <path d="M20 16v8M20 28v1" />
              </svg>
              <h3>Change alerts</h3>
              <p>Before and after, with date and source.</p>
            </div>
            <div className="feature">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#7c3aed" strokeWidth="2" aria-hidden="true">
                <path d="M20 4l13 5v10c0 9-6 14-13 17C13 33 7 28 7 19V9z" />
              </svg>
              <h3>Private by design</h3>
              <p>No card numbers, OTPs or logins.</p>
            </div>
          </div>
          <div className="features-copy light">
            <span className="eyebrow">What you get</span>
            <h2>Stop cashing out at 30 paise a point.</h2>
            <p className="rule-left">
              85,000 HDFC Infinia points are {inr(cash.rupeeValue)} as statement credit, or up to {inr(smartbuyUncapped)} on
              SmartBuy travel. CardSense shows the difference before you redeem.
            </p>
            <Link to="/redeem" className="btn btn-primary">
              Compare my routes
            </Link>
          </div>
        </section>

        <section className="photo-strip">
          <div className="container photo-grid">
            <img src={tap} alt="Customer tapping a card on a payment terminal at a café" />
            <img src={phone} alt="Card held to a phone showing tap to pay" />
            <img src={cashback} alt="Hand holding a credit card next to a phone with a cashback screen" />
          </div>
        </section>

        <section className="container how">
          <img className="how-photo" src={woman} alt="Smiling woman checking her phone while holding a card" />
          <div className="how-copy">
            <div className="how-head">
              <span className="eyebrow">How it works</span>
              <h2>Three steps, no sign-up</h2>
            </div>
            <ol className="steps">
              <li>
                <span className="step-num">1</span>
                <h3>Add your cards</h3>
                <p>Pick the card and type your points balance.</p>
              </li>
              <li>
                <span className="step-num">2</span>
                <h3>Choose a goal</h3>
                <p>Cash, shopping or travel. We rank the routes in ₹.</p>
              </li>
              <li>
                <span className="step-num dark-num">3</span>
                <h3>Stay ahead of changes</h3>
                <p>Track milestones and see devaluations with sources.</p>
              </li>
            </ol>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
