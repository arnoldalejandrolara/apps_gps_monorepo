import React, { useState } from 'react';
import { styled } from 'styled-components';
import { FaSearch, FaDesktop, FaMobileAlt, FaWhatsapp, FaEnvelope, FaBell, FaPlay, FaSave } from 'react-icons/fa';
import { AlertsList } from '../listado/AlertListConfig';

// --- Datos de Ejemplo ---
const alertOptions = [
    { id: 'alert-1', name: 'Velocidad Excesiva', description: 'Recibir una alerta si el vehículo supera el límite de velocidad.' },
    { id: 'alert-2', name: 'Entrada/Salida de Geo-cerca', description: 'Notificación cuando el vehículo entra o sale de un área definida.' },
    { id: 'alert-3', name: 'Batería Baja', description: 'Alerta si el nivel de batería del dispositivo de rastreo es bajo.' },
    { id: 'alert-4', name: 'Encendido/Apagado de Motor', description: 'Notificación al encender o apagar el motor del vehículo.' },
    { id: 'alert-5', name: 'Desconexión de Dispositivo', description: 'Alerta si el dispositivo de rastreo se desconecta de la red.' },
];

const channelOptions = [
    { id: 'web', name: 'Web', icon: FaDesktop },
    { id: 'mobile', name: 'Mobile', icon: FaMobileAlt },
    { id: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp },
    { id: 'email', name: 'Email', icon: FaEnvelope },
];

const userOptions = [
    { id: 'user-1', name: 'Juan Pérez' },
    { id: 'user-2', name: 'Ana López' },
    { id: 'user-3', name: 'Carlos Ruiz' },
];

const unitOptions = [
    { id: 'unit-1', name: 'Ford Mustang', plate: 'P-12345' },
    { id: 'unit-2', name: 'Tesla Model 3', plate: 'T-44556' },
    { id: 'unit-3', name: 'Toyota Supra', plate: 'S-77889' },
];

const soundOptions = [
    { id: 'sound-1', name: 'Alarma Clásica' },
    { id: 'sound-2', name: 'Timbre de Campana' },
    { id: 'sound-3', name: 'Sonido Electrónico' },
];

// --- Componente de Notificaciones ---
export function NotifiConfigComponent() {
    const [channels, setChannels] = useState({
        web: true,
        mobile: true,
        whatsapp: false,
        email: true,
    });

    const [alerts, setAlerts] = useState(() =>
        alertOptions.reduce((acc, alert) => {
            acc[alert.id] = true; // Activar todas las alertas por defecto
            return acc;
        }, {})
    );

    const [searchTerm, setSearchTerm] = useState('');
 
    const [expandedAlertId, setExpandedAlertId] = useState(null);

    const handleChannelChange = (channelId) => {
        setChannels(prev => ({
            ...prev,
            [channelId]: !prev[channelId]
        }));
    };

    const handleAlertChange = (alertId) => {
        setAlerts(prev => ({
            ...prev,
            [alertId]: !prev[alertId]
        }));
    };

    const handleSoundClick = (alertId) => {
        setExpandedAlertId(expandedAlertId === alertId ? null : alertId);
    };


    const filteredAlerts = alertOptions.filter(alert =>
        alert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <NotificationContainer>
            <UserUnitSection>
                <SelectColumn>
                    <SelectWrapper>
                        <SelectLabel>Usuario:</SelectLabel>
                        <UserUnitSelect>
                            {userOptions.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </UserUnitSelect>
                    </SelectWrapper>
                    <SelectWrapper>
                        <SelectLabel>Unidad:</SelectLabel>
                        <UserUnitSelect>
                            {unitOptions.map(unit => (
                                <option key={unit.id} value={unit.id}>
                                    {unit.name} ({unit.plate})
                                </option>
                            ))}
                        </UserUnitSelect>
                    </SelectWrapper>
                </SelectColumn>
                <InputColumn>
                    <InputWrapper>
                        <InputLabel>Teléfono:</InputLabel>
                        <ContactInput type="tel" placeholder="Número de teléfono" />
                    </InputWrapper>
                    <InputWrapper>
                        <InputLabel>Correo:</InputLabel>
                        <ContactInput type="email" placeholder="Correo electrónico" />
                    </InputWrapper>
                </InputColumn>
            </UserUnitSection>

            <SectionHeader>Canales de Notificación</SectionHeader>
            <ChannelList>
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
            </ChannelList>

            <SectionHeader>Alertas</SectionHeader>

            <SearchWrapper>
                <SearchIcon />
                <SearchInput
                    type="text"
                    placeholder="Buscar alerta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </SearchWrapper>

            <AlertsList
                alerts={alerts}
                filteredAlerts={filteredAlerts}
                expandedAlertId={expandedAlertId}
                handleAlertChange={handleAlertChange}
                handleSoundClick={handleSoundClick}
            />

        </NotificationContainer>
    );
}

// --- Estilos ---
const NotificationContainer = styled.div`
    background-color: #fff;
    padding: 5px 15px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const UserUnitSection = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #E9ECEF;
    margin-bottom: 15px;
`;

const SelectColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const InputColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const SelectWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const SelectLabel = styled.label`
    font-size: 13px;
    color: #495057;
    font-weight: 500;
    min-width: 70px;
`;

const UserUnitSelect = styled.select`
    padding: 8px 10px;
    border-radius: 6px;
    border: 1px solid #DEE2E6;
    background-color: #f8f9fa;
    font-size: 13px;
    width: 100%;
    outline: none;
    cursor: pointer;
    transition: all 0.2s ease;
    &:focus {
        border-color: #007BFF;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
    }
`;

const InputWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const InputLabel = styled.label`
    font-size: 13px;
    color: #495057;
    font-weight: 500;
    min-width: 70px;
`;

const ContactInput = styled.input`
    padding: 8px 10px;
    border-radius: 6px;
    border: 1px solid #DEE2E6;
    background-color: #f8f9fa;
    font-size: 13px;
    outline: none;
    width: 100%;
    transition: all 0.2s ease;
    &:focus {
        border-color: #007BFF;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
    }
`;

const SectionHeader = styled.h2`
    font-size: 14px;
    font-weight: 500;
    color: #343A40;
    border-bottom: 1px solid #E9ECEF;
    padding-bottom: 10px;
    margin-bottom: 15px;
`;

const ChannelList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 15px;
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
`;

const ChannelTitle = styled.h4`
    font-size: 14px;
    font-weight: 500;
    color: #343A40;
    margin: 0;
`;

const SearchWrapper = styled.div` 
    position: relative; 
    margin-top: -15px;
    margin-bottom: 15px; 
`;

const SearchIcon = styled(FaSearch)`
    position: absolute; 
    top: 50%; 
    left: 15px;
    transform: translateY(-50%); 
    color: #ADB5BD;
`;

const SearchInput = styled.input`
    padding: 10px 15px 10px 40px; 
    border-radius: 6px; 
    border: 1px solid #DEE2E6;
    background-color: #f8f9fa; 
    font-size: 13px; 
    width: 100%;
    height: 35px;
    outline: none;
    transition: all 0.2s ease;
    &:focus {
        border-color: #007BFF;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
    }
`;

const AlertList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const AlertItem = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #F8F9FA;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #E9ECEF;
    transition: height 0.3s ease, box-shadow 0.2s ease;
    overflow: hidden;
    height: ${({ $isExpanded }) => ($isExpanded ? 'auto' : '85px')};
    &:hover {
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    }
`;

const AlertHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const AlertInfo = styled.div`
    flex-grow: 1;
`;

const AlertTitle = styled.h4`
    font-size: 14px;
    font-weight: 500;
    color: #343A40;
    margin: 0 0 4px;
`;

const AlertDescription = styled.p`
    font-size: 13px;
    color: #6C757D;
    margin: 0;
`;

const AlertActions = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
`;

const SoundButton = styled.button`
    background: #6C757D;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 10px;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;
    &:hover {
        background-color: #5A6268;
    }
`;

// Estilos para la sección de configuración de sonido
const SoundConfig = styled.div`
    padding-top: 15px;
    margin-top: 15px;
    border-top: 1px solid #E9ECEF;
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const SoundConfigRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const SoundLabel = styled.label`
    font-size: 13px;
    color: #495057;
    font-weight: 500;
`;

const SoundSelect = styled.select`
    padding: 8px 10px;
    border-radius: 6px;
    border: 1px solid #DEE2E6;
    background-color: #f8f9fa;
    font-size: 13px;
    outline: none;
    cursor: pointer;
    flex-grow: 1;
`;

const PlayButton = styled.button`
    background: #28A745;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;
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
    &:hover {
        background-color: #0069D9;
    }
`;

// Estilos del interruptor (switch)
const SwitchLabel = styled.label`
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
    flex-shrink: 0;
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