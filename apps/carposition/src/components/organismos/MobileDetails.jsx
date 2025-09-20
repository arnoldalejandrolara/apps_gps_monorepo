import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  IoCarSportOutline,
  IoPersonOutline,
  IoTimeOutline,
  IoAnalyticsOutline,
  IoSyncOutline,
  IoLockClosedOutline,
  IoLockOpenOutline,
  IoClose, // <-- CAMBIO 1: Importa el ícono de cierre
} from 'react-icons/io5';

// --- Datos falsos (mock) ---
const mockVehicle = {
  id: 123,
  info: {
    nombre: 'Torton Kenworth',
    chofer: 'Juan Pérez',
    placas: 'A12-BCD',
  },
  posicion_actual: {
    id_status_motor: 1,
    fecha: new Date().toISOString(),
  },
};

// --- ESTILOS ---
const slideUp = keyframes`from { transform: translateY(100%); } to { transform: translateY(0); }`;

const GrabBar = styled.div`
  width: 40px; height: 5px; background-color: #d0d0d0; border-radius: 10px; margin: 8px auto 12px; cursor: grab; flex-shrink: 0;
`;
const PanelContainer = styled.div.attrs((props) => ({
  style: {
    transform: `translateY(${props.translateY}px)`,
    transition: props.isDragging ? 'none' : 'transform 0.3s ease-out',
  },
}))`
  position: fixed; bottom: 0; left: 0; width: 100%; height: auto; max-height: 85vh; background: #ffffff; z-index: 1009; border-top-left-radius: 20px; border-top-right-radius: 20px; box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.1); padding: 0 10px 20px 10px; display: flex; flex-direction: column; animation: ${slideUp} 0.3s ease-out;
`;

// --- CAMBIO 2: Se ajusta el header para posicionar el botón ---
const PanelHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-bottom: 10px;
  flex-shrink: 0;
  position: relative; // Necesario para posicionar el botón de cierre
`;

const VehicleTitle = styled.h3`
  margin: 0; font-size: 16px; color: #191919; font-weight: 500;
`;

// --- CAMBIO 3: Se crea el estilo para el botón de cierre ---
const CloseButton = styled.button`
  position: absolute;
  top: -5px;
  right: 5px;
  background: #f0f0f0;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  color: #555;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const PanelContent = styled.div`
  overflow-y: auto; padding: 0 15px;
  &::-webkit-scrollbar { display: none; }
`;
const InfoGrid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 10px;
`;
const InfoItem = styled.div`
  background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 12px; padding: 12px; display: flex; flex-direction: column;
`;
const InfoLabel = styled.span`
  font-size: 12px; color: #6c757d; margin-bottom: 5px; display: flex; align-items: center; gap: 6px;
`;
const InfoValue = styled.span`
  font-size: 14px; color: #212529; font-weight: 500;
`;
const StatusDot = styled.div`
  width: 8px; height: 8px; border-radius: 50%;
  background-color: ${(props) => props.status === 'En movimiento' ? '#4CAF50' : '#F44336'};
`;
const ActionsSection = styled.div`
  margin-top: 10px; border-top: 1px solid #e9ecef; padding-top: 10px;
`;
const ActionButton = styled.button`
  width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #007bff; background-color: #e7f5ff; color: #007bff; font-size: 14px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background-color 0.2s;
  &:hover { background-color: #d0e7ff; }
`;
const ActionGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 15px;
`;
const CommandButton = styled.button`
  display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 12px; padding: 12px 5px; font-size: 11px; font-weight: 500; color: #343a40; cursor: pointer; transition: all 0.2s ease;
  svg {
    font-size: 22px; margin-bottom: 6px; color: ${(props) => props.color || '#343a40'};
  }
  &:hover {
    border-color: ${(props) => props.color || '#007bff'};
    background-color: ${(props) => props.hoverBgColor || '#e7f5ff'};
    color: ${(props) => props.color || '#007bff'};
  }
`;

export const MobileDetails = ({ isOpen, onClose }) => {
  const [dragState, setDragState] = useState({
    startY: 0,
    currentY: 0,
    isDragging: false,
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overscrollBehaviorY = 'contain';
    }
    return () => {
      document.body.style.overscrollBehaviorY = 'auto';
    };
  }, [isOpen]);

  const activeVehicle = mockVehicle;

  const deltaY = dragState.isDragging ? dragState.currentY - dragState.startY : 0;
  const translateY = dragState.isDragging ? Math.max(0, deltaY) : 0;

  const handleTouchStart = (e) => {
    setDragState({
      startY: e.touches[0].clientY,
      currentY: e.touches[0].clientY,
      isDragging: true,
    });
  };

  const handleTouchMove = (e) => {
    if (!dragState.isDragging) return;
    setDragState((prev) => ({ ...prev, currentY: e.touches[0].clientY }));
  };

  const handleTouchEnd = () => {
    const finalDeltaY = dragState.currentY - dragState.startY;
    const threshold = 80;
    if (finalDeltaY > threshold) {
      onClose();
    }
    setDragState({ startY: 0, currentY: 0, isDragging: false });
  };

  if (!isOpen) {
    return null;
  }

  const statusText =
    activeVehicle.posicion_actual.id_status_motor === 1
      ? 'En movimiento'
      : 'Detenido';

  const handleUpdatePosition = () =>
    alert(`Actualizando posición para: ${activeVehicle.info.nombre}`);
  const handleBlockEngine = () =>
    alert(`Bloqueando motor para: ${activeVehicle.info.nombre}`);
  const handleUnblockEngine = () =>
    alert(`Desbloqueando motor para: ${activeVehicle.info.nombre}`);

  return (
    <>
      <PanelContainer
        translateY={translateY}
        isDragging={dragState.isDragging}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <GrabBar />
        <PanelHeader>
          <VehicleTitle>{activeVehicle.info.nombre}</VehicleTitle>
          {/* --- CAMBIO 4: Se añade el botón al JSX y se le asigna la función `onClose` --- */}
          <CloseButton onClick={onClose}>
            <IoClose />
          </CloseButton>
        </PanelHeader>
        <PanelContent>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>
                <IoPersonOutline /> Conductor
              </InfoLabel>
              <InfoValue>{activeVehicle.info.chofer}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>
                <StatusDot status={statusText} /> Estado
              </InfoLabel>
              <InfoValue>{statusText}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>
                <IoTimeOutline /> Última Actualización
              </InfoLabel>
              <InfoValue>
                {new Date(
                  activeVehicle.posicion_actual.fecha
                ).toLocaleString()}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>
                <IoCarSportOutline /> Placas
              </InfoLabel>
              <InfoValue>{activeVehicle.info.placas}</InfoValue>
            </InfoItem>
          </InfoGrid>
          
          <ActionsSection>
            <ActionButton>
              <IoAnalyticsOutline /> Ver Recorrido Completo
            </ActionButton>
            <ActionGrid>
              <CommandButton
                onClick={handleUpdatePosition} color="#007bff" hoverBgColor="#e7f5ff"
              >
                <IoSyncOutline /> Actualizar
              </CommandButton>
              <CommandButton
                onClick={handleBlockEngine} color="#ffc107" hoverBgColor="#fff8e1"
              >
                <IoLockClosedOutline /> Bloquear
              </CommandButton>
              <CommandButton
                onClick={handleUnblockEngine} color="#4CAF50" hoverBgColor="#e8f5e9"
              >
                <IoLockOpenOutline /> Desbloquear
              </CommandButton>
            </ActionGrid>
          </ActionsSection>
        </PanelContent>
      </PanelContainer>
    </>
  );
};