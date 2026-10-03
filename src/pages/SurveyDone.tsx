import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function SurveyDone() {
  return (
    <div className="survey dark">
      <main id="main" className="thanks">
        <div className="thanks-cards" aria-hidden="true">
          <div className="tc tc-back" />
          <div className="tc tc-front">✓</div>
        </div>
        <h1>Thanks, that helps a lot.</h1>
        <p>Your answers shape what we build next. We read every response.</p>
        <div className="cta-row center">
          <Link to="/wallet" className="btn btn-primary btn-lg">
            Back to my wallet
          </Link>
          <Link to="/cards" className="link-arrow">
            Browse all cards →
          </Link>
        </div>
        <p className="thanks-note">Saved on this device only.</p>
      </main>
      <Footer />
    </div>
  );
}
