import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../styled-components/leaflet.css';
import styled from 'styled-components';

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

export function OSMMapVanilla({ 
  viewState, 
  onViewStateChange, 
  vehicles = [], 
  selectedVehicles = [],
  children 
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const isUpdatingRef = useRef(false);
  const animationRef = useRef(null);
  const animationProgressRef = useRef(0);
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  // Función helper para actualizar el estado de manera segura
  const safeUpdateViewState = (newViewState) => {
    if (onViewStateChange && !isUpdatingRef.current && (
      Math.abs(newViewState.longitude - (viewState?.longitude || 0)) > 0.0001 ||
      Math.abs(newViewState.latitude - (viewState?.latitude || 0)) > 0.0001 ||
      newViewState.zoom !== (viewState?.zoom || 14)
    )) {
      isUpdatingRef.current = true;
      onViewStateChange({
        viewState: newViewState
      });
      // Resetear el flag después de un breve delay
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
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
    if (!route || route.length < 2) return null;
    
    const totalSegments = route.length - 1;
    const segmentIndex = Math.floor(progress * totalSegments);
    const segmentProgress = (progress * totalSegments) % 1;
    
    if (segmentIndex >= totalSegments) {
      return route[route.length - 1];
    }
    
    const start = route[segmentIndex];
    const end = route[segmentIndex + 1];
    
    return interpolatePoint(start, end, segmentProgress);
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
      // Si estamos en el último punto, usar la dirección del segmento anterior
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
    if (!mapInstanceRef.current || selectedVehicles.length === 0) return;

    // Limpiar marcadores existentes
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Agregar marcadores animados para vehículos seleccionados
    selectedVehicles.forEach((vehicle, index) => {
      if (vehicle.route && vehicle.route.length > 0) {
        const currentPos = getCurrentPosition(vehicle.route, animationProgressRef.current);
        const currentHeading = getCurrentHeading(vehicle.route, animationProgressRef.current);
        
        if (currentPos && typeof currentPos[1] === 'number' && typeof currentPos[0] === 'number' && 
            !isNaN(currentPos[1]) && !isNaN(currentPos[0]) && 
            currentPos[1] >= -90 && currentPos[1] <= 90 && currentPos[0] >= -180 && currentPos[0] <= 180) {
          
          // Crear icono de carro SVG con orientación dinámica
          const carIcon = L.divIcon({
            className: 'vehicle-marker',
            html: `
              <div style="
                width: 48px;
                height: 48px;
                transform: rotate(${currentHeading}deg);
                transition: transform 0.3s ease;
                transform-origin: center center;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
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
            `,
            iconSize: [48, 48],
            iconAnchor: [24, 24],
          });
          
          const marker = L.marker([currentPos[1], currentPos[0]], { icon: carIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup(`
              <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
                <h3 style="margin: 0 0 10px 0; color: #1a1a1a; font-size: 16px;">Unidad #${vehicle.id || index + 1}</h3>
                <p style="margin: 4px 0; color: #4a5568; font-size: 14px;"><strong>Estado:</strong> ${vehicle.info?.status || 'En movimiento'}</p>
                <p style="margin: 4px 0; color: #4a5568; font-size: 14px;"><strong>Chofer:</strong> ${vehicle.info?.driver || 'Lara'}</p>
                <p style="margin: 4px 0; color: #4a5568; font-size: 14px;"><strong>Progreso:</strong> ${Math.round(animationProgressRef.current * 100)}%</p>
                <p style="margin: 4px 0; color: #4a5568; font-size: 14px;"><strong>Dirección:</strong> ${Math.round(currentHeading)}°</p>
              </div>
            `);
          
          markersRef.current.push(marker);
        }
      }
    });

    // Continuar la animación solo si no está pausada y no ha terminado
    if (!isAnimationPaused && animationProgressRef.current < 1) {
      animationProgressRef.current += 0.01; // Incremento más lento para animación suave
      if (animationProgressRef.current >= 1) {
        animationProgressRef.current = 1; // Mantener en el final, no reiniciar
        setIsAnimationComplete(true);
        console.log('Animación completada');
      }
    }
  };

  // Fix para los iconos de Leaflet
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  // Inicializar mapa
  useEffect(() => {
    if (!mapRef.current) return;

    // Limpiar mapa existente
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Crear nuevo mapa
    const map = L.map(mapRef.current, {
      center: [viewState?.latitude || 19.4326, viewState?.longitude || -99.1332],
      zoom: viewState?.zoom || 14,
      zoomControl: true,
      attributionControl: true,
      dragging: true,
      touchZoom: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
    });

    // Agregar capa de tiles OSM
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Evento cuando los tiles se cargan
    tileLayer.on('load', () => {
      console.log('OSM tiles cargados correctamente');
      map.invalidateSize();
    });

    // Eventos del mapa (eliminado moveend duplicado)

    // Evento para detectar movimiento en tiempo real (solo cuando termina)
    map.on('moveend', () => {
      console.log('Mapa movido');
      const center = map.getCenter();
      const zoom = map.getZoom();
      
      safeUpdateViewState({
        longitude: center.lng,
        latitude: center.lat,
        zoom: zoom,
        pitch: 0,
        bearing: 0,
      });
    });

    // Evento para detectar zoom
    map.on('zoomend', () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      
      safeUpdateViewState({
        longitude: center.lng,
        latitude: center.lat,
        zoom: zoom,
        pitch: 0,
        bearing: 0,
      });
    });

    // Evento para detectar clics en el mapa
    map.on('click', (e) => {
      console.log('Clic en el mapa:', e.latlng);
    });

    // Forzar renderizado del mapa
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  // Actualizar vista del mapa
  useEffect(() => {
    if (mapInstanceRef.current && viewState) {
      mapInstanceRef.current.setView(
        [viewState.latitude, viewState.longitude],
        viewState.zoom,
        {
          animate: true,
          duration: 0.5
        }
      );
    }
  }, [viewState]);

  // Iniciar y detener animación de vehículos
  useEffect(() => {
    // Detener animación anterior si existe
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    // Reiniciar estado de animación cuando cambian los vehículos
    animationProgressRef.current = 0;
    setIsAnimationComplete(false);
    setIsAnimationPaused(false);

    // Iniciar nueva animación si hay vehículos seleccionados
    if (selectedVehicles.length > 0 && mapInstanceRef.current) {
      const animate = () => {
        animateVehicles();
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }

    // Cleanup al desmontar o cambiar vehículos
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [selectedVehicles, mapInstanceRef.current]);

  return (
    <MapContainer ref={mapRef}>
      {/* Botón de control de animación */}
      {/* {selectedVehicles.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onClick={() => {
          if (isAnimationComplete) {
            restartAnimation();
          } else {
            setIsAnimationPaused(!isAnimationPaused);
          }
        }}
        >
          <span style={{ fontSize: '16px' }}>
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
          top: '60px',
          left: '20px',
          zIndex: 1000,
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          fontSize: '12px',
          minWidth: '120px'
        }}>
          <div style={{ marginBottom: '4px' }}>
            Progreso: {Math.round(animationProgressRef.current * 100)}%
          </div>
          <div style={{
            width: '100%',
            height: '4px',
            background: '#eee',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${animationProgressRef.current * 100}%`,
              height: '100%',
              background: '#e53e3e',
              transition: 'width 0.1s ease'
            }} />
          </div>
        </div>
      )} */}
      
      {children}
    </MapContainer>
  );
}
