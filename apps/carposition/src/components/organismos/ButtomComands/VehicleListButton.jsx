import React from 'react';
import styled from 'styled-components';
import Car from "../../../assets/Car.svg"; // Asegúrate que la ruta al SVG sea correcta

// --- Estilos del componente (movidos desde App.jsx) ---
const StyledVehicleListButton = styled.button`
    position: fixed;
    top: 50%;
    left: 0;
    /* Usa la prop $isOpen para controlar la transformación y opacidad */
    transform: ${(props) => (props.$isOpen ? 'translateY(-50%) translateX(-100%)' : 'translateY(-50%) translateX(0)')};
    opacity: ${(props) => (props.$isOpen ? 0 : 1)};
    pointer-events: ${(props) => (props.$isOpen ? 'none' : 'auto')};
    z-index: 1000;
    background: #ffffff;
    color: #333333;
    border: 1px solid #dddddd;
    border-radius: 0 8px 8px 0;
    width: 40px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 22px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    border-left: none;
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
`;


// --- Componente Funcional ---

export function VehicleListButton({ isOpen, onClick }) {
  return (
    <StyledVehicleListButton onClick={onClick} $isOpen={isOpen}>
        <img
            src={Car}
            alt="Car Icon"
            style={{ width: "30px", height: "30px" }}
        />
    </StyledVehicleListButton>
  );
}