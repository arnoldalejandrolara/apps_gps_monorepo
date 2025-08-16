import React, { useState } from 'react';
import styled from 'styled-components';
import DeviceContent from './DeviceContent';
import DeviceSettings from './DeviceSettings';
import "../../../styled-components/animations.css"; // Archivo CSS para manejar las animaciones

const DevicesContent = () => {
  const [currentScreen, setCurrentScreen] = useState('devices'); // Estado para manejar la pantalla actual
  const [selectedDevice, setSelectedDevice] = useState(null); // Estado para manejar el dispositivo seleccionado

  const handleDeviceClick = (deviceId) => {
    setSelectedDevice(deviceId); // Aquí podrías pasar información del dispositivo
    setCurrentScreen('settings'); // Cambiar a la pantalla de configuración
  };

  const handleBack = () => {
    setSelectedDevice(null); // Limpiar el dispositivo seleccionado
    setCurrentScreen('devices'); // Regresar a la pantalla de dispositivos
  };

  return (
    <Container>
      <div className={`screen ${currentScreen === 'devices' ? 'active' : 'hidden'}`}>
        <Section>
          <Title>Mis dispositivos</Title>
          <HorizontalLine />

          <SearchContainer>
            <SearchInput 
              type="text" 
              placeholder="Buscar dispositivo..." 
            />
          </SearchContainer>

          <ContentContainer>
            <DeviceContent onClick={() => handleDeviceClick(1)} />
            <DeviceContent onClick={() => handleDeviceClick(2)} />
            <DeviceContent onClick={() => handleDeviceClick(3)} />
            <DeviceContent onClick={() => handleDeviceClick(4)} />
            <DeviceContent onClick={() => handleDeviceClick(5)} />

          </ContentContainer>
        </Section>
      </div>

      <div className={`screen ${currentScreen === 'settings' ? 'active' : 'hidden'}`}>
        <DeviceSettings deviceId={selectedDevice} onBack={handleBack} />
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

const Section = styled.div`
  margin-bottom: 40px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
  width: 100%;
  text-align: left;
  color: white;
`;

const HorizontalLine = styled.hr`
  width: 100%;
  border: 1px solid #333333;
  margin-bottom: 25px;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const SearchInput = styled.input`
  font-size: 14px;
  padding: 8px;
  border: 1px solid grey;
  border-radius: 4px;
  color: white;
  background: transparent;
  width: 40%;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto; /* Habilita scroll vertical */
  
`;

export default DevicesContent;