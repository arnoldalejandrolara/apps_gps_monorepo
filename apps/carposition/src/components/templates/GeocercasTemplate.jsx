import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import expandIcon from '../../assets/expand-right.svg';




export function GeocercasTemplate() {
    const [selectedReport, setSelectedReport] = useState('Listado');


  return (
    <Container>

      <HeaderContainer>
        
        <BreadcrumbContainer>
          <Breadcrumb>
            Home
            <Icon src={expandIcon} alt="Expand icon" />
            Geocercas
            <Icon src={expandIcon} alt="Expand icon" />
            <CurrentOption>
              {selectedReport }
            </CurrentOption>
          </Breadcrumb>
        </BreadcrumbContainer>
      </HeaderContainer>
      <HorizontalLine />

    
    

    </Container>
  );
}

const expandAnimation = keyframes`
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 500px;
    opacity: 1;
  }
`;

const collapseAnimation = keyframes`
  from {
    max-height: 500px;
    opacity: 1;
  }
  to {
    max-height: 0;
    opacity: 0;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh; /* Full height of the viewport */
  padding: 20px;
  width: 100%;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between; /* Distribuye espacio entre elementos */
  align-items: center;
  gap: 20px; /* Espaciado entre el Header y el Selector */
  position: relative;
  width: 100%;
  margin: 5px;
`;

const BreadcrumbContainer = styled.div`
  display: flex;
  flex: 1; /* Toma el máximo espacio disponible */
  justify-content: flex-start; /* Alinea el Breadcrumb a la izquierda */
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  color: white;
`;

const Icon = styled.img`
  width: 12px;
  height: 12px;
  margin: 0 8px;
`;

const CurrentOption = styled.span`
  font-weight: 500;
  color: white;
`;

const ReportSelectorContainer = styled.div`
  display: flex;
  justify-content: center; /* Centra horizontalmente */
  align-items: center; /* Asegura la alineación vertical */
  position: absolute; /* Permite centrar el Select */
  left: 50%; /* Mueve el contenedor al centro */
  transform: translateX(-50%); /* Ajusta el Select para que quede realmente centrado */
  z-index: 10; /* Asegura que el Select esté por encima de otros elementos */
`;

const ExpandableContainer = styled.div`
  width: 280px;
  position: relative;
  user-select: none;
`;

const ExpandableHeader = styled.div`
  font-size: 14px;
  padding: 10px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background: #2a2a2a;
  border-radius: 8px;
  color: white;
  transition: background 0.2s ease;
  &:hover {
    background: #333333;
  }
`;

const ExpandedContent = styled.div`
  position: absolute;
  top: calc(100% + 8px); /* un poco de separación del botón */
  left: 0;
  width: 100%;
  z-index: 20;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 12px;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.2);
  padding: 12px;
  animation: ${expandAnimation} 0.2s ease-out;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: none;
  border-radius: 8px; /* Rounded corners */
  outline: none;
  background: #1e1e1e; /* Slightly darker background for input */
  color: white;
  margin-bottom: 10px; /* Add spacing below the input */
`;

const Category = styled.div`
  margin-bottom: 12px; /* Spacing between categories */
`;

const CategoryTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: white;
  user-select: none;
  margin-bottom: 8px; /* Spacing below the category title */
`;

const MenuItem = styled.div`
  padding: 8px 12px;
  font-size: 14px;
  color: white; /* White text for menu items */
  cursor: pointer;
  border-radius: 4px;
  user-select: none;
  &:hover {
    background: #333333; /* Light hover effect */
  }
`;

const HorizontalLine = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid #333333;
  margin: 15px 0;
`;

const Content = styled.div`
  flex: 1; /* Take all the remaining space */
  font-size: 14px;
  color: #333;
  display: flex;
  // background: red; /* Slightly darker background for content */
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export default GeocercasTemplate;