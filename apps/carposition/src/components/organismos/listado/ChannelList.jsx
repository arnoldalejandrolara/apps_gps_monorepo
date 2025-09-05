import React from 'react';
import { styled } from 'styled-components';
import { FaDesktop, FaMobileAlt, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

// --- Datos de Ejemplo ---
const channelOptions = [
    { id: 'web', name: 'Web', icon: FaDesktop },
    { id: 'mobile', name: 'Mobile', icon: FaMobileAlt },
    { id: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp },
    { id: 'email', name: 'Email', icon: FaEnvelope },
];

export function ChannelList({ channels, handleChannelChange }) {
    return (
        <ChannelContainer>
            {channelOptions.map(channel => {
                const IconComponent = channel.icon;
                return (
                    <ChannelCard key={channel.id}>
                        <IconWrapper>
                            <IconComponent />
                        </IconWrapper>
                        <ChannelInfo>
                            <ChannelTitle>{channel.name}</ChannelTitle>
                        </ChannelInfo>
                        <SwitchLabel>
                            <SwitchInput
                                type="checkbox"
                                checked={channels[channel.id]}
                                onChange={() => handleChannelChange(channel.id)}
                            />
                            <SwitchSlider />
                        </SwitchLabel>
                    </ChannelCard>
                );
            })}
        </ChannelContainer>
    );
}

// --- Estilos ---
const ChannelContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 15px;

    @media (max-width: 768px) {  grid-template-columns: 1fr; }
`;

const ChannelCard = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #F8F9FA;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #E9ECEF;
    transition: box-shadow 0.2s ease;
    flex-wrap: wrap; /* Añadido para que los elementos se envuelvan en pantallas pequeñas */
    &:hover {
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    }
`;

const IconWrapper = styled.div`
    width: 30px;
    height: 30px;
    background-color: #DEE2E6;
    color: #495057;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
`;

const ChannelInfo = styled.div`
    flex-grow: 1;
    margin: 0 10px;
    min-width: 50px; /* Asegura un ancho mínimo para evitar desbordamiento */
`;

const ChannelTitle = styled.h4`
    font-size: 14px;
    font-weight: 500;
    color: #343A40;
    margin: 0;
`;

// Estilos del interruptor (switch)
const SwitchLabel = styled.label`
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
    flex-shrink: 0; /* Asegura que no se reduzca de tamaño */
    cursor: pointer;
`;

const SwitchInput = styled.input`
    opacity: 0;
    width: 0;
    height: 0;
`;

const SwitchSlider = styled.span`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 24px;
    &:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
    }
    ${SwitchInput}:checked + & {
        background-color: #007BFF;
    }
    ${SwitchInput}:checked + &:before {
        transform: translateX(20px);
    }
`;