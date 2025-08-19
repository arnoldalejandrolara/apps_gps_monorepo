import React from 'react';
import styled from 'styled-components';

// Estilos con styled-components
const Container = styled.div`
  padding: 5px;
  border-radius: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between; /* Espacia las columnas */
  align-items: center;
  box-sizing: border-box;
`;

const FuelLevelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Alinea el contenido a la izquierda */
  justify-content: center;
  width: 70%; /* La columna izquierda ocupa el 70% del ancho */
  box-sizing: border-box;
`;

const FuelLevelTitle = styled.h4`
  margin: 0;
  font-weight: 400;
  font-size: 10px;
  color: white;
`;

const FuelLevelRow = styled.div`
  display: flex;
  align-items: center; /* Alinea los elementos en el centro verticalmente */
  margin-top: 10px;
  width: 100%;
`;

const FuelLevelIndicator = styled.div`
  width: 60%;
  height: 18px;
  background-color: #363636; /* Fondo gris oscuro */
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center; /* Centra verticalmente el contenido */
  padding: 0 5px; /* Espaciado interno para el texto */
  color: white;
  font-size: 10px;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${(props) => props.fuelLevel || 0}%;
    background-color: #4caf50; /* Verde para el nivel de combustible */
    z-index: 1;
  }

  span {
    position: relative;
    z-index: 2; /* Asegura que el texto esté sobre la barra de progreso */
  }
`;

const FuelInfo = styled.span`
  font-size: 10px;
  color: white;
  margin-left: 10px; /* Espacio entre el indicador y la información */
`;

const PercentageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 30%; /* La columna derecha ocupa el 30% del ancho */
  box-sizing: border-box;
`;

const TotalTitle = styled.h4`
  margin: 0; /* Sin margen superior */
  font-weight: 400;
  font-size: 10px;
  color: white;
`;

const PercentageText = styled.div`
  font-size: 15px; /* Tamaño grande para el porcentaje */
  font-weight: bold;
  color: #4caf50;
  margin-top: 5px; /* Espaciado entre el título y el porcentaje */
`;

const TotalLitersText = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #4caf50;
  margin-top: 5px; /* Espaciado entre el porcentaje y el total de litros */
`;

const GridCombustible = ({ fuelLevels = [{ tank: 1, percentage: 50, capacity: 60 }] }) => {
  // Calcula el total de litros
  const totalLiters = fuelLevels.reduce(
    (sum, { capacity, percentage }) => sum + (capacity * percentage) / 100,
    0
  );

  return (
    <Container>
      {/* Columna izquierda: Nivel de combustible */}
      <FuelLevelContainer>
        <FuelLevelTitle>Combustible</FuelLevelTitle>
        {fuelLevels.map(({ tank, percentage, capacity }) => (
          <FuelLevelRow key={tank}>
            <FuelLevelIndicator fuelLevel={percentage}>
              <span>
                Tanque {tank} | {percentage}% {/* Porcentaje dentro de la barra */}
              </span>
            </FuelLevelIndicator>
            <FuelInfo>
              Cap. {capacity}L | {(capacity * percentage) / 100}L
            </FuelInfo>
          </FuelLevelRow>
        ))}
      </FuelLevelContainer>
      {/* Columna derecha: Título, Porcentaje promedio y Total de litros */}
      <PercentageContainer>
        <TotalTitle>Total</TotalTitle>
        <PercentageText>
          {Math.round(
            fuelLevels.reduce((sum, level) => sum + level.percentage, 0) / fuelLevels.length
          )}
          %
        </PercentageText>
        <TotalLitersText>{totalLiters.toFixed(2)}L</TotalLitersText>
      </PercentageContainer>
    </Container>
  );
};

export default GridCombustible;