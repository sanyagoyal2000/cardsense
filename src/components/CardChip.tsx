import type { CSSProperties, ReactNode } from 'react';
import type { Card } from '../data/cards';

interface Props {
  card: Card;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
}

/** Gradient rectangle standing in for a card. No logos, no card art. */
export default function CardChip({ card, children, style, className = '' }: Props) {
  return (
    <div
      className={`card-chip${card.ink === 'dark' ? ' ink-dark' : ''} ${className}`.trim()}
      style={{ background: card.grad, ...style }}
    >
      <b>{card.chipName}</b>
      {children}
    </div>
  );
}

export function CardSwatch({ card }: { card: Card }) {
  return <span className="card-swatch" style={{ background: card.grad }} aria-hidden="true" />;
}
