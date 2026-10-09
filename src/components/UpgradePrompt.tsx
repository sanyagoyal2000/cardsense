import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  /** Plan to name in the link, e.g. "Plus". */
  plan?: string;
  className?: string;
}

/** Small lime-outlined nudge to /plans. Never blocks the page. */
export default function UpgradePrompt({ children, plan = 'Plus', className = '' }: Props) {
  return (
    <div className={`upgrade ${className}`.trim()} role="status">
      <span>{children}</span>
      <Link to="/plans" className="upgrade-link">
        See {plan} →
      </Link>
    </div>
  );
}
