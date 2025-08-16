import React from 'react';
import styled from 'styled-components';
import expanded from '../../../assets/expand-right.svg';
import car_info from '../../../assets/car_info.png';

const DeviceContent = ({ onClick }) => {
  return (
    <StyledDeviceContent onClick={onClick}>
      <CarIcon>
        <img src={car_info} alt="Car Icon" />
      </CarIcon>
      <DeviceInfo>
        <DeviceColumn>
          <DeviceTitle>Datos unidad</DeviceTitle>
          <DeviceDescription>
            <DescriptionText>Marca: Toyota</DescriptionText>
            <DescriptionText>Modelo: Corolla</DescriptionText>
            <DescriptionText>Año: 2020</DescriptionText>
            <DescriptionText>Placa : AY6-D2-W2</DescriptionText>
          </DeviceDescription>
        </DeviceColumn>
        <DeviceColumn>
          <DeviceTitle>Datos dispositivo</DeviceTitle>
          <DeviceDescription>
            <DescriptionText>Nombre: Toyota</DescriptionText>
            <DescriptionText>Color: Corolla</DescriptionText>
            <DescriptionText>Tipo: Carro deportivo</DescriptionText>
            <DescriptionText>Nombre chofer : Mario Tejo</DescriptionText>
          </DeviceDescription>
        </DeviceColumn>
      </DeviceInfo>

      <Actions>
        <MapButton>Mapa</MapButton>
        <ExpandIcon src={expanded} alt="Expand" />
      </Actions>
    </StyledDeviceContent>
  );
};

const StyledDeviceContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid grey;
  border-radius: 10px;
  padding: 15px;
  flex-wrap: wrap;
  cursor: pointer; /* Hace que todo el componente sea clickeable */
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1); /* Cambia el fondo al pasar el mouse */
  }
`;

const CarIcon = styled.div`
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  img {
    width: 100%;
    height: auto;
  }
`;

const DeviceInfo = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  margin-left: 50px;
  flex-basis: 50%;
  gap: 40px;
  @media (max-width: 768px) {
    flex-basis: 100%;
    margin-left: 0;
    margin-top: 10px;
    flex-direction: column;
    gap: 20px;
  }
`;

const DeviceColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const DeviceTitle = styled.h2`
  font-size: 14px;
  margin: 0 0 2px 0;
  color: white;
  text-align: left;
`;

const DeviceDescription = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DescriptionText = styled.p`
  font-size: 12px;
  margin: 0;
  color: white;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  flex-basis: 25%;
  justify-content: flex-end;
  @media (max-width: 768px) {
    flex-basis: 100%;
    justify-content: space-between;
    margin-top: 10px;
  }
`;

const MapButton = styled.button`
  font-size: 14px;
  color: black;
  background: #CCB800;
  border: 1px solid grey;
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
  margin-right: 50px;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ExpandIcon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

export default DeviceContent;