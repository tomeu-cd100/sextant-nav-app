import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PracticeSim from './PracticeSim';
import VisualSim from './VisualSim';

export default function Simulator() {
  const { t } = useTranslation();
  return (
    <Routes>
      <Route path="/" element={
        <div className="max-w-md mx-auto space-y-6 pb-20">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-6">
            {t('nav.simulator')}
          </h2>
          <div className="grid gap-4">
            <Link to="/simulator/math" className="p-6 bg-slate-800 rounded-xl hover:bg-slate-700 transition ring-1 ring-white/10">
              <h3 className="text-xl font-bold text-slate-200 mb-2">{t('nav.math_sim')}</h3>
              <p className="text-sm text-slate-400">{t('nav.math_sim_desc')}</p>
            </Link>
            <Link to="/simulator/visual" className="p-6 bg-slate-800 rounded-xl hover:bg-slate-700 transition ring-1 ring-white/10">
              <h3 className="text-xl font-bold text-slate-200 mb-2">{t('nav.vis_sim')}</h3>
              <p className="text-sm text-slate-400">{t('nav.vis_sim_desc')}</p>
            </Link>
          </div>
        </div>
      } />
      <Route path="/math" element={<PracticeSim />} />
      <Route path="/visual" element={<VisualSim />} />
    </Routes>
  );
}
