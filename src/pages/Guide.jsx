import React from 'react';
import { Card } from '../components/ui';
import { useTranslation } from 'react-i18next';

export default function Guide() {
  const { t } = useTranslation();
  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
        {t('guide.title')}
      </h2>

      <Card>
        <h3 className="text-xl font-bold text-white mb-2">{t('guide.step1_title')}</h3>
        <ul className="list-disc pl-5 text-sm text-slate-300 space-y-2">
          <li>{t('guide.step1_1')}</li>
          <li>{t('guide.step1_2')}</li>
          <li>{t('guide.step1_3')}</li>
        </ul>
      </Card>

      <Card>
        <h3 className="text-xl font-bold text-white mb-2">{t('guide.step2_title')}</h3>
        <ul className="list-decimal pl-5 text-sm text-slate-300 space-y-2">
          <li>{t('guide.step2_1')}</li>
          <li>{t('guide.step2_2')}</li>
          <li>{t('guide.step2_3')}</li>
          <li>{t('guide.step2_4')}</li>
          <li>{t('guide.step2_5')}</li>
        </ul>
      </Card>

      <Card>
        <h3 className="text-xl font-bold text-white mb-2">{t('guide.step3_title')}</h3>
        <ul className="list-decimal pl-5 text-sm text-slate-300 space-y-2">
          <li>{t('guide.step3_1')}</li>
          <li>{t('guide.step3_2')}</li>
          <li>{t('guide.step3_3')}</li>
          <li>{t('guide.step3_4')}</li>
          <li>{t('guide.step3_5')}</li>
        </ul>
      </Card>
      
      <Card>
        <h3 className="text-xl font-bold text-white mb-2">{t('guide.step4_title')}</h3>
        <p className="text-sm text-slate-300">
          {t('guide.step4_1')} <br/><br/>
          {t('guide.step4_2')} <br/>
          {t('guide.step4_3')}
        </p>
      </Card>
    </div>
  );
}
