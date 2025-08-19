import { usePWA } from '../hooks/usePWA'
import { CheckCircle, RefreshCw, X } from 'lucide-react'

export const PWAPrompt = () => {
  const { needRefresh, offlineReady, closePrompt, updateApp } = usePWA()

  if (!needRefresh && !offlineReady) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      {offlineReady && (
        <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle size={20} />
            <span>App lista para uso offline</span>
          </div>
          <button
            onClick={closePrompt}
            className="ml-2 p-1 hover:bg-green-600 rounded"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {needRefresh && (
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw size={20} />
            <span>Nueva versión disponible</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={updateApp}
              className="px-3 py-1 bg-white text-blue-500 rounded hover:bg-gray-100 text-sm font-medium"
            >
              Actualizar
            </button>
            <button
              onClick={closePrompt}
              className="p-1 hover:bg-blue-600 rounded"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 