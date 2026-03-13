import React, { useState } from 'react';
import { Card, Label, Input, Button } from '../components/ui';
import { useTranslation } from 'react-i18next';
import { getAstroData } from '../core/astro';
import { calculateDip, calculateSunHo, parseHs, formatAngle } from '../core/reductions';

export default function MeridianCalc() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '12:00:00',
    hsDeg: '',
    hsMin: '',
    ieMin: '0',
    eyeHeight: '2',
    passDir: 'South'
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const compute = () => {
    try {
      const utcDate = new Date(`${form.date}T${form.time}Z`);
      const { dec, sd } = getAstroData('sun', utcDate);
      
      const hsDecimal = parseHs(form.hsDeg, form.hsMin);
      const ie = parseFloat(form.ieMin) || 0;
      const eyeMeters = parseFloat(form.eyeHeight) || 0;
      
      const dipMin = calculateDip(eyeMeters);
      const ho = calculateSunHo(hsDecimal, ie, dipMin, sd, true);

      const zd = 90 - ho;
      
      let lat = 0;
      if (form.passDir === 'South') {
        lat = dec + zd;
      } else {
        lat = dec - zd;
      }

      setResult({
        ho: formatAngle(ho),
        dec: formatAngle(dec),
        zd: formatAngle(zd),
        lat: formatAngle(lat)
      });
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">
        {t('nav.meridian')} Calc
      </h2>

      <Card>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t('calc.date')}</Label>
              <Input type="date" name="date" value={form.date} onChange={handleChange} />
            </div>
            <div>
              <Label>{t('calc.time_max')}</Label>
              <Input type="time" step="1" name="time" value={form.time} onChange={handleChange} />
            </div>
          </div>

          <div>
            <Label>{t('calc.hs_max')}</Label>
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
            <Label>{t('calc.pass_dir')}</Label>
            <select name="passDir" value={form.passDir} onChange={handleChange} className="block w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-slate-100">
              <option value="South">{t('calc.pass_s')}</option>
              <option value="North">{t('calc.pass_n')}</option>
            </select>
          </div>

          <Button onClick={compute}>{t('calc.calc_lat')}</Button>
        </div>
      </Card>

      {result && (
        <Card className="border border-red-500/30">
          <h3 className="text-xl font-bold text-red-400 mb-4">{t('calc.results')}</h3>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div className="text-slate-400">{t('calc.dec')}</div>
            <div className="font-mono text-right text-slate-200">{result.dec}</div>
            
            <div className="text-slate-400">{t('calc.ho')}</div>
            <div className="font-mono text-right text-slate-200">{result.ho}</div>
            
            <div className="text-slate-400">{t('calc.zd')}</div>
            <div className="font-mono text-right text-slate-200">{result.zd}</div>
            
            <div className="text-slate-400 text-lg">{t('calc.lat')}</div>
            <div className="font-mono text-right font-bold text-red-400 text-lg">{result.lat}</div>
          </div>
        </Card>
      )}
    </div>
  );
}
