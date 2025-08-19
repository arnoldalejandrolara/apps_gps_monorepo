import React from 'react'
import { useNotifications } from '../hooks/useNotifications'
import DebugConsole from './DebugConsole'

const NotificationTest = ({ serverUrl = import.meta.env.VITE_API_URL_ONLY }) => {
  const {
    isSupported,
    permission,
    platform,
    isPWA,
    isWebSocketConnected,
    pendingNotifications,
    requestPermission,
    subscribeToNotifications,
    sendTestNotification,
    showLocalNotification,
    clearPendingNotifications,
    testServiceWorkerConnection,
    forceServiceWorkerUpdate
  } = useNotifications()

  const handleRequestPermission = async () => {
    const granted = await requestPermission()
    if (granted) {
      console.log('Permisos otorgados')
    } else {
      console.log('Permisos denegados')
    }
  }

  const handleSubscribe = async () => {
    const subscription = await subscribeToNotifications(serverUrl)
    if (subscription) {
      console.log('Suscripción exitosa:', subscription)
    }
  }

  const handleTestNotification = async () => {
    if (platform === 'ios-safari') {
      // Para iOS Safari, mostrar notificación local
      showLocalNotification('Prueba iOS', {
        body: 'Esta es una notificación de prueba para iOS Safari',
        tag: 'test-notification'
      })
    } else {
      // Para otros navegadores, enviar notificación de prueba al servidor
      await sendTestNotification(serverUrl)
    }
  }

  const handleTestServiceWorker = async () => {
    console.log('Probando conexión con Service Worker...')
    const success = await testServiceWorkerConnection()
    if (success) {
      console.log('✅ Service Worker conectado correctamente')
    } else {
      console.log('❌ Error conectando con Service Worker')
    }
  }

  const handleForceServiceWorkerUpdate = async () => {
    console.log('Forzando actualización del Service Worker...')
    const success = await forceServiceWorkerUpdate()
    if (success) {
      console.log('✅ Service Worker actualizado correctamente')
    } else {
      console.log('❌ Error actualizando Service Worker')
    }
  }

  const handleClearServiceWorkerCache = async () => {
    console.log('🧹 Limpiando cache del Service Worker...')
    
    try {
      // Desregistrar Service Worker
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        await registration.unregister()
        console.log('✅ Service Worker desregistrado')
      }
      
      // Limpiar cache del navegador
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        console.log('📋 Caches encontrados:', cacheNames)
        
        for (const cacheName of cacheNames) {
          await caches.delete(cacheName)
          console.log('🗑️ Cache eliminado:', cacheName)
        }
      }
      
      // Recargar la página para forzar reinstalación
      console.log('🔄 Recargando página...')
      window.location.reload()
      
    } catch (error) {
      console.error('❌ Error limpiando cache:', error)
    }
  }

  const handleTestIOSConditions = () => {
    console.log('=== DIAGNÓSTICO iOS SAFARI ===')
    console.log('Plataforma:', platform)
    console.log('Permisos:', permission)
    console.log('PWA instalada:', isPWA)
    console.log('WebSocket conectado:', isWebSocketConnected)
    console.log('App activa (document.hidden):', !document.hidden)
    console.log('Navegador standalone:', window.navigator.standalone)
    console.log('Display mode standalone:', window.matchMedia('(display-mode: standalone)').matches)
    console.log('Service Worker disponible:', 'serviceWorker' in navigator)
    console.log('Service Worker controller:', navigator.serviceWorker?.controller)
    console.log('Notification API disponible:', 'Notification' in window)
    console.log('Notificaciones pendientes:', pendingNotifications.length)
    console.log('================================')
  }

  const handleCheckServiceWorkerStatus = async () => {
    console.log('=== ESTADO DETALLADO DEL SERVICE WORKER ===')
    
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration()
        console.log('Registro del Service Worker:', registration)
        
        if (registration) {
          console.log('Scope:', registration.scope)
          console.log('Update via cache:', registration.updateViaCache)
          console.log('Active SW:', registration.active)
          console.log('Waiting SW:', registration.waiting)
          console.log('Installing SW:', registration.installing)
          
          if (registration.active) {
            console.log('Estado del SW activo:', registration.active.state)
            console.log('Script URL del SW activo:', registration.active.scriptURL)
          }
          
          if (registration.waiting) {
            console.log('Estado del SW esperando:', registration.waiting.state)
            console.log('Script URL del SW esperando:', registration.waiting.scriptURL)
          }
          
          if (registration.installing) {
            console.log('Estado del SW instalando:', registration.installing.state)
            console.log('Script URL del SW instalando:', registration.installing.scriptURL)
          }
        } else {
          console.log('No hay registro de Service Worker')
        }
        
        // Verificar si hay un controller
        console.log('Controller actual:', navigator.serviceWorker.controller)
        if (navigator.serviceWorker.controller) {
          console.log('Controller script URL:', navigator.serviceWorker.controller.scriptURL)
          console.log('Controller state:', navigator.serviceWorker.controller.state)
        }
        
      } catch (error) {
        console.error('Error verificando Service Worker:', error)
      }
    } else {
      console.log('Service Worker no soportado')
    }
    
    console.log('==========================================')
  }

  const handleCheckSecurityStatus = () => {
    console.log('=== ESTADO DE SEGURIDAD ===')
    console.log('Protocolo:', window.location.protocol)
    console.log('Host:', window.location.host)
    console.log('URL completa:', window.location.href)
    console.log('Es HTTPS:', window.location.protocol === 'https:')
    console.log('Es localhost:', window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    console.log('Es desarrollo:', window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1'))
    
    // Verificar certificado
    if (window.location.protocol === 'https:') {
      console.log('✅ HTTPS detectado')
      
      // Intentar verificar el certificado
      fetch('/')
        .then(response => {
          console.log('✅ Certificado válido - fetch exitoso')
          console.log('Status:', response.status)
          console.log('Headers:', response.headers)
        })
        .catch(error => {
          console.error('❌ Error con certificado:', error)
          console.log('Detalles del error:', error.message)
        })
    } else {
      console.log('❌ No es HTTPS - Service Workers requieren HTTPS')
    }
    
    // Verificar si estamos en un contexto seguro
    console.log('Contexto seguro:', window.isSecureContext)
    console.log('Service Worker disponible:', 'serviceWorker' in navigator)
    console.log('PushManager disponible:', 'PushManager' in window)
    
    console.log('==========================')
  }

  return (
    <>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Prueba de Notificaciones</h3>
        
        <div className="space-y-4">
          <div className="text-sm">
            <p><strong>Plataforma:</strong> {platform}</p>
            <p><strong>Soportado:</strong> {isSupported ? 'Sí' : 'No'}</p>
            <p><strong>Permisos:</strong> {permission}</p>
            <p><strong>PWA Instalada:</strong> {isPWA ? 'Sí' : 'No'}</p>
            <p><strong>App Activa:</strong> {!document.hidden ? 'Sí' : 'No'}</p>
            {platform === 'ios-safari' && (
              <>
                <p><strong>WebSocket:</strong> {isWebSocketConnected ? 'Conectado' : 'Desconectado'}</p>
                <p><strong>Notificaciones Pendientes:</strong> {pendingNotifications.length}</p>
              </>
            )}
          </div>

          {platform === 'ios-safari' && !isPWA && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <p className="font-medium">⚠️ Importante para iOS Safari:</p>
              <p>Para recibir notificaciones en iOS Safari, la app debe estar instalada como PWA.</p>
              <p>Usa el botón "Instalar App" para agregar la app a tu pantalla de inicio.</p>
            </div>
          )}

          {platform === 'ios-safari' && isPWA && !isWebSocketConnected && (
            <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded">
              <p className="font-medium">ℹ️ WebSocket no conectado:</p>
              <p>El WebSocket se conectará automáticamente cuando el usuario esté autenticado.</p>
            </div>
          )}

          {platform === 'ios-safari' && isPWA && isWebSocketConnected && document.hidden && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p className="font-medium">⚠️ App no está activa:</p>
              <p>Las notificaciones locales en iOS Safari solo funcionan cuando la app está visible y activa.</p>
              <p>Trae la app al primer plano para recibir notificaciones.</p>
            </div>
          )}

          {platform === 'ios-safari' && pendingNotifications.length > 0 && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <p className="font-medium">📬 Notificaciones pendientes:</p>
              <p>Tienes {pendingNotifications.length} notificación(es) esperando.</p>
              <p>Trae la app al primer plano para verlas.</p>
              <button
                onClick={clearPendingNotifications}
                className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Limpiar pendientes
              </button>
            </div>
          )}

          {!isSupported && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>❌ Las notificaciones no están soportadas en este navegador.</p>
            </div>
          )}

          <div className="space-y-2">
            {platform === 'ios-safari' && (
              <>
                <button
                  onClick={handleTestIOSConditions}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  🔍 Diagnosticar iOS Safari
                </button>
                
                <button
                  onClick={handleCheckSecurityStatus}
                  className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  🔒 Verificar Seguridad
                </button>
                
                <button
                  onClick={handleCheckServiceWorkerStatus}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  🔍 Verificar Estado SW
                </button>
                
                <button
                  onClick={handleTestServiceWorker}
                  className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  🔧 Probar Service Worker
                </button>
                
                <button
                  onClick={handleForceServiceWorkerUpdate}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  🔄 Forzar Actualización SW
                </button>
                
                <button
                  onClick={handleClearServiceWorkerCache}
                  className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                  🧹 Limpiar Cache SW
                </button>
              </>
            )}

            {!isSupported ? (
              <button
                className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed"
                disabled
              >
                Notificaciones no soportadas
              </button>
            ) : permission === 'default' ? (
              <button
                onClick={handleRequestPermission}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Solicitar Permisos
              </button>
            ) : permission === 'granted' ? (
              <>
                <button
                  onClick={handleSubscribe}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  disabled={platform === 'ios-safari' && !isWebSocketConnected}
                >
                  {platform === 'ios-safari' && false ? 'Registrar para Notificaciones' : 'Suscribirse a Notificaciones'}
                </button>
                
                <button
                  onClick={handleTestNotification}
                  className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                  disabled={platform === 'ios-safari' && document.hidden}
                >
                  {platform === 'ios-safari' && false ? 'Mostrar Notificación Local' : 'Enviar Notificación de Prueba'}
                </button>
              </>
            ) : (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p>❌ Permisos denegados. No se pueden mostrar notificaciones.</p>
              </div>
            )}
          </div>

          {platform === 'ios-safari' && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
              <p className="font-medium">ℹ️ Información para iOS Safari:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Las notificaciones push no están disponibles</li>
                <li>Se usa el WebSocket existente para notificaciones en tiempo real</li>
                <li>Solo se pueden mostrar notificaciones locales cuando la app está activa</li>
                <li>La app debe estar instalada como PWA para mejor experiencia</li>
                <li>El backend debe enviar notificaciones con tipo 'push_notification'</li>
                <li>Las notificaciones se guardan en cola si la app no está activa</li>
                <li>Se muestran automáticamente cuando la app vuelve al primer plano</li>
                <li><strong>IMPORTANTE:</strong> Service Workers requieren HTTPS válido</li>
                <li>Certificados Let's Encrypt pueden tener problemas en iOS Safari</li>
                <li>Usa "Verificar Seguridad" para diagnosticar problemas de certificado</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Debug Console para iOS Safari */}
      <DebugConsole isVisible={platform === 'ios-safari'} />
    </>
  )
}

export default NotificationTest 