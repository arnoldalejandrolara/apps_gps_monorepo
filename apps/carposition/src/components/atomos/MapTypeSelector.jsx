import React from 'react';
import styled from 'styled-components';
import { MapIcon, GlobeIcon } from 'lucide-react';

const SelectorContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  overflow: hidden;
`;

const MapTypeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: ${props => props.active ? '#1976d2' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  min-width: 140px;
  
  &:hover {
    background: ${props => props.active ? '#1565c0' : '#f5f5f5'};
  }
  
  &:first-child {
    border-bottom: 1px solid #e0e0e0;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export function MapTypeSelector({ mapType, onMapTypeChange }) {
  return (
    <SelectorContainer>
      <MapTypeButton
        active={mapType === 'google'}
        onClick={() => onMapTypeChange('google')}
      >
        <IconWrapper>
          <MapIcon size={16} />
        </IconWrapper>
        Google Maps
      </MapTypeButton>
      
      <MapTypeButton
        active={mapType === 'osm'}
        onClick={() => onMapTypeChange('osm')}
      >
        <IconWrapper>
          <GlobeIcon size={16} />
        </IconWrapper>
        OpenStreetMap
      </MapTypeButton>
    </SelectorContainer>
  );
}
