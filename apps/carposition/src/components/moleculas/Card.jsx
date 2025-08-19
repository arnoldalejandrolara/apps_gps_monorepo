// src/components/molecules/Card.jsx

import React from 'react';
import styled from 'styled-components';

// ✅ 1. Mueve TODOS los estilos relacionados con Card a este archivo.
const StyledCard = styled.div`
  background-color: #1E1E1E;
  border: 1px solid #2E2E2E;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &:first-child {
    margin-top: 24px;
  }
  &:not(:last-child){
    margin-bottom: 24px;
  }
`;

const StyledCardHeader = styled.div`
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center; /* Centrado vertical para un mejor look */
  border-bottom: 1px solid #2E2E2E;
`;

const StyledCardTitle = styled.h2`
  font-size: 12px;
  font-weight: 400;
  color: #a0a0a0;
  margin: 0;
`;

const StyledCardContent = styled.div`
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const StyledCardFooter = styled.div`
  background-color: #252525;
  padding: 16px 24px;
  text-align: right;
  font-size: 14px;
  color: #A0A0A0;
  border-top: 1px solid #2E2E2E;
`;

// ✅ 2. Crea el componente funcional que usa estos estilos.
export function Card({ title, headerActions, footerContent, children }) {
  return (
    <StyledCard>
      {/* El header solo se muestra si hay un título o acciones */}
      {(title || headerActions) && (
        <StyledCardHeader>
          <StyledCardTitle>{title}</StyledCardTitle>
          {/* Espacio para íconos o botones */}
          <div>{headerActions}</div>
        </StyledCardHeader>
      )}

      {/* El contenido principal siempre se muestra */}
      <StyledCardContent>{children}</StyledCardContent>

      {/* El footer solo se muestra si se le pasa contenido */}
      {footerContent && (
        <StyledCardFooter>{footerContent}</StyledCardFooter>
      )}
    </StyledCard>
  );
}