import React from 'react';
import styled from 'styled-components';
import { FaShare } from "react-icons/fa6";



// Estilos con styled-components
const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #242424;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
  padding: 0; /* Sin padding */
  margin: 0;
  border-radius: 5px;
  gap: 0;
  &:active {
    background: #1c2941;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Label = styled.span`
  font-size: 10px;
  font-weight: 500;
  color: #fff;
  margin-top: 6px;
  text-align: center;
`;

const GridShareUbi = ({ onClick }) => {
  return (
    <Container onClick={onClick}>
      <IconWrapper>
        <FaShare size={23} color="#fff" />
      </IconWrapper>
      <Label>Compartir Ubicacion</Label>
    </Container>
  );
};

export default GridShareUbi;