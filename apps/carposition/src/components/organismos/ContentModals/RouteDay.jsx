import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import Map, { Marker, Source, Layer } from 'react-map-gl/mapbox';
import { FaRoute, FaMapPin, FaFlagCheckered, FaCar, FaCrosshairs } from 'react-icons/fa';
import * as turf from '@turf/turf';
import { route } from '../../../utilities/dataEstatica.jsx';

// Tu token de Mapbox
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYXJub2xkYWxlamFuZHJvbGFyYSIsImEiOiJjbWVtZ3ZtOG0wcnJyMmpwbGZ6ajloamYzIn0.y2qjqVBVoFYJSPaDwayFGw';

// SVG para la flecha
const arrowSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="24" viewBox="0 0 80 24"><polyline points="50 6, 56 12, 50 18" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
const arrowSvgDataUrl = `data:image/svg+xml;base64,${btoa(arrowSvgString)}`;

// --- Estilos ---
const ComponentWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: #e9ecef;
`;
const MapContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
const ControlsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
`;
const RouteButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: #218838;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  }
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
    transform: none;
  }
`;
const FollowButtonContainer = styled.div`
  position: absolute;
  bottom: 90px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 10;
  pointer-events: none;
`;
const FollowButton = styled(RouteButton)`
  pointer-events: auto;
  background-color: #fff;
  color: #343a40;
  border: 1px solid #e9ecef;
  transform: none;
  &:hover {
    background-color: #f8f9fa;
    transform: translateY(-2px);
  }
`;
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
`;
const CarIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background-color: #343a40;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  animation: ${fadeIn} 0.3s ease-out;
`;

// --- Componente Principal ---
export function RouteDay() {
  const [viewState, setViewState] = useState({
    longitude: -97.898,
    latitude: 22.374,
    zoom: 14,
    pitch: 45,
    bearing: 0
  });

  const [animatedRoute, setAnimatedRoute] = useState(null);
  const [carPosition, setCarPosition] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isFollowing, setIsFollowing] = useState(true);
  
  const animationIntervalRef = useRef(null);
  const isFollowingRef = useRef(true);
  const mapRef = useRef();

  useEffect(() => {
    isFollowingRef.current = isFollowing;
  }, [isFollowing]);

  useEffect(() => {
    return () => {
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
    };
  }, []);

  const handleMapLoad = () => {
    const map = mapRef.current.getMap();
    if (map.hasImage('arrow-icon')) {
      setIsMapReady(true);
      return;
    }
    const image = new Image(80, 24);
    image.src = arrowSvgDataUrl;
    image.onload = () => {
      if (!map.hasImage('arrow-icon')) map.addImage('arrow-icon', image);
      setIsMapReady(true);
    };
  };

  const handleViewRoute = (e) => {
    e.stopPropagation();

    if (!isMapReady) return;
    if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
    
    setIsFollowing(true);
    
    const fullRouteGeoJSON = { type: 'Feature', geometry: { type: 'LineString', coordinates: route } };
    const routeBbox = turf.bbox(fullRouteGeoJSON);
    mapRef.current.fitBounds([ [routeBbox[0], routeBbox[1]], [routeBbox[2], routeBbox[3]] ], { padding: 80, duration: 1500 });

    let coordinateIndex = 0;
    animationIntervalRef.current = setInterval(() => {
      if (coordinateIndex < route.length) {
        const currentPos = route[coordinateIndex];
        setCarPosition(currentPos);
        const currentLine = { type: 'Feature', geometry: { type: 'LineString', coordinates: route.slice(0, coordinateIndex + 1) } };
        setAnimatedRoute(currentLine);

        if (isFollowingRef.current) {
          mapRef.current.panTo([currentPos[0], currentPos[1]], { duration: 100, easing: (t) => t });
        }
        
        coordinateIndex++;
      } else {
        clearInterval(animationIntervalRef.current);
      }
    }, 50);
  };
  
  const handleMoveStart = (e) => {
    if (e.originalEvent) {
      setIsFollowing(false);
    }
  };

  const handleFollowClick = (e) => {
    e.stopPropagation();

    setIsFollowing(true);
    if(mapRef.current && carPosition) {
        mapRef.current.panTo([carPosition[0], carPosition[1]], { duration: 1000 });
    }
  };

  const startPoint = route[0];
  const endPoint = route[route.length - 1];

  return (
    <ComponentWrapper>
      <MapContainer>
        <Map
          ref={mapRef}
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          onMoveStart={handleMoveStart}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/outdoors-v12"
          mapboxAccessToken={MAPBOX_TOKEN}
          onLoad={handleMapLoad}
        >
          {animatedRoute && (
            <>
              <Source id="route-source" type="geojson" data={animatedRoute}>
                <Layer
                  id="route-casing-layer"
                  type="line"
                  paint={{ 'line-color': '#198754', 'line-width': 12, 'line-opacity': 0.8 }}
                  layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                />
                <Layer
                  id="route-pattern-layer"
                  type="line"
                  paint={{ 'line-pattern': 'arrow-icon', 'line-width': 7 }}
                  layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                />
              </Source>
              
              <Marker longitude={startPoint[0]} latitude={startPoint[1]} anchor="bottom">
                <FaMapPin size={30} color="#28a745" />
              </Marker>
              
              <Marker longitude={endPoint[0]} latitude={endPoint[1]} anchor="bottom">
                <FaFlagCheckered size={30} color="#dc3545" />
              </Marker>

              {carPosition && (
                 <Marker longitude={carPosition[0]} latitude={carPosition[1]} anchor="center">
                   <CarIcon><FaCar size={16}/></CarIcon>
                 </Marker>
              )}
            </>
          )}
        </Map>
      </MapContainer>
      
      {animatedRoute && !isFollowing && (
        <FollowButtonContainer>
          <FollowButton onClick={handleFollowClick}>
            <FaCrosshairs/>
            <span>Seguir Vehículo</span>
          </FollowButton>
        </FollowButtonContainer>
      )}

      <ControlsContainer>
        <RouteButton onClick={handleViewRoute} disabled={!isMapReady}>
          <FaRoute />
          <span>{isMapReady ? 'Ver recorrido del día' : 'Cargando mapa...'}</span>
        </RouteButton>
      </ControlsContainer>
    </ComponentWrapper>
  );
}