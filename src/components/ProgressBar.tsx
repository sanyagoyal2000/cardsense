interface Props {
  percent: number;
  tone?: 'ink' | 'lime' | 'danger';
  thick?: boolean;
  label: string;
}

export default function ProgressBar({ percent, tone = 'ink', thick, label }: Props) {
  const p = Math.max(0, Math.min(100, Number.isFinite(percent) ? percent : 0));
  return (
    <div
      className={`progress tone-${tone}${thick ? ' thick' : ''}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(p)}
    >
      <span style={{ width: `${p}%` }} />
    </div>
  );
}
