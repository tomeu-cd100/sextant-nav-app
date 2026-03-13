import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Label } from '../components/ui';
import { useTranslation } from 'react-i18next';
import { getAstroData } from '../core/astro';
import { calculateSunHo, calculateSightReduction, parseHs } from '../core/reductions';

export default function PracticeSim() {
  const { t } = useTranslation();
  const [scenario, setScenario] = useState(null);
  const [userAns, setUserAns] = useState({ ho: '', intercept: '', direction: 'T', zn: '' });
  const [resultMsg, setResultMsg] = useState(null);

  const generateScenario = () => {
    // Generate random date within year 2026
    const start = new Date(2026, 0, 1).getTime();
    const end = new Date(2026, 11, 31).getTime();
    const dateStr = new Date(start + Math.random() * (end - start)).toISOString();
    
    // Random Lat (0 to 60 N/S), Lon (0 to 180 E/W)
    const lat = (Math.random() * 60).toFixed(1) * (Math.random() > 0.5 ? 1 : -1);
    const lon = (Math.random() * 180).toFixed(1) * (Math.random() > 0.5 ? 1 : -1);
    
    // Random hs between 15 and 70 degrees
    const hs = (15 + Math.random() * 55).toFixed(2);
    const ie = (Math.random() * 4 - 2).toFixed(1); // -2.0 to 2.0
    const eye = (1 + Math.random() * 9).toFixed(1); // 1.0 to 10.0m

    // Calculate truth
    const utcDate = new Date(dateStr);
    const { dec, gha, sd } = getAstroData('sun', utcDate);
    const dip = -1.77 * Math.sqrt(parseFloat(eye));
    const ho = calculateSunHo(parseFloat(hs), parseFloat(ie), dip, sd, true);
    
    const { hc, zn } = calculateSightReduction({ lat, lon, dec, gha });
    const intercept = (ho - hc) * 60;

    setScenario({
      dateStr: dateStr.replace('T', ' ').substring(0, 19) + ' UTC',
      lat, lon, hs, ie, eye,
      truth: { ho, intercept, zn }
    });
    setResultMsg(null);
    setUserAns({ ho: '', intercept: '', direction: 'T', zn: '' });
  };

  useEffect(() => {
    generateScenario();
  }, []);

  const checkAnswers = () => {
    if (!scenario) return;
    const { ho, intercept, zn } = scenario.truth;
    
    const uHo = parseHs(userAns.ho.split('.')[0] || 0, userAns.ho.split('.')[1] || 0);
    const uInt = parseFloat(userAns.intercept) * (userAns.direction === 'T' ? 1 : -1);
    const actualInt = intercept;
    
    const hoDiff = Math.abs(ho - parseFloat(userAns.ho));
    const intDiff = Math.abs(actualInt - uInt);
    
    if (hoDiff < 0.1 && intDiff < 0.5) {
      setResultMsg({ success: true, text: `Correct! Excellent work. True Intercept is ${Math.abs(actualInt).toFixed(1)}' ${actualInt >= 0 ? 'T' : 'A'}` });
    } else {
      setResultMsg({ success: false, text: `Check your math. The true Ho was ${ho.toFixed(2)}° and Intercept was ${Math.abs(actualInt).toFixed(1)}' ${actualInt >= 0 ? 'T' : 'A'}`});
    }
  };

  if (!scenario) return null;

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
        {t('sim.math_title')}
      </h2>

      <Card>
        <p className="text-slate-300 mb-4 text-sm">
          {t('sim.math_subtitle')}
        </p>
        <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl space-y-2 font-mono text-sm text-slate-300">
          <div><strong className="text-slate-100">Date/Time:</strong> {scenario.dateStr}</div>
          <div><strong className="text-slate-100">GHA/Dec:</strong> Check Almanac/Equations</div>
          <div><strong className="text-slate-100">DR Lat:</strong> {Math.abs(scenario.lat)}° {scenario.lat >= 0 ? 'N' : 'S'}</div>
          <div><strong className="text-slate-100">DR Lon:</strong> {Math.abs(scenario.lon)}° {scenario.lon >= 0 ? 'E' : 'W'}</div>
          <div><strong className="text-slate-100">Sextant (Hs):</strong> {scenario.hs}°</div>
          <div><strong className="text-slate-100">Index Error:</strong> {scenario.ie}'</div>
          <div><strong className="text-slate-100">Eye Height:</strong> {scenario.eye}m</div>
          <div><strong className="text-slate-100">Limb:</strong> Lower (Sun)</div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button onClick={generateScenario} className="text-blue-400 text-sm hover:underline">
            {t('sim.gen_new')}
          </button>
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-bold text-white mb-4">{t('sim.your_ans')}</h3>
        <div className="space-y-4">
          <div>
            <Label>{t('sim.ho_dec')}</Label>
            <Input type="number" step="0.01" value={userAns.ho} onChange={(e) => setUserAns({...userAns, ho: e.target.value})} placeholder="e.g. 45.67" />
          </div>
          <div>
            <Label>{t('sim.intercept_min')}</Label>
            <div className="flex gap-2">
              <Input type="number" step="0.1" value={userAns.intercept} onChange={(e) => setUserAns({...userAns, intercept: e.target.value})} placeholder="e.g. 6.8" />
              <select value={userAns.direction} onChange={(e) => setUserAns({...userAns, direction: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg text-slate-100 px-3 py-2 outline-none">
                <option value="T">T</option>
                <option value="A">A</option>
              </select>
            </div>
          </div>
          
          <Button onClick={checkAnswers}>{t('sim.check_btn')}</Button>
          
          {resultMsg && (
            <div className={`p-4 rounded-lg font-medium text-sm ${resultMsg.success ? 'bg-emerald-900/50 border border-emerald-500 text-emerald-300' : 'bg-red-900/50 border border-red-500 text-red-300'}`}>
              {resultMsg.text}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
