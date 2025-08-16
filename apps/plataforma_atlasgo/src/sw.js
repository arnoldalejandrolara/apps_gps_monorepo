// Service Worker para PWA con manejo completo de push notifications
// Versión: 2024-01-15-v7-IMPROVED-CACHE
import {precacheAndRoute} from 'workbox-precaching';
precacheAndRoute(self.__WB_MANIFEST);

const CACHE_NAME = 'car-platform-v1'
const STATIC_CACHE = 'car-platform-static-v1'
const DYNAMIC_CACHE = 'car-platform-dynamic-v1'

const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  '/pwa-192x192.png',
  '/pwa-512x512.png'
]

// Configuración de estrategias de cache
const CACHE_STRATEGIES = {
  // Recursos estáticos (CSS, JS, imágenes) - Cache First
  static: {
    cacheName: STATIC_CACHE,
    maxEntries: 50,
    maxAgeSeconds: 30 * 24 * 60 * 60 // 30 días
  },
  // HTML - Network First con fallback a cache
  html: {
    cacheName: DYNAMIC_CACHE,
    maxEntries: 10,
    maxAgeSeconds: 24 * 60 * 60 // 1 día
  },
  // API calls - Network First con cache corto
  api: {
    cacheName: DYNAMIC_CACHE,
    maxEntries: 20,
    maxAgeSeconds: 5 * 60 // 5 minutos
  }
}

// Detectar plataforma (solo para logs, no usar window)
const isIOSSafari = () => {
  // No se puede detectar userAgent en SW, solo dejar como false
  return false
}

// Función para determinar el tipo de recurso
function getResourceType(request) {
  const url = new URL(request.url)
  
  // API calls
  if (url.pathname.startsWith('/api/') || url.pathname.includes('core')) {
    return 'api'
  }
  
  // HTML
  if (request.destination === 'document' || url.pathname.endsWith('.html')) {
    return 'html'
  }
  
  // Estáticos (CSS, JS, imágenes, etc.)
  return 'static'
}

// Función para limpiar cache antiguo
async function cleanOldCaches() {
  const cacheNames = await caches.keys()
  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, CACHE_NAME]
  
  return Promise.all(
    cacheNames.map(cacheName => {
      if (!currentCaches.includes(cacheName)) {
        console.log('🗑️ Eliminando cache antiguo:', cacheName)
        return caches.delete(cacheName)
      }
    })
  )
}

// Función para limpiar entradas expiradas
async function cleanExpiredEntries(cacheName, maxAgeSeconds) {
  const cache = await caches.open(cacheName)
  const requests = await cache.keys()
  const now = Date.now()
  
  const expiredRequests = requests.filter(async (request) => {
    const response = await cache.match(request)
    if (!response) return true
    
    const dateHeader = response.headers.get('date')
    if (!dateHeader) return false
    
    const responseDate = new Date(dateHeader).getTime()
    return (now - responseDate) > (maxAgeSeconds * 1000)
  })
  
  return Promise.all(expiredRequests.map(request => cache.delete(request)))
}

console.log('🔥 SW MEJORADO CARGADO - ' + new Date().toISOString())
console.log('🔒 Contexto seguro:', self.isSecureContext)
console.log('🌐 Location:', self.location.href)
console.log('📱 iOS Safari:', isIOSSafari())

// Verificar si estamos en un contexto seguro
if (!self.isSecureContext) {
  console.error('❌ ERROR: Service Worker requiere contexto seguro (HTTPS o localhost)')
  console.error('❌ Protocolo actual:', self.location.protocol)
  console.error('❌ Host actual:', self.location.host)
}

// Evento de instalación
self.addEventListener('install', function(event) {
  console.log('🔥 SW MEJORADO INSTALANDO - ' + new Date().toISOString())
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE),
      caches.open(DYNAMIC_CACHE),
      caches.open(CACHE_NAME)
    ]).then(([staticCache, dynamicCache, mainCache]) => {
      console.log('📦 Caches abiertos:', [STATIC_CACHE, DYNAMIC_CACHE, CACHE_NAME])
      return mainCache.addAll(urlsToCache)
    }).then(() => {
      console.log('🔥 SW MEJORADO INSTALADO - ' + new Date().toISOString())
      return self.skipWaiting()
    }).catch((error) => {
      console.error('❌ Error en instalación:', error)
    })
  )
})

// Evento de activación
self.addEventListener('activate', function(event) {
  console.log('🔥 SW MEJORADO ACTIVANDO - ' + new Date().toISOString())
  
  event.waitUntil(
    cleanOldCaches()
      .then(() => {
        console.log('🔥 SW MEJORADO ACTIVADO - ' + new Date().toISOString())
        return self.clients.claim()
      }).then(() => {
        console.log('🔥 SW MEJORADO CLIENTES RECLAMADOS - ' + new Date().toISOString())
      }).catch((error) => {
        console.error('❌ Error en activación:', error)
      })
  )
})

// Interceptar peticiones fetch con estrategias mejoradas
self.addEventListener('fetch', function(event) {
  // Solo cachear peticiones GET
  if (event.request.method !== 'GET') {
    return
  }

  const resourceType = getResourceType(event.request)
  const strategy = CACHE_STRATEGIES[resourceType]
  
  console.log(`📦 Estrategia para ${event.request.url}: ${resourceType}`)

  event.respondWith(
    handleRequest(event.request, resourceType, strategy)
  )
})

// Función principal para manejar requests
async function handleRequest(request, resourceType, strategy) {
  try {
    switch (resourceType) {
      case 'static':
        return await cacheFirst(request, strategy)
      case 'html':
        return await networkFirst(request, strategy)
      case 'api':
        return await networkFirst(request, strategy)
      default:
        return await networkFirst(request, strategy)
    }
  } catch (error) {
    console.error('❌ Error en handleRequest:', error)
    return await fallbackResponse(request)
  }
}

// Estrategia Cache First para recursos estáticos
async function cacheFirst(request, strategy) {
  const cache = await caches.open(strategy.cacheName)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    console.log('📦 Cache First - desde cache:', request.url)
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone()
      cache.put(request, responseToCache)
      console.log('📦 Cache First - agregado a cache:', request.url)
    }
    return networkResponse
  } catch (error) {
    console.error('❌ Error en Cache First:', error)
    throw error
  }
}

// Estrategia Network First para HTML y API
async function networkFirst(request, strategy) {
  const cache = await caches.open(strategy.cacheName)
  
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone()
      cache.put(request, responseToCache)
      console.log('📦 Network First - actualizado cache:', request.url)
    }
    return networkResponse
  } catch (error) {
    console.log('📦 Network First - fallback a cache:', request.url)
    const cachedResponse = await cache.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    throw error
  }
}

// Fallback cuando todo falla
async function fallbackResponse(request) {
  console.log('📦 Fallback para:', request.url)
  
  // Si es una página, mostrar página offline
  if (request.destination === 'document') {
    const offlineResponse = await caches.match('/index.html')
    if (offlineResponse) {
      return offlineResponse
    }
  }
  
  // Para otros recursos, retornar respuesta vacía
  return new Response('', {
    status: 404,
    statusText: 'Not Found'
  })
}

// Manejar notificaciones push
self.addEventListener('push', function(event) {
  console.log('📱 Push event recibido:', event)
  console.log('📱 Datos push:', event.data ? event.data.text() : 'Sin datos')
  
  let notificationData = {
    title: 'Plataforma Car',
    body: 'Nueva notificación',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    tag: 'default',
    requireInteraction: false,
    silent: false,
    vibrate: [200, 100, 200],
    data: {
      url: '/',
      timestamp: new Date().toISOString(),
      source: 'push'
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir',
        icon: '/pwa-192x192.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/pwa-192x192.png'
      }
    ]
  }

  // Si hay datos en el evento push, usarlos
  if (event.data) {
    try {
      const data = event.data.json()
      console.log('📱 Datos push parseados:', data)
      notificationData = { ...notificationData, ...data }
      notificationData.body = data.notification.body;
      notificationData.title = data.notification.title;
    } catch (error) {
      console.log('📱 Datos push como texto:', event.data.text())
      notificationData.body = event.data.text()
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
      .then(() => {
        console.log('📱 Notificación push mostrada exitosamente')
        
        // Enviar mensaje a clientes
        return self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'PUSH_NOTIFICATION_SHOWN',
              data: notificationData
            })
          })
        })
      })
      .catch((error) => {
        console.error('❌ Error mostrando notificación push:', error)
      })
  )
})

// Manejar clics en notificaciones
self.addEventListener('notificationclick', function(event) {
  console.log('👆 Notificación clickeada:', event)
  console.log('👆 Acción:', event.action)
  console.log('👆 Datos:', event.notification.data)
  
  event.notification.close()

  const urlToOpen = event.notification.data?.url || '/'

  if (event.action === 'open') {
    // Abrir la aplicación
    event.waitUntil(
      clients.openWindow(urlToOpen)
        .then((windowClient) => {
          if (windowClient) {
            console.log('👆 Ventana abierta:', windowClient.url)
            return windowClient.focus()
          }
        })
        .catch((error) => {
          console.error('❌ Error abriendo ventana:', error)
        })
    )
  } else if (event.action === 'close') {
    // Solo cerrar la notificación
    console.log('👆 Notificación cerrada por usuario')
  } else {
    // Clic en la notificación principal
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Si ya hay una ventana abierta, enfocarla
        for (const client of clientList) {
          if (client.url.includes('/') && 'focus' in client) {
            console.log('👆 Enfocando ventana existente:', client.url)
            return client.focus()
          }
        }
        // Si no hay ventana abierta, abrir una nueva
        if (clients.openWindow) {
          console.log('👆 Abriendo nueva ventana:', urlToOpen)
          return clients.openWindow(urlToOpen)
        }
      })
    )
  }
})

// Manejar cierre de notificaciones
self.addEventListener('notificationclose', function(event) {
  console.log('❌ Notificación cerrada:', event)
  console.log('❌ Datos de notificación cerrada:', event.notification.data)
})

// Manejar mensajes del cliente
self.addEventListener('message', function(event) {
  console.log('💬 Mensaje recibido en SW:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('⏭️ Saltando espera...')
    self.skipWaiting()
  }
  
  // Manejar notificaciones locales (especialmente para iOS Safari)
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    console.log('📱 SHOW_NOTIFICATION recibido:', event.data)
    const { title, options } = event.data
    
    const notificationData = {
      title: title || 'Plataforma Car',
      body: options.body || 'Nueva notificación',
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: options.tag || 'local-notification',
      requireInteraction: false,
      silent: false,
      vibrate: [200, 100, 200],
      data: {
        url: '/',
        timestamp: new Date().toISOString(),
        source: 'local',
        ...options.data
      },
      ...options
    }

    console.log('📱 Mostrando notificación local con datos:', notificationData)

    event.waitUntil(
      self.registration.showNotification(notificationData.title, notificationData)
        .then(() => {
          console.log('📱 Notificación local mostrada exitosamente')
          
          // Enviar confirmación a clientes
          return self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              client.postMessage({
                type: 'LOCAL_NOTIFICATION_SHOWN',
                data: notificationData
              })
            })
          })
        })
        .catch((error) => {
          console.error('❌ Error mostrando notificación local:', error)
          
          // Enviar error a clientes
          return self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              client.postMessage({
                type: 'NOTIFICATION_ERROR',
                error: error.message
              })
            })
          })
        })
    )
  }

  // Manejar solicitud de estado del SW
  if (event.data && event.data.type === 'GET_SW_STATUS') {
    console.log('📊 Enviando estado del SW')
    event.ports[0].postMessage({
      type: 'SW_STATUS',
      isSecureContext: self.isSecureContext,
      platform: isIOSSafari() ? 'ios-safari' : 'standard',
      timestamp: new Date().toISOString()
    })
  }

  // Limpiar cache expirado periódicamente
  if (event.data && event.data.type === 'CLEAN_CACHE') {
    console.log('🧹 Limpiando cache expirado...')
    event.waitUntil(
      Promise.all([
        cleanExpiredEntries(STATIC_CACHE, CACHE_STRATEGIES.static.maxAgeSeconds),
        cleanExpiredEntries(DYNAMIC_CACHE, CACHE_STRATEGIES.html.maxAgeSeconds)
      ]).then(() => {
        console.log('🧹 Cache limpiado exitosamente')
      }).catch((error) => {
        console.error('❌ Error limpiando cache:', error)
      })
    )
  }
})

// Función para mostrar notificaciones locales (útil para iOS Safari)
self.showLocalNotification = function(title, options = {}) {
  const notificationData = {
    title: title || 'Plataforma Car',
    body: options.body || 'Nueva notificación',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    tag: options.tag || 'local-notification',
    requireInteraction: false,
    silent: false,
    vibrate: [200, 100, 200],
    data: {
      url: '/',
      timestamp: new Date().toISOString(),
      source: 'local',
      ...options.data
    },
    ...options
  }

  return self.registration.showNotification(notificationData.title, notificationData)
}

// Mensaje inicial
self.clients.matchAll().then(function(clients) {
  clients.forEach(function(client) {
    client.postMessage({
      type: 'SW_READY',
      message: '🔥 SW MEJORADO INICIALIZADO - ' + new Date().toISOString(),
      platform: isIOSSafari() ? 'ios-safari' : 'standard',
      isSecureContext: self.isSecureContext
    })
  })
}).catch(function(error) {
  console.error('❌ Error enviando mensaje inicial:', error)
}) 