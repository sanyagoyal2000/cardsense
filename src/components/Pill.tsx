import type { ReactNode } from 'react';

interface Props {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
  dark?: boolean;
  className?: string;
}

/** Toggle button shaped as a pill. Uses aria-pressed for state. */
export default function Pill({ pressed, onClick, children, dark, className = '' }: Props) {
  return (
    <button
      type="button"
      className={`pill${dark ? ' on-dark' : ''} ${className}`.trim()}
      aria-pressed={pressed}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
