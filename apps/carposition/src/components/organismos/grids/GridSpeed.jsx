import React from 'react';
import styled from 'styled-components';
import { FaBolt } from 'react-icons/fa';
import { BsSpeedometer2 } from "react-icons/bs";
import { TbNavigationFilled } from "react-icons/tb";

// Estilos con styled-components
const Container = styled.div`
  padding: 2px;
  border-radius: 10px;
  width: 100%;
  height: 100%; /* Asegura que el contenedor ocupe toda la altura disponible */
  display: flex; /* Configura el contenedor como flexbox */
  justify-content: center; /* Centra horizontalmente */
  align-items: center; /* Centra verticalmente */
  box-sizing: border-box;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column; /* Por defecto en una sola columna */
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  @media (min-width: 570px) {
    flex-direction: row; /* Cambia a dos columnas en pantallas grandes */
    justify-content: space-between; /* Espacia las columnas */
    align-items: flex-start; /* Alinea las columnas al inicio verticalmente */
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Alinea el contenido de la columna a la izquierda */
  justify-content: center;
  box-sizing: border-box;
  padding: 2px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  flex-wrap: wrap;

   /* Oculta todo el TitleRow de orientación en pantallas pequeñas */
  &.orientation-title {
    @media (max-width: 569px) {
      display: none;
    }
  }
`;

const Title = styled.h4`
  margin: 0;
  font-weight: 400;
  font-size: 10px;
  }
`;

const SpeedText = styled.div`
  font-size: 15px; /* Tamaño de fuente */
  font-weight: 500;
  color: #4caf50;
  margin-top: 2px;
`;

const Orientation = styled.div`
  display: flex;
  align-items: center;
  margin-top: 2px;
  font-size: 12x;
  color: white;

  svg {
    margin-right: 5px; /* Espacio entre el ícono y el texto */
  }

    span {
    font-size: 12px; /* Tamaño de fuente */
    }
`;

const Icon = styled.div`
  display: flex;
  justify-content: center;
  font-size: 20px;
  margin-right: 8px;
  color: ${(props) => props.color || 'inherit'};
`;

const GridSpeed = ({ speed = 120, orientation = 'Norte' }) => {
  return (
    <Container>
      <Row>
        {/* Columna 1: Velocidad */}
        <Column>
          <TitleRow>
            <Icon>
              <BsSpeedometer2 />
            </Icon>
            <Title>Velocidad</Title>
          </TitleRow>
          <SpeedText>{speed} km/h</SpeedText>
        </Column>
        {/* Columna 2: Orientación */}
        <Column>
          <TitleRow className="orientation-title">
            <Icon>
              <TbNavigationFilled />
            </Icon>
            <Title >Orientación</Title>
          </TitleRow>
          <Orientation>
            <TbNavigationFilled />
            <span>{orientation}</span>
          </Orientation>
        </Column>
      </Row>
    </Container>
  );
};

export default GridSpeed;