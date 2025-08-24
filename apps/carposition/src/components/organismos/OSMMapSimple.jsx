import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: #f0f0f0;
`;

const MapContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #666;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
`;

const MapIcon = styled.div`
  width: 60px;
  height: 60px;
  background: #e53e3e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  
  &::after {
    content: '';
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 12px solid white;
    transform: rotate(0deg);
  }
`;

const VehicleInfo = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  max-width: 300px;
`;

const VehicleTitle = styled.h3`
  margin: 0 0 15px 0;
  color: #1a1a1a;
  font-size: 18px;
`;

const VehicleDetail = styled.p`
  margin: 8px 0;
  color: #4a5568;
  font-size: 14px;
`;

const MapControls = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  gap: 10px;
`;

const ControlButton = styled.button`
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  &:hover {
    background: #f5f5f5;
  }
`;

export function OSMMapSimple({ 
  viewState, 
  onViewStateChange, 
  vehicles = [], 
  selectedVehicles = [],
  children 
}) {
  const mapRef = useRef(null);

  // Función para manejar el zoom
  const handleZoom = (direction) => {
    const newZoom = Math.max(1, Math.min(20, (viewState?.zoom || 14) + direction));
    if (onViewStateChange) {
      onViewStateChange({
        viewState: {
          ...viewState,
          zoom: newZoom,
        }
      });
    }
  };

  // Función para centrar en vehículo seleccionado
  const centerOnVehicle = () => {
    if (selectedVehicles.length > 0) {
      const vehicle = selectedVehicles[0];
      if (vehicle.route && vehicle.route.length > 0) {
        const [lng, lat] = vehicle.route[0];
        if (onViewStateChange) {
          onViewStateChange({
            viewState: {
              longitude: lng,
              latitude: lat,
              zoom: 15,
              pitch: 0,
              bearing: 0,
            }
          });
        }
      }
    }
  };

  return (
    <MapContainer ref={mapRef}>
      <MapControls>
        <ControlButton onClick={() => handleZoom(1)}>+</ControlButton>
        <ControlButton onClick={() => handleZoom(-1)}>-</ControlButton>
        <ControlButton onClick={centerOnVehicle}>📍</ControlButton>
      </MapControls>
      
      <MapContent>
        <MapIcon />
        
        <VehicleInfo>
          <VehicleTitle>OpenStreetMap</VehicleTitle>
          <VehicleDetail>
            <strong>Latitud:</strong> {viewState?.latitude?.toFixed(6) || '19.4326'}
          </VehicleDetail>
          <VehicleDetail>
            <strong>Longitud:</strong> {viewState?.longitude?.toFixed(6) || '-99.1332'}
          </VehicleDetail>
          <VehicleDetail>
            <strong>Zoom:</strong> {viewState?.zoom || 14}
          </VehicleDetail>
          
          {selectedVehicles.length > 0 && (
            <>
              <VehicleDetail style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                <strong>Vehículos seleccionados:</strong> {selectedVehicles.length}
              </VehicleDetail>
              {selectedVehicles.map((vehicle, index) => (
                <VehicleDetail key={index}>
                  Unidad #{vehicle.id || index + 1} - {vehicle.info?.status || 'Activo'}
                </VehicleDetail>
              ))}
            </>
          )}
        </VehicleInfo>
        
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#999' }}>
          Implementación simplificada de OSM
        </div>
      </MapContent>
      
      {children}
    </MapContainer>
  );
}
