import React from 'react';
import styled from 'styled-components';

// Estilos con styled-components
const Container = styled.div`
  padding: 5px;
  border-radius: 10px;
  width: fit-content; /* Ajusta el tamaño al contenido */
  max-width: 100%; /* Evita desbordar el contenedor */
  box-sizing: border-box;
  
  display: flex;
  flex-direction: column; /* Alinea los elementos en columna */
  align-items: center; /* Centra el contenido horizontalmente */
  justify-content: center; /* Centra el contenido verticalmente */
`;

const Title = styled.h4`
  margin: 0;
  font-size: 11px; /* Tamaño del texto del título */
  font-weight: bold;
  color: white;
`;

const Time = styled.span`
  margin-top: 5px; /* Espaciado entre el título y el tiempo */
  font-size: 10px; /* Tamaño del texto del tiempo */
  font-weight: normal;
  color: #4caf50; /* Color del texto del tiempo */
`;

const GridTimeOn = ({ title = "ACC ON", time = "598 hrs 48 min" }) => {
  return (
    <Container>
      <Title>{title}</Title>
      <Time>{time}</Time>
    </Container>
  );
};

export default GridTimeOn;