import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch, FaFileExport, FaCar } from 'react-icons/fa';
import { CustomSelect } from '../formularios/CustomSelect';
import { RiFileExcel2Line } from "react-icons/ri";

// MUI Imports para los selectores de fecha y hora
import { TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SearchButtonWithLoading } from '../../atomos/ButtonSearchLoad';

// --- Datos de ejemplo ---
const unitOptions = [
    { id: 'unit-1', name: 'Ford Mustang' },
    { id: 'unit-2', name: 'Tesla Model 3' },
    { id: 'unit-3', name: 'Toyota Supra' },
    { id: 'unit-4', name: 'Chevrolet Camaro' },
];

// --- Componente de Reporte de Historial ---
export function HistoryReport() {
    const [selectedUnit, setSelectedUnit] = useState('Unidad');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showTable, setShowTable] = useState(false);
    const [loading, setLoading] = useState(false); // Estado de carga del botón
    const [isCanceling, setIsCanceling] = useState(false);
    const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
    const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState(null);

    const handleSearch = () => {
        if (!selectedUnit || !startDate || !endDate) {
            alert('Por favor, selecciona una unidad, fecha y hora.');
            return;
        }

        setLoading(true);
        setIsCanceling(false);
        
        const timeoutId = setTimeout(() => {
            setLoading(false);
            setShowTable(true);
            setSearchTimeout(null); // Limpiamos la referencia
        }, 10000); 

        setSearchTimeout(timeoutId);
    };



    const handleCancel = () => {
        setLoading(false);
        console.log('Búsqueda cancelada');
    };

    // const handleCancel = () => {
    //     if (searchTimeout) {
    //         clearTimeout(searchTimeout);
    //         setLoading(false);
    //         setIsCanceling(false);
    //         setSearchTimeout(null);
    //         alert('Búsqueda cancelada.');
    //     }
    // };

    // const handleMouseEnter = () => {
    //     if (loading) {
    //         setIsCanceling(true);
    //     }
    // };

    // const handleMouseLeave = () => {
    //     setIsCanceling(false);
    // };

    const handleStartDateClick = () => {
        setIsStartDatePickerOpen(true);
        setIsEndDatePickerOpen(false);
    };

    const handleEndDateClick = () => {
        setIsEndDatePickerOpen(true);
        setIsStartDatePickerOpen(false);
    };

    return (
        <ReportContainer>
            {/* Seccion de controles */}
            <ControlsContainer>
                <UnitSelectWrapper>
                    <CustomSelect
                        label=""
                        options={unitOptions}
                        value={selectedUnit}
                        onChange={setSelectedUnit}
                        size='large'
                        placeholder="Selecciona una unidad"
                    />
                </UnitSelectWrapper>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateRangeWrapper>
                        <DateInputGroup>
                            <DateTimePicker
                                label="Inicio"
                                value={startDate}
                                onChange={(newValue) => {
                                    setStartDate(newValue);
                                    setIsStartDatePickerOpen(false);
                                }}
                                open={isStartDatePickerOpen}
                                onOpen={handleStartDateClick}
                                onClose={() => setIsStartDatePickerOpen(false)}
                                views={['year', 'month', 'day']}
                                slotProps={{
                                    textField: {
                                        sx: {
                                            width: '160px',
                                            '& .MuiPickersInputBase-root': {
                                                height: '50px',
                                                minHeight: '50px',
                                                alignItems: 'center',
                                                '& .MuiOutlinedInput-input': {
                                                    padding: '12.5px 14px',
                                                    height: 'auto'
                                                }
                                            }
                                        }
                                      },
                                    popper: { sx: { zIndex: 9999 } }
                                }}
                            />
                            <DateTimePicker
                                label="Fin"
                                value={endDate}
                                onChange={(newValue) => {
                                    setEndDate(newValue);
                                    setIsEndDatePickerOpen(false);
                                }}
                                open={isEndDatePickerOpen}
                                onOpen={handleEndDateClick}
                                onClose={() => setIsEndDatePickerOpen(false)}
                                views={['year', 'month', 'day']}
                                slotProps={{
                                    textField: {
                                        sx: {
                                            width: '160px',
                                            '& .MuiPickersInputBase-root': {
                                                height: '50px',
                                                minHeight: '50px',
                                                alignItems: 'center',
                                                '& .MuiOutlinedInput-input': {
                                                    padding: '12.5px 14px',
                                                    height: 'auto'
                                                }
                                            }
                                        }
                                      },
                                    popper: { sx: { zIndex: 9999 } }
                                }}
                            />
                        </DateInputGroup>
                    </DateRangeWrapper>
                </LocalizationProvider>
                
                <ButtonContainer>
                <SearchButtonWithLoading 
                    loading={loading}
                    onClick={handleSearch}
                    onCancel={handleCancel}
                >
                    Buscar
                </SearchButtonWithLoading>
                    <ExportButton>
                    <RiFileExcel2Line size={20}/>
                        {/* <span>Exportar</span> */}
                    </ExportButton>
                </ButtonContainer>
            </ControlsContainer>

            {/* Seccion de contenido */}
            <ContentContainer>
                {showTable ? (
                    <TablePlaceholder>
                        <p>Aquí se mostrará la tabla con los resultados del historial.</p>
                    </TablePlaceholder>
                ) : (
                    <EmptyState>
                        <FaCar size={60} color="#E9ECEF" />
                        <EmptyStateText>Selecciona una unidad y fecha para iniciar la búsqueda.</EmptyStateText>
                    </EmptyState>
                )}
            </ContentContainer>
        </ReportContainer>
    );
}

// --- Estilos ---
const ReportContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const ControlsContainer = styled.div`
    display: flex;
    align-items: flex-end;
    gap: 15px;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #DEE2E6;
    flex-wrap: wrap;

    @media (max-width: 992px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

const UnitSelectWrapper = styled.div`
    max-width: 280px;
    min-width: 250px;
    
    @media (max-width: 768px) {
        max-width: 100%;
    }
`;

const DateRangeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 250px; /* Ancho más compacto */
    
    @media (min-width: 993px) {
        flex-grow: 1; /* Permite que el contenedor de fechas ocupe el espacio disponible en pantallas grandes */
    }
`;

const DateInputGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const Addon = styled.span`
    font-size: 14px;
    color: #495057;
    font-weight: 500;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 10px; /* Espacio entre los botones */
    
    @media (max-width: 992px) {
        width: 100%;
        justify-content: flex-start;
    }
`;

const BaseButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 18px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
    height: 50px;
`;


const ExportButton = styled(BaseButton)`
    background-color: transparent;
    color: black;
    &:hover {
        background-color: #5A6268;
        color: white;
    }
`;

const ContentContainer = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    color: #ADB5BD;
`;

const EmptyStateText = styled.p`
    font-size: 1rem;
    font-weight: 400;
    margin-top: 15px;
`;

const TablePlaceholder = styled.div`
    width: 100%;
    min-height: 200px;
    padding: 20px;
    border: 1px dashed #DEE2E6;
    border-radius: 8px;
    background-color: #F8F9FA;
    text-align: center;
    color: #495057;
`;