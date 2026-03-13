import React from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useTranslation } from 'react-i18next'

function ReloadPrompt() {
  const { t } = useTranslation()
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  if (!offlineReady && !needRefresh) return null

  return (
    <div className="fixed bottom-0 right-0 m-4 p-4 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 text-slate-200">
      <div className="mb-4">
        {offlineReady
          ? <span>{t('app.offline_ready') || 'App ready to work offline'}</span>
          : <span>{t('app.new_content') || 'New content available, click on reload button to update.'}</span>}
      </div>
      <div className="flex gap-2">
        {needRefresh && (
          <button 
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium" 
            onClick={() => updateServiceWorker(true)}
          >
            {t('app.reload') || 'Reload'}
          </button>
        )}
        <button 
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded font-medium" 
          onClick={() => close()}
        >
          {t('app.close') || 'Close'}
        </button>
      </div>
    </div>
  )
}

export default ReloadPrompt
