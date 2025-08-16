import React, { useEffect, useState, useRef, useCallback } from "react";
import styled, {keyframes} from "styled-components";
import { useMediaQuery } from 'react-responsive';
import { useNavigate, useLocation } from 'react-router-dom';
import { BsThreeDots } from "react-icons/bs";
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { useSelector } from "react-redux";
import FloatingButton from "../moleculas/FloatingButton";
import BottomSheetCar from '../organismos/BottomSheetCar';
import { getOrientation } from "../../utilities/Functions";
import { slides } from "../../utilities/dataEstatica";
import { sendComando } from "../../services/DispositivosService";
import Swal from "sweetalert2";
import Alert from "@mui/material/Alert"; // Importa el componente Alert de Material UI
import Stack from "@mui/material/Stack"; // Para organizar las alertas

// SVG del carro como componente (vista superior)
const CarMarker = ({ rotation }) => (
  <div style={{
    width: '32px',
    height: '32px',
    transform: `rotate(${rotation}deg)`,
    transition: 'transform 0.3s ease',
    transformOrigin: 'center center'
  }}>
    <svg
      width="48"
      height="48"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25.192749,34.420269c0.3357525,0.7560654,1.8607941,0.8125992,3.406292,0.1262512c0.167984-0.074604,0.327858-0.1557655,0.4815159-0.2406273c0,11.4814987,0,26.826889,0,28.2994461c0,2.3790054,0.5286694,13.8334885,0.5286694,13.8334885s0.7930012,6.3440247,1.1454468,9.3398132s0.881115,6.344017,3.9650154,8.0181351s14.8908272,2.4671249,14.8908272,2.4671249s11.8069305-0.7930069,14.8908272-2.4671249c3.0839005-1.674118,3.6125717-5.0223465,3.9650192-8.0181351c0.3524399-2.9957886,1.1454468-9.3398132,1.1454468-9.3398132S70.14048,64.9843445,70.14048,62.6053391c0-1.4725571,0-16.8179474,0-28.2994461c0.153656,0.0848618,0.31353,0.1660233,0.481514,0.2406273c1.5454941,0.686348,3.0705414,0.6298141,3.4062881-0.1262512c0.3357544-0.7560692-0.6449127-1.9253502-2.1903915-2.6116791c-0.5907288-0.2623539-1.1779099-0.4152794-1.6974106-0.4629707c0-5.6102619,0-9.7120895,0-9.7120895s0.5755157-9.4140253-4.4349365-13.1873493c-4.7580185-3.5831833-6.5789948-4.405571-9.927227-4.6992683h-12.335598c-3.3482361,0.2936974-5.1692123,1.1160851-9.927227,4.6992683c-5.0104561,3.773324-4.4349346,13.1873493-4.4349346,13.1873493s0,4.1018276,0,9.7120895c-0.5195045,0.0476913-1.1066837,0.2006168-1.6974144,0.4629707C25.8376656,32.4949188,24.8569946,33.6641998,25.192749,34.420269z M50.3154068,88.6863174h-1.4097824c0,0-9.8694038,0.0108871-14.185936-2.9076767l0.6167793-12.5999374c0,0,4.8461266,2.2027893,13.5691566,1.9384537h1.4097824c8.7230301,0.2643356,13.5691605-1.9384537,13.5691605-1.9384537l0.6167755,12.5999374C60.1848106,88.6972046,50.3154068,88.6863174,50.3154068,88.6863174z M63.2454338,9.518898c0.4588013-0.4587994,1.6954613,0.0340099,2.7621498,1.1007042c1.0666962,1.0666943,1.5595093,2.3033524,1.100708,2.7621508c-0.4588013,0.4587994-1.6954575-0.0340099-2.7621536-1.1007042C63.2794456,11.2143488,62.7866364,9.9776964,63.2454338,9.518898z M48.0245094,21.4573059h3.1720123c0,0,3.8769035-0.2643337,10.1328125,1.674118s5.5510216,5.9915752,5.5510216,5.9915752l-2.0265656,9.7803669c-4.5817909-1.674118-14.5383835-1.674118-14.5383835-1.674118h-1.4097824c0,0-9.9565887,0-14.5383835,1.674118l-2.0265617-9.7803669c0,0-0.7048912-4.0531254,5.5510178-5.9915752S48.0245094,21.4573059,48.0245094,21.4573059z M32.9280968,10.6196022c1.0666924-1.0666943,2.3033524-1.5595036,2.7621498-1.1007042c0.4587975,0.4587984-0.034008,1.6954508-1.1007042,2.7621508c-1.0667152,1.0666943-2.3033752,1.5595036-2.7621517,1.1007042C31.3685932,12.9229546,31.8613796,11.6862965,32.9280968,10.6196022z"
        fill="#FF0000"
        stroke="#FFFFFF"
        strokeWidth="0.5"
      />
    </svg>
  </div>
);

const MapContainer = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    touch-action: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
    
    /* Estilos específicos para Safari */
    @supports (-webkit-touch-callout: none) {
        & > div {
            touch-action: none;
            -webkit-user-select: none;
            user-select: none;
            cursor: grab;
        }
        
        & > div:active {
            cursor: grabbing;
        }
    }
`;

// Animación para deslizar la alerta existente hacia la izquierda
const slideOutLeft = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
`;

// Animación para la entrada de la nueva alerta (deslizamiento desde la derecha)
const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const AlertContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 70px;
  z-index: 1000; /* Asegura que esté en la parte superior de la pantalla */
  width: auto;
  max-width: 300px; /* Limitar el ancho de la alerta */
  animation: ${slideInRight} 0.5s ease-in-out, ${slideOutLeft} 0.5s ease-in-out 3s;
`;

export const MapaClasicoTemplate = () => {
    const [bottomSheet, setBottomSheet] = useState(null);
    const [showSelectOptions, setShowSelectOptions] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Tipo pdi");
    const [showOptions, setShowOptions] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const navigate = useNavigate();
    const location = useLocation();
    const [showCarDetails, setShowCarDetails] = useState(false);
    const [currentTab, setCurrentTab] = useState(0);
    const [timestamp, setTimestamp] = useState(0);
    const startTimeRef = useRef(null);
    const animationFrameRef = useRef(null);
    const [vehiclePositions, setVehiclePositions] = useState({});
    const [vehicleRotations, setVehicleRotations] = useState({});
    const [animationSpeed] = useState(2);
    const lastUpdateRef = useRef(null);
    const [animationComplete, setAnimationComplete] = useState({});
    const dragTimeoutRef = useRef(null);
    const isDraggingRef = useRef(false);
    const mapRef = useRef(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("success");
    const [alertKey, setAlertKey] = useState(0);

    const selectedVehicles = useSelector((state) => state.vehicle?.selectedVehicles || []);
    const selectedVehicle = useSelector((state) => state.vehicle?.selectedVehicles[0] || null);

    const token = useSelector((state) => state.auth?.token || null);

    // Estado inicial del mapa con valores por defecto
    const [mapCenter, setMapCenter] = useState({
        lat: 22.653024,
        lng: -101.956114
    });
    const [mapZoom, setMapZoom] = useState(5);

    // Estado para controlar si el mapa debe actualizarse
    const [shouldUpdateMap, setShouldUpdateMap] = useState(false);

    // Función para calcular el centro y zoom basado en los puntos de la ruta
    const calculateMapView = (route) => {
        if (!route || route.length === 0) return null;

        // Filtrar puntos válidos
        const validPoints = route.filter(([lng, lat]) => 
            typeof lat === 'number' && typeof lng === 'number' &&
            !isNaN(lat) && !isNaN(lng) &&
            lat >= -90 && lat <= 90 &&
            lng >= -180 && lng <= 180
        );

        if (validPoints.length === 0) return null;

        // Usar la última coordenada como centro
        const lastPoint = validPoints[validPoints.length - 1];
        const center = {
            lat: lastPoint[1],
            lng: lastPoint[0]
        };

        // Calcular el zoom basado en la distancia máxima entre puntos
        let maxDistance = 0;
        for (let i = 0; i < validPoints.length - 1; i++) {
            const [lng1, lat1] = validPoints[i];
            const [lng2, lat2] = validPoints[i + 1];
            
            // Calcular distancia usando la fórmula de Haversine
            const R = 6371; // Radio de la Tierra en km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLng = (lng2 - lng1) * Math.PI / 180;
            const a = 
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                Math.sin(dLng/2) * Math.sin(dLng/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const distance = R * c;
            
            maxDistance = Math.max(maxDistance, distance);
        }

        // Ajustar los niveles de zoom para una vista mucho más alejada
        let zoom = 16; // zoom por defecto más alejado
        if (maxDistance > 0) {
            if (maxDistance > 50) zoom = 10;       // > 50km
            else if (maxDistance > 20) zoom = 11;  // 20-50km
            else if (maxDistance > 10) zoom = 12;  // 10-20km
            else if (maxDistance > 5) zoom = 13;   // 5-10km
            else if (maxDistance > 2) zoom = 14;  // 2-5km
            else if (maxDistance > 1) zoom = 15;  // 1-2km
            else zoom = 16;                       // < 1km
        }

        console.log('Calculated map view:', { center, zoom, maxDistance, lastPoint });
        return { center, zoom };
    };

    useEffect(() => {
        console.log("MapaTemplate mobile MONTADO");
        return () => {
          console.log("MapaTemplate mobile DESMONTADO");
        };
      }, []);

    // Efecto para actualizar la posición del mapa cuando se selecciona un vehículo
    useEffect(() => {
        console.log('Effect triggered - selectedVehicles changed:', selectedVehicles);
        if (selectedVehicles.length > 0) {
            const vehicle = selectedVehicles[0];
            console.log('Selected vehicle:', vehicle);
            if (vehicle?.route && Array.isArray(vehicle.route) && vehicle.route.length > 0) {
                const mapView = calculateMapView(vehicle.route);
                if (mapView) {
                    console.log('Setting map view from calculated values');
                    setShouldUpdateMap(true);
                    setMapCenter(mapView.center);
                    setMapZoom(mapView.zoom);
                }
            }
        }
    }, [selectedVehicles]);

    // Efecto para resetear shouldUpdateMap después de un breve delay
    useEffect(() => {
        if (shouldUpdateMap) {
            const timer = setTimeout(() => {
                setShouldUpdateMap(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [shouldUpdateMap]);

    // Función para calcular la dirección promedio basada en varios puntos
    const calculateAverageDirection = (route, currentIndex, lookAhead = 3) => {
        if (!route || route.length < 2) return 0;

        const startIndex = Math.max(0, currentIndex);
        const endIndex = Math.min(route.length - 1, currentIndex + lookAhead);
        
        // Si estamos al final de la ruta, usar los últimos dos puntos
        if (currentIndex >= route.length - 2) {
            const lastPoint = route[route.length - 1];
            const secondLastPoint = route[route.length - 2];
            const dx = lastPoint[0] - secondLastPoint[0];
            const dy = lastPoint[1] - secondLastPoint[1];
            // Ajustar el ángulo para que 0 grados sea el Norte
            return Math.atan2(dx, dy) * (180 / Math.PI);
        }

        // Calcular la dirección promedio usando varios puntos
        let totalDx = 0;
        let totalDy = 0;
        let count = 0;

        for (let i = startIndex; i < endIndex; i++) {
            const currentPoint = route[i];
            const nextPoint = route[i + 1];
            if (currentPoint && nextPoint) {
                totalDx += nextPoint[0] - currentPoint[0];
                totalDy += nextPoint[1] - currentPoint[1];
                count++;
            }
        }

        if (count === 0) return 0;

        // Calcular el ángulo promedio
        const avgDx = totalDx / count;
        const avgDy = totalDy / count;
        // Ajustar el ángulo para que 0 grados sea el Norte
        return Math.atan2(avgDx, avgDy) * (180 / Math.PI);
    };

    // Efecto para la animación de los vehículos
    useEffect(() => {
        // Limpiar cualquier animación existente
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        // Reiniciar todos los estados de animación
        setAnimationComplete({});
        setVehiclePositions({});
        setVehicleRotations({});
        setTimestamp(0);
        startTimeRef.current = null;
        lastUpdateRef.current = null;

        if (selectedVehicles.length > 0) {
            // Verificar rutas inválidas
            selectedVehicles.forEach(vehicle => {
                if (!vehicle.route || !Array.isArray(vehicle.route)) {
                    console.warn(`⚠️ Vehículo ${vehicle.id} no tiene ruta definida`);
                } else if (vehicle.route.length === 0) {
                    console.warn(`⚠️ Vehículo ${vehicle.id} tiene ruta vacía`);
                } else if (vehicle.route.length === 1) {
                    console.warn(`⚠️ Vehículo ${vehicle.id} tiene solo un punto en la ruta:`, vehicle.route[0]);
                } else {
                    console.log(`Vehículo ${vehicle.id} tiene ruta válida`);
                }
            });

            // Iniciar la animación inmediatamente
            const startAnimation = () => {
                startTimeRef.current = performance.now();
                lastUpdateRef.current = startTimeRef.current;
                setTimestamp(0);
                animationFrameRef.current = requestAnimationFrame(animate);
            };

            // Pequeño delay para asegurar que el mapa esté listo
            setTimeout(startAnimation, 100);

            const animate = (currentTime) => {
                if (!startTimeRef.current) {
                    startTimeRef.current = currentTime;
                }

                const deltaTime = (currentTime - lastUpdateRef.current) / 1000;
                lastUpdateRef.current = currentTime;

                const elapsedTime = (currentTime - startTimeRef.current) / 1000;
                const newTimestamp = elapsedTime * animationSpeed;

                const newPositions = {};
                const newRotations = {};
                const newAnimationComplete = { ...animationComplete };
                let allAnimationsComplete = true;

                selectedVehicles.forEach(vehicle => {
                    if (!vehicle.route || !Array.isArray(vehicle.route)) {
                        console.warn(`⚠️ Vehículo ${vehicle.id} no tiene ruta válida`);
                        return;
                    }

                    // Si solo hay un punto en la ruta, usarlo directamente
                    if (vehicle.route.length === 1) {
                        const point = vehicle.route[0];
                        if (point && Array.isArray(point) && point.length >= 2) {
                            newPositions[vehicle.id] = { 
                                lat: point[1], 
                                lng: point[0] 
                            };
                            newRotations[vehicle.id] = 0;
                            newAnimationComplete[vehicle.id] = true;
                        }
                        return;
                    }

                    // Iniciar la animación desde el primer punto
                    const route = vehicle.route;
                    const totalPoints = route.length;
                    const totalTime = totalPoints * 1;
                    const currentTime = Math.min(newTimestamp, totalTime);
                    
                    if (currentTime >= totalTime) {
                        newAnimationComplete[vehicle.id] = true;
                        const lastPoint = route[route.length - 1];
                        const secondLastPoint = route[route.length - 2];
                        
                        if (lastPoint && secondLastPoint) {
                            newPositions[vehicle.id] = { 
                                lat: lastPoint[1], 
                                lng: lastPoint[0] 
                            };
                            const dx = lastPoint[0] - secondLastPoint[0];
                            const dy = lastPoint[1] - secondLastPoint[1];
                            newRotations[vehicle.id] = Math.atan2(dx, dy) * (180 / Math.PI);
                        }
                    } else {
                        allAnimationsComplete = false;
                        const pointIndex = Math.floor(currentTime);
                        const nextPointIndex = Math.min(pointIndex + 1, totalPoints - 1);
                        
                        const currentPoint = route[pointIndex];
                        const nextPoint = route[nextPointIndex];
                        
                        if (currentPoint && nextPoint) {
                            const pointProgress = currentTime % 1;
                            
                            // Interpolar posición con easing
                            const easeProgress = pointProgress < 0.5
                                ? 2 * pointProgress * pointProgress
                                : 1 - Math.pow(-2 * pointProgress + 2, 2) / 2;
                            
                            const lat = currentPoint[1] + (nextPoint[1] - currentPoint[1]) * easeProgress;
                            const lng = currentPoint[0] + (nextPoint[0] - currentPoint[0]) * easeProgress;
                            
                            newPositions[vehicle.id] = { lat, lng };
                            newRotations[vehicle.id] = calculateAverageDirection(route, pointIndex);
                        }
                    }
                });

                setVehiclePositions(newPositions);
                setVehicleRotations(newRotations);
                setAnimationComplete(newAnimationComplete);
                setTimestamp(newTimestamp);

                if (!allAnimationsComplete) {
                    animationFrameRef.current = requestAnimationFrame(animate);
                } else {
                    console.log('Todas las animaciones completadas');
                }
            };
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        };
    }, [selectedVehicles, animationSpeed]);

    const handleOptionSelect = (option) => {
        console.log(`${option} seleccionada`);
        setSelectedOption(option);
        setShowSelectOptions(false);
        
        // Actualizar el centro del mapa
        console.log('Setting map center from handleOptionSelect');
        setMapCenter(prev => {
            console.log('Previous center:', prev);
            const newCenter = { 
                lat: 22.653024, 
                lng: -101.956114 
            };
            console.log('New center:', newCenter);
            return newCenter;
        });
        setMapZoom(15);
    };

    const handleConfigClick = () => {
        if (bottomSheet === "config") {
            setBottomSheet(null);
        } else {
            setBottomSheet("config");
        }
    };

    // Manejadores para los cambios del mapa
    const handleCenterChanged = useCallback((e) => {
        console.log('handleCenterChanged called with:', e);
        if (!isDraggingRef.current && e?.center) {
            console.log('Setting map center from handleCenterChanged');
            setMapCenter(prev => {
                console.log('Previous center:', prev);
                console.log('New center from event:', e.center);
                return e.center;
            });
        }
    }, []);

    const handleZoomChanged = useCallback((e) => {
        if (e?.zoom) {
            console.log('Zoom actualizado a:', e.zoom);
            setMapZoom(e.zoom);
        }
    }, []);

    const handleMapDrag = useCallback(() => {
        isDraggingRef.current = true;
        if (dragTimeoutRef.current) {
            clearTimeout(dragTimeoutRef.current);
        }
    }, []);

    const handleMapDragEnd = useCallback((e) => {
        console.log('handleMapDragEnd called with:', e);
        isDraggingRef.current = false;
        if (dragTimeoutRef.current) {
            clearTimeout(dragTimeoutRef.current);
        }
        
        // Esperar un momento después de que termine el arrastre antes de actualizar
        dragTimeoutRef.current = setTimeout(() => {
            if (e?.center) {
                console.log('Setting map center from handleMapDragEnd');
                setMapCenter(prev => {
                    console.log('Previous center:', prev);
                    console.log('New center from event:', e.center);
                    return e.center;
                });
            }
        }, 100);
    }, []);

    // Limpiar el timeout cuando el componente se desmonte
    useEffect(() => {
        return () => {
            if (dragTimeoutRef.current) {
                clearTimeout(dragTimeoutRef.current);
            }
        };
    }, []);

    // Log cuando cambia el estado del mapa
    useEffect(() => {
        console.log('Map State Updated - Source:', new Error().stack);
        console.log('Map State:', { center: mapCenter, zoom: mapZoom });
    }, [mapCenter, mapZoom]);

    const sendCmd = async (comando) => {
        try {
            const imei = selectedVehicles[0]?.imei;
            if(!imei){
                setAlertMessage("No se encontró el IMEI del vehículo");
                setAlertSeverity("warning"); // Set warning severity
                return;
            } 

            const response = await sendComando(token, imei, comando);
            const response_cmd = JSON.parse(response.response);

            if(response_cmd.type == 1){
                setAlertSeverity("success");
            } else {
                setAlertSeverity("warning");
            }
            setAlertMessage(response_cmd.message);
            setTimeout(() => {
                setAlertMessage("");
            }, 2000);
        } catch (error) {
            console.log(error);
            setAlertMessage("Error al enviar el comando");
            setAlertSeverity("error"); // Set error severity
            setTimeout(() => {
                setAlertMessage("");
            }, 2000);
        }
        
    }

    const onUpdateLocation = () => {
        sendCmd("posicion");
    }

    const onLock = () => {
        const swalWithCustomButtons = Swal.mixin({
            customClass: {
                confirmButton: "custom-btn-success",
                cancelButton: "custom-btn-danger"
            },
            buttonsStyling: false
        });
        swalWithCustomButtons.fire({
            title: "Quieres bloquear la unidad?",
            text: "No podrás revertir esto!",
            theme : "dark",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Si, hazlo!",
            cancelButtonText: "No, cancelar!",
            reverseButtons: true
        }).then((result) => {
        if (result.isConfirmed) {
            sendCmd("bloqueo_motor");
        }
        });
    }

    const onUnlock = () => {
        const swalWithCustomButtons = Swal.mixin({
            customClass: {
                confirmButton: "custom-btn-success",
                cancelButton: "custom-btn-danger"
            },
            buttonsStyling: false
        });
        swalWithCustomButtons.fire({
            title: "Quieres desbloquear la unidad?",
            text: "No podrás revertir esto!",
            theme : "dark",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Si, hazlo!",
            cancelButtonText: "No, cancelar!",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                sendCmd("desbloqueo_motor");
            }
        });
    }

    // Log cuando cambian los vehículos seleccionados
    // useEffect(() => {
    //     console.log('Selected Vehicles Changed:', selectedVehicles);
    // }, [selectedVehicles]);

    return (
        <MapContainer>
            <APIProvider apiKey="AIzaSyBgNmR7s6iIP55wskrCK-735AxUNm1KpU0">
                <Map
                    center={shouldUpdateMap ? mapCenter : undefined}
                    zoom={shouldUpdateMap ? mapZoom : undefined}
                    defaultCenter={mapCenter}
                    defaultZoom={mapZoom}
                    mapId="64d9b619826759eb"
                    colorScheme={'LIGHT'}
                    controller={true}
                    onLoad={(map) => {
                        console.log('Map loaded, setting options...');
                        mapRef.current = map;
                        if (map) {
                            map.setOptions({
                                gestureHandling: 'greedy',
                                draggable: true,
                                scrollwheel: true,
                                disableDoubleClickZoom: false,
                                zoomControl: false,
                                mapTypeControl: false,
                                streetViewControl: false,
                                fullscreenControl: false,
                                clickableIcons: false,
                                keyboardShortcuts: false,
                                tilt: 0,
                                restriction: null
                            });
                        }
                    }}
                    onCenterChanged={(e) => {
                        if (!shouldUpdateMap && !isDraggingRef.current && e?.center) {
                            console.log('Center changed:', e.center);
                            setMapCenter(e.center);
                        }
                    }}
                    onZoomChanged={(e) => {
                        if (!shouldUpdateMap && e?.zoom) {
                            console.log('Zoom changed:', e.zoom);
                            setMapZoom(e.zoom);
                        }
                    }}
                    onDragStart={() => {
                        isDraggingRef.current = true;
                    }}
                    onDragEnd={(e) => {
                        isDraggingRef.current = false;
                        if (!shouldUpdateMap && e?.center) {
                            console.log('Drag ended, new center:', e.center);
                            setMapCenter(e.center);
                        }
                    }}
                    options={{
                        gestureHandling: 'greedy',
                        draggable: true,
                        scrollwheel: true,
                        disableDoubleClickZoom: false,
                        zoomControl: false,
                        mapTypeControl: false,
                        streetViewControl: false,
                        fullscreenControl: false,
                        clickableIcons: false,
                        keyboardShortcuts: false,
                        tilt: 0,
                        restriction: null
                    }}
                >
                    {selectedVehicles.map(vehicle => {
                        const position = vehiclePositions[vehicle.id];
                        const rotation = vehicleRotations[vehicle.id];
                        
                        if (!position) return null;

                        return (
                            <AdvancedMarker
                                key={vehicle.id}
                                position={position}
                                onClick={() => {
                                    if (bottomSheet === "details") {
                                        setBottomSheet(null);
                                    } else {
                                        setBottomSheet("details");
                                    }
                                }}
                            >
                                <CarMarker rotation={rotation} />
                            </AdvancedMarker>
                        );
                    })}
                </Map>
            </APIProvider>

            <FloatingButton
                icon={BsThreeDots}
                onClick={handleConfigClick}
                position="top-right"
                size={40}
            />

            {
                bottomSheet != null && (
                    <BottomSheetCar
                    show={bottomSheet !== null}
                    bottomSheet={bottomSheet}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                    showSelectOptions={showSelectOptions}
                    setShowSelectOptions={setShowSelectOptions}
                    handleOptionSelect={handleOptionSelect}
                    selectedVehicle={selectedVehicle}
                    slides={slides}
                    currentTab={currentTab}
                    setCurrentTab={setCurrentTab}
                    onClose={() => setBottomSheet(null)}
                    getOrientation={getOrientation}
                    onUpdateLocation={onUpdateLocation}
                    onLock={onLock}
                    onUnlock={onUnlock}
                />
                )
            }


            {alertMessage && (
                  <AlertContainer key={alertKey}>
                    <Stack sx={{ width: "100%" }} spacing={2}>
                      <Alert variant="filled" severity={alertSeverity}>{alertMessage}</Alert>
                    </Stack>
                  </AlertContainer>
                )}
        </MapContainer>
    );
    
};
