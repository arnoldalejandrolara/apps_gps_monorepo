import React from 'react';
import styled from 'styled-components';

const FloatingButton = ({ icon: Icon, onClick, position = 'top-right', size = 40, color = '#555', background = '#202020', borderColor = '#333333' }) => {
  return (
    <StyledButton
      onClick={onClick}
      $position={position}
      $size={size}
      $color={color}
      $background={background}
      $borderColor={borderColor}
    >
      <Icon size={size * 0.6} />
    </StyledButton>
  );
};

const StyledButton = styled.button`
  position: absolute;
  ${({ $position }) => {
    switch ($position) {
      case 'top-left':
        return `top: 10px; left: 10px;`;
      case 'top-right':
        return `top: 10px; right: 10px;`;
      case 'bottom-left':
        return `bottom: 10px; left: 10px;`;
      case 'bottom-right':
        return `bottom: 10px; right: 10px;`;
      default:
        return `top: 10px; right: 10px;`;
    }
  }}
  background-color: ${({ $background }) => $background};
  border: none;
  border-radius: 20%;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid ${({ $borderColor }) => $borderColor};
  font-size: ${({ $size }) => $size * 0.6}px;
  color: ${({ $color }) => $color};
  cursor: pointer;
  z-index: 1000;
`;

export default FloatingButton;