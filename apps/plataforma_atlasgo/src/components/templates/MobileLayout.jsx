import styled from 'styled-components';
import { MapaTemplate } from './MapaTemplate';

const MobileContainer = styled.div`
  position: relative;
  width: 100%;
  height: calc(100vh - 60px); /* Restamos el espacio del BottomMenu */
  overflow: hidden;
`;

const MapContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const ContentContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: ${props => props.isMapVisible ? 'none' : 'auto'};
  background-color: ${props => props.isMapVisible ? 'transparent' : props.theme.bgtotal};
`;

export function MobileLayout({ children, isMapVisible = true }) {
  return (
    <MobileContainer>
      <MapContainer>
        <MapaTemplate />
      </MapContainer>
      <ContentContainer isMapVisible={isMapVisible}>
        {children}
      </ContentContainer>
    </MobileContainer>
  );
} 