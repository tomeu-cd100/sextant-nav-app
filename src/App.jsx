import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SunCalc from './pages/SunCalc';
import MeridianCalc from './pages/MeridianCalc';
import MoonCalc from './pages/MoonCalc';
import StarsCalc from './pages/StarsCalc';
import Simulator from './pages/Simulator';
import Guide from './pages/Guide';
import ReloadPrompt from './components/ReloadPrompt';

function App() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <header className="p-4 bg-slate-800 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!isHome && (
            <Link to="/" className="text-slate-400 hover:text-white transition flex items-center justify-center bg-slate-700/50 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </Link>
          )}
          <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            {t('app.title')}
          </Link>
        </div>
        <div className="flex items-center">
          <button 
            onClick={() => i18n.changeLanguage(i18n.language === 'ca' ? 'es' : 'ca')}
            className="text-sm font-semibold text-slate-300 hover:text-white bg-slate-700/50 px-3 py-1.5 rounded-lg border border-slate-600 transition"
          >
            {i18n.language === 'ca' ? 'ES' : 'CA'}
          </button>
        </div>
      </header>
      <main className="flex-1 p-4 overflow-y-auto">
        <Routes>
          <Route path="/" element={
            <div className="flex flex-col gap-4 text-center mt-8 max-w-sm mx-auto">
              <h2 className="text-2xl text-slate-300 mb-6">{t('app.subtitle')}</h2>
              <Link to="/sun" className="p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition ring-1 ring-white/10 flex items-center justify-center gap-2">
                <span className="text-2xl">☀️</span> {t('nav.sun')}
              </Link>
              <Link to="/meridian" className="p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition ring-1 ring-white/10 flex items-center justify-center gap-2">
                <span className="text-2xl">🕛</span> Meridiana
              </Link>
              <Link to="/moon" className="p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition ring-1 ring-white/10 flex items-center justify-center gap-2">
                <span className="text-2xl">🌙</span> {t('nav.moon')}
              </Link>
              <Link to="/stars" className="p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition ring-1 ring-white/10 flex items-center justify-center gap-2">
                <span className="text-2xl">✨</span> {t('nav.stars')}
              </Link>
              <Link to="/simulator" className="p-4 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl hover:to-slate-600 transition ring-1 ring-blue-500/50 flex items-center justify-center gap-2 font-semibold">
                <span className="text-2xl">🎓</span> {t('nav.simulator')}
              </Link>
              <Link to="/guide" className="p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition ring-1 ring-white/10 flex items-center justify-center gap-2">
                <span className="text-2xl">📖</span> {t('nav.guide')}
              </Link>
            </div>
          } />
          <Route path="/sun" element={<SunCalc />} />
          <Route path="/meridian" element={<MeridianCalc />} />
          <Route path="/moon" element={<MoonCalc />} />
          <Route path="/stars" element={<StarsCalc />} />
          <Route path="/simulator/*" element={<Simulator />} />
          <Route path="/guide" element={<Guide />} />
        </Routes>
      </main>
      <ReloadPrompt />
    </div>
  );
}

export default App;
