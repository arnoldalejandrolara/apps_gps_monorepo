import React from 'react';
import styled from 'styled-components';
import { FaBolt } from 'react-icons/fa';
import { CiBatteryCharging } from "react-icons/ci";

// Estilos con styled-components
const Container = styled.div`
  padding: 5px;

  border-radius: 10px;
  width: 100%; /* Permite que el componente se ajuste al ancho de su contenedor padre */
  max-width: 100%; /* Asegura que no se desborde */
  box-sizing: border-box;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; /* Espacia las columnas */
  flex-wrap: wrap;
`;

const BatteryColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Alinea el contenido a la izquierda */
  justify-content: center;
  width: 68%; /* La columna de batería ocupa el 68% del ancho */
  box-sizing: border-box;
`;

const VoltageColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Alinea el contenido a la izquierda */
  justify-content: center;
  width: 30%; /* La columna de voltaje ocupa el 30% del ancho */
  box-sizing: border-box;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  flex-wrap: wrap;
`;

const Title = styled.h4`
  margin: 0;
  font-weight: 400;
  font-size: 10px;
`;

const BatteryBlocksRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (min-width: 570px) {
    flex-direction: row; /* Cambia a row en pantallas grandes */
    align-items: center; /* Alinea verticalmente los bloques y el texto */
  }
`;

const BatteryBlocks = styled.div`
  display: flex;
  gap: 2px;
  margin-right: 10px;
`;

const BatteryBlock = styled.div`
  width: 12px;
  height: 20px;
  border-radius: 5px;
  background-color: ${(props) => (props.filled ? '#4caf50' : '#363636')};

   @media (min-width: 570px) {
    height: 30px;
  }
`;

const Icon = styled.div`
  display: flex;
  justify-content: center;
  font-size: 18px;
  margin-right: 8px;
  color: ${(props) => props.color || 'inherit'};
`;

const Text = styled.span`
  font-size: 12px;

  @media (min-width: 570px) {
    font-size: 20px; /* Aumenta el tamaño de la letra */
    margin-left: 10px; /* Agrega un margen para separar el texto de los bloques */
  }
`;

const GridsSmall = ({ batteryLevel = 75, voltage = 12.8 }) => {
  const batteryBlocks = Array(5).fill(null); // Simula 5 bloques de batería

  return (
    <Container>
      <Row>
        {/* Columna 1: Batería */}
        <BatteryColumn>
          <TitleRow>
            <Icon>
              <CiBatteryCharging />
            </Icon>
            <Title>Batería</Title>
          </TitleRow>
          <BatteryBlocksRow>
            <BatteryBlocks>
              {batteryBlocks.map((_, index) => (
                <BatteryBlock key={index} filled={index < batteryLevel / 20} />
              ))}
            </BatteryBlocks>
            <Text>{batteryLevel}%</Text>
          </BatteryBlocksRow>
        </BatteryColumn>

        {/* Columna 2: Voltaje */}
        <VoltageColumn>
          <TitleRow>
            <Icon color="#ffeb3b">
              <FaBolt />
            </Icon>
            <Title>Voltaje</Title>
          </TitleRow>
          <Text>{voltage}V</Text>
        </VoltageColumn>
      </Row>
    </Container>
  );
};

export default GridsSmall;