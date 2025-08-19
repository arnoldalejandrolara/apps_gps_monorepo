import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: ${props => props.primary ? '#333' : '#222'};
  color: #E0E0E0;
  border: 1px solid #333;
  border-radius: 6px;
  padding: ${props => props.small ? '6px 10px' : '8px 12px'};
  font-size: ${props => props.small ? '12px' : '13px'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.2s;
  
  &:hover { 
    background-color: #3a3a3a; 
  }
`;

// ✅ Aquí está el cambio crucial. Envolvemos el componente Button
//    en React.forwardRef para que acepte una ref y la pase al StyledButton.
export const Button = React.forwardRef((props, ref) => {
  return <StyledButton ref={ref} {...props} />;
});

// IconButton extiende de Button, que ahora maneja refs correctamente,
// así que no necesita cambios.
export const IconButton = styled(Button)`
  padding: ${props => props.small ? '6px' : '8px'};
`;