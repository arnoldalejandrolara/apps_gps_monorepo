// Service Worker para PWA con notificaciones push
const CACHE_NAME = 'car-platform-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx'
]

// Detectar si es iOS Safari
const isIOSSafari = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && 
         /Safari/.test(navigator.userAgent) && 
         !/Chrome/.test(navigator.userAgent)
}

// Instalación del service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker instalándose...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto')
        return cache.addAll(urlsToCache)
      })
      .then(() => {
        console.log('Service Worker instalado correctamente')
        // Forzar activación inmediata
        return self.skipWaiting()
      })
  )
})

// Activación del service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activándose...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('Service Worker activado correctamente')
      // Tomar control de todas las páginas abiertas
      return self.clients.claim()
    })
  )
})

// Interceptar peticiones fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retorna la respuesta del cache si existe, sino hace la petición a la red
        return response || fetch(event.request)
      })
  )
})

// Manejar notificaciones push (solo para navegadores que soportan Push API)
if ('PushManager' in self) {
  self.addEventListener('push', (event) => {
    console.log('Push event recibido:', event)
    
    let notificationData = {
      title: 'Plataforma Car',
      body: 'Nueva notificación',
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: 'default',
      requireInteraction: false,
      data: {
        url: '/',
        timestamp: new Date().toISOString()
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
        notificationData = { ...notificationData, ...data }
      } catch (error) {
        console.log('Datos push recibidos como texto:', event.data.text())
        notificationData.body = event.data.text()
      }
    }

    event.waitUntil(
      self.registration.showNotification(notificationData.title, notificationData)
    )
  })
} else {
  console.log('Push API no soportada en este navegador')
}

// Manejar clics en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('Notificación clickeada:', event)
  
  event.notification.close()

  if (event.action === 'open') {
    // Abrir la aplicación
    event.waitUntil(
      clients.openWindow('/')
    )
  } else if (event.action === 'close') {
    // Solo cerrar la notificación
    event.notification.close()
  } else {
    // Clic en la notificación principal
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Si ya hay una ventana abierta, enfocarla
        for (const client of clientList) {
          if (client.url.includes('/') && 'focus' in client) {
            return client.focus()
          }
        }
        // Si no hay ventana abierta, abrir una nueva
        if (clients.openWindow) {
          return clients.openWindow('/')
        }
      })
    )
  }
})

// Manejar cierre de notificaciones
self.addEventListener('notificationclose', (event) => {
  console.log('Notificación cerrada:', event)
})

// Manejar mensajes del cliente
self.addEventListener('message', (event) => {
  console.log('Mensaje recibido en SW:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  // Manejar notificaciones locales para iOS Safari
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    console.log('SHOW_NOTIFICATION recibido:', event.data)
    const { title, options } = event.data
    
    const notificationData = {
      title: title || 'Plataforma Car',
      body: options.body || 'Nueva notificación',
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: options.tag || 'local-notification',
      requireInteraction: false,
      data: {
        url: '/',
        timestamp: new Date().toISOString(),
        ...options.data
      },
      ...options
    }

    console.log('Mostrando notificación con datos:', notificationData)

    event.waitUntil(
      self.registration.showNotification(notificationData.title, notificationData)
        .then(() => {
          console.log('Notificación mostrada exitosamente')
        })
        .catch((error) => {
          console.error('Error mostrando notificación:', error)
        })
    )
  }
})

// Función para mostrar notificaciones locales (útil para iOS Safari)
self.showLocalNotification = (title, options = {}) => {
  const notificationData = {
    title: title || 'Plataforma Car',
    body: options.body || 'Nueva notificación',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    tag: options.tag || 'local-notification',
    requireInteraction: false,
    data: {
      url: '/',
      timestamp: new Date().toISOString(),
      ...options.data
    },
    ...options
  }

  return self.registration.showNotification(notificationData.title, notificationData)
} 