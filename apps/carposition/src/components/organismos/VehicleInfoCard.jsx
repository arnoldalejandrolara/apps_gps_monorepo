import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaTachometerAlt, FaClock, FaTimes, FaMapMarkerAlt, FaCalendarAlt, FaKey, FaCompass, FaWindowMinimize } from 'react-icons/fa';
import { IoMdBatteryCharging } from "react-icons/io";
import { LuMinimize } from "react-icons/lu";
import { TbWindowMinimize } from "react-icons/tb";

// --- Sub-componente ProgressBar (SIN CAMBIOS) ---
const ProgressBar = ({ label, value, color = '#28a745' }) => (
    <ProgressBarContainer>
        <ProgressBarFill $value={value} style={{ backgroundColor: color }} />
        <ProgressBarLabel>
            {label ? `${label}: ${value}%` : `${value}%`}
        </ProgressBarLabel>
    </ProgressBarContainer>
);


// --- Componente Principal de la Tarjeta ---
export function VehicleInfoCard({ isVisible, onClose, onMinimize }) {
    
    const mockVehicleData = {
      name: 'Kenworth T680',
      date: '08/09/2025 11:05:15',
      ignition: true,
      timeOn: '5h 01m',
      speed: '75',
      orientation: 'Noroeste',
      fuel1: 91,
      fuel2: 65,
      fuel3: 20,
      coords: '22.257, -97.842',
      address: 'Blvd. de los Ríos, Miramar, Tamaulipas',
      voltage: 94
    };

    return (
        <CardContainer $isVisible={isVisible}>
            {/* El Header ahora contiene la fila superior con el nombre y los botones */}
            <Header>
                <HeaderTopRow>
                    <VehicleName>{mockVehicleData.name}</VehicleName>
                    <CardActions>
                        <ActionButton onClick={onMinimize} title="Minimizar">
                            <TbWindowMinimize />
                        </ActionButton>
                        <ActionButton onClick={onClose} title="Cerrar">
                            <FaTimes />
                        </ActionButton>
                    </CardActions>
                </HeaderTopRow>
                <DataItem><FaCalendarAlt /><span>Última actualización: {mockVehicleData.date}</span></DataItem>
            </Header>

            {/* El resto del JSX no cambia */}
            <StatusGrid>
                <StatusItem>
                    <StatusLabel>Velocidad</StatusLabel>
                    <SpeedDisplay>
                        <SpeedValue>{mockVehicleData.speed}</SpeedValue>
                        <SpeedUnit>km/h</SpeedUnit>
                    </SpeedDisplay>
                </StatusItem>
                <StatusItem>
                    <StatusLabel>Ignición</StatusLabel>
                    {mockVehicleData.ignition ? (
                        <StatusValue color="#28a745"> ENCENDIDO</StatusValue>
                    ) : (
                        <StatusValue color="#dc3545"> APAGADO</StatusValue>
                    )}
                    <SubText>Tiempo: {mockVehicleData.timeOn}</SubText>
                </StatusItem>
                <StatusItem>
                    <StatusLabel>Orientación</StatusLabel>
                    <StatusValue><FaCompass /> {mockVehicleData.orientation}</StatusValue>
                </StatusItem>
            </StatusGrid>

            <Section>
                <SectionTitle>Medidores</SectionTitle>
                <MetersContainer>
                    <ProgressBar label="Tanque 1" value={mockVehicleData.fuel1} />
                    <ProgressBar label="Tanque 2" value={mockVehicleData.fuel2} />
                    <ProgressBar label="Tanque 3" value={mockVehicleData.fuel3} />
                    <ProgressBar label="Voltaje" value={mockVehicleData.voltage} color="#ffc107" />
                </MetersContainer>
            </Section>
            
            <Footer>
                <FaMapMarkerAlt />
                <LocationInfo>
                    <Address>{mockVehicleData.address}</Address>
                    <Coordinates>{mockVehicleData.coords}</Coordinates>
                </LocationInfo>
            </Footer>
        </CardContainer>
    );
}

// ==================== ESTILOS MODERNOS (CON AJUSTES) ====================

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// -- ESTILO MODIFICADO --
const CardActions = styled.div`
    /* Se quita la posición absoluta */
    display: flex;
    gap: 8px;
    z-index: 10;
`;

const ActionButton = styled.button`
    background: #e9ecef;
    border: none;
    color: #6c757d;
    font-size: 14px;
    cursor: pointer;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease, color 0.2s ease;
    flex-shrink: 0; /* Evita que los botones se encojan */

    &:hover {
        background-color: #ced4da;
        color: #212529;
    }
`;


const CardContainer = styled.div`
    position: fixed;
    top: 15px;
    right: 70px;
    width: 360px; 
    z-index: 1050;
    background: #f8f9fa; 
    color: #212529;
    border-radius: 16px; 
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease-out;
    transform: ${(props) => (props.$isVisible ? 'translateX(0)' : 'translateX(120%)')};
    opacity: ${(props) => (props.$isVisible ? '1' : '0')};
    pointer-events: ${(props) => (props.$isVisible ? 'auto' : 'none')};
    
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

// -- ESTILO MODIFICADO --
const Header = styled.header`
    animation: ${fadeIn} 0.5s ease-out;
    /* Ya no necesita padding-right */
`;

// -- NUEVO ESTILO --
const HeaderTopRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 4px;
`;

const VehicleName = styled.h2`
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-grow: 1; /* Permite que el nombre ocupe el espacio disponible */
`;

const DataItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #6c757d;
    
    svg {
        font-size: 12px;
    }
`;

const StatusGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
    gap: 12px;
    animation: ${fadeIn} 0.6s ease-out;
`;

const StatusItem = styled.div`
    background: #ffffff;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid #e9ecef;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const StatusLabel = styled.span`
    font-size: 11px;
    font-weight: 500;
    color: #6c757d;
`;

const StatusValue = styled.div`
    font-size: 14px;
    font-weight: 600;
    color: ${(props) => props.color || '#212529'};
    display: flex;
    align-items: center;
    gap: 6px;
`;

const SpeedDisplay = styled.div`
    display: flex;
    align-items: baseline;
    gap: 4px;
`;

const SpeedValue = styled.span`
    font-size: 28px;
    font-weight: 700;
    color: #007bff;
    line-height: 1;
`;

const SpeedUnit = styled.span`
    font-size: 14px;
    font-weight: 500;
    color: #007bff;
`;

const SubText = styled.span`
    font-size: 11px;
    color: #6c757d;
    margin-top: 2px;
`;

const Section = styled.section`
    animation: ${fadeIn} 0.7s ease-out;
`;

const SectionTitle = styled.h3`
    font-size: 12px;
    font-weight: 500;
    color: #6c757d;
    text-transform: uppercase;
    margin: 0 0 10px 0;
    letter-spacing: 0.5px;
`;

const MetersContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Footer = styled.footer`
    border-top: 1px solid #e9ecef;
    padding-top: 16px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 12px;
    color: #6c757d;
    animation: ${fadeIn} 0.8s ease-out;
    
    svg {
        margin-top: 2px;
        flex-shrink: 0;
    }
`;

const LocationInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const Address = styled.span`
    font-weight: 500;
    color: #212529;
`;

const Coordinates = styled.span``;

const ProgressBarContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    height: 20px;
    background-color: #e9ecef;
    border-radius: 10px;
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
    border-radius: 10px;
`;

const ProgressBarLabel = styled.span`
    position: relative;
    z-index: 1;
    font-size: 10px;
    font-weight: 600;
    color: #343a40;
    padding: 0 10px;
    text-shadow: 0 0 4px rgba(255, 255, 255, 0.6);
`;