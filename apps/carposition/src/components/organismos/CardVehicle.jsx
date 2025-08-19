import React from "react";
import styled from "styled-components";

import Car from "../../assets/Car.svg";
import { calculateDateDifference } from "../../utilities/Functions";

export function VehicleCard({ name, status, updated, driver, onClick }) {
  let formato_actualizado = calculateDateDifference(updated);

  return (
    <CardContainer onClick={onClick}>
      <CardTop>
        <Checkbox type="checkbox" onClick={(e) => e.stopPropagation()} />
        <CarIconContainer>
          <img
            src={Car}
            alt="Car Icon"
            style={{ width: "25px", height: "25px" }}
          />
        </CarIconContainer>
        <VehicleInfo>
          <h4>{name}</h4>
          <p>Estado: {status}</p>
          <p>Actualizado: {formato_actualizado.message}</p>
          <p>Chofer: {driver}</p>
        </VehicleInfo>
      </CardTop>
    </CardContainer>
  );
}

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: #FFFFFF;
  padding: 10px 5px;
  border-bottom: 1px solid #EAECEF;
  gap: 0;
  width: 100%;
  position: relative;
  transition: background-color 0.18s, box-shadow 0.18s;
  user-select: none;

  &:hover {
    background-color: #F8F9FA;
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;
`;

// --- ESTILOS DEL CHECKBOX MEJORADOS ---
const Checkbox = styled.input`
  /* Reseteo de estilos */
  appearance: none;
  -webkit-appearance: none;
  
  /* Dimensiones y apariencia base */
  width: 20px;
  height: 20px;
  background-color: #fff;
  border: 1.5px solid #ced4da;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease-in-out;
  flex-shrink: 0;

  &:hover {
    border-color: #adb5bd;
  }

  /* Estilo cuando está seleccionado (CHECKED) */
  &:checked {
    /* CAMBIO: Color verde */
    background-color: #28a745;
    border-color: #28a745;
  }

  /* La marca de verificación (palomita) */
  &::after {
    content: '';
    position: absolute;
    left: 6px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2.5px 2.5px 0;
    
    /* CAMBIO: Animación de entrada (por defecto está oculta) */
    transform: rotate(45deg) scale(0);
    opacity: 0;
    transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
  }

  /* CAMBIO: Animación de salida (se muestra cuando está 'checked') */
  &:checked::after {
    transform: rotate(45deg) scale(1);
    opacity: 1;
  }
`;
// --- FIN DE ESTILOS DEL CHECKBOX ---

const CarIconContainer = styled.div`
  position: relative;
  background: #F1F3F5;
  padding: 6px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const VehicleInfo = styled.div`
  flex-grow: 1;
  color: #212529;
  h4 {
    margin: 0;
    font-size: 11px;
  }
  p {
    margin: 1px 0;
    font-size: 10px;
    color: #6C757D;
  }
`;