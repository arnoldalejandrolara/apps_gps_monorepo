import React from 'react';
import styled from 'styled-components';
import { FaClock } from 'react-icons/fa'; // Ícono para horómetro
import { MdSpeed } from 'react-icons/md'; // Ícono para odómetro

// Estilos con styled-components
const Container = styled.div`
  padding: 5px;
  border-radius: 10px;
  width: 100%; /* Permite que el componente se ajuste al ancho de su contenedor padre */
  max-width: 100%; /* Asegura que no se desborde */
  box-sizing: border-box;
  display: flex;
  flex-direction: column; /* Alinea los elementos en columna */
  justify-content: center;
  gap: 10px; /* Espaciado entre las filas */
`;

const Row = styled.div`
  display: flex;
  align-items: center; /* Alinea verticalmente los elementos */
  justify-content: flex-start; /* Alinea los elementos hacia la izquierda */
  gap: 5px; /* Espaciado entre los elementos */
  width: 100%;
`;

const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px; /* Tamaño del ícono */
  color: ${(props) => props.color || 'inherit'};
`;

const Label = styled.span`
  font-size: 11px;
  font-weight: bold;
  color: white;
`;

const Value = styled.span`
  font-size: 11px;
  font-weight: normal;
  color: #4caf50;
`;

const GridHorometro = ({
  horometro = "120h",
  odometro = "2000km",
  horometroLabel = "Horómetro",
  odometroLabel = "Odómetro",
}) => {
  return (
    <Container>
      {/* Fila del horómetro */}
      <Row>
        {/* Ícono del horómetro */}
        <Icon>
          <FaClock />
        </Icon>
        {/* Label del horómetro */}
        <Label>{horometroLabel}</Label>
        {/* Separador */}
        <Label>:</Label>
        {/* Valor del horómetro */}
        <Value>{horometro}</Value>
      </Row>

      {/* Fila del odómetro */}
      <Row>
        {/* Ícono del odómetro */}
        <Icon>
          <MdSpeed />
        </Icon>
        {/* Label del odómetro */}
        <Label>{odometroLabel}</Label>
        {/* Separador */}
        <Label>:</Label>
        {/* Valor del odómetro */}
        <Value>{odometro}</Value>
      </Row>
    </Container>
  );
};

export default GridHorometro;