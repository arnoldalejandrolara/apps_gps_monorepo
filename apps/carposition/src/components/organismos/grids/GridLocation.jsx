import React from 'react';
import styled from 'styled-components';
import { MdPlace } from "react-icons/md";
import { BiSolidNavigation } from "react-icons/bi";

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
  justify-content: space-between; /* Espacia el contenido entre la izquierda y la derecha */
  flex-wrap: nowrap; /* Evita que los elementos se envuelvan */
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center; /* Alinea verticalmente el ícono y el texto */
  flex-grow: 1; /* Ocupa el espacio disponible hacia la izquierda */
`;

const Icon = styled.div`
  display: flex;
  justify-content: center;
  font-size: 20px;
  margin-right: 10px;
  color: ${(props) => props.color || 'inherit'};
`;

const AddressText = styled.span`
  font-size: 10px;
  color: white;

  @media (min-width: 570px) {
    font-size: 16px; /* Aumenta el tamaño de la letra */
  }
`;

const LocationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 20%; /* Hace el contenedor redondeado */
  background-color: #4caf50; /* Color de fondo */
`;

const GridLocation = ({ address = "1234 Calle Principal, Ciudad", iconColor = "white" }) => {
  return (
    <Container>
      <Row>
        {/* Sección izquierda: Ícono y dirección */}
        <LeftSection>
          <Icon color={iconColor}>
            <MdPlace />
          </Icon>
          <AddressText>{address}</AddressText>
        </LeftSection>

        {/* Sección derecha: Contenedor redondeado */}
        <LocationContainer>
          <BiSolidNavigation color="white" size={20} />
        </LocationContainer>
      </Row>
    </Container>
  );
};

export default GridLocation;