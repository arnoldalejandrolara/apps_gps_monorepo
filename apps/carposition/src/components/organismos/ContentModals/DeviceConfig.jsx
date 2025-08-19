import React, { useState } from 'react';
import { styled } from 'styled-components';
import { FaCar, FaArrowLeft, FaSearch, FaFilter } from 'react-icons/fa';

// Importa el componente de contenido de detalles
import { DeviceDetailsContent } from './DeviceDetails';

// --- Datos de Ejemplo ---
const dummyDevices = [
    { id: 'dev-1', name: 'Ford Mustang', plate: 'P-12345', status: 'Online', color: 'Rojo', type: 'Deportivo', driver: 'Juan Pérez', model: 'Mustang GT', year: 2022, serialNumber: 'SN123456', brand: 'Ford' },
    { id: 'dev-2', name: 'Chevrolet Camaro', plate: 'C-67890', status: 'Offline', color: 'Amarillo', type: 'Deportivo', driver: 'Ana López', model: 'SS', year: 2021, serialNumber: 'SN789012', brand: 'Chevrolet' },
    { id: 'dev-3', name: 'Dodge Challenger', plate: 'D-11223', status: 'Online', color: 'Negro', type: 'Deportivo', driver: 'Carlos Ruiz', model: 'SRT Hellcat', year: 2023, serialNumber: 'SN345678', brand: 'Dodge' },
    { id: 'dev-4', name: 'Tesla Model 3', plate: 'T-44556', status: 'Online', color: 'Blanco', type: 'Eléctrico', driver: 'Elena García', model: 'Long Range', year: 2024, serialNumber: 'SN901234', brand: 'Tesla' },
    { id: 'dev-5', name: 'Toyota Supra', plate: 'S-77889', status: 'Offline', color: 'Gris', type: 'Deportivo', driver: 'Miguel Castro', model: 'GR Supra', year: 2023, serialNumber: 'SN567890', brand: 'Toyota' },
    { id: 'dev-6', name: 'Nissan GT-R', plate: 'N-11223', status: 'Online', color: 'Azul', type: 'Deportivo', driver: 'Luis Torres', model: 'GT-R NISMO', year: 2022, serialNumber: 'SN112233', brand: 'Nissan' },
    { id: 'dev-7', name: 'Honda Civic', plate: 'H-44556', status: 'Online', color: 'Plata', type: 'Sedán', driver: 'Sofía Díaz', model: 'Type R', year: 2023, serialNumber: 'SN445566', brand: 'Honda' },
    { id: 'dev-8', name: 'Audi R8', plate: 'A-77889', status: 'Offline', color: 'Rojo', type: 'Deportivo', driver: 'David Gómez', model: 'V10', year: 2021, serialNumber: 'SN778899', brand: 'Audi' },
];

// --- Componente Principal ---
export function DeviceConfigComponent() {
    const [view, setView] = useState('list'); // 'list' o 'details'
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleShowDetails = (device) => {
        setSelectedDevice(device);
        setView('details');
    };

    const handleReturnToList = () => {
        setSelectedDevice(null);
        setView('list');
    };

    const filteredDevices = dummyDevices.filter(device =>
        device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.plate.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ComponentWrapper>
            <ContentArea>
                {/* Vista de Lista */}
                <AnimatedView $isActive={view === 'list'} $direction="left">
                    <Header>
                        <SearchWrapper>
                            <SearchIcon />
                            <SearchInput 
                                type="text" 
                                placeholder="Buscar vehículo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </SearchWrapper>
                        <FilterButton>
                            <FaFilter />
                        </FilterButton>
                    </Header>
                    <DeviceList>
                        {filteredDevices.map(device => (
                            <DeviceCard 
                                key={device.id} 
                                onClick={() => handleShowDetails(device)}
                            >
                                <IconWrapper status={device.status}>
                                    <FaCar />
                                </IconWrapper>
                                <DeviceInfo>
                                    <DeviceName>{device.name}</DeviceName>
                                    <DevicePlate>{device.plate}</DevicePlate>
                                </DeviceInfo>
                                <DeviceStatus status={device.status}>{device.status}</DeviceStatus>
                            </DeviceCard>
                        ))}
                    </DeviceList>
                </AnimatedView>

                {/* Vista de Detalles */}
                <AnimatedView $isActive={view === 'details'} $direction="right">
                    <DetailsHeader>
                        <BackButton onClick={handleReturnToList}>
                            <FaArrowLeft style={{ marginRight: '8px' }} />
                            Regresar
                        </BackButton>
                        {selectedDevice && (
                            <DeviceTitle>{selectedDevice.name}</DeviceTitle>
                        )}
                    </DetailsHeader>
                    <DeviceDetailsContent device={selectedDevice} />
                </AnimatedView>
            </ContentArea>
        </ComponentWrapper>
    );
}

// --- Estilos ---
const ComponentWrapper = styled.div`
    padding: 10px; 
    background-color: #F8F9FA; 
    border-radius: 8px;
    height: 100%; 
    display: flex; 
    flex-direction: column;
    position: relative;
    overflow: hidden;
    @media (max-width: 768px) { padding: 15px; }
`;

const ContentArea = styled.div`
    position: relative;
    flex-grow: 1;
    width: 100%;
    height: 100%;
`;

const AnimatedView = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: transform 0.4s ease-in-out;
    transform: translateX(${({ $isActive, $direction }) => 
        $isActive ? '0%' : ($direction === 'left' ? '-100vw' : '100vw')
    });
`;

const Header = styled.div`
    display: flex; 
    justify-content: start; 
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap; 
    flex-shrink: 0; 
    gap: 15px;
    @media (max-width: 768px) {
        flex-direction: column; 
        align-items: stretch; 
    }
`;

const SearchWrapper = styled.div` 
    position: relative; 
    flex-shrink: 0;
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
    background-color: #fff; 
    font-size: 13px; 
    width: 400px; /* Ancho fijo para el input */
    outline: none;
    transition: all 0.2s ease;
    &:focus {
        border-color: #007BFF;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
    }
    @media (max-width: 480px) {
        width: 100%; /* El input vuelve a ocupar todo el ancho en móviles */
    }
`;

const FilterButton = styled.button`
    background-color: #6C757D; 
    color: white; 
    border: none; 
    height: 100%;
    border-radius: 6px;
    padding: 10px 14px; 
    font-size: 14px; 
    font-weight: 500; 
    cursor: pointer;
    display: flex; 
    align-items: center; 
    justify-content: center;
    transition: background-color 0.2s ease;
    flex-shrink: 0;
    &:hover { background-color: #5A6268; }
`;

const DeviceList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex-grow: 1;
    overflow-y: auto;
`;

const DeviceCard = styled.div`
    display: flex;
    align-items: center;
    background: #FFFFFF;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #E9ECEF;
    cursor: pointer;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    }
`;

const IconWrapper = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${({ status }) => status === 'Online' ? '#D4EDDA' : '#F8D7DA'};
    color: ${({ status }) => status === 'Online' ? '#28A745' : '#DC3545'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    margin-right: 15px;
    flex-shrink: 0;
`;

const DeviceInfo = styled.div`
    flex-grow: 1;
    min-width: 0;
`;

const DeviceName = styled.span`
    font-size: 14px;
    font-weight: 500;
    color: #343A40;
    display: block;
`;

const DevicePlate = styled.span`
    font-size: 13px;
    color: #6C757D;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
`;

const DeviceStatus = styled.span`
    font-size: 12px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 12px;
    flex-shrink: 0;
    color: ${({ status }) => status === 'Online' ? '#28A745' : '#DC3545'};
    background-color: ${({ status }) => status === 'Online' ? '#D4EDDA' : '#F8D7DA'};
`;

const DetailsHeader = styled.div`
    display: flex;
    align-items: center;
    padding-bottom: 15px;
    margin-bottom: 20px;
    border-bottom: 1px solid #DEE2E6;
    flex-shrink: 0;
`;

const BackButton = styled.button`
    background: transparent;
    border: 1px solid #DEE2E6;
    color: #495057;
    border-radius: 6px;
    padding: 8px 15px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: all 0.2s ease;
    &:hover { background-color: #E9ECEF; }
`;

const DeviceTitle = styled.h3`
    font-size: 1.2rem;
    font-weight: 500;
    color: #343A40;
    margin: 0 0 0 20px;
    flex-grow: 1;
`;