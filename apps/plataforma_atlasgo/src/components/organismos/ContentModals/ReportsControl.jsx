import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import {
    FaCog, FaClock, FaCalendarAlt, FaThermometerHalf, FaTachometerAlt,
    FaGasPump, FaHistory, FaBell, FaMapMarkerAlt, FaCar, FaMotorcycle,
    FaBatteryFull, FaChartLine, FaChartBar, FaFileAlt, FaSearch
} from 'react-icons/fa';
import { useSelector } from 'react-redux';

// Import the new HistoryReportComponent
import { HistoryReport } from '../reportes/HistoryReport';

// --- Datos de Ejemplo para los reportes ---
const dummyReports = [
    { id: '1', name: 'Historial', icon: FaHistory },
    { id: '2', name: 'Horas Trabajadas', icon: FaClock },
    { id: '3', name: 'Horas Trabajadas ON', icon: FaCalendarAlt },
    { id: '4', name: 'Horas de traslados', icon: FaClock },
    { id: '5', name: 'Temperatura', icon: FaThermometerHalf }, // Corregido: FaThermometerHalf is a component, not a string
    { id: '6', name: 'Kilometraje', icon: FaTachometerAlt },
    { id: '7', name: 'Kilometraje Múltiple', icon: FaTachometerAlt },
    { id: '8', name: 'Unidades en PDI', icon: FaMapMarkerAlt },
    { id: '9', name: 'Combustible', icon: FaGasPump },
    { id: '10', name: 'Combustible OBD', icon: FaGasPump },
    { id: '11', name: 'Lectura OBD', icon: FaCog },
    { id: '12', name: 'Alertas', icon: FaBell },
    { id: '13', name: 'Última posición', icon: FaMapMarkerAlt },
    { id: '14', name: 'Viajes', icon: FaCar },
    { id: '15', name: 'Traslados', icon: FaMotorcycle },
    { id: '16', name: 'Traslados múltiples', icon: FaMotorcycle },
    { id: '17', name: 'Status Batería Respaldo', icon: FaBatteryFull },
    { id: '18', name: 'Estatus de combustible', icon: FaGasPump },
    { id: '19', name: 'Estatus de actividad', icon: FaChartLine },
    { id: '20', name: 'Estatus de unidad', icon: FaChartBar },
    { id: '21', name: 'Estatus de reporte', icon: FaFileAlt },
];

// --- Componente de Reportes ---
export function ReportsComponent() {
    const [selectedReport, setSelectedReport] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredReports = dummyReports.filter(report =>
        report.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const vehicles = useSelector(state => state.vehicle.vehicles);

    const unidades = useMemo(() => {
        return vehicles.map(vehicle => ({
            id: vehicle.imei,
            name: vehicle.info.nombre,
            value: vehicle.imei
        }));
    }, [vehicles]);

    return (
        <ReportesContainer>
            <Sidebar>
                <SearchWrapper>
                    <SearchInput
                        type="text"
                        placeholder="Buscar reporte..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <SearchIcon />
                </SearchWrapper>
                <ReportList>
                    {filteredReports.map(report => {
                        const IconComponent = report.icon;
                        return (
                            <SidebarItem
                                key={report.id}
                                onClick={() => setSelectedReport(report)}
                                $isSelected={selectedReport?.id === report.id}
                            >
                                <IconComponent />
                                <span>{report.name}</span>
                            </SidebarItem>
                        );
                    })}
                </ReportList>
            </Sidebar>
            <ReportContent>
                {/* Conditional rendering based on the selected report */}
                {selectedReport && selectedReport.name === 'Historial' ? (
                    // Render the new component when "Historial" is selected
                    <HistoryReport unidades={unidades} />
                ) : selectedReport ? (
                    // Show a generic placeholder for other selected reports
                    <>
                        <ReportTitle>{selectedReport.name}</ReportTitle>
                        <ContentPlaceholder>
                            Contenido del reporte de {selectedReport.name}
                        </ContentPlaceholder>
                    </>
                ) : (
                    // Show the initial empty state if no report is selected
                    <EmptyState>
                        <EmptyStateIcon />
                        <EmptyStateText>Selecciona un reporte</EmptyStateText>
                    </EmptyState>
                )}
            </ReportContent>
        </ReportesContainer>
    );
}

// --- Estilos ---
const ReportesContainer = styled.div`
    display: flex;
    height: 100%;
    background-color: #F8F9FA;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
`;

const Sidebar = styled.div`
    width: 280px;
    background-color: #F8F9FA;
    padding: 20px;
    border-right: 1px solid #DEE2E6;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
`;

const SearchWrapper = styled.div`
    position: relative;
    margin-bottom: 20px;
`;

const SearchInput = styled.input`
    width: 100%;
    height: 35px;
    padding: 10px 15px 10px 40px;
    border: 1px solid #DEE2E6;
    border-radius: 8px;
    font-size: 14px;
    background-color: #fff;
    outline: none;
    transition: all 0.2s ease;
    
    &:focus {
        border-color: #007BFF;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
    }
`;

const SearchIcon = styled(FaSearch)`
    position: absolute;
    top: 50%;
    left: 15px;
    transform: translateY(-50%);
    color: #ADB5BD;
    font-size: 14px;
`;

const ReportList = styled.div`
    flex-grow: 1;
    overflow-y: auto;
    padding-right: 5px;

    &::-webkit-scrollbar {
        width: 8px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #e0e0e0;
        border-radius: 4px;
        &:hover {
            background-color: #c0c0c0;
        }
    }
`;

const SidebarItem = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 14px 15px;
    margin-bottom: 8px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: ${({ $isSelected }) => ($isSelected ? '#007bff' : '#495057')};
    background-color: ${({ $isSelected }) => ($isSelected ? '#e9f5ff' : 'transparent')};
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #e9f5ff;
        color: #007bff;
    }

    svg {
        font-size: 18px;
        color: ${({ $isSelected }) => ($isSelected ? '#007bff' : '#ADB5BD')};
        transition: color 0.2s ease;
    }
`;

const ReportContent = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding: 10px;
    background-color: #F8F9FA;
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    color: #CED4DA;
`;

const EmptyStateIcon = styled(FaFileAlt)`
    font-size: 100px;
    margin-bottom: 20px;
`;

const EmptyStateText = styled.h2`
    font-size: 20px;
    font-weight: 500;
    color: #99A3AD;
`;

const ReportTitle = styled.h1`
    font-size: 24px;
    font-weight: 600;
    color: #343A40;
    margin-bottom: 20px;
`;

const ContentPlaceholder = styled.div`
    background-color: #ffffff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    flex-grow: 1;
    font-size: 14px;
`;