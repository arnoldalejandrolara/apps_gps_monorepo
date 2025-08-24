import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../styled-components/leaflet.css';
import styled from 'styled-components';

// Fix para los iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para actualizar la vista del mapa
function MapUpdater({ viewState }) {
  const map = useMap();
  
  useEffect(() => {
    if (viewState) {
      map.setView(
        [viewState.latitude, viewState.longitude],
        viewState.zoom,
        {
          animate: true,
          duration: 0.5
        }
      );
    }
  }, [map, viewState]);

  return null;
}

// Icono personalizado para vehículos
const vehicleIcon = L.divIcon({
  className: 'vehicle-marker',
  html: `
    <div style="
      width: 30px;
      height: 30px;
      background: #e53e3e;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 10px solid white;
        transform: rotate(0deg);
      "></div>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

// Componente para los marcadores de vehículos
function VehicleMarkers({ vehicles, selectedVehicles }) {
  const map = useMap();
  const markersRef = useRef([]);
  
  useEffect(() => {
    // Limpiar marcadores existentes
    markersRef.current.forEach(marker => {
      map.removeLayer(marker);
    });
    markersRef.current = [];

    // Agregar nuevos marcadores para vehículos seleccionados
    selectedVehicles.forEach((vehicle) => {
      if (vehicle.route && vehicle.route.length > 0) {
        const [lng, lat] = vehicle.route[0];
        if (typeof lat === 'number' && typeof lng === 'number' && 
            !isNaN(lat) && !isNaN(lng) && 
            lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          
          const marker = L.marker([lat, lng], { icon: vehicleIcon })
            .addTo(map)
            .bindPopup(`
              <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
                <h3 style="margin: 0 0 10px 0; color: #1a1a1a; font-size: 16px;">Unidad #${vehicle.id || 1}</h3>
                <p style="margin: 4px 0; color: #4a5568; font-size: 14px;"><strong>Estado:</strong> ${vehicle.info?.status || 'Encendido'}</p>
                <p style="margin: 4px 0; color: #4a5568; font-size: 14px;"><strong>Chofer:</strong> ${vehicle.info?.driver || 'Lara'}</p>
                <p style="margin: 4px 0; color: #4a5568; font-size: 14px;"><strong>Última actualización:</strong> ${vehicle.info?.lastUpdate || 'N/A'}</p>
              </div>
            `);
          
          markersRef.current.push(marker);
        }
      }
    });
  }, [map, selectedVehicles]);

  return null;
}

const MapContainerStyled = styled(MapContainer)`
  width: 100%;
  height: 100%;
  z-index: 1;
`;

export function OSMMap({ 
  viewState, 
  onViewStateChange, 
  vehicles = [], 
  selectedVehicles = [],
  children 
}) {
  const mapRef = useRef(null);

  const handleMapMove = (e) => {
    const map = e.target;
    const center = map.getCenter();
    const zoom = map.getZoom();
    
    if (onViewStateChange) {
      onViewStateChange({
        viewState: {
          longitude: center.lng,
          latitude: center.lat,
          zoom: zoom,
          pitch: 0,
          bearing: 0,
        }
      });
    }
  };

  return (
    <MapContainerStyled
      ref={mapRef}
      center={[viewState?.latitude || 19.4326, viewState?.longitude || -99.1332]}
      zoom={viewState?.zoom || 14}
      style={{ height: '100%', width: '100%' }}
      onMove={handleMapMove}
      onZoom={handleMapMove}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapUpdater viewState={viewState} />
      <VehicleMarkers vehicles={vehicles} selectedVehicles={selectedVehicles} />
      
      {children}
    </MapContainerStyled>
  );
}
