import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Wallet from './pages/Wallet';
import Redeem from './pages/Redeem';
import Benefits from './pages/Benefits';
import AllCards from './pages/AllCards';
import Survey from './pages/Survey';
import SurveyDone from './pages/SurveyDone';
import Community from './pages/Community';
import Experts from './pages/Experts';
import Plans from './pages/Plans';

const TITLES: Record<string, string> = {
  '/': 'CardSense: your card points in rupees',
  '/wallet': 'My wallet · CardSense',
  '/redeem': 'Redeem points · CardSense',
  '/benefits': 'Benefits & changes · CardSense',
  '/cards': 'All cards · CardSense',
  '/community': 'Community · CardSense',
  '/experts': 'Talk to an expert · CardSense',
  '/plans': 'Plans & pricing · CardSense',
  '/feedback': 'Feedback · CardSense',
  '/feedback/thanks': 'Thanks · CardSense',
};

function usePageSetup() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = TITLES[pathname] ?? (pathname.startsWith('/community/') ? TITLES['/community'] : 'CardSense');
    window.scrollTo(0, 0);
  }, [pathname]);
}

export default function App() {
  usePageSetup();
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/redeem" element={<Redeem />} />
      <Route path="/benefits" element={<Benefits />} />
      <Route path="/cards" element={<AllCards />} />
      <Route path="/community" element={<Community />} />
      <Route path="/community/:postId" element={<Community />} />
      <Route path="/experts" element={<Experts />} />
      <Route path="/plans" element={<Plans />} />
      <Route path="/feedback" element={<Survey />} />
      <Route path="/feedback/thanks" element={<SurveyDone />} />
      <Route path="*" element={<Landing />} />
    </Routes>
  );
}
