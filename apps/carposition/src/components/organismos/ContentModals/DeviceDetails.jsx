import React, { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import { useSelector } from 'react-redux';
import { FaExclamationTriangle, FaClock, FaMapMarkerAlt, FaPalette, FaSave } from 'react-icons/fa';
import { CompactPicker } from 'react-color';
import { getMarcasUnidades, getTiposUnidades, getDatosDispositivo, updateDatosDispositivo } from '@mi-monorepo/common/services';

// --- Componente del contenido de detalles ---
export function DeviceDetailsContent({ device }) {
    // Estados para los checkboxes de configuración
    const [speedAlarmActive, setSpeedAlarmActive] = useState(false);
    const [idleAlarmActive, setIdleAlarmActive] = useState(false);
    const [poiAlarmActive, setPoiAlarmActive] = useState(false);

    const [speedLimit, setSpeedLimit] = useState('');
    const [showColorPicker, setShowColorPicker] = useState(false);

    const token = useSelector((state) => state.auth?.token);

    const [marcasUnidades, setMarcasUnidades] = useState([]);

    const [tiposUnidades, setTiposUnidades] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    console.log(device);
    // Estado para la información editable
    const [editableInfo, setEditableInfo] = useState({
        name: device?.info.nombre || '',
        driver: device?.info.chofer || '',
        plate: device?.info.placas || '',
        color: '#' + device?.info.color || '',
        type: device?.type || '',
        brand: device?.info.marca || '',
        model: device?.info.modelo || '',
        year: device?.info.anio || '',
    });

    useEffect(() => {
        const fetchDatosDispositivo = async () => {
            if (token && device) {
                const response = await getDatosDispositivo(token, device.imei);
                console.log(response);
                setEditableInfo({
                    name: response.data.nombre || '',
                    driver: response.data.chofer || '',
                    plate: response.data.placa || '',
                    color: '#' + response.data.color || '',
                    type: response.data.id_tipo || '',
                    brand: response.data.id_marca || '',
                    model: response.data.modelo || '',
                    year: response.data.anio || '',
                });   
            }
        };
        fetchDatosDispositivo();
        
    }, [device]);

    // Cerrar el color picker cuando se hace clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showColorPicker && !event.target.closest('.color-picker-container')) {
                setShowColorPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showColorPicker]);

    // Fetch marcas de unidades
    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                try {
                    const response = await getMarcasUnidades(token);
                    setMarcasUnidades(response.marcas);

                    const responseTipos = await getTiposUnidades(token);
                    setTiposUnidades(responseTipos.tipos);
                } catch (error) {
                    console.error('Error fetching marcas:', error);
                }
            }
        };

        fetchData();
    }, [token]);

    if (!device) {
        return <p>Selecciona un vehículo para ver los detalles.</p>;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleColorChange = (color) => {
        setEditableInfo(prev => ({ ...prev, color: color.hex }));
    };

    const handleColorChangeComplete = (color) => {
        setEditableInfo(prev => ({ ...prev, color: color.hex }));
        setShowColorPicker(false);
    };

    const handleSave = async () => {
        if (!token || !device?.imei) {
            console.error('Token o IMEI no disponible');
            return;
        }

        setIsSaving(true);
        try {
            // Preparar los datos para enviar
            const dataToSave = {
                nombre: editableInfo.name,
                chofer: editableInfo.driver,
                placa: editableInfo.plate,
                color: editableInfo.color.replace('#', ''),
                id_marca: editableInfo.brand,
                modelo: editableInfo.model,
                anio: editableInfo.year,
                id_tipo: editableInfo.type
            };

            const response = await updateDatosDispositivo(token, device.imei, dataToSave);
            console.log('Datos guardados exitosamente:', response);
            
            // Aquí podrías mostrar una notificación de éxito
            alert('Datos guardados exitosamente');
            
        } catch (error) {
            console.error('Error al guardar los datos:', error);
            alert('Error al guardar los datos. Por favor, inténtalo de nuevo.');
        } finally {
            setIsSaving(false);
        }
    };
    
    // Los datos del dispositivo se desestructuran para un acceso más fácil
    const { status } = device;
    const serialNumber = device?.info.num_serie || 'N/A';


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
                        <Label>Chofer</Label>
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
                        <StyledSelect 
                            name="brand" 
                            value={editableInfo.brand} 
                            onChange={handleInputChange}
                        >
                            <option value="0">Seleccionar marca</option>
                            {marcasUnidades.map(marca => (
                                <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                            ))}
                        </StyledSelect>
                    </InfoGroup>
                    <InfoGroup>
                        <Label>No. de Serie</Label>
                        <InfoDisplay>{serialNumber}</InfoDisplay>
                    </InfoGroup>
                    <InfoGroup>
                        <Label>Color</Label>
                        <ColorPickerContainer className="color-picker-container">
                            <ColorPreview 
                                color={editableInfo.color || '#007BFF'}
                                onClick={() => setShowColorPicker(!showColorPicker)}
                            >
                                <FaPalette />
                            </ColorPreview>
                            <ColorInput 
                                type="text" 
                                name="color" 
                                value={editableInfo.color} 
                                onChange={handleInputChange}
                                placeholder="#000000"
                            />
                            {showColorPicker && (
                                <ColorPickerDropdown>
                                    <CompactPicker
                                        color={editableInfo.color || '#007BFF'}
                                        onChange={handleColorChangeComplete}
                                        colors={[
                                            '#4D4D4D', '#999999', '#FFFFFF', '#F44E3B',
                                            '#FE9200', '#FCDC00', '#DBDF00', '#A4DD00',
                                            '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF',
                                            '#333333', '#808080', '#CCCCCC', '#D33115',
                                            '#E27300', '#FCC400', '#B0BC00', '#68BC00',
                                            '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF'
                                        ]}
                                    />
                                </ColorPickerDropdown>
                            )}
                        </ColorPickerContainer>
                    </InfoGroup>
                    <InfoGroup>
                        <Label>Tipo</Label>
                        <StyledSelect 
                            name="type" 
                            value={editableInfo.type} 
                            onChange={handleInputChange} 
                        >
                            <option value="0">Seleccionar tipo</option>
                            {tiposUnidades.map(tipo => (
                                <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                            ))}
                        </StyledSelect>
                    </InfoGroup>
                </GridContainer>
                
                <ButtonContainer>
                    <SaveButton onClick={handleSave} disabled={isSaving}>
                        <FaSave />
                        {isSaving ? 'Guardando...' : 'Guardar'}
                    </SaveButton>
                </ButtonContainer>
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

// Estilo para el select de marca - idéntico a StyledInput
const StyledSelect = styled.select`
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
    color: ${({ status }) => status === 'Activo' ? '#155724' : '#721c24'};
    background-color: ${({ status }) => status === 'Activo' ? '#D4EDDA' : '#F8D7DA'};
    border-color: ${({ status }) => status === 'Activo' ? '#C3E6CB' : '#F5C6CB'};
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

// --- Estilos para el Color Picker ---
const ColorPickerContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const ColorPreview = styled.div`
    width: 35px;
    height: 35px;
    background-color: ${props => props.color};
    border: 2px solid #CED4DA;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: white;
    font-size: 14px;
    text-shadow: 0 1px 2px rgba(0,0,0,0.5);

    &:hover {
        border-color: #007BFF;
        transform: scale(1.05);
    }
`;

const ColorInput = styled.input`
    flex: 1;
    height: 35px;
    font-size: 14px;
    color: #495057;
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
`;

const ColorPickerDropdown = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    margin-top: 5px;
    
    /* Override react-color styles for better integration */
    .compact-picker {
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        border-radius: 8px !important;
        border: 1px solid #CED4DA !important;
        background: white !important;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    padding-top: 5px;
`;

const SaveButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: auto;
    min-width: 120px;
    height: 40px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0 16px;

    &:hover:not(:disabled) {
        background-color: #218838;
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
    }

    &:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: 0 1px 4px rgba(40, 167, 69, 0.3);
    }

    &:disabled {
        background-color: #6c757d;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }

    svg {
        font-size: 16px;
    }
`;