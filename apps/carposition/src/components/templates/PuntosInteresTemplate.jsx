import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import expandIcon from '../../assets/expand-right.svg';
import { FaPlus } from 'react-icons/fa'; // Asegúrate de instalar react-icons
import { TablaPuntosInteres } from '../organismos/table/table.jsx';
import CreateView from '../organismos/ViewPdi/ViewCreate.jsx';
import ExportarModal from '../organismos/reportes/ExportarBtn.jsx';
import Filtros from '../organismos/reportes/FiltrosBtn.jsx';

export function PuntosInteresTemplate() {
    const [selectedReport, setSelectedReport] = useState('Listado');
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [showCreateView, setShowCreateView] = useState(false);

    const handleCreateClick = () => {
        setIsCreating(true);
        // Simula un tiempo de carga de 1 segundo antes de mostrar la vista de creación
        setTimeout(() => {
            setIsCreating(false);
            setShowCreateView(true);
        }, 500);
    };

    const handleBackClick = () => {
        setIsCreating(true);
        // Simula un tiempo de carga de 1 segundo antes de regresar a la vista principal
        setTimeout(() => {
            setIsCreating(false);
            setShowCreateView(false);
        }, 500);
    };

    return (
        <Container>
            <HeaderContainer>
                <BreadcrumbContainer>
                    <Breadcrumb>
                        Home
                        <Icon src={expandIcon} alt="Expand icon" />
                        Puntos de interes
                        <Icon src={expandIcon} alt="Expand icon" />
                        <CurrentOption>
                        {showCreateView ? 'Crear' : 'Listado'}
                        </CurrentOption>
                    </Breadcrumb>
                </BreadcrumbContainer>
            </HeaderContainer>
            <HorizontalLine />

            {!showCreateView ? (
                !isCreating ? (
                    <>
                        <ActionsContainer>
                            <SearchContainer>
                                <SearchInput placeholder="Buscar..." />
                                <Filtros
                                    selectedFilters={selectedFilters}
                                    setSelectedFilters={setSelectedFilters}
                                    selectedDate={selectedDate}
                                    setSelectedDate={setSelectedDate}
                                />
                            </SearchContainer>

                            <ButtonsContainer>
                                <ExportarModal />
                                <BtnCreate onClick={handleCreateClick}>
                                    <FaPlus style={{ marginRight: '8px' }} /> Crear nuevo
                                </BtnCreate>
                            </ButtonsContainer>
                        </ActionsContainer>

                        <TablaPuntosInteres />
                    </>
                ) : (
                    <LoadingContainer>
                        <Spinner />
                    </LoadingContainer>
                )
            ) : (
                isCreating ? (
                    <LoadingContainer>
                        <Spinner />
                    </LoadingContainer>
                ) : (
                    <CreateView onBack={handleBackClick} />
                )
            )}
        </Container>
    );
}

const BtnCreate = styled.button`
    background: white;
    display: flex;
    padding: 10px 10px;
    border-radius: 8px;
    border: none;
    align-items: center;
    cursor: pointer;
    transition: background 0.3s, transform 0.2s;

    &:hover {
        background: #3d3d3d;
    }
`;

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 100px); /* Ajusta el tamaño según el diseño */
`;

const Spinner = styled.div`
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255, 255, 255, 0.4);
    border-top: 4px solid #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

const ActionsContainer = styled.div`
    display: flex;
    justify-content: space-between; /* Espaciado entre buscador y botones */
    align-items: center;
    margin-top: 20px;
    padding: 0 60px;
`;

const SearchContainer = styled.div`
    display: flex; /* Alinea el input y el botón de filtros en una fila */
    align-items: center;
    width: 320px; /* Espacio total para el buscador y el botón */
    gap: 10px; /* Espaciado entre el buscador y el botón de filtros */
`;

const ButtonsContainer = styled.div`
    display: flex;
    gap: 10px; /* Separación entre los botones */
`;

const expandAnimation = keyframes`
    from {
        max-height: 0;
        opacity: 0;
    }
    to {
        max-height: 500px;
        opacity: 1;
    }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh; /* Full height of the viewport */
    padding: 20px;
    width: 100%;
    background: #191919; /* Fondo gris oscuro */
`;

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between; /* Distribuye espacio entre elementos */
    align-items: center;
    gap: 20px; /* Espaciado entre el Header y el Selector */
    position: relative;
    width: 100%;
    margin: 5px;
`;

const BreadcrumbContainer = styled.div`
    display: flex;
    flex: 1; /* Toma el máximo espacio disponible */
    justify-content: flex-start; /* Alinea el Breadcrumb a la izquierda */
`;

const Breadcrumb = styled.div`
    display: flex;
    align-items: center;
    font-size: 13px;
    color: white;
`;

const Icon = styled.img`
    width: 12px;
    height: 12px;
    margin: 0 8px;
`;

const CurrentOption = styled.span`
    font-weight: 500;
    color: white;
`;

const SearchInput = styled.input`
    flex: 1;
    height: 41px;
    padding: 8px 12px;
    font-size: 14px;
    border: none;
    border-radius: 8px; /* Rounded corners */
    outline: none;
    background: #2d2d2d; /* Slightly darker background for input */
    color: white;
`;

const HorizontalLine = styled.hr`
    width: 100%;
    border: none;
    border-top: 1px solid #333333;
    margin: 15px 0;
`;

export default PuntosInteresTemplate;