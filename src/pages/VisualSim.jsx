import React, { useState, useEffect } from 'react';
import { Card, Button } from '../components/ui';
import { useTranslation } from 'react-i18next';

export default function VisualSim() {
  const { t } = useTranslation();
  const [sliderVal, setSliderVal] = useState(0); // 0 to 100
  const [targetVal, setTargetVal] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Generate a random sun height target between 10% and 90%
    setTargetVal(10 + Math.random() * 80);
    setSliderVal(0);
    setIsDone(false);
  }, []);

  const distance = Math.abs(sliderVal - targetVal);
  const perfect = distance < 0.5;

  const checkReading = () => {
    if (perfect) {
      alert(t('sim.msg_perfect'));
      setTargetVal(10 + Math.random() * 80);
      setIsDone(false);
    } else {
      const msg = sliderVal > targetVal ? t('sim.msg_low') : t('sim.msg_high');
      alert(msg);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
        {t('sim.vis_title')}
      </h2>
      <Card>
        <p className="text-sm text-slate-300 mb-4">
          {t('sim.vis_subtitle')}
        </p>
        
        {/* Viewport circle */}
        <div className="relative w-64 h-64 mx-auto rounded-full border-4 border-slate-700 bg-sky-900 overflow-hidden shadow-inner mb-6">
          {/* Horizon Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1/2 bg-blue-900/80 border-t-2 border-slate-400 z-10" />
          
          {/* The Sun (moves down as slider goes UP) */}
          <div 
            className="absolute w-12 h-12 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,1)] z-20 transition-all duration-75"
            style={{ 
              left: 'calc(50% - 24px)', 
              // at slider=0 (Hs=0), the sun is way up (targetVal represents the literal offset required)
              // targetVal is the slider value needed to bring bottom of sun to 50% height.
              // bottom of wrapper is 50%. Top of wrapper = 0%, etc.
              top: `calc(${50 - targetVal + sliderVal}% - 48px)`
            }}
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-400 text-center">
            {t('sim.drum_adj')}
          </label>
          <input 
            type="range" 
            min="0" max="100" step="0.1"
            value={sliderVal}
            onChange={(e) => setSliderVal(parseFloat(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>0°</span>
            <span>{t('sim.approx')} {(sliderVal * 0.8).toFixed(1)}°</span>
          </div>
          
          <Button onClick={checkReading}>{t('sim.mark')}</Button>
        </div>
      </Card>
    </div>
  );
}
