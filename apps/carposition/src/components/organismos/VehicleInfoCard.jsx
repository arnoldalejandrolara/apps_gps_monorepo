import React from 'react';
import styled from 'styled-components';
import { FaTachometerAlt, FaClock, FaTimes, FaMapMarkerAlt, FaCalendarAlt, FaKey, FaCompass } from 'react-icons/fa';
import { IoMdBatteryCharging } from "react-icons/io";

// --- Sub-componente Reutilizable para Barras de Progreso (SIN CAMBIOS) ---
const ProgressBar = ({ label, value, color = '#28a745' }) => (
    <ProgressBarContainer>
        <ProgressBarFill $value={value} style={{ backgroundColor: color }} />
        <ProgressBarLabel>
            {label ? `${label}: ${value}%` : `${value}%`}
        </ProgressBarLabel>
    </ProgressBarContainer>
);

// --- Componente Principal de la Tarjeta (MODIFICADO) ---
export function VehicleInfoCard({ vehicle, isVisible, onClose }) {
    if (!vehicle) {
        return null;
    }

    return (
        <CardContainer $isVisible={isVisible}>
            <CloseButton onClick={onClose}><FaTimes /></CloseButton>

            <MainContent>
                {/* --- SECCIÓN 1: INFO PRINCIPAL (MODIFICADA) --- */}
                <InfoSection>
                    <SectionTitle>Información General</SectionTitle>
                    <VehicleName>{vehicle.name}</VehicleName>
                    <DataItem><FaCalendarAlt /><span>{vehicle.date}</span></DataItem>
                    {/* Solo se muestra si la ignición está encendida */}
                    {vehicle.ignition && (
                        <DataItem>
                            <FaKey color="#28a745" />
                            <AccStatus>ACC ON</AccStatus>
                            <TimeOn>{vehicle.timeOn}</TimeOn>
                        </DataItem>
                    )}
                </InfoSection>

                <VerticalDivider />

                {/* --- SECCIÓN 2: MOVIMIENTO (MODIFICADA) --- */}
                <InfoSection>
                    <SectionTitle>Movimiento</SectionTitle>
                    <SpeedDisplay>
                        <SpeedValue>{vehicle.speed}</SpeedValue>
                        <SpeedLabel>Velocidad</SpeedLabel>
                    </SpeedDisplay>
                    <DataItem>
                        <FaCompass />
                        <span>{vehicle.orientation}</span>
                    </DataItem>
                </InfoSection>
                
                <VerticalDivider />

                {/* --- SECCIÓN 3: COMBUSTIBLE (SIN CAMBIOS) --- */}
                <InfoSection>
                    <SectionTitle>Combustible</SectionTitle>
                    <FuelInfo>
                        <ProgressBar label="Tanque 1" value={vehicle.fuel1} />
                        <ProgressBar label="Tanque 2" value={vehicle.fuel2} />
                        <ProgressBar label="Tanque 3" value={vehicle.fuel3} />
                    </FuelInfo>
                </InfoSection>
            </MainContent>
            
            {/* --- SECCIÓN 4: FOOTER (MODIFICADA) --- */}
            <Footer>
                <FooterLeft>
                    <Coordinates>{vehicle.coords}</Coordinates>
                    <DataItem className="footer-address">
                        <FaMapMarkerAlt />
                        <span>{vehicle.address}</span>
                    </DataItem>
                </FooterLeft>
                <VoltageSection>
                    <IoMdBatteryCharging size={18} />
                    <ProgressBar value={vehicle.voltage} />
                </VoltageSection>
            </Footer>
        </CardContainer>
    );
}

// --- ESTILOS CON AJUSTES ---

const CardContainer = styled.div`
    position: fixed;
    top: 15px;
    left: 50%;
    width: 95%;
    max-width: 800px;
    z-index: 1050;
    background: rgba(255, 255, 255, 0.95);
    color: #333;
    border: 1px solid rgba(0, 0, 0, 0.08);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease-out;
    transform: ${(props) => (props.$isVisible ? 'translate(-50%, 0)' : 'translate(-50%, -150%)')};
    opacity: ${(props) => (props.$isVisible ? '1' : '0')};
    pointer-events: ${(props) => (props.$isVisible ? 'auto' : 'none')};
    padding: 15px 20px;
    display: flex;
    flex-direction: column;
`;

const MainContent = styled.div`
    display: grid;
    grid-template-columns: 1fr auto 1fr auto 1fr; 
    gap: 15px;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 12px;
    }
`;

const InfoSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
`;

const SectionTitle = styled.h4`
    font-size: 11px;
    font-weight: 500;
    color: #6c757d;
    text-transform: uppercase;
    margin: 0 0 2px 0;
    letter-spacing: 0.5px;
`;

const VehicleName = styled.h3`
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const DataItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #555;
    
    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    svg {
        font-size: 13px;
        color: #888;
        flex-shrink: 0;
    }
`;

const AccStatus = styled.span`
    font-weight: bold;
    color: #28a745;
`;

const TimeOn = styled.span`
    margin-left: auto; /* Empuja el tiempo a la derecha */
    padding-left: 10px;
    color: #555;
`;

const SpeedDisplay = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const SpeedValue = styled.span`
    font-size: 28px;
    font-weight: 600;
    color: #333;
    line-height: 1.1;
`;

const SpeedLabel = styled.span`
    font-size: 12px;
    color: #6c757d;
`;

const FuelInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const VerticalDivider = styled.div`
    width: 1px;
    background-color: #e0e0e0;

    @media (max-width: 768px) {
        height: 1px;
        width: 100%;
    }
`;

const Footer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start; /* Alinea al inicio por si la dirección tiene varias líneas */
    gap: 20px;
    border-top: 1px solid #e9ecef;
    padding-top: 10px;
    margin-top: 10px;
`;

const FooterLeft = styled.div`
    display: flex;
    flex-direction: row;
    gap: 6px;
    min-width: 0;
`;

const Coordinates = styled.span`
    font-size: 12px;
    color: #666;
`;

const VoltageSection = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    width: 150px;
    color: #666;
    flex-shrink: 0;
`;

const ProgressBarContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    height: 18px;
    background-color: #e9ecef;
    border-radius: 5px;
    width: 100%;
    overflow: hidden;
`;

const ProgressBarFill = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${(props) => props.$value}%;
    transition: width 0.5s ease-in-out;
`;

const ProgressBarLabel = styled.span`
    position: relative;
    z-index: 1;
    font-size: 10px;
    font-weight: 600;
    color: #333;
    margin-left: 8px;
    text-shadow: 0 0 3px rgba(255, 255, 255, 0.7);
`;

const CloseButton = styled.button`
    position: absolute;
    top: 8px;
    right: 8px;
    background: transparent;
    border: none;
    color: #aaa;
    font-size: 16px;
    cursor: pointer;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease, color 0.2s ease;
    z-index: 1;

    &:hover {
        background-color: #f0f0f0;
        color: #333;
    }
`;