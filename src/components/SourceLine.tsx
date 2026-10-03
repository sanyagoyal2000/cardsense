import type { Source } from '../data/cards';
import { LAST_CHECKED } from '../data/cards';

export default function SourceLine({ source, className = '' }: { source: Source; className?: string }) {
  return (
    <span className={`source-line ${className}`.trim()}>
      <a href={source.url} target="_blank" rel="noopener noreferrer">
        {source.name}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>{' '}
      · checked {LAST_CHECKED}
    </span>
  );
}
