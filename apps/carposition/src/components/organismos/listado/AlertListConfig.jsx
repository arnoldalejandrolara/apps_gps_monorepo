import React from 'react';
import { styled, keyframes, css } from 'styled-components';
import { FaBell, FaPlay, FaSave } from 'react-icons/fa';

// --- Datos de Ejemplo (sin cambios) ---
const soundOptions = [
    { id: 'sound-1', name: 'Alarma Clásica' },
    { id: 'sound-2', name: 'Timbre de Campana' },
    { id: 'sound-3', name: 'Sonido Electrónico' },
];

export function AlertsList({
    alerts,
    filteredAlerts,
    expandedAlertId,
    handleAlertChange,
    handleSoundClick
}) {
    const handlePlaySound = (soundId) => {
        const sound = soundOptions.find(s => s.id === soundId);
        alert(`Reproduciendo: ${sound.name}`);
    };

    const handleSaveSound = (alertId, soundId) => {
        const sound = soundOptions.find(a => a.id === alertId).name;
        alert(`Sonido guardado para la alerta "${alertName}"`);
    };

    return (
        <AlertList>
            {filteredAlerts.map(alert => (
                <AlertItem key={alert.id} $isExpanded={expandedAlertId === alert.id}>
                    <AlertHeader>
                        <AlertInfo>
                            <AlertTitle>{alert.name}</AlertTitle>
                            <AlertDescription>{alert.description}</AlertDescription>
                        </AlertInfo>
                        <AlertActions>
                            <SoundButton onClick={() => handleSoundClick(alert.id)}>
                                <FaBell />
                            </SoundButton>
                            <SwitchLabel>
                                <SwitchInput
                                    type="checkbox"
                                    checked={alerts[alert.id]}
                                    onChange={() => handleAlertChange(alert.id)}
                                />
                                <SwitchSlider />
                            </SwitchLabel>
                        </AlertActions>
                    </AlertHeader>
                    {expandedAlertId === alert.id && (
                        <SoundConfig>
                            <SoundConfigRow>
                                <SoundLabel>Sonido:</SoundLabel>
                                <SoundSelect>
                                    {soundOptions.map(sound => (
                                        <option key={sound.id} value={sound.id}>
                                            {sound.name}
                                        </option>
                                    ))}
                                </SoundSelect>
                            </SoundConfigRow>
                            {/* 👇 1. NUEVO CONTENEDOR PARA LOS BOTONES */}
                            <ActionButtons>
                                <PlayButton onClick={() => handlePlaySound(soundOptions[0].id)}>
                                    <FaPlay />
                                </PlayButton>
                                <SaveButton onClick={() => handleSaveSound(alert.id, soundOptions[0].id)}>
                                    <FaSave style={{ marginRight: '5px' }} /> Guardar
                                </SaveButton>
                            </ActionButtons>
                        </SoundConfig>
                    )}
                </AlertItem>
            ))}
        </AlertList>
    );
}

// --- Keyframes ---
const expandItem = keyframes`
    from {
        max-height: 85px; // Altura colapsada (sin cambios)
    }
    to {
        max-height: 300px; // 👇 2. MÁS ALTURA PARA UNA EXPANSIÓN COMPLETA EN MÓVIL
    }
`;

const slideIn = keyframes`
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
`;

// --- Estilos ---
const AlertList = styled.div`
    display: flex; flex-direction: column; gap: 15px;
`;

const AlertItem = styled.div`
    display: flex; flex-direction: column; justify-content: space-between;
    background-color: #F8F9FA; padding: 15px; border-radius: 8px;
    border: 1px solid #E9ECEF; transition: all 0.3s ease-out; overflow: hidden;
    
    ${({ $isExpanded }) => $isExpanded && css`
        animation: ${expandItem} 0.4s ease-out forwards; // Un poco más lenta para suavidad
    `}
    
    @media (max-width: 768px) { padding: 20px; }
`;

const AlertHeader = styled.div`
    display: flex; justify-content: space-between; align-items: center;
    @media (max-width: 768px) {
        flex-direction: column; align-items: flex-start; gap: 15px;
    }
`;

const AlertInfo = styled.div`
    flex-grow: 1;
`;
const AlertTitle = styled.h4`
    font-size: 14px; font-weight: 500; color: #343A40; margin: 0 0 4px;
`;
const AlertDescription = styled.p`
    font-size: 13px; color: #6C757D; margin: 0;
`;

const AlertActions = styled.div`
    display: flex; align-items: center; gap: 10px; flex-shrink: 0;
    @media (max-width: 768px) {
        width: 100%; justify-content: flex-end;
    }
`;

const SoundButton = styled.button`
    background: #6C757D; color: white; border: none; border-radius: 6px;
    padding: 8px 10px; font-size: 14px; cursor: pointer; display: flex;
    align-items: center; justify-content: center; transition: background-color 0.2s ease;
    &:hover { background-color: #5A6268; }
`;

const SoundConfig = styled.div`
    padding-top: 15px; margin-top: 15px; border-top: 1px solid #E9ECEF;
    display: flex; flex-direction: column; gap: 15px;
    animation: ${slideIn} 0.3s ease-out;
`;

const SoundConfigRow = styled.div`
    display: flex; align-items: center; gap: 10px;
    @media (max-width: 768px) {
        flex-direction: column; align-items: stretch;
    }
`;

const SoundLabel = styled.label`
    font-size: 13px; color: #495057; font-weight: 500;
`;
const SoundSelect = styled.select`
    padding: 8px 10px; border-radius: 6px; border: 1px solid #DEE2E6;
    background-color: #f8f9fa; font-size: 13px; outline: none;
    cursor: pointer; flex-grow: 1;
`;

// 👇 3. NUEVO CONTENEDOR PARA LOS BOTONES
const ActionButtons = styled.div`
    display: flex;
    gap: 10px;
`;

const PlayButton = styled.button`
    background: #28A745; 
    color: white; 
    border: none; 
    border-radius: 6px;
    padding: 10px 12px; // Un poco más de padding vertical para consistencia
    font-size: 14px; 
    cursor: pointer; 
    display: flex;
    align-items: center; 
    justify-content: center; 
    transition: background-color 0.2s ease;
    
    // --- CAMBIO CLAVE ---
    flex: 1; // Le dice al botón que ocupe el espacio disponible

    &:hover { 
        background-color: #218838; 
    }
`;

const SaveButton = styled.button`
    background: #007BFF; 
    color: white; 
    border: none; 
    border-radius: 6px;
    padding: 10px 15px; 
    font-size: 14px; 
    font-weight: 500; 
    cursor: pointer;
    display: flex; 
    align-items: center; 
    justify-content: center;
    transition: background-color 0.2s ease;

    // --- CAMBIO CLAVE ---
    flex: 1; // También le dice a este botón que ocupe el espacio disponible

    &:hover { 
        background-color: #0069D9; 
    }
`;

// Estilos del interruptor (switch)
const SwitchLabel = styled.label`
    position: relative; display: inline-block; width: 44px; height: 24px;
    flex-shrink: 0; cursor: pointer;
`;
const SwitchInput = styled.input`
    opacity: 0; width: 0; height: 0;
`;
const SwitchSlider = styled.span`
    position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
    background-color: #ccc; transition: 0.4s; border-radius: 24px;
    &:before {
        position: absolute; content: ""; height: 18px; width: 18px; left: 3px;
        bottom: 3px; background-color: white; transition: 0.4s; border-radius: 50%;
    }
    ${SwitchInput}:checked + & { background-color: #007BFF; }
    ${SwitchInput}:checked + &:before { transform: translateX(20px); }
`;