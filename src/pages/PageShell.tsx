import type { ReactNode } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

/** Dark hero band with header, light content, footer. */
export default function PageShell({ hero, children }: { hero: ReactNode; children: ReactNode }) {
  return (
    <div className="app">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <section className="hero dark">
        <Header />
        {hero}
      </section>
      <main id="main" className="page-main">
        {children}
      </main>
      <Footer />
    </div>
  );
}
