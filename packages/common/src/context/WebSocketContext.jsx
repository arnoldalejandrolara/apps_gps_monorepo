import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setVehicles as setVehiclesSlice, setVehicleNewRegister } from "../store/slices/vehicleSlice.js";
import { addNotification, addNotificationList, addOneNotificationToList, removeNotificationList } from '../store/slices/notificationSlice.js';
import { setPdiData } from '../store/slices/pdiViewSlice.js';
import { setGeofenceData } from '../store/slices/geoViewSlice.js';

// Función para parsear coordenadas de polígono de formato PostgreSQL a array de arrays
const parsePolygonCoordinates = (polygonString) => {
    try {
        // Remover paréntesis externos y espacios
        const cleanString = polygonString.replace(/^\(|\)$/g, '').trim();
        
        // Dividir por las comas que separan los pares de coordenadas
        const coordinatePairs = cleanString.split('),(');
        
        // Parsear cada par de coordenadas
        const coordinates = coordinatePairs.map(pair => {
            // Remover paréntesis y espacios
            const cleanPair = pair.replace(/^\(|\)$/g, '').trim();
            // Dividir por coma para obtener lng y lat
            const [lng, lat] = cleanPair.split(',').map(coord => parseFloat(coord.trim()));
            return [lng, lat];
        });
        
        return coordinates;
    } catch (error) {
        console.error('Error al parsear coordenadas del polígono:', error);
        return [];
    }
};

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const ws = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const heartbeatIntervalRef = useRef(null);
    const messageHandlersRef = useRef(new Set());
    const hasConnectedBeforeRef = useRef(false);
    const dispatch = useDispatch();

    const { user, token, isAuthenticated } = useSelector(state => state.auth);
    const { vehicles } = useSelector((state) => state.vehicle);

    const connect = useCallback(() => {
        if (!isAuthenticated) {
            console.log('🔒 Usuario no autenticado, no se conectará el WebSocket');
            return;
        }

        if (ws.current?.readyState === WebSocket.OPEN) {
            console.log('✅ WebSocket ya está conectado');
            return;
        }

        try {
            ws.current = new WebSocket(import.meta.env.VITE_WS_URL);

            ws.current.onopen = () => {
                console.log('✅ WebSocket conectado');
                // Limpiar cualquier timeout de reconexión existente
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }

                // Enviar credenciales
                ws.current.send(JSON.stringify({
                    type: 'on_connect',
                    token: user?.access_token || token,
                    is_first_connection: vehicles.length === 0
                }));

                // Marcar que ya hemos tenido una conexión exitosa
                hasConnectedBeforeRef.current = true;

                // Iniciar heartbeat
                heartbeatIntervalRef.current = setInterval(() => {
                    if (ws.current?.readyState === WebSocket.OPEN) {
                        ws.current.send(JSON.stringify({ type: 'ping' }));
                    }
                }, 30000); // Ping cada 30 segundos
            };

            ws.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    // Notificar a todos los handlers registrados
                    messageHandlersRef.current.forEach(handler => {
                        try {
                            handler(data);
                        } catch (error) {
                            console.error('Error en handler de mensaje:', error);
                        }
                    });

                    // Manejar mensajes específicos del sistema
                    //console.log('🔍 Mensaje recibido:', data);
                    if (data.type === 'on_connect') {
                        console.log('🔗 Conectado al WebSocket:', data);
                    } else if (data.type === 'on_message') {
                        console.log('💬 Mensaje recibido:', data);
                    } else if (data.type === 'on_disconnect') {
                        console.log('🔌 Desconectado del WebSocket:', data);
                    } else if (data.type === 'dispositivos') {
                        const vehicles_array = [];
                        for (let i = 0; i < data.dispositivos.length; i++) {
                            const vehicle = data.dispositivos[i];
                            const vehicleObject = {
                                id: vehicle.id,
                                route: vehicle.historial_coordenadas == null ? [] : [
                                    [vehicle.historial_coordenadas.x, vehicle.historial_coordenadas.y]
                                ],
                                posicion_actual: {
                                    id_alerta: vehicle.historial_alerta_id,
                                    alerta: vehicle.historial_alerta,
                                    fecha: vehicle.historial_fecha,
                                    velocidad: vehicle.historial_velocidad == null ? 0 : vehicle.historial_velocidad,
                                    odometro: vehicle.historial_odometro,
                                    horometro: vehicle.historial_horometro,
                                    altitud: vehicle.historial_altitud,
                                    bateria: vehicle.historial_bateria,
                                    detenido: vehicle.historial_detenido,
                                    id_status_motor: vehicle.historial_id_status_motor,
                                    orientacion: vehicle.historial_orientacion,
                                    satelites: vehicle.historial_satelites,
                                    temperatura: vehicle.historial_temperatura,
                                    voltaje_principal: vehicle.historial_voltaje_principal,
                                    voltaje_respaldo: vehicle.historial_voltaje_respaldo,
                                    lat: vehicle.historial_coordenadas?.x,
                                    lng: vehicle.historial_coordenadas?.y,
                                },
                                imei: vehicle.imei,
                                status: vehicle.status,
                                info: {
                                    nombre: vehicle.unidad_nombre,
                                    año: vehicle.unidad_anio,
                                    placas: vehicle.placa,
                                    modelo: vehicle.unidad_modelo,
                                    color: hexToRgb(vehicle.unidad_color),
                                    chofer: vehicle.unidad_chofer,
                                    num_serie: vehicle.num_serie,
                                }
                            };
                            vehicles_array.push(vehicleObject);
                        }
                        dispatch(setVehiclesSlice(vehicles_array));
                    } else if (data.type === 'nuevo_registro') {
                        //console.log('🔍 Nuevo registro:', data);
                        dispatch(setVehicleNewRegister(data.data));

                        if(data.data.id_alerta != null){
                            dispatch(addNotification({
                                id: data.data.id,
                                title: data.data.unidad_nombre,
                                message: data.data.alerta,
                                type: 'alert'
                            }));

                            data.data.id = data.data.id_ultimo_hgps;
                            data.data.is_new = true;

                            dispatch(addOneNotificationToList(data.data));
                        }
                    } else if (data.type === 'alertas') {
                        data.alertas = data.alertas.map(alert => ({
                            ...alert,
                            is_new: false
                        }));
                        dispatch(addNotificationList(data.alertas));
                    } else if (data.type === 'pi') {
                        dispatch(setPdiData(data.pi));
                    } else if (data.type === 'geofences') {
                        // Parsear el polígono de coordenadas de formato PostgreSQL a array de arrays
                        data.geofences.forEach(geofence => {
                            geofence.polygon = parsePolygonCoordinates(geofence.polygon);
                        });
                        dispatch(setGeofenceData(data.geofences));
                    }
                } catch (error) {
                    console.error('Error al procesar el mensaje:', error);
                }
            };

            ws.current.onerror = (error) => {
                console.error('❌ Error de WebSocket:', error);
            };

            ws.current.onclose = (event) => {
                console.log('🔌 WebSocket cerrado:', event.code, event.reason);

                // Limpiar el intervalo de heartbeat
                if (heartbeatIntervalRef.current) {
                    clearInterval(heartbeatIntervalRef.current);
                    heartbeatIntervalRef.current = null;
                }

                // Intentar reconectar si el usuario está autenticado
                if (isAuthenticated) {
                    console.log('🔄 Intentando reconectar en 5 segundos...');
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, 5000);
                }
            };
        } catch (error) {
            console.error('❌ Error al crear WebSocket:', error);
            if (isAuthenticated) {
                reconnectTimeoutRef.current = setTimeout(() => {
                    connect();
                }, 5000);
            }
        }
    }, [isAuthenticated, user?.access_token, token]);

    // Efecto para manejar la conexión basada en autenticación
    useEffect(() => {
        if (isAuthenticated) {
            connect();
        } else {
            // Si el usuario no está autenticado, cerrar la conexión
            if (ws.current) {
                ws.current.close();
            }
            // Limpiar intervalos y timeouts
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
                heartbeatIntervalRef.current = null;
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
        }

        return () => {
            // Limpiar todo al desmontar
            if (ws.current) {
                ws.current.close();
            }
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [isAuthenticated, connect]);

    const sendMessage = useCallback((message) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(typeof message === 'string' ? message : JSON.stringify(message));
        } else {
            console.warn('⚠️ WebSocket no está abierto aún.');
        }
    }, []);

    const addMessageHandler = useCallback((handler) => {
        messageHandlersRef.current.add(handler);
        return () => messageHandlersRef.current.delete(handler);
    }, []);

    const value = {
        sendMessage,
        addMessageHandler,
        isConnected: ws.current?.readyState === WebSocket.OPEN
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket debe ser usado dentro de un WebSocketProvider');
    }
    return context;
};

// Función auxiliar para convertir color hex a RGB
function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b];
} 