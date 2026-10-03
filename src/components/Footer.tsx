import { LAST_CHECKED } from '../data/cards';

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>Values from public sources, last checked {LAST_CHECKED}. Not financial advice. Not affiliated with any bank.</p>
    </footer>
  );
}
