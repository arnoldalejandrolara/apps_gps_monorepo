import React, { useState, useEffect } from 'react';
import { styled, keyframes } from 'styled-components';
import { FaPlus, FaMapMarkerAlt, FaEdit, FaTrash, FaRegEye , FaSearch} from 'react-icons/fa';
import { MdOutlineGrass } from 'react-icons/md';
import { TablaPuntosInteres } from '../table/table.jsx';
import { mockPagosData, dummyPointsOfInterest } from '../../../utilities/dataEstatica.jsx';
import { GeoCercasForm } from '../formularios/GeoCercasForm.jsx';
import { useSelector } from 'react-redux';
import { getIconosGeocercas, getGeocercasTable } from '@mi-monorepo/common/services';

// --- Componente Principal ---
export function GeoCercasControl({ initialView = 'table' }) {
    const [view, setView] = useState(initialView); // <-- Usa la prop para el estado inicial
    const [searchTerm, setSearchTerm] = useState('');

    const [points, setPoints] = useState(dummyPointsOfInterest);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState([]);
    const [pageCount, setPageCount] = useState(Math.ceil(mockPagosData.length / 10));
    const [totalRows, setTotalRows] = useState(mockPagosData.length);

    const [selectedGeoCerca, setSelectedGeoCerca] = useState(null);
    // const [view, setView] = useState('table'); // Estado para controlar la vista

    const [iconos, setIconos] = useState([]);

    const { token } = useSelector(state => state.auth);

    const [data, setData] = useState([]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleDeletePoint = (pointId) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este punto de interés?")) {
            setPoints(points.filter(p => p.id !== pointId));
        }
    };
    
    // Función para manejar el clic en el botón de volver
    const handleBackClick = () => {
        setView('table');
        setSelectedGeoCerca(null);
        fetchData();
    };

    const fetchData = async () => {
        const response = await getGeocercasTable(token, pagination.pageIndex, pagination.pageSize, sorting, '');
        setData(response.table.data);
        setPageCount(Math.ceil(response.table.recordsTotal / pagination.pageSize));
        setTotalRows(response.table.recordsTotal);
    };

    useEffect(() => {
        const fetchIconos = async () => {
            const response = await getIconosGeocercas(token);
            setIconos(response.iconos);
        }

        if(token) {
            fetchIconos();
            fetchData();
        }
    }, [token]);

    const handleEditGeoCerca = (point) => {
        setView('form');
        // console.log(point);
        
        // Parsear el polígono si viene como string WKT
        if (point.polygon && typeof point.polygon === 'string') {
            const parsedPolygon = parseWKTPolygon(point.polygon);
            point.polygon = parsedPolygon;
        }
        
        setSelectedGeoCerca(point);
    };


    // Función para parsear string WKT a array de coordenadas
    const parseWKTPolygon = (wktString) => {
        try {
            //console.log('Parseando coordenadas:', wktString);
            
            // Si ya es un array, retornarlo directamente
            if (Array.isArray(wktString)) {
                //console.log('Ya es un array:', wktString);
                return wktString;
            }
            
            // Si es string, intentar parsearlo
            if (typeof wktString === 'string') {
                // Buscar todos los pares de coordenadas en el string
                // Patrón: (-número,número)
                const coordinateMatches = wktString.match(/\(-?\d+\.?\d*,-?\d+\.?\d*\)/g);
                
                if (coordinateMatches) {
                    //console.log('Coordenadas encontradas:', coordinateMatches);
                    
                    const coordinatePairs = coordinateMatches.map(match => {
                        // Limpiar paréntesis y extraer números
                        const cleanMatch = match.replace(/[()]/g, '');
                        const [lng, lat] = cleanMatch.split(',').map(Number);
                        
                        //console.log('Par parseado:', [lat, lng]);
                        return [lat, lng]; // Convertir a formato [lat, lng]
                    });
                    
                    //console.log('Polígono parseado:', coordinatePairs);
                    return coordinatePairs;
                } else {
                    console.error('No se encontraron coordenadas en el formato esperado');
                    return [];
                }
            }
            
            console.error('Formato no reconocido:', typeof wktString);
            return [];
        } catch (error) {
            console.error('Error al parsear coordenadas:', error);
            return [];
        }
    };

    return (
        <ComponentWrapper>
            <ContentArea>
                <AnimatedViewContainer>
                    {/* Vista de la tabla */}
                    <AnimatedView $isActive={view === 'table'} $direction="left">
                    {/* <Header>
                        <ButtonGroup>
                            <PrimaryButton onClick={() => setView('form')}>
                                <FaPlus style={{ marginRight: '8px' }} />
                                Nuevo
                            </PrimaryButton>
                        </ButtonGroup>
                    </Header> */}

                        <Header>
                            <SearchWrapper>
                                <SearchIcon />
                                <SearchInput 
                                    type="text" 
                                    placeholder="Buscar punto de interés..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </SearchWrapper>
                            <CreateButton onClick={() => setView('form')}>
                                <FaPlus style={{ marginRight: '8px' }} />
                                {/* CAMBIO: Texto del botón corregido */}
                                Nuevo Punto
                            </CreateButton>
                        </Header>

                        {points.length > 0 ? (
                            isMobile ? (
                                <PointsList>
                                    {points.map(point => (
                                        <PointCard key={point.id}>
                                            <PointIcon>
                                                <FaMapMarkerAlt />
                                            </PointIcon>

                                            <PointDetails>
                                                <PointInfo>
                                                    <PointName>{point.name}</PointName>
                                                    <PointLocation>{point.location}</PointLocation>
                                                    <PointCategory category={point.category}>{point.category}</PointCategory>
                                                </PointInfo>
                                            </PointDetails>
                                           
                                            <CardActions>
                                                <IconButton title="Editar Punto" onClick={() => handleEditGeoCerca(point)}><FaEdit /></IconButton>
                                                <IconButton title="Ver en el Mapa"><FaRegEye /></IconButton>
                                                <IconButton title="Eliminar Punto" onClick={() => handleDeletePoint(point.id)}><FaTrash /></IconButton>
                                            </CardActions>
                                        </PointCard>
                                    ))}
                                </PointsList>
                            ) : (
                                <TableWrapper>
                                    <TablaPuntosInteres
                                        type="geocercas"
                                        data={data}
                                        isLoading={isLoading}
                                        pagination={pagination}
                                        onPaginationChange={setPagination}
                                        sorting={sorting}
                                        onSortingChange={setSorting}
                                        pageCount={pageCount}
                                        totalRows={totalRows}
                                        onEdit={handleEditGeoCerca}
                                    />
                                </TableWrapper>
                            )
                        ) : (
                            <EmptyState>
                                <EmptyStateCard>
                                    <CactusIcon />
                                    <EmptyText>No hay puntos de interés</EmptyText>
                                </EmptyStateCard>
                            </EmptyState>
                        )}
                    </AnimatedView>
                    
                    {/* Vista del formulario */}
                    <AnimatedView $isActive={view === 'form'} $direction="right">
                        <GeoCercasForm onBack={handleBackClick} iconos={iconos} geoCerca={selectedGeoCerca} />
                    </AnimatedView>
                </AnimatedViewContainer>
            </ContentArea>
        </ComponentWrapper>
    );
}

// --- Estilos de AnimatedView ---
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
        $isActive ? '0%' : ($direction === 'left' ? '-100%' : '100%')
    });
    pointer-events: ${({ $isActive }) => ($isActive ? 'auto' : 'none')};
    opacity: ${({ $isActive }) => ($isActive ? '1' : '0')};
`;

const AnimatedViewContainer = styled.div`
    position: relative;
    height: 100%;
    overflow: hidden;
`;



const TableWrapper = styled.div`
    height: 100%;
    overflow-y: hidden;    
`;

// --- Estilos ---
const ComponentWrapper = styled.div`
    padding: 0px; 
    background-color: #fffff; 
    border-radius: 8px;
    height: 100%; 
    display: flex; 
    flex-direction: column;
    position: relative;
    /* overflow: hidden; */ // ← REMOVER ESTA LÍNEA
    @media (max-width: 768px) { padding: 15px; }
`;

const ContentArea = styled.div`
    position: relative;
    flex-grow: 1;
    width: 100%;
    height: 100%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    background-color: #fffff;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;


const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    flex-shrink: 0;
    gap: 15px; /* Añade un gap para manejar el espaciado */

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
    }
`;
const SearchWrapper = styled.div`
    position: relative;
    /* Permite que el contenedor crezca si es necesario */
    flex-grow: 1;
    min-width: 280px;
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
    width: 100%; /* Ocupa todo el ancho de su contenedor */
    outline: none;
    transition: all 0.2s ease;
    &:focus {
        border-color: #007BFF;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
    }
`;

const CreateButton = styled.button`
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;
    flex-shrink: 0; /* Evita que el botón se encoja */
    &:hover {
        background-color: #0056b3;
    }
`;

// const ButtonGroup = styled.div`
//     display: flex;
//     gap: 10px;
//     flex-wrap: wrap;
// `;


// const PrimaryButton = styled(Button)`
//     background-color: #28A745;
//     border: 1px solid #28A745;
//     color: white;
//     &:hover {
//         background-color: #218838;
//         border-color: #1e7e34;
//     }
// `;

const PointsList = styled.div`
    flex-grow: 1; 
    overflow-y: auto; 
    height: 100%; 
`;

const PointDetails = styled.div`
    grid-area: info;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
`;

const PointCard = styled.div`
    display: grid;
    grid-template-areas:
        "icon info"
        "actions actions";
    grid-template-columns: auto 1fr;
    gap: 0 15px;
    align-items: center;
    background: #FFFFFF;
    padding: 5px 12px;
    border-radius: 8px;
    border: 1px solid #E9ECEF;
    margin-bottom: 10px;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
`;

const PointIcon = styled.div`
    width: 40px; 
    height: 40px; 
    border-radius: 50%; 
    background-color: #007BFF;
    color: white; 
    display: flex; 
    align-items: center; 
    justify-content: center;
    font-size: 18px; 
    margin-right: 15px; 
    flex-shrink: 0;
`;

const PointInfo = styled.div`
    flex-grow: 1; 
    min-width: 0;
    @media (max-width: 480px) { flex-basis: 100%; margin-bottom: 10px; }
`;

const PointName = styled.span`
    font-size: 14px; 
    font-weight: 500; 
    color: #343A40; 
    display: block;
`;

const PointLocation = styled.span`
    font-size: 13px; 
    color: #6C757D; 
    white-space: nowrap;
    overflow: hidden; 
    text-overflow: ellipsis; 
    display: block;
    @media (max-width: 480px) { display: none; }
`;

const PointCategory = styled.span`
    font-size: 12px; 
    font-weight: 500; 
    padding: 4px 10px; 
    border-radius: 12px;
    margin-right: 20px; 
    flex-shrink: 0;
    color: #343A40;
    background-color: #E9ECEF;
`;


const CardActions = styled.div` 
    grid-area: actions;
    display: flex; 
    justify-content: space-around;
    align-items: center; 
    width: 100%;
    padding-top: 12px;
    margin-top: 12px;
    border-top: 1px solid #e9ecef;
`;


const IconButton = styled.button`
    background: transparent; 
    border: none; 
    color: #ADB5BD; 
    font-size: 18px;
    cursor: pointer; 
    padding: 5px; 
    transition: color 0.2s ease;
    &:hover { color: #007BFF; }
`;

// --- Estilos para el Estado Vacío ---
const EmptyState = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 20px;
    flex-grow: 1;
`;

const EmptyStateCard = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 600px;
    
    border: 1px solid #E9ECEF;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const CactusIcon = styled(MdOutlineGrass)`
    font-size: 48px;
    color: #343A40;
    margin-right: 15px;
`;

const EmptyText = styled.span`
    font-size: 16px;
    color: #6C757D;
    font-weight: 500;
`;