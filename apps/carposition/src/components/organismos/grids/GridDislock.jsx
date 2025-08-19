import React from 'react';
import styled from 'styled-components';
import { MdLocationOn } from 'react-icons/md';
import { FiUnlock } from "react-icons/fi";


// Estilos con styled-components
const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #335533;
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

const GridUnlock = ({ onClick }) => {
  return (
    <Container onClick={onClick}>
      <IconWrapper>
        <FiUnlock size={23} color="#fff" />
      </IconWrapper>
      <Label>Desbloquear</Label>
    </Container>
  );
};

export default GridUnlock;