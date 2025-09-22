import React, { useState } from 'react';
import { styled } from 'styled-components';
import { FaExclamationTriangle, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

// --- Componente del contenido de detalles ---
export function DeviceDetailsContent({ device }) {
    // Estados para los checkboxes de configuración
    const [speedAlarmActive, setSpeedAlarmActive] = useState(false);
    const [idleAlarmActive, setIdleAlarmActive] = useState(false);
    const [poiAlarmActive, setPoiAlarmActive] = useState(false);

    const [speedLimit, setSpeedLimit] = useState('');

    // Estado para la información editable
    const [editableInfo, setEditableInfo] = useState({
        name: device?.name || '',
        driver: device?.driver || '',
        plate: device?.plate || '',
        color: device?.color || '',
        type: device?.type || '',
        brand: device?.brand || '',
        model: device?.model || '',
        year: device?.year || '',
    });

    if (!device) {
        return <p>Selecciona un vehículo para ver los detalles.</p>;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableInfo(prev => ({ ...prev, [name]: value }));
    };
    
    // Los datos del dispositivo se desestructuran para un acceso más fácil
    const { status, serialNumber } = device;

    return (
        <ContentWrapper>
            <Section>
                <SectionTitle>Información Principal</SectionTitle>
                <GridContainer>
                    <InfoGroup>
                        <Label>Nombre del Dispositivo</Label>
                        <StyledInput 
                            type="text" 
                            name="name" 
                            value={editableInfo.name} 
                            onChange={handleInputChange} 
                        />
                    </InfoGroup>
                    <InfoGroup>
                        <Label>Conductor</Label>
                        <StyledInput 
                            type="text" 
                            name="driver" 
                            value={editableInfo.driver} 
                            onChange={handleInputChange} 
                        />
                    </InfoGroup>
                    <InfoGroup>
                        <Label>Placa</Label>
                        <StyledInput 
                            type="text" 
                            name="plate" 
                            value={editableInfo.plate} 
                            onChange={handleInputChange} 
                        />
                    </InfoGroup>
                    <InfoGroup>
                        <Label>Estado</Label>
                        <StatusDisplay status={status}>{status}</StatusDisplay>
                    </InfoGroup>
                    <InfoGroup>
                        <Label>Modelo</Label>
                        <StyledInput 
                            type="text" 
                            name="model" 
                            value={editableInfo.model} 
                            onChange={handleInputChange} 
                        />
                    </InfoGroup>
                    <InfoGroup>
                        <Label>Año</Label>
                        <StyledInput 
                            type="text" 
                            name="year" 
                            value={editableInfo.year} 
                            onChange={handleInputChange} 
                        />
                    </InfoGroup>
                    <InfoGroup>
                        <Label>Marca</Label>
                        <StyledInput 
                            type="text" 
                            name="brand" 
                            value={editableInfo.brand} 
                            onChange={handleInputChange} 
                        />
                    </InfoGroup>
                    <InfoGroup>
                        <Label>No. de Serie</Label>
                        <InfoDisplay>{serialNumber}</InfoDisplay>
                    </InfoGroup>
                    <InfoGroup>
                        <Label>Color</Label>
                        <StyledInput 
                            type="text" 
                            name="color" 
                            value={editableInfo.color} 
                            onChange={handleInputChange} 
                        />
                    </InfoGroup>
                    <InfoGroup>
                        <Label>Tipo</Label>
                        <StyledInput 
                            type="text" 
                            name="type" 
                            value={editableInfo.type} 
                            onChange={handleInputChange} 
                        />
                    </InfoGroup>
                </GridContainer>
            </Section>

            <Section>
                <SectionTitle>Configuración de Alarmas</SectionTitle>
                <AlarmContainer>

                    <AlarmItem>
                        <AlarmIconWrapper><FaExclamationTriangle /></AlarmIconWrapper>
                        <AlarmContent>
                            <AlarmHeader>
                                <AlarmText>Alarma por Exceso de Velocidad</AlarmText>
                                <CheckboxLabel>
                                    <StyledCheckbox
                                        type="checkbox"
                                        checked={speedAlarmActive}
                                        onChange={() => setSpeedAlarmActive(!speedAlarmActive)}
                                    />
                                    <CheckboxContainer />
                                </CheckboxLabel>
                            </AlarmHeader>
                            <AlarmDescription>Detecta la velocidad solo cuando el GPS envía la información.</AlarmDescription>
                            <StyledInput 
                                type="number" 
                                placeholder="Límite de velocidad (km/h)" 
                                value={speedLimit}
                                onChange={(e) => setSpeedLimit(e.target.value)}
                                disabled={!speedAlarmActive}
                            />
                        </AlarmContent>
                    </AlarmItem>
                    <AlarmItem>
                        <AlarmIconWrapper><FaClock /></AlarmIconWrapper>
                        <AlarmContent>
                            <AlarmHeader>
                                <AlarmText>Alarma por Tiempo Detenido</AlarmText>
                                <CheckboxLabel>
                                    <StyledCheckbox
                                        type="checkbox"
                                        checked={idleAlarmActive}
                                        onChange={() => setIdleAlarmActive(!idleAlarmActive)}
                                    />
                                    <CheckboxContainer />
                                </CheckboxLabel>
                            </AlarmHeader>
                            <AlarmDescription>Recibe una alerta si el vehículo ha estado detenido por un tiempo prolongado.</AlarmDescription>
                            <StyledInput 
                                type="number" 
                                placeholder="Tiempo inactivo (minutos)" 
                                disabled={!idleAlarmActive} 
                            />
                        </AlarmContent>
                    </AlarmItem>
                    <AlarmItem>
                        <AlarmIconWrapper><FaMapMarkerAlt /></AlarmIconWrapper>
                        <AlarmContent>
                            <AlarmHeader>
                                <AlarmText>Alarma por Punto de Interés (POI)</AlarmText>
                                <CheckboxLabel>
                                    <StyledCheckbox
                                        type="checkbox"
                                        checked={poiAlarmActive}
                                        onChange={() => setPoiAlarmActive(!poiAlarmActive)}
                                    />
                                    <CheckboxContainer />
                                </CheckboxLabel>
                            </AlarmHeader>
                            <AlarmDescription>Recibe notificaciones al entrar o salir de una zona específica.</AlarmDescription>
                        </AlarmContent>
                    </AlarmItem>
                </AlarmContainer>
            </Section>
        </ContentWrapper>
    );
}

// --- Estilos del nuevo componente ---
const ContentWrapper = styled.div`
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 20px; 
    border: 1px solid #E9ECEF;
    overflow-y: auto;
`;

const Section = styled.div`
    padding: 15px 0;
    margin-bottom: 20px;
    border-bottom: 1px solid #E9ECEF;

    &:last-child {
        border-bottom: none;
        margin-bottom: 0;
    }
`;

const SectionTitle = styled.h4`
    font-size: 1rem;
    color: #343A40;
    font-weight: 500;
    margin-top: 0;
    margin-bottom: 15px;
    padding-bottom: 8px;
    border-bottom: 1px solid #DEE2E6;
`;

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px 30px; 

     @media (max-width: 768px) { grid-template-columns: 1fr  }
`;

const InfoGroup = styled.div`
    display: flex;
    flex-direction: column;
`;

const Label = styled.label`
    font-size: 13px;
    color: #6C757D;
    font-weight: 500;
    margin-bottom: 5px;
`;

// Estilo para los campos de solo lectura
const InfoDisplay = styled.p`
    font-size: 14px;
    color: #495057;
    margin: 0;
    padding: 8px 10px;
    background-color: #F8F9FA;
    border-radius: 4px;
    border: 1px solid #CED4DA;
`;

// Nuevo estilo para los campos editables (inputs)
const StyledInput = styled.input`
    width: 100%;
    height: 35px;
    font-size: 14px;
    color: #495057;
    margin: 0;
    padding: 8px 10px;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #CED4DA;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
        border-color: #007BFF;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
    &:disabled {
        background-color: #f0f0f0;
        cursor: not-allowed;
    }
`;

const StatusDisplay = styled(InfoDisplay)`
    color: ${({ status }) => status === 'Online' ? '#155724' : '#721c24'};
    background-color: ${({ status }) => status === 'Online' ? '#D4EDDA' : '#F8D7DA'};
    border-color: ${({ status }) => status === 'Online' ? '#C3E6CB' : '#F5C6CB'};
    font-weight: 500;
    text-align: left;
`;

const AlarmContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const AlarmItem = styled.div`
    display: flex;
    align-items: flex-start;
    background-color: #F8F9FA;
    padding: 15px; // --- CAMBIO: Un poco más de padding
    border-radius: 8px; // --- CAMBIO: Bordes un poco más redondeados
    border: 1px solid #E9ECEF;
`;

const AlarmIconWrapper = styled.div`
    font-size: 1rem;
    color: #6C757D;
    margin-right: 10px;
    flex-shrink: 0;
`;

const AlarmContent = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 5px;
`;

const AlarmHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%; // Asegura que ocupe todo el ancho disponible

    // --- AJUSTES PARA MÓVIL ---
    @media (max-width: 768px) {
        flex-direction: column; // Apila los elementos verticalmente
        align-items: flex-start; // Alinea todo a la izquierda
        gap: 10px; // Añade espacio entre el texto y el interruptor
    }
`;


const AlarmText = styled.span`
    font-size: 14px;
    color: #343A40;
    font-weight: 500;
`;

const AlarmDescription = styled.p`
    font-size: 12px;
    color: #888;
    margin: 0;
    margin-bottom: 10px; // --- CAMBIO: Un poco más de margen inferior

    // --- AJUSTES PARA MÓVIL ---
    @media (max-width: 768px) {
        margin-top: 5px; // Añade espacio arriba después del header apilado
    }
`;
const CheckboxLabel = styled.label`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`;

const CheckboxContainer = styled.div`
    width: 20px;
    height: 20px;
    border: 1px solid #CED4DA;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    &:hover {
        border-color: #ADB5BD;
    }
`;

const StyledCheckbox = styled.input`
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;

    &:checked + ${CheckboxContainer} {
        background-color: #28a745;
        border-color: #28a745;
        &::after {
            content: '';
            position: absolute;
            left: 6px;
            top: 3px;
            width: 4px;
            height: 8px;
            border: solid white;
            border-width: 0 1px 1px 0;
            transform: rotate(45deg);
        }
    }
`;