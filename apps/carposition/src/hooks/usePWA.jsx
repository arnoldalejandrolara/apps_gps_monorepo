import { useState, useEffect } from 'react'
import { registerSW } from 'virtual:pwa-register'

export const usePWA = () => {
  const [needRefresh, setNeedRefresh] = useState(false)
  const [offlineReady, setOfflineReady] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  const updateSW = registerSW({
    onNeedRefresh() {
      setNeedRefresh(true)
    },
    onOfflineReady() {
      setOfflineReady(true)
    },
  })

  useEffect(() => {
    // Verificar si la app está instalada
    const checkIfInstalled = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
      }
    }

    checkIfInstalled()
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkIfInstalled)

    return () => {
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', checkIfInstalled)
    }
  }, [])

  const closePrompt = () => {
    setNeedRefresh(false)
    setOfflineReady(false)
  }

  const updateApp = () => {
    updateSW()
    closePrompt()
  }

  return {
    needRefresh,
    offlineReady,
    isInstalled,
    closePrompt,
    updateApp
  }
} 