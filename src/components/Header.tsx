import { Link, NavLink } from 'react-router-dom';
import { getPlan } from '../data/plans';
import { usePlan } from '../lib/plan';

const LINKS = [
  { to: '/wallet', label: 'My wallet' },
  { to: '/redeem', label: 'Redeem' },
  { to: '/benefits', label: 'Benefits' },
  { to: '/cards', label: 'All cards' },
  { to: '/community', label: 'Community' },
  { to: '/experts', label: 'Experts' },
  { to: '/plans', label: 'Plans' },
  { to: '/feedback', label: 'Feedback' },
];

export function Logo() {
  return (
    <Link to="/" className="logo">
      <span className="logo-mark" aria-hidden="true" />
      CardSense
    </Link>
  );
}

function PlanBadge() {
  const plan = usePlan();
  return (
    <Link to="/plans" className={`plan-badge plan-${plan}`} aria-label={`Current plan: ${getPlan(plan).name}. See plans`}>
      {getPlan(plan).name}
    </Link>
  );
}

export default function Header({ landing = false }: { landing?: boolean }) {
  const links = landing ? [{ to: '/', label: 'Home' }, ...LINKS] : LINKS;
  return (
    <header className="container site-header">
      <Logo />
      <nav className={landing ? 'nav landing' : 'nav'} aria-label="Main">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.to === '/'}>
            {l.label}
          </NavLink>
        ))}
      </nav>
      {landing ? (
        <Link to="/wallet" className="btn btn-primary btn-sm header-cta">
          Check my points
        </Link>
      ) : (
        <PlanBadge />
      )}
    </header>
  );
}
