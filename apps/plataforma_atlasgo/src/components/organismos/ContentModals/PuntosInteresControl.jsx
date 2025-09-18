import React, { useState, useEffect } from 'react';
import { styled, keyframes } from 'styled-components';
import { FaPlus, FaSearch, FaMapMarkerAlt, FaEdit, FaTrash, FaRegEye } from 'react-icons/fa';
import { MdOutlineGrass } from 'react-icons/md';
import { TablaPuntosInteres } from '../table/table.jsx';
import { PuntoInteresForm } from '../formularios/PuntoInteresForm.jsx';
import { useSelector } from 'react-redux';
import { getCategoriasPIRequest, getIconosPIRequest, getPITable } from '@mi-monorepo/common/services';

// --- Componente Principal ---
export function PuntosInteresControl({ initialView = 'table' }) {
    const [view, setView] = useState(initialView);
    const [searchTerm, setSearchTerm] = useState('');

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [totalRows, setTotalRows] = useState(0);

    const [selectedPoint, setSelectedPoint] = useState(null);

    const token = useSelector(state => state.auth.token);
    const [categorias, setCategorias] = useState([]);
    const [iconos, setIconos] = useState([]);

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
            // Lógica para eliminar...
        }
    };
    
    const handleBackClick = () => {
        setView('table');
        setSelectedPoint(null);
        fetchData();
    };
    
    const fetchData = async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            // CAMBIO: Se pasa el 'searchTerm' a la llamada de la API
            const response = await getPITable(token, pagination.pageIndex, pagination.pageSize, sorting, searchTerm);
            setData(response.table.data || []);
            setPageCount(Math.ceil(response.table.recordsTotal / pagination.pageSize));
            setTotalRows(response.table.recordsTotal);
        } catch (error) {
            console.error("Error al obtener Puntos de Interés:", error);
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        const fetchInitialData = async () => {
            if (token) {
                const responseCategorias = await getCategoriasPIRequest(token);
                setCategorias(responseCategorias.categorias);

                const responseIconos = await getIconosPIRequest(token);
                setIconos(responseIconos.iconos);
            }
        };
        fetchInitialData();
    }, [token]);

    // CAMBIO: useEffect ahora depende del término de búsqueda también
    useEffect(() => {
        fetchData();
    }, [token, pagination, sorting, searchTerm]);

    const handleEditPoint = (point) => {
        setView('form');
        setSelectedPoint(point);
    };

    return (
        <ComponentWrapper>
            <ContentArea>
                <AnimatedViewContainer>
                    {/* Vista de la tabla */}
                    <AnimatedView $isActive={view === 'table'} $direction="left">
                        {/* CORRECCIÓN: Se elimina el Header anidado y se limpia la estructura */}
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

                        {isMobile ? (
                            <PointsList>
                                {data.map(point => (
                                    <PointCard key={point.id}>
                                        <PointIcon>
                                            <FaMapMarkerAlt />
                                        </PointIcon>
                                        <PointDetails>
                                            <PointInfo>
                                                <PointName>{point.nombre}</PointName>
                                                <PointLocation>{point.coordenadas.x}, {point.coordenadas.y}</PointLocation>
                                            </PointInfo>
                                            <PointCategory category={point.categoria}>{point.categoria}</PointCategory>
                                        </PointDetails>
                                        <CardActions>
                                            <IconButton title="Editar Punto" onClick={() => handleEditPoint(point)}><FaEdit /></IconButton>
                                            <IconButton title="Ver en el Mapa"><FaRegEye /></IconButton>
                                            <IconButton title="Eliminar Punto" onClick={() => handleDeletePoint(point.id)}><FaTrash /></IconButton>
                                        </CardActions>
                                    </PointCard>
                                ))}
                            </PointsList>
                        ) : (
                            <TableWrapper>
                                <TablaPuntosInteres
                                    type="pdi"
                                    data={data}
                                    isLoading={isLoading}
                                    pagination={pagination}
                                    onPaginationChange={setPagination} // Se pasa setPagination directamente
                                    sorting={sorting}
                                    onSortingChange={setSorting}
                                    pageCount={pageCount}
                                    totalRows={totalRows}
                                    onEdit={handleEditPoint}
                                />
                            </TableWrapper>
                        )}
                    </AnimatedView>
                    
                    {/* Vista del formulario */}
                    <AnimatedView $isActive={view === 'form'} $direction="right">
                        <PuntoInteresForm onBack={handleBackClick} categorias={categorias} iconos={iconos} point={selectedPoint} />
                    </AnimatedView>
                </AnimatedViewContainer>
            </ContentArea>
        </ComponentWrapper>
    );
}

// --- Estilos ---
const AnimatedView = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: transform 0.4s ease-in-out, opacity 0.4s ease-in-out;
    background-color: #F8F9FA;
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

const ComponentWrapper = styled.div`
    padding: 25px; 
    background-color: #F8F9FA; 
    border-radius: 8px;
    height: 100%; 
    display: flex; 
    flex-direction: column;
    position: relative;
    @media (max-width: 768px) { padding: 15px; }
`;

const ContentArea = styled.div`
    position: relative;
    flex-grow: 1;
    width: 100%;
    height: 100%;
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

const PointsList = styled.div`
    flex-grow: 1; overflow-y: auto; height: 100%; padding-right: 5px;
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
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #E9ECEF;
    margin-bottom: 10px;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
`;

const PointIcon = styled.div`
    grid-area: icon;
    width: 48px; 
    height: 48px; 
    border-radius: 50%; 
    background-color: #007BFF;
    color: white; 
    display: flex; 
    align-items: center; 
    justify-content: center;
    font-size: 20px; 
    flex-shrink: 0;
`;

const PointInfo = styled.div`
    min-width: 0;
`;

const PointName = styled.span`
    font-size: 15px; 
    font-weight: 600; 
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
`;

const PointCategory = styled.span`
    font-size: 12px; 
    font-weight: 500; 
    padding: 4px 10px; 
    border-radius: 12px;
    color: #343A40;
    background-color: #E9ECEF;
    margin-top: 6px;
    align-self: flex-start;
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