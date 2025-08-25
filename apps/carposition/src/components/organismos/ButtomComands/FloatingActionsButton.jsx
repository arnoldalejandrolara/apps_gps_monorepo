import React from 'react';
import styled from 'styled-components';
import { FaSyncAlt, FaLock, FaUnlock, FaHistory, FaRoute, FaStreetView, FaShareAlt } from 'react-icons/fa';
import { useModal } from '../../../hooks/useModal';
// --- 1. IMPORTA EL NUEVO COMPONENTE DE MODAL ---
import { UpdateLocationModal } from '../ContentModals/CmdUpdateLocation';
import { LockEngineModal } from '../ContentModals/CmdLockEngine';
import { UnlockEngineModal } from '../ContentModals/CmdUnlockEngine';
import { ShareLocationModal } from '../ContentModals/ShareLocationModal'; // Asegúrate de que este componente exista
import { RouteDay } from '../ContentModals/RouteDay.jsx'; // Asegúrate de que este componente exista
import { goStreetView } from '@mi-monorepo/common/services';
import { useSelector } from 'react-redux';

// --- Estilos del componente (sin cambios) ---
const AnimatedButtonContainer = styled.div`
    position: fixed;
    bottom: 20px;
    left: 50%;
    z-index: 1000;
    display: flex;
    gap: 10px;
    transform: ${(props) => (props.$isVisible ? 'translateX(-50%)' : 'translateX(-50%) translateY(100px)')};
    opacity: ${(props) => (props.$isVisible ? '1' : '0')};
    pointer-events: ${(props) => (props.$isVisible ? 'auto' : 'none')};
    transition: transform 0.3s ease-out, opacity 0.3s ease-out;
`;

const AnimatedButton = styled.button`
    border: none;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    min-width: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    background: #007bff;
    color: white;
    &:nth-child(2) { background: #dc3545; }
    &:nth-child(3) { background: #28a745; }
    &:nth-child(4) { background: #6c757d; }
    &:nth-child(5) { background: #ffc107; color: #333; }
    &:nth-child(6) { background: #17a2b8; }
    &:nth-child(7) { background: #fd7e14; }
    span { font-size: 10px; color: inherit; }
    svg { font-size: 18px; color: inherit; }
    &:nth-child(1) { transition-delay: 0s; }
    &:nth-child(2) { transition-delay: 0.05s; }
    &:nth-child(3) { transition-delay: 0.1s; }
    &:nth-child(4) { transition-delay: 0.15s; }
    &:nth-child(5) { transition-delay: 0.2s; }
    &:nth-child(6) { transition-delay: 0.25s; }
    &:nth-child(7) { transition-delay: 0.3s; }
`;


// --- Componente de Botones Flotantes ---

export function FloatingActionButtons({ isVisible }) {
    const { openModal , closeModal } = useModal();
    const selectedVehicles = useSelector(state => state.vehicle.selectedVehicles);

    // --- 2. ACTUALIZA LA FUNCIÓN handleUpdate ---
    const handleUpdate = () => {
        // Llama a openModal con el nuevo componente
        openModal(<UpdateLocationModal onClose={closeModal} />, 'Actualizar Ubicación', 'small');
    };
    
    const handleLock = () => {
        openModal(<LockEngineModal onClose={closeModal} />, 'Bloquear Motor', 'small');
    };

    const handleUnlock = () => {
        openModal(<UnlockEngineModal onClose={closeModal} />, 'Desbloquear Motor', 'small');
    };

    const handleHistory = () => {
        const content = <p>Componente de historial aquí (ej. con selector de fechas).</p>;
        openModal(content, 'Historial de Recorridos', 'large');
    };

    const handleShare = () => {
        openModal(
            <ShareLocationModal onClose={closeModal} />, 
            'Compartir Ubicación', 
            'small' // Un tamaño pequeño es ideal para este modal
        );
    };

    const handleRecorrido = () => {
        openModal(
            <RouteDay />, 
            'Recorrido del Día', 
            'extraLarge' // Usa un tamaño grande para que el mapa se vea bien
        );
    };

    const handleStreetView = () => {
        const latitude = selectedVehicles[0].posicion_actual.lat;
        const longitude = selectedVehicles[0].posicion_actual.lng;
        goStreetView(latitude, longitude);
    };

    return (
        <AnimatedButtonContainer $isVisible={isVisible}>
            <AnimatedButton onClick={handleUpdate}>
                <FaSyncAlt />
                <span>Actualizar</span>
            </AnimatedButton>
            <AnimatedButton onClick={handleLock}>
                <FaLock />
                <span>Bloquear</span>
            </AnimatedButton>
            <AnimatedButton onClick={handleUnlock}>
                <FaUnlock />
                <span>Desbloquear</span>
            </AnimatedButton>
            <AnimatedButton onClick={handleHistory}>
                <FaHistory />
                <span>Historial</span>
            </AnimatedButton>
            <AnimatedButton onClick={handleRecorrido}>
                <FaRoute />
                <span>Recorrido</span>
            </AnimatedButton>
            <AnimatedButton onClick={handleStreetView}>
                <FaStreetView />
                <span>Street View</span>
            </AnimatedButton>
            <AnimatedButton onClick={handleShare}>
                <FaShareAlt />
                <span>Compartir</span>
            </AnimatedButton>
        </AnimatedButtonContainer>
    );
}