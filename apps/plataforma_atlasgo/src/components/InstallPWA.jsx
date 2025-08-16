import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'

export const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false)
  const [promptInstall, setPromptInstall] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setPromptInstall(e)
      setSupportsPWA(true)
    }

    // Verificar si la app ya está instalada
    const checkIfInstalled = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
      }
    }

    checkIfInstalled()
    window.addEventListener('beforeinstallprompt', handler)
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkIfInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', checkIfInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!promptInstall) {
      return
    }
    promptInstall.prompt()
    const { outcome } = await promptInstall.userChoice
    if (outcome === 'accepted') {
      console.log('Usuario aceptó la instalación')
    } else {
      console.log('Usuario rechazó la instalación')
    }
    setPromptInstall(null)
    setSupportsPWA(false)
  }

  if (!supportsPWA || isInstalled) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={handleInstallClick}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
      >
        <Download size={16} />
        <span>Instalar App</span>
      </button>
    </div>
  )
} 