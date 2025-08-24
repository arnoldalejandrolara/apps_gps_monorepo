import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useWebSocket } from   '../context/WebSocketContext';
import { setPushEndpoint } from '@mi-monorepo/common/store/auth';
import { useDispatch } from 'react-redux';
import { subscribeToNotificationsRequest } from '@mi-monorepo/common/services';

// Detectar si es iOS Safari
const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

const isSafari = () => {
    return (
        /Safari/.test(navigator.userAgent) &&
        !/Chrome/.test(navigator.userAgent)
    );
};

const isIOSSafari = () => {
    return isIOS() && isSafari();
};

// Detectar si es PWA instalada
const isPWAInstalled = () => {
    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true
    );
};

export const useNotifications = () => {
    const [permission, setPermission] = useState('default');
    const [subscription, setSubscription] = useState(null);
    const [isSupported, setIsSupported] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [platform, setPlatform] = useState('unknown');
    const [isPWA, setIsPWA] = useState(false);
    const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
    const [pendingNotifications, setPendingNotifications] = useState([]);
    const [hasAttemptedAutoSubscribe, setHasAttemptedAutoSubscribe] =
        useState(false);
    const token = useSelector((state) => state.auth?.token);
    const dispatch = useDispatch();
    const { sendMessage, addMessageHandler, isConnected } = useWebSocket();
    const pushEndpoint = useSelector((state) => state.auth?.pushEndpoint);

    useEffect(() => {
        // Detectar plataforma
        const currentPlatform = isIOSSafari() ? 'ios-safari' : 'standard';
        setPlatform(currentPlatform);
        setIsPWA(isPWAInstalled());

        // Verificar soporte según plataforma
        if (currentPlatform === 'ios-safari' && false) {
            // iOS Safari: solo soporta notificaciones si es PWA instalada
            if (isPWAInstalled() && 'Notification' in window) {
                setIsSupported(true);
                setPermission(Notification.permission);
            } else {
                setIsSupported(false);
                console.log(
                    'iOS Safari requiere que la app esté instalada como PWA para notificaciones'
                );
            }
        } else {
            // Navegadores estándar: verificar Push API
            if (
                'Notification' in window &&
                'serviceWorker' in navigator &&
                'PushManager' in window
            ) {
                setIsSupported(true);
                setPermission(Notification.permission);
            } else {
                setIsSupported(false);
                console.log('Push API no soportada en este navegador');
            }
        }
    }, []);

    // Actualizar estado de conexión WebSocket
    useEffect(() => {
        setIsWebSocketConnected(isConnected);
    }, [isConnected]);

    // Escuchar logs del Service Worker
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            const handleServiceWorkerMessage = (event) => {
                console.log('📨 Mensaje recibido del SW:', event.data);

                if (event.data && event.data.type === 'SW_LOG') {
                    console.log(`[SW] ${event.data.message}`);
                } else if (
                    event.data &&
                    event.data.type === 'LOCAL_NOTIFICATION_SHOWN'
                ) {
                    console.log(
                        '✅ Notificación local mostrada exitosamente:',
                        event.data.data
                    );
                } else if (
                    event.data &&
                    event.data.type === 'NOTIFICATION_ERROR'
                ) {
                    console.error(
                        '❌ Error en notificación:',
                        event.data.error
                    );
                } else if (
                    event.data &&
                    event.data.type === 'PUSH_NOTIFICATION_SHOWN'
                ) {
                    console.log(
                        '📱 Notificación push mostrada:',
                        event.data.data
                    );
                } else if (event.data && event.data.type === 'SW_READY') {
                    console.log('🚀 Service Worker listo:', event.data);
                } else {
                    console.log('📨 Mensaje del SW no manejado:', event.data);
                }
            };

            navigator.serviceWorker.addEventListener(
                'message',
                handleServiceWorkerMessage
            );

            return () => {
                navigator.serviceWorker.removeEventListener(
                    'message',
                    handleServiceWorkerMessage
                );
            };
        }
    }, []);

    // Función específica para iOS Safari
    const showLocalNotification = useCallback(
        async (title, options = {}) => {
            console.log('Intentando mostrar notificación local:', {
                title,
                options,
                platform,
                permission,
            });

            if (
                platform === 'ios-safari' &&
                permission === 'granted' &&
                false
            ) {
                console.log('iOS Safari - Verificando condiciones...');

                // Verificar si la app está en primer plano
                const isAppActive = !document.hidden;
                console.log('App activa:', isAppActive);

                if (!isAppActive) {
                    console.log(
                        '⚠️ App no está activa - las notificaciones locales solo funcionan cuando la app está visible en iOS Safari'
                    );
                    return null;
                }

                try {
                    // ESPERAR a que el service worker esté listo
                    if ('serviceWorker' in navigator) {
                        console.log(
                            'Service Worker disponible, esperando que esté listo...'
                        );
                        await navigator.serviceWorker.ready;
                        console.log('Service Worker listo');

                        // Verificar que hay un controller activo
                        if (navigator.serviceWorker.controller) {
                            console.log(
                                '✅ Controller activo encontrado:',
                                navigator.serviceWorker.controller
                            );
                            console.log(
                                'Estado del controller:',
                                navigator.serviceWorker.controller.state
                            );

                            const message = {
                                type: 'SHOW_NOTIFICATION',
                                title,
                                options: {
                                    body: options.body || 'Nueva notificación',
                                    icon: '/pwa-192x192.png',
                                    badge: '/pwa-192x192.png',
                                    tag: options.tag || 'local-notification',
                                    requireInteraction: false,
                                    data: {
                                        url: '/',
                                        timestamp: new Date().toISOString(),
                                        ...options.data,
                                    },
                                    ...options,
                                },
                            };

                            console.log(
                                '📤 Enviando mensaje al Service Worker:',
                                message
                            );

                            // Enviar mensaje y esperar respuesta
                            const messagePromise = new Promise(
                                (resolve, reject) => {
                                    const timeout = setTimeout(() => {
                                        reject(
                                            new Error(
                                                'Timeout esperando respuesta del Service Worker'
                                            )
                                        );
                                    }, 5000);

                                    const handleResponse = (event) => {
                                        if (
                                            event.data &&
                                            event.data.type ===
                                                'LOCAL_NOTIFICATION_SHOWN'
                                        ) {
                                            clearTimeout(timeout);
                                            navigator.serviceWorker.removeEventListener(
                                                'message',
                                                handleResponse
                                            );
                                            resolve({
                                                type: 'service-worker',
                                                title,
                                                success: true,
                                            });
                                        } else if (
                                            event.data &&
                                            event.data.type ===
                                                'NOTIFICATION_ERROR'
                                        ) {
                                            clearTimeout(timeout);
                                            navigator.serviceWorker.removeEventListener(
                                                'message',
                                                handleResponse
                                            );
                                            reject(new Error(event.data.error));
                                        }
                                    };

                                    navigator.serviceWorker.addEventListener(
                                        'message',
                                        handleResponse
                                    );
                                }
                            );

                            navigator.serviceWorker.controller.postMessage(
                                message
                            );

                            console.log(
                                '📤 Mensaje enviado al Service Worker, esperando respuesta...'
                            );

                            const result = await messagePromise;
                            console.log(
                                '✅ Respuesta recibida del Service Worker:',
                                result
                            );
                            return result;
                        } else {
                            console.log(
                                '⚠️ No hay controller activo, registrando service worker...'
                            );
                            const registration =
                                await navigator.serviceWorker.register(
                                    '/sw.js'
                                );
                            await navigator.serviceWorker.ready;

                            if (registration.active) {
                                console.log(
                                    '✅ Service Worker registrado y activo:',
                                    registration.active
                                );

                                const message = {
                                    type: 'SHOW_NOTIFICATION',
                                    title,
                                    options: {
                                        body:
                                            options.body ||
                                            'Nueva notificación',
                                        icon: '/pwa-192x192.png',
                                        badge: '/pwa-192x192.png',
                                        tag:
                                            options.tag || 'local-notification',
                                        requireInteraction: false,
                                        data: {
                                            url: '/',
                                            timestamp: new Date().toISOString(),
                                            ...options.data,
                                        },
                                        ...options,
                                    },
                                };

                                registration.active.postMessage(message);
                                console.log(
                                    '📤 Mensaje enviado al Service Worker recién registrado'
                                );
                                return { type: 'service-worker', title };
                            } else {
                                console.log(
                                    '❌ Service Worker registrado pero no activo'
                                );
                            }
                        }
                    }

                    // Fallback: usar Notification API directamente
                    console.log(
                        '🔄 Service Worker no disponible, usando Notification API directamente'
                    );
                    const notification = new Notification(title, {
                        icon: '/pwa-192x192.png',
                        badge: '/pwa-192x192.png',
                        tag: 'local-notification',
                        requireInteraction: false,
                        ...options,
                    });

                    console.log(
                        '✅ Notificación creada directamente:',
                        notification
                    );

                    // Auto-cerrar después de 5 segundos
                    setTimeout(() => {
                        notification.close();
                        console.log('⏰ Notificación cerrada automáticamente');
                    }, 5000);

                    return notification;
                } catch (error) {
                    console.error(
                        '❌ Error mostrando notificación local:',
                        error
                    );

                    // Fallback final: Notification API
                    try {
                        console.log(
                            '🔄 Intentando fallback con Notification API...'
                        );
                        const notification = new Notification(title, {
                            icon: '/pwa-192x192.png',
                            badge: '/pwa-192x192.png',
                            tag: 'local-notification-fallback',
                            requireInteraction: false,
                            ...options,
                        });

                        setTimeout(() => notification.close(), 5000);
                        return notification;
                    } catch (fallbackError) {
                        console.error(
                            '❌ Error en fallback también:',
                            fallbackError
                        );
                        return null;
                    }
                }
            } else {
                console.log('❌ No se puede mostrar notificación:', {
                    platform,
                    permission,
                    isSupported:
                        platform === 'ios-safari' &&
                        permission === 'granted' &&
                        false,
                });
                return null;
            }
        },
        [platform, permission]
    );

    // Manejar cambios de visibilidad de la página (especialmente para iOS Safari)
    // useEffect(() => {
    //   if (platform === 'ios-safari' && false) {
    //     const handleVisibilityChange = () => {
    //       const isVisible = !document.hidden
    //       console.log('Cambio de visibilidad de la página:', isVisible)

    //       if (isVisible && pendingNotifications.length > 0) {
    //         console.log('App vuelve a estar activa, mostrando notificaciones pendientes:', pendingNotifications.length)

    //         // Mostrar notificaciones pendientes
    //         pendingNotifications.forEach((notification, index) => {
    //           setTimeout(() => {
    //             showLocalNotification(notification.title, notification.options)
    //           }, index * 1000) // Espaciar las notificaciones por 1 segundo
    //         })

    //         // Limpiar notificaciones pendientes
    //         setPendingNotifications([])
    //       }
    //     }

    //     document.addEventListener('visibilitychange', handleVisibilityChange)

    //     return () => {
    //       document.removeEventListener('visibilitychange', handleVisibilityChange)
    //     }
    //   }
    // }, [platform, pendingNotifications, showLocalNotification])

    // Registrar handler para notificaciones push en iOS Safari
    // useEffect(() => {
    //   if (platform === 'ios-safari' && isSupported && false) {
    //     const removeHandler = addMessageHandler((data) => {
    //       if (data.type === 'push_notification') {
    //         console.log('Notificación recibida:', data)
    //         console.log('Estado de la app:', {
    //           permission: Notification.permission,
    //           isPWA: isPWAInstalled(),
    //           isStandalone: window.navigator.standalone,
    //           displayMode: window.matchMedia('(display-mode: standalone)').matches,
    //           isVisible: !document.hidden
    //         })

    //         // Verificar si la app está activa
    //         if (!document.hidden) {
    //           // App está activa, mostrar notificación inmediatamente
    //           const notification = showLocalNotification(data.title, {
    //             body: data.body,
    //             icon: data.icon || '/pwa-192x192.png',
    //             tag: data.tag || 'websocket-notification',
    //             data: data.data
    //           })

    //           if (notification) {
    //             console.log('Notificación creada exitosamente:', notification)
    //           } else {
    //             console.log('No se pudo crear la notificación')
    //           }
    //         } else {
    //           // App no está activa, guardar en cola
    //           console.log('App no está activa, guardando notificación en cola')
    //           setPendingNotifications(prev => [...prev, {
    //             title: data.title,
    //             options: {
    //               body: data.body,
    //               icon: data.icon || '/pwa-192x192.png',
    //               tag: data.tag || 'websocket-notification',
    //               data: data.data
    //             }
    //           }])
    //         }
    //       }
    //     })

    //     return removeHandler
    //   }
    // }, [platform, isSupported, addMessageHandler, showLocalNotification])

    // Función para validar si una suscripción sigue siendo válida
    const validateSubscription = useCallback(
        async (pushSubscription) => {
            if (!pushSubscription) return false;

            // En iOS Safari, no podemos validar suscripciones de la misma manera
            if (false) {
                return true; // Asumimos que es válida en iOS
            }

            try {
                // Verificar si la suscripción tiene un endpoint válido
                if (!pushSubscription.endpoint) return false;

                // Verificar si la suscripción no ha expirado
                const response = await fetch(pushSubscription.endpoint, {
                    method: 'HEAD',
                });

                // Si el endpoint responde, la suscripción es válida
                return response.status !== 410; // 410 Gone indica que la suscripción expiró
            } catch (error) {
                console.log('Error validando suscripción:', error);
                return false;
            }
        },
        [platform]
    );

    // Función para renovar suscripción expirada
    const renewSubscription = useCallback(
        async (registration) => {
            if (false) {
                // En iOS Safari, no hay suscripciones push tradicionales
                return null;
            }

            try {
                // Cancelar suscripción existente si existe
                const existingSubscription =
                    await registration.pushManager.getSubscription();
                if (existingSubscription) {
                    await existingSubscription.unsubscribe();
                }

                // Crear nueva suscripción
                const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
                const newSubscription =
                    await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: vapidPublicKey,
                    });

                return newSubscription;
            } catch (error) {
                console.error('Error renovando suscripción:', error);
                return null;
            }
        },
        [platform]
    );

    const requestPermission = useCallback(async () => {
        if (!isSupported) {
            if (platform === 'ios-safari' && !isPWA && false) {
                console.log(
                    'iOS Safari requiere que la app esté instalada como PWA para notificaciones'
                );
                return false;
            }
            console.log('Las notificaciones no están soportadas');
            return false;
        }

        try {
            const result = await Notification.requestPermission();
            console.log(result, 'result requestPermission');
            setPermission(result);
            return result === 'granted';
        } catch (error) {
            console.error('Error al solicitar permisos:', error);
            return false;
        }
    }, [isSupported, platform, isPWA]);

    const subscribeToNotifications = useCallback(
        async (permissionGranted) => {
            console.log(
                permissionGranted,
                'permissionGranted subscribeToNotifications'
            );
            if (!isSupported || !permissionGranted) {
                console.log('Permisos no otorgados para notificaciones');
                return null;
            }

            setIsValidating(true);

            try {
                // Navegadores estándar con Push API
                let registration =
                    await navigator.serviceWorker.getRegistration();
                if (!registration) {
                    registration = await navigator.serviceWorker.register(
                        '/sw.js',
                        {
                            scope: '/',
                            type: 'module',
                        }
                    );
                    await navigator.serviceWorker.ready;
                }

                // Obtener suscripción existente
                let pushSubscription =
                    await registration.pushManager.getSubscription();

                // Validar suscripción existente
                // (Desactivado para Safari, solo para navegadores estándar)
                if (pushSubscription && false) {
                    const isValid = await validateSubscription(
                        pushSubscription
                    );
                    if (!isValid) {
                        console.log('Suscripción expirada, renovando...');
                        pushSubscription = await renewSubscription(
                            registration
                        );
                    }
                }

                // Si no hay suscripción válida, crear nueva
                if (!pushSubscription) {
                    const vapidPublicKey = import.meta.env
                        .VITE_VAPID_PUBLIC_KEY;
                    pushSubscription = await registration.pushManager.subscribe(
                        {
                            userVisibleOnly: true,
                            applicationServerKey: vapidPublicKey,
                        }
                    );
                }

                // Enviar suscripción al servidor
                const response = await subscribeToNotificationsRequest(
                    token,
                    JSON.stringify({
                        subscription: pushSubscription,
                        userId: 'USER_ID',
                        platform: 'standard',
                        type: 'push',
                        timestamp: new Date().toISOString(),
                    })
                );

                if (response.status === 200 || response.status === 201) {
                    setSubscription(pushSubscription);
                    dispatch(setPushEndpoint(pushSubscription));
                    console.log('Suscripción exitosa');
                    return pushSubscription;
                } else if (response.status === 409) {
                    setSubscription(pushSubscription);
                    dispatch(setPushEndpoint(pushSubscription));
                    console.log('Suscripcion existente');
                    return pushSubscription;
                } else if (response.status === 410) {
                    pushSubscription = await renewSubscription(registration);

                    const renewResponse = await subscribeToNotificationsRequest(
                        token,
                        JSON.stringify({
                            subscription: pushSubscription,
                            userId: 'USER_ID',
                            platform: 'standard',
                            type: 'push',
                            timestamp: new Date().toISOString(),
                        })
                    );

                    if (
                        renewResponse.status === 200 ||
                        renewResponse.status === 201
                    ) {
                        setSubscription(pushSubscription);
                        dispatch(setPushEndpoint(pushSubscription));
                        console.log('Suscripción renovada exitosamente');
                        return pushSubscription;
                    } else if (renewResponse.status === 409) {
                        setSubscription(pushSubscription);
                        dispatch(setPushEndpoint(pushSubscription));
                        console.log('Suscripcion existente');
                        return pushSubscription;
                    } else {
                        console.error('Error al renovar suscripción');
                        return null;
                    }
                }
            } catch (error) {
                console.error('Error al suscribirse a notificaciones:', error);
                return null;
            } finally {
                setIsValidating(false);
            }
        },
        [
            isSupported,
            validateSubscription,
            renewSubscription,
            platform,
            isConnected,
        ]
    );

    // Función para verificar y renovar suscripción periódicamente
    const checkAndRenewSubscription = useCallback(
        async (serverUrl) => {
            if (!subscription) return;

            // En iOS Safari, verificar conexión WebSocket
            if (platform === 'ios-safari' && false) {
                if (!isConnected) {
                    console.log(
                        'WebSocket desconectado, esperando reconexión automática...'
                    );
                }
                return;
            }

            try {
                const isValid = await validateSubscription(subscription);
                if (!isValid) {
                    console.log(
                        'Suscripción expirada, renovando automáticamente...'
                    );
                    await subscribeToNotifications(permission === 'granted');
                }
            } catch (error) {
                console.error('Error verificando suscripción:', error);
            }
        },
        [
            subscription,
            validateSubscription,
            subscribeToNotifications,
            platform,
            isConnected,
        ]
    );

    const unsubscribeFromNotifications = useCallback(
        async (serverUrl) => {
            if (!subscription) return;

            try {
                if (platform === 'ios-safari' && false) {
                    // Para iOS Safari, solo notificar al servidor (el WebSocket se mantiene para otros usos)
                    await fetch(`${serverUrl}/notifications/unsubscribe`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            subscription: subscription,
                            userId: 'USER_ID',
                            platform: 'ios-safari',
                            type: 'websocket',
                        }),
                    });
                } else {
                    // Cancelar suscripción en el service worker
                    await subscription.unsubscribe();

                    // Notificar al servidor
                    await fetch(`${serverUrl}/notifications/unsubscribe`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            subscription: subscription,
                            userId: 'USER_ID',
                            platform: 'standard',
                            type: 'push',
                        }),
                    });
                }

                setSubscription(null);
                console.log('Desuscripción exitosa');
            } catch (error) {
                console.error('Error al desuscribirse:', error);
            }
        },
        [subscription, platform]
    );

    const sendTestNotification = useCallback(
        async (serverUrl) => {
            if (!subscription) {
                console.log('No hay suscripción activa');
                return;
            }

            try {
                const response = await fetch(
                    `${serverUrl}/notifications/test`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            subscription: subscription,
                            message: '¡Notificación de prueba!',
                            platform: platform,
                            type:
                                platform === 'ios-safari'
                                    ? 'websocket'
                                    : 'push',
                        }),
                    }
                );

                if (response.ok) {
                    console.log('Notificación de prueba enviada');
                } else {
                    console.error('Error al enviar notificación de prueba');
                }
            } catch (error) {
                console.error('Error al enviar notificación de prueba:', error);
            }
        },
        [subscription, platform]
    );

    // Función para probar la conexión con el Service Worker
    const testServiceWorkerConnection = useCallback(async () => {
        if ('serviceWorker' in navigator) {
            try {
                console.log('🧪 Probando conexión con Service Worker...');

                // Esperar a que el service worker esté listo
                await navigator.serviceWorker.ready;
                console.log('✅ Service Worker listo');

                // Verificar controller
                if (navigator.serviceWorker.controller) {
                    console.log(
                        '✅ Controller activo:',
                        navigator.serviceWorker.controller
                    );
                    console.log(
                        'Estado del controller:',
                        navigator.serviceWorker.controller.state
                    );

                    // Enviar mensaje de prueba
                    const testMessage = {
                        type: 'SHOW_NOTIFICATION',
                        title: 'Prueba de Conexión',
                        options: {
                            body: 'Si ves esta notificación, la conexión con el Service Worker funciona correctamente',
                            tag: 'test-connection',
                            data: {
                                test: true,
                                timestamp: new Date().toISOString(),
                            },
                        },
                    };

                    console.log('📤 Enviando mensaje de prueba:', testMessage);
                    navigator.serviceWorker.controller.postMessage(testMessage);

                    return true;
                } else {
                    console.log('⚠️ No hay controller activo');
                    return false;
                }
            } catch (error) {
                console.error('❌ Error probando Service Worker:', error);
                return false;
            }
        } else {
            console.log('❌ Service Worker no soportado');
            return false;
        }
    }, []);

    // Función para verificar el estado del Service Worker
    const getServiceWorkerStatus = useCallback(async () => {
        if ('serviceWorker' in navigator) {
            try {
                const registration =
                    await navigator.serviceWorker.getRegistration();
                console.log('📊 Estado del Service Worker:');
                console.log('- Registrado:', !!registration);

                if (registration) {
                    console.log('- Activo:', !!registration.active);
                    console.log('- Esperando:', !!registration.waiting);
                    console.log('- Instalando:', !!registration.installing);
                    console.log(
                        '- Controller:',
                        !!navigator.serviceWorker.controller
                    );

                    if (registration.active) {
                        console.log(
                            '- Script URL:',
                            registration.active.scriptURL
                        );
                        console.log('- Estado:', registration.active.state);
                    }
                }

                return {
                    registered: !!registration,
                    active: !!registration?.active,
                    waiting: !!registration?.waiting,
                    installing: !!registration?.installing,
                    controller: !!navigator.serviceWorker.controller,
                };
            } catch (error) {
                console.error('❌ Error obteniendo estado del SW:', error);
                return null;
            }
        } else {
            console.log('❌ Service Worker no soportado');
            return null;
        }
    }, []);

    // Suscripción automática al iniciar si ya hay pushEndpoint guardado
    useEffect(() => {
        const autoSubscribe = async () => {
            // Verificar que tengamos los requisitos para suscribirse automáticamente
            if (
                pushEndpoint &&
                permission === 'granted' &&
                isSupported &&
                token &&
                !subscription // Solo si no hay suscripción activa
            ) {
                console.log(
                    '🔄 Suscripción automática detectada - pushEndpoint existente:',
                    pushEndpoint
                );
                console.log('📋 Condiciones verificadas:', {
                    pushEndpoint: !!pushEndpoint,
                    permission,
                    isSupported,
                    hasToken: !!token,
                    hasSubscription: !!subscription,
                });
                try {
                    console.log('🚀 Iniciando suscripción automática...');
                    const result = await subscribeToNotifications(
                        permission === 'granted'
                    );
                    if (result) {
                        console.log('✅ Suscripción automática exitosa');
                    } else {
                        console.log('❌ Suscripción automática falló');
                    }
                } catch (error) {
                    console.error('❌ Error en suscripción automática:', error);
                } finally {
                    setHasAttemptedAutoSubscribe(true);
                }
            } else {
                console.log('⏸️ Suscripción automática no ejecutada:', {
                    pushEndpoint: !!pushEndpoint,
                    permission,
                    isSupported,
                    hasToken: !!token,
                    hasSubscription: !!subscription,
                });

                setHasAttemptedAutoSubscribe(true);
            }
        };

        // Solo ejecutar cuando todos los valores necesarios estén disponibles
        if (permission !== 'default' && isSupported !== null) {
            autoSubscribe();
        } else {
            setHasAttemptedAutoSubscribe(true);
        }
    }, [
        pushEndpoint,
        permission,
        isSupported,
        token,
        subscription,
        subscribeToNotifications,
    ]);

    return {
        isSupported,
        permission,
        subscription,
        isValidating,
        platform,
        isPWA,
        isWebSocketConnected,
        pendingNotifications,
        hasAttemptedAutoSubscribe,
        requestPermission,
        subscribeToNotifications,
        unsubscribeFromNotifications,
        sendTestNotification,
        validateSubscription,
        checkAndRenewSubscription,
        showLocalNotification,
        testServiceWorkerConnection,
        getServiceWorkerStatus,
        pushEndpoint,
        clearPendingNotifications: () => setPendingNotifications([]),
    };
};
