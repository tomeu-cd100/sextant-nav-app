import React, { useState } from 'react';
import { Card, Label, Input, Button } from '../components/ui';
import { useTranslation } from 'react-i18next';
import { getAstroData } from '../core/astro';
import { calculateDip, calculateStarHo, parseHs, calculateSightReduction, formatAngle } from '../core/reductions';

const BODIES = [
  'Venus', 'Mars', 'Jupiter', 'Saturn',
  // Usually stars are done via direct entry of SHA and Aries GHA,
  // but since we have precise geocentric ephemeris, we'll allow entering custom GHA/Dec
  // or selecting top planets for simplicity.
];

export default function StarsCalc() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '12:00:00',
    bodyName: 'Venus',
    hsDeg: '',
    hsMin: '',
    ieMin: '0',
    eyeHeight: '2',
    latDeg: '',
    latMin: '',
    latDir: 'N',
    lonDeg: '',
    lonMin: '',
    lonDir: 'E',
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const compute = () => {
    try {
      const utcDate = new Date(`${form.date}T${form.time}Z`);
      const { dec, gha } = getAstroData(form.bodyName, utcDate);
      
      const hsDecimal = parseHs(form.hsDeg, form.hsMin);
      const ie = parseFloat(form.ieMin) || 0;
      const eyeMeters = parseFloat(form.eyeHeight) || 0;
      
      let lat = parseHs(form.latDeg, form.latMin);
      if (form.latDir === 'S') lat = -lat;
      
      let lon = parseHs(form.lonDeg, form.lonMin);
      if (form.lonDir === 'W') lon = -lon;

      const dipMin = calculateDip(eyeMeters);
      
      const ho = calculateStarHo(hsDecimal, ie, dipMin);
      const { hc, zn } = calculateSightReduction({ lat, lon, dec, gha });

      const interceptArcmin = (ho - hc) * 60;
      const interceptAbs = Math.abs(interceptArcmin);
      const direction = interceptArcmin >= 0 ? 'Towards (T)' : 'Away (A)';

      setResult({
        ho: formatAngle(ho),
        hc: formatAngle(hc),
        dec: formatAngle(dec),
        gha: formatAngle(gha),
        zn: zn.toFixed(1) + '°',
        intercept: `${interceptAbs.toFixed(1)}' ${direction}`
      });
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
        {t('nav.stars')}
      </h2>

      <Card>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t('calc.date')}</Label>
              <Input type="date" name="date" value={form.date} onChange={handleChange} />
            </div>
            <div>
              <Label>{t('calc.time')}</Label>
              <Input type="time" step="1" name="time" value={form.time} onChange={handleChange} />
            </div>
          </div>

          <div>
            <Label>{t('calc.planet')}</Label>
            <select name="bodyName" value={form.bodyName} onChange={handleChange} className="block w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-slate-100">
              {BODIES.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <Label>{t('calc.hs_alt')}</Label>
            <div className="grid grid-cols-2 gap-4">
              <Input type="number" placeholder="Deg °" name="hsDeg" value={form.hsDeg} onChange={handleChange} />
              <Input type="number" step="0.1" placeholder="Min '" name="hsMin" value={form.hsMin} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t('calc.ie')}</Label>
              <Input type="number" step="0.1" name="ieMin" value={form.ieMin} onChange={handleChange} />
            </div>
            <div>
              <Label>{t('calc.eye')}</Label>
              <Input type="number" step="0.1" name="eyeHeight" value={form.eyeHeight} onChange={handleChange} />
            </div>
          </div>

          <div>
            <Label>{t('calc.dr_lat')}</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input type="number" placeholder="Deg °" name="latDeg" value={form.latDeg} onChange={handleChange} />
              <Input type="number" step="0.1" placeholder="Min '" name="latMin" value={form.latMin} onChange={handleChange} />
              <select name="latDir" value={form.latDir} onChange={handleChange} className="bg-slate-900 border border-slate-700 rounded-lg text-slate-100 px-2 outline-none">
                <option value="N">N</option>
                <option value="S">S</option>
              </select>
            </div>
          </div>

          <div>
            <Label>{t('calc.dr_lon')}</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input type="number" placeholder="Deg °" name="lonDeg" value={form.lonDeg} onChange={handleChange} />
              <Input type="number" step="0.1" placeholder="Min '" name="lonMin" value={form.lonMin} onChange={handleChange} />
              <select name="lonDir" value={form.lonDir} onChange={handleChange} className="bg-slate-900 border border-slate-700 rounded-lg text-slate-100 px-2 outline-none">
                <option value="E">E</option>
                <option value="W">W</option>
              </select>
            </div>
          </div>

          <Button onClick={compute} className="from-indigo-600 to-purple-600">{t('calc.calc_btn')}</Button>
        </div>
      </Card>

      {result && (
        <Card className="border border-purple-500/30">
          <h3 className="text-xl font-bold text-purple-400 mb-4">{t('calc.results')}</h3>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div className="text-slate-400">{t('calc.gha')}</div>
            <div className="font-mono text-right text-slate-200">{result.gha}</div>
            
            <div className="text-slate-400">{t('calc.dec')}</div>
            <div className="font-mono text-right text-slate-200">{result.dec}</div>
            
            <div className="text-slate-400">{t('calc.ho')}</div>
            <div className="font-mono text-right text-slate-200">{result.ho}</div>
            
            <div className="text-slate-400">{t('calc.hc')}</div>
            <div className="font-mono text-right text-slate-200">{result.hc}</div>
            
            <div className="text-slate-400">{t('calc.intercept')}</div>
            <div className="font-mono text-right font-bold text-purple-300">{result.intercept}</div>
            
            <div className="text-slate-400">{t('calc.azimuth')}</div>
            <div className="font-mono text-right font-bold text-purple-300">{result.zn}</div>
          </div>
        </Card>
      )}
    </div>
  );
}
