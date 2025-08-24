import React, { useState } from 'react';
import { styled } from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import { AlertsList } from '../listado/AlertListConfig';
import { ChannelList } from '../listado/ChannelList';
import { CustomSelect } from '../formularios/CustomSelect';
import { FormInput } from '../formularios/FormInput';
// --- Datos de Ejemplo ---
const alertOptions = [
    { id: 'alert-1', name: 'Velocidad Excesiva', description: 'Recibir una alerta si el vehículo supera el límite de velocidad.' },
    { id: 'alert-2', name: 'Entrada/Salida de Geo-cerca', description: 'Notificación cuando el vehículo entra o sale de un área definida.' },
    { id: 'alert-3', name: 'Batería Baja', description: 'Alerta si el nivel de batería del dispositivo de rastreo es bajo.' },
    { id: 'alert-4', name: 'Encendido/Apagado de Motor', description: 'Notificación al encender o apagar el motor del vehículo.' },
    { id: 'alert-5', name: 'Desconexión de Dispositivo', description: 'Alerta si el dispositivo de rastreo se desconecta de la red.' },
];

const userOptions = [
    { id: 'user-1', name: 'Juan Pérez' },
    { id: 'user-2', name: 'Ana López' },
    { id: 'user-3', name: 'Carlos Ruiz' },
    { id: 'user-4', name: 'Carlos Ruiz' },
    { id: 'user-5', name: 'Carlos Ruiz' },
    { id: 'user-6', name: 'Carlos Ruiz' },
    { id: 'user-7', name: 'Carlos Ruiz' },
];

const unitOptions = [
    { id: 'unit-1', name: 'Ford Mustang', plate: 'P-12345' },
    { id: 'unit-2', name: 'Tesla Model 3', plate: 'T-44556' },
    { id: 'unit-3', name: 'Toyota Supra', plate: 'S-77889' },
];

// --- Componente de Notificaciones ---
export function NotifiConfigComponent() {

    const [userSelect, setUserSelect] = useState('Usuario');
    const [unitSelect, setUnitSelect] = useState('Unidad');

    const [user, setUser] = useState(null);

    const [formData, setFormData] = useState({
        telefono: user?.telefono || '',
        email: user?.email || '',
       
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const [channels, setChannels] = useState({
        web: true,
        mobile: true,
        whatsapp: false,
        email: true,
    });

    const [alerts, setAlerts] = useState(() =>
        alertOptions.reduce((acc, alert) => {
            acc[alert.id] = true;
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
                        <CustomSelect
                            label=""
                            options={userOptions}
                            value={userSelect}
                            onChange={setUserSelect}
                        />
                    </SelectWrapper>
                    <SelectWrapper>
                        <SelectLabel>Unidad:</SelectLabel>
                        <CustomSelect
                            label=""
                            options={unitOptions}
                            value={unitSelect}
                            onChange={setUnitSelect}
                        />
                    </SelectWrapper>
                </SelectColumn>
                <InputColumn>
                
                <InputWrapper>
                        <InputLabel>Teléfono:</InputLabel>
                        <FormInput
                            renderLabel={false}
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            placeholder="Número de teléfono"
                            required
                        />
                    </InputWrapper>
                    <InputWrapper>
                        <InputLabel>Correo:</InputLabel>
                        <FormInput
                            renderLabel={false}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Correo electrónico"
                            required
                        />
                    </InputWrapper>
                </InputColumn>
            </UserUnitSection>

            <SectionHeader>Canales de Notificación</SectionHeader>
            <ChannelList channels={channels} handleChannelChange={handleChannelChange} />

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



const SectionHeader = styled.h2`
    font-size: 14px;
    font-weight: 500;
    color: #343A40;
    border-bottom: 1px solid #E9ECEF;
    padding-bottom: 10px;
    margin-bottom: 15px;
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