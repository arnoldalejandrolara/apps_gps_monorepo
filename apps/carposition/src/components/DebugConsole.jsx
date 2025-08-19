import React, { useState, useEffect } from 'react'

const DebugConsole = ({ isVisible = false }) => {
  const [logs, setLogs] = useState([])
  const [isOpen, setIsOpen] = useState(isVisible)

  useEffect(() => {
    // Interceptar console.log para iOS Safari
    const originalLog = console.log
    const originalError = console.error
    const originalWarn = console.warn

    console.log = (...args) => {
      originalLog(...args)
      addLog('log', ...args)
    }

    console.error = (...args) => {
      originalError(...args)
      addLog('error', ...args)
    }

    console.warn = (...args) => {
      originalWarn(...args)
      addLog('warn', ...args)
    }

    return () => {
      console.log = originalLog
      console.error = originalError
      console.warn = originalWarn
    }
  }, [])

  const addLog = (type, ...args) => {
    const logEntry = {
      id: Date.now(),
      type,
      message: args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '),
      timestamp: new Date().toLocaleTimeString()
    }

    setLogs(prev => [logEntry, ...prev.slice(0, 49)]) // Mantener solo los últimos 50 logs
  }

  const clearLogs = () => {
    setLogs([])
  }

  const exportLogs = () => {
    const logText = logs.map(log => 
      `[${log.timestamp}] ${log.type.toUpperCase()}: ${log.message}`
    ).join('\n')
    
    // Crear archivo de descarga
    const blob = new Blob([logText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `debug-logs-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg z-50"
        title="Abrir consola de debug"
      >
        🐛
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-black text-green-400 p-4 rounded-lg shadow-lg z-50 font-mono text-xs overflow-hidden">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white font-bold">Debug Console</h3>
        <div className="space-x-2">
          <button
            onClick={clearLogs}
            className="bg-red-600 text-white px-2 py-1 rounded text-xs"
          >
            Limpiar
          </button>
          <button
            onClick={exportLogs}
            className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
          >
            Exportar
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="bg-gray-600 text-white px-2 py-1 rounded text-xs"
          >
            ✕
          </button>
        </div>
      </div>
      
      <div className="h-full overflow-y-auto bg-gray-900 p-2 rounded">
        {logs.length === 0 ? (
          <div className="text-gray-500">No hay logs...</div>
        ) : (
          logs.map(log => (
            <div key={log.id} className="mb-1">
              <span className="text-gray-500">[{log.timestamp}]</span>
              <span className={`ml-2 ${
                log.type === 'error' ? 'text-red-400' :
                log.type === 'warn' ? 'text-yellow-400' :
                'text-green-400'
              }`}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DebugConsole 