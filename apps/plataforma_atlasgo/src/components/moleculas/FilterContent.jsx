import React from "react";
import styled from "styled-components";

// El contenedor principal ahora se llama FilterContainer
const FilterContainer = styled.div`
  background: #242424;
  border-radius: 6px;
  border: 1px solid #373737;
  padding: 20px;
  height: 100%;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 18px; /* Espacio entre los grupos de filtros */

  h3 {
    margin-top: 0;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 600;
  }
`;

// Estilos para los elementos del formulario
const FilterRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: #a0a0a0;
`;

const StyledInput = styled.input`
  background-color: #1c1c1c;
  border: 1px solid #4a4a4a;
  border-radius: 5px;
  padding: 10px;
  color: #e0e0e0;
  font-size: 13px;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #6ee7b7;
  }
`;

const StyledSelect = styled.select`
  background-color: #1c1c1c;
  border: 1px solid #4a4a4a;
  border-radius: 5px;
  padding: 10px;
  color: #e0e0e0;
  font-size: 13px;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #6ee7b7;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: auto; /* Empuja los botones al fondo */
  padding-top: 10px;
  border-top: 1px solid #373737;
`;

const StyledButton = styled.button`
  border: 1px solid ${props => props.primary ? '#6ee7b7' : '#555'};
  background-color: ${props => props.primary ? '#6ee7b7' : 'transparent'};
  color: ${props => props.primary ? '#111' : '#e0e0e0'};
  padding: 8px 16px;
  border-radius: 5px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.primary ? '#58d6a3' : '#333'};
    border-color: ${props => props.primary ? '#58d6a3' : '#777'};
  }
`;


// El componente ahora es FilterContent
function FilterContent() {
  return (
    <FilterContainer>
      <h3>Filtrar por</h3>
      
      <FilterRow>
        <FilterLabel htmlFor="filtro-evento">Evento</FilterLabel>
        <StyledInput id="filtro-evento" type="text" placeholder="Buscar por nombre de evento..." />
      </FilterRow>

      <FilterRow>
        <FilterLabel htmlFor="filtro-usuario">Usuario</FilterLabel>
        <StyledSelect id="filtro-usuario">
          <option value="">Todos los usuarios</option>
          <option value="user1">usuario1@correo.com</option>
          <option value="user2">usuario2@correo.com</option>
        </StyledSelect>
      </FilterRow>

      <ActionButtons>
        <StyledButton>Limpiar</StyledButton>
        <StyledButton primary>Aplicar Filtros</StyledButton>
      </ActionButtons>
    </FilterContainer>
  );
}

export default FilterContent;