import React, { useMemo, useRef, useEffect, useState } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSelector } from 'react-redux';

// Token de Mapbox - deberías configurar VITE_MAPBOX_TOKEN en tu archivo .env
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiYXJub2xkYWxlamFuZHJvbGFyYSIsImEiOiJjbWVtZ3ZtOG0wcnJyMmpwbGZ6ajloamYzIn0.y2qjqVBVoFYJSPaDwayFGw';

// --- NUEVO: Datos de ejemplo para los PDI (ahora con radio) ---
const fakePdiData = [
    { id: 'pdi-1', name: 'Oficina Central', longitude: -101.956114, latitude: 22.653024, radius: 500,color: '#007cbf' }, // Radio en metros
    { id: 'pdi-2', name: 'Bodega Norte', longitude: -101.978130, latitude: 22.669050, radius: 500 ,color: '#007cbf'},
    { id: 'pdi-3', name: 'Almacén Sur', longitude: -101.941200, latitude: 22.635100, radius: 750,color: '#007cbf' },
    {id: 'pdi-4', name: 'Casa Arnold', longitude: -97.89011807247293, latitude: 22.362032800122975, radius: 600,color: '#007cbf'},
    {id: 'pdi-5', name: 'Uat', longitude: -97.86097819243601, latitude:22.279252426216114, radius: 800,color: '#007cbf'},
];


// --- NUEVO: Datos de ejemplo para las Geocercas (Polígonos) ---
const fakeGeofenceData = [
    {
        id: 'geofence-1',
        name: 'Zona Industrial Prohibida',
        color: '#E53935', // Rojo
        // Coordenadas en formato [longitud, latitud]
        coordinates: [
            [-97.88, 22.38],
            [-97.86, 22.38],
            [-97.86, 22.36],
            [-97.88, 22.36],
            [-97.88, 22.38] // El último punto debe ser igual al primero para cerrar el polígono
        ]
    },
    {
        id: 'geofence-2',
        name: 'Área de Carga y Descarga',
        color: '#43A047', // Verde
        coordinates: [
            [-97.90, 22.35],
            [-97.89, 22.36],
            [-97.88, 22.35],
            [-97.89, 22.34],
            [-97.90, 22.35]
        ]
    }
];



const CustomMapPin = ({ color = '#d93131' }) => ( // Color rojo por defecto
    <svg 
        height="40" // Un poco más alto para que se vea bien
        viewBox="0 0 24 36"
        style={{
            cursor: 'pointer',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))'
        }}
    >
        {/* Vástago/Palo del pin */}
        <path 
            fill="#A0A0A0" // Un color gris/plata para el palo
            stroke="#616161" // Borde un poco más oscuro
            strokeWidth="0.5"
            // Dibuja un rectángulo que termina en punta
            d="M10.5 14 L13.5 14 L13.5 30 L12 36 L10.5 30 Z" 
        />

        {/* Cabeza redonda del pin */}
        <circle 
            cx="12"      // Centrado horizontalmente
            cy="10"      // Centrado verticalmente en la parte superior
            r="10"       // Radio del círculo
            fill={color} // Color personalizable
            strokeWidth="1"
        />

        {/* Reflejo/brillo en la cabeza del pin */}
        <circle 
            cx="15" 
            cy="7" 
            r="2.5" 
            fill="white" 
            fillOpacity="0.5" // Ligeramente transparente
        />
    </svg>
);


// --> 1. FUNCIÓN PARA GENERAR UN CÍRCULO GEOJSON (RADIAL GEODÉSICO)
// Basado en https://stackoverflow.com/questions/2783857/draw-a-circle-with-coordinates-on-a-map
function createGeoJSONCircle(center, radiusInMeters, points = 64) {
    const coords = {
        latitude: center[1],
        longitude: center[0]
    };

    const km = radiusInMeters / 1000;

    const ret = [];
    const distanceX = km / (111.320 * Math.cos(coords.latitude * Math.PI / 180));
    const distanceY = km / 110.574;

    let theta, x, y;
    for (let i = 0; i < points; i++) {
        theta = (i / points) * (2 * Math.PI);
        x = distanceX * Math.cos(theta);
        y = distanceY * Math.sin(theta);

        ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]); // Cierra el polígono

    return {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [ret]
            }
        }]
    };
}



// --> 2. COMPONENTE PARA EL MARCADOR PDI CON TOOLTIP
const PdiMarkerWithTooltip = ({ name, longitude, latitude , color}) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <Marker longitude={longitude} latitude={latitude} anchor="bottom">
            <div
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                style={{
                    position: 'relative',
                    cursor: 'pointer',
                    fontSize: '24px',
                    textShadow: '0 1px 3px rgba(0,0,0,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <CustomMapPin color={color} />
                {showTooltip && (
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '100%', // Posiciona el tooltip encima del emoji
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            fontSize: '12px',
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none', // Asegura que el tooltip no interfiera con eventos del marcador
                            marginBottom: '5px' // Pequeño espacio entre el emoji y el tooltip
                        }}
                    >
                        {name}
                    </div>
                )}
            </div>
        </Marker>
    );
};


export function MapboxMap({ viewState, onViewStateChange, vehicles, selectedVehicles }) {
    const selectedVehiclesIds = useSelector((state) => 
        state.vehicle?.selectedVehicles?.map(v => v.id) || [], (prev, next) => {
            return JSON.stringify(prev) === JSON.stringify(next);
        }
    );

    const showPdiMarkers = useSelector((state) => state.pdiView.showPdiMarkers);
    const showGeofences = useSelector((state) => state.geofenceView.showGeofences);

    useEffect(() => {
        console.log('El estado de showPdiMarkers cambió a:', showPdiMarkers);
    }, [showPdiMarkers]); 

    const pdiData = useSelector((state) => state.pdiView.pdiData);
    const geofenceData = useSelector((state) => state.geofenceView.geofenceData);

    const geofencePolygons = useMemo(() => {
        console.log('geofenceData', geofenceData);
        return geofenceData.map(geofence => ({
            id: `geofence-polygon-${geofence.id}`,
            color: '#' + geofence.hex_color,
            data: {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        // Mapbox espera las coordenadas dentro de un array adicional
                        coordinates: [geofence.polygon] 
                    }
                }]
            }
        }));
    }, [geofenceData]);
    
    const animationRef = useRef(null);
    const animationProgressRef = useRef(0);
    const [isAnimationPaused, setIsAnimationPaused] = useState(false);
    const [isAnimationComplete, setIsAnimationComplete] = useState(false);
    const [animatedPositions, setAnimatedPositions] = useState({});

    // --- MODIFICADO: Creación de los marcadores para los PDI (ahora usa el componente con tooltip) ---
    const pdiMarkers = useMemo(() => {
        return pdiData.map(pdi => (
            <PdiMarkerWithTooltip
                key={pdi.id}
                name={pdi.nombre}
                longitude={pdi.coordenadas.y}
                latitude={pdi.coordenadas.x}
                color={'#' + pdi.icono_hex_color} // <-- Pasa el color aquí
            />
        ));
    }, [pdiData]); 

    // --> 3. CREACIÓN DE LOS CÍRCULOS (RADIOS) DE LOS PDI EN FORMATO GEOJSON
    const pdiGeoJSONCircles = useMemo(() => {
        console.log('pdiData', pdiData);
        return pdiData.map(pdi => ({
            id: `pdi-circle-${pdi.id}`,
            data: createGeoJSONCircle([pdi.coordenadas.y, pdi.coordenadas.x], pdi.radio),
        }));
    }, [pdiData]);

    // --> 4. ESTILO DE LA CAPA PARA LOS CÍRCULOS (Radios)
    const circleLayerStyle = {
        id: 'pdi-circle-layer',
        type: 'fill',
        paint: {
            'fill-color': '#007cbf', // Color azul
            'fill-opacity': 0.2,    // Opacidad para que sea semitransparente
            'fill-outline-color': '#005f99' // Borde más oscuro
        }
    };

    const circleLayerProps = {
        type: 'fill',
        paint: {
            'fill-color': '#007cbf',
            'fill-opacity': 0.2,
            'fill-outline-color': '#005f99'
        }
    };



    // Función para interpolar entre dos puntos
    const interpolatePoint = (start, end, progress) => {
        return [
            start[0] + (end[0] - start[0]) * progress,
            start[1] + (end[1] - start[1]) * progress
        ];
    };

    // Función para obtener la posición actual en la ruta
    const getCurrentPosition = (route, progress) => {
        if (!route || route.length < 2) {
            return null;
        }
        
        const totalSegments = route.length - 1;
        const segmentIndex = Math.floor(progress * totalSegments);
        const segmentProgress = (progress * totalSegments) % 1;
        
        if (segmentIndex >= totalSegments) {
            return route[route.length - 1];
        }
        
        const start = route[segmentIndex];
        const end = route[segmentIndex + 1];
        
        const result = interpolatePoint(start, end, segmentProgress);
        
        return result;
    };

    // Función para calcular la dirección (heading) entre dos puntos
    const calculateHeading = (start, end) => {
        const deltaLng = end[0] - start[0];
        const deltaLat = end[1] - start[1];
        const heading = Math.atan2(deltaLng, deltaLat) * (180 / Math.PI);
        return heading;
    };

    // Función para obtener la dirección actual en la ruta
    const getCurrentHeading = (route, progress) => {
        if (!route || route.length < 2) return 0;
        
        const totalSegments = route.length - 1;
        const segmentIndex = Math.floor(progress * totalSegments);
        
        if (segmentIndex >= totalSegments) {
            const start = route[Math.max(0, totalSegments - 1)];
            const end = route[totalSegments];
            return calculateHeading(start, end);
        }
        
        const start = route[segmentIndex];
        const end = route[segmentIndex + 1];
        
        return calculateHeading(start, end);
    };

    // Función para reiniciar la animación
    const restartAnimation = () => {
        animationProgressRef.current = 0;
        setIsAnimationComplete(false);
        setIsAnimationPaused(false);
    };

    // Función para animar los vehículos
    const animateVehicles = () => {
        if (selectedVehicles.length === 0) return;

        const newPositions = {};
        
        selectedVehicles.forEach((vehicle) => {
            if (vehicle.route && vehicle.route.length > 0) {
                let route = vehicle.route;
                
                if (route.length === 1) {
                    const startPoint = route[0];
                    const startPointMapbox = [startPoint[1], startPoint[0]];
                    const endPoint = [
                        startPointMapbox[0] + 0.01,
                        startPointMapbox[1] + 0.01
                    ];
                    route = [startPointMapbox, endPoint];
                } else {
                    route = route.map(point => [point[1], point[0]]);
                }
                
                const currentPos = getCurrentPosition(route, animationProgressRef.current);
                const currentHeading = getCurrentHeading(route, animationProgressRef.current);
                
                if (currentPos && typeof currentPos[1] === 'number' && typeof currentPos[0] === 'number' && 
                    !isNaN(currentPos[1]) && !isNaN(currentPos[0]) && 
                    currentPos[1] >= -90 && currentPos[1] <= 90 && currentPos[0] >= -180 && currentPos[0] <= 180) {
                    
                    newPositions[vehicle.id] = {
                        position: currentPos,
                        heading: currentHeading
                    };
                }
            }
        });

        setAnimatedPositions(newPositions);

        if (!isAnimationPaused && animationProgressRef.current < 1) {
            animationProgressRef.current += 0.01;
            if (animationProgressRef.current >= 1) {
                animationProgressRef.current = 1;
                setIsAnimationComplete(true);
            }
        }
    };

    // Función para calcular el punto final de la animación
    const getAnimationEndPoint = (vehicles) => {
        if (!vehicles || vehicles.length === 0) return null;
        
        let allEndPoints = [];
        
        vehicles.forEach(vehicle => {
            if (vehicle.route && vehicle.route.length > 0) {
                let route = vehicle.route;
                
                if (route.length === 1) {
                    const startPoint = route[0];
                    const endPoint = [startPoint[1] + 0.01, startPoint[0] + 0.01];
                    allEndPoints.push(endPoint);
                } else {
                    const lastPoint = route[route.length - 1];
                    const endPoint = [lastPoint[1], lastPoint[0]];
                    allEndPoints.push(endPoint);
                }
            }
        });
        
        if (allEndPoints.length === 0) return null;
        
        const avgLng = allEndPoints.reduce((sum, point) => sum + point[0], 0) / allEndPoints.length;
        const avgLat = allEndPoints.reduce((sum, point) => sum + point[1], 0) / allEndPoints.length;
        
        return [avgLng, avgLat];
    };

    // Crear marcadores para los vehículos seleccionados
    const vehicleMarkers = useMemo(() => {
        if (!selectedVehicles || selectedVehicles.length === 0) {
            return [];
        }
        
        return selectedVehicles.map(vehicle => {
            const animatedData = animatedPositions[vehicle.id];
            
            let position;
            let heading = 0;
            
            if (animatedData) {
                position = animatedData.position;
                heading = animatedData.heading;
            } else {
                position = [
                    vehicle.posicion_actual?.lng || -101.956114,
                    vehicle.posicion_actual?.lat || 22.653024
                ];
            }
            
            if (!position || position.length !== 2 || 
                typeof position[0] !== 'number' || typeof position[1] !== 'number' ||
                isNaN(position[0]) || isNaN(position[1])) {
                return null;
            }
            
            return (
                <Marker
                    key={vehicle.id}
                    longitude={position[0]}
                    latitude={position[1]}
                    anchor="center"
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            transform: 'scale(1.2)',
                            transformOrigin: 'center center'
                        }}
                        title={`Vehículo ${vehicle.id} - ${vehicle.info?.nombre || 'Sin nombre'} - Pos: ${position[0].toFixed(4)}, ${position[1].toFixed(4)}`}
                    >
                        {/* Carrito SVG */}
                        <svg
                            width="48"
                            height="48"
                            viewBox="0 0 100 100"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{
                                transform: `rotate(${heading}deg)`,
                                transition: 'transform 0.3s ease',
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                            }}
                        >
                            <path
                                d="M25.192749,34.420269c0.3357525,0.7560654,1.8607941,0.8125992,3.406292,0.1262512c0.167984-0.074604,0.327858-0.1557655,0.4815159-0.2406273c0,11.4814987,0,26.826889,0,28.2994461c0,2.3790054,0.5286694,13.8334885,0.5286694,13.8334885s0.7930012,6.3440247,1.1454468,9.3398132s0.881115,6.344017,3.9650154,8.0181351s14.8908272,2.4671249,14.8908272,2.4671249s11.8069305-0.7930069,14.8908272-2.4671249c3.0839005-1.674118,3.6125717-5.0223465,3.9650192-8.0181351c0.3524399-2.9957886,1.1454468-9.3398132,1.1454468-9.3398132S70.14048,64.9843445,70.14048,62.6053391c0-1.4725571,0-16.8179474,0-28.2994461c0.153656,0.0848618,0.31353,0.1660233,0.481514,0.2406273c1.5454941,0.686348,3.0705414,0.6298141,3.4062881-0.1262512c0.3357544-0.7560692-0.6449127-1.9253502-2.1903915-2.6116791c-0.5907288-0.2623539-1.1779099-0.4152794-1.6974106-0.4629707c0-5.6102619,0-9.7120895,0-9.7120895s0.5755157-9.4140253-4.4349365-13.1873493c-4.7580185-3.5831833-6.5789948-4.405571-9.927227-4.6992683h-12.335598c-3.3482361,0.2936974-5.1692123,1.1160851-9.927227,4.6992683c-5.0104561,3.773324-4.4349346,13.1873493-4.4349346,13.1873493s0,4.1018276,0,9.7120895c-0.5195045,0.0476913-1.1066837,0.2006168-1.6974144,0.4629707C25.8376656,32.4949188,24.8569946,33.6641998,25.192749,34.420269z M50.3154068,88.6863174h-1.4097824c0,0-9.8694038,0.0108871-14.185936-2.9076767l0.6167793-12.5999374c0,0,4.8461266,2.2027893,13.5691566,1.9384537h1.4097824c8.7230301,0.2643356,13.5691605-1.9384537,13.5691605-1.9384537l0.6167755,12.5999374C60.1848106,88.6972046,50.3154068,88.6863174,50.3154068,88.6863174z M63.2454338,9.518898c0.4588013-0.4587994,1.6954613,0.0340099,2.7621498,1.1007042c1.0666962,1.0666943,1.5595093,2.3033524,1.100708,2.7621508c-0.4588013,0.4587994-1.6954575-0.0340099-2.7621536-1.1007042C63.2794456,11.2143488,62.7866364,9.9776964,63.2454338,9.518898z M48.0245094,21.4573059h3.1720123c0,0,3.8769035-0.2643337,10.1328125,1.674118s5.5510216,5.9915752,5.5510216,5.9915752l-2.0265656,9.7803669c-4.5817909-1.674118-14.5383835-1.674118-14.5383835-1.674118h-1.4097824c0,0-9.9565887,0-14.5383835,1.674118l-2.0265617-9.7803669c0,0-0.7048912-4.0531254,5.5510178-5.9915752S48.0245094,21.4573059,48.0245094,21.4573059z M32.9280968,10.6196022c1.0666924-1.0666943,2.3033524-1.5595036,2.7621498-1.1007042c0.4587975,0.4587984-0.034008,1.6954508-1.1007042,2.7621508c-1.0667152,1.0666943-2.3033752,1.5595036-2.7621517,1.1007042C31.3685932,12.9229546,31.8613796,11.6862965,32.9280968,10.6196022z"
                                fill="#FF0000"
                                stroke="#FFFFFF"
                                strokeWidth="0.5"
                            />
                        </svg>
                    </div>
                </Marker>
            );
        }).filter(Boolean);
    }, [selectedVehicles, animatedPositions]);

    // Iniciar y detener animación de vehículos
    useEffect(() => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }

        animationProgressRef.current = 0;
        setIsAnimationComplete(false);
        setIsAnimationPaused(false);
        setAnimatedPositions({});

        if (selectedVehicles.length > 0) {
            
            const endPoint = getAnimationEndPoint(selectedVehicles);
            if (endPoint) {
                onViewStateChange({
                    viewState: {
                        ...viewState,
                        longitude: endPoint[0],
                        latitude: endPoint[1],
                        zoom: Math.max(viewState.zoom || 10, 12),
                        transitionDuration: 2000,
                        transitionInterpolator: {
                            interpolatePosition: (from, to) => [to[0], to[1]]
                        }
                    }
                });
            }
            
            const animate = () => {
                animateVehicles();
                animationRef.current = requestAnimationFrame(animate);
            };
            animationRef.current = requestAnimationFrame(animate);
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
        };
    }, [selectedVehicles]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Map
                {...viewState}
                onMove={evt => onViewStateChange({ viewState: evt.viewState })}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={MAPBOX_TOKEN}
                attributionControl={false}
                reuseMaps={true}
            >
                {vehicleMarkers}
                
                {/* --- NUEVO: Renderizado condicional de los marcadores PDI --- */}
                {showPdiMarkers && pdiMarkers}

                {/* --> 5. RENDERIZADO CONDICIONAL DE LOS CÍRCULOS PDI */}
                {showPdiMarkers && pdiGeoJSONCircles.map(pdiCircle => (
                    <Source key={pdiCircle.id} id={pdiCircle.id} type="geojson" data={pdiCircle.data}>
                        <Layer 
                            id={`layer-${pdiCircle.id}`} // ID único para la capa
                            {...circleLayerProps} 
                        />
                    </Source>
                ))}

                {showGeofences && geofencePolygons.map(polygon => (
                    <Source key={polygon.id} id={polygon.id} type="geojson" data={polygon.data}>
                        {/* Capa para el relleno del polígono */}
                        <Layer
                            id={`layer-fill-${polygon.id}`}
                            type="fill"
                            paint={{
                                'fill-color': polygon.color, // Color dinámico
                                'fill-opacity': 0.3,
                            }}
                        />
                        {/* Capa para el borde del polígono */}
                        <Layer
                            id={`layer-line-${polygon.id}`}
                            type="line"
                            paint={{
                                'line-color': polygon.color,
                                'line-width': 2,
                            }}
                        />
                    </Source>
                ))}

  {/* --- NUEVO: Renderizado condicional de los POLÍGONOS de Geocercas --- */}
  {showGeofences && geofencePolygons.map(polygon => (
                    <Source key={polygon.id} id={polygon.id} type="geojson" data={polygon.data}>
                        {/* Capa para el relleno del polígono */}
                        <Layer
                            id={`layer-fill-${polygon.id}`}
                            type="fill"
                            paint={{
                                'fill-color': polygon.color, // Color dinámico
                                'fill-opacity': 0.3,
                            }}
                        />
                        {/* Capa para el borde del polígono */}
                        <Layer
                            id={`layer-line-${polygon.id}`}
                            type="line"
                            paint={{
                                'line-color': polygon.color,
                                'line-width': 2,
                            }}
                        />
                    </Source>
                ))}
                
            </Map>

            {/* Botón de control de animación */}
            {/* {selectedVehicles.length > 0 && (
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    zIndex: 1000,
                    background: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
                }}
                onClick={() => {
                    if (isAnimationComplete) {
                        restartAnimation();
                    } else {
                        setIsAnimationPaused(!isAnimationPaused);
                    }
                }}
                >
                    <span style={{ fontSize: '18px' }}>
                        {isAnimationComplete ? '🔄' : (isAnimationPaused ? '▶️' : '⏸️')}
                    </span>
                    <span>
                        {isAnimationComplete ? 'Reiniciar' : (isAnimationPaused ? 'Reanudar' : 'Pausar')} Animación
                    </span>
                </div>
            )} */}

            {/* Indicador de progreso */}
            {/* {selectedVehicles.length > 0 && !isAnimationComplete && (
                <div style={{
                    position: 'absolute',
                    top: '80px',
                    left: '20px',
                    zIndex: 1000,
                    background: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    fontSize: '14px',
                    minWidth: '140px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
                }}>
                    <div style={{ marginBottom: '8px', fontWeight: '500' }}>
                        Progreso: {Math.round(animationProgressRef.current * 100)}%
                    </div>
                    <div style={{
                        width: '100%',
                        height: '6px',
                        background: '#eee',
                        borderRadius: '3px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${animationProgressRef.current * 100}%`,
                            height: '100%',
                            background: '#1976d2',
                            transition: 'width 0.1s ease',
                            borderRadius: '3px'
                        }} />
                    </div>
                </div>
            )} */}
        </div>
    );
}