import React, { useState, useEffect } from 'react';
import { styled, keyframes } from 'styled-components';
import { FaPlus, FaMapMarkerAlt, FaEdit, FaTrash, FaRegEye } from 'react-icons/fa';
import { MdOutlineGrass } from 'react-icons/md';
import { TablaPuntosInteres } from '../table/table.jsx';
import { mockPagosData, dummyPointsOfInterest } from '../../../utilities/dataEstatica.jsx';
import { GeoCercasForm } from '../formularios/GeoCercasForm.jsx';
import { useSelector } from 'react-redux';
import { getIconosGeocercas } from '@mi-monorepo/common/services';

// --- Componente Principal ---
export function GeoCercasControl({ initialView = 'table' }) {
    const [view, setView] = useState(initialView); // <-- Usa la prop para el estado inicial

    const [points, setPoints] = useState(dummyPointsOfInterest);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState([]);
    const [pageCount, setPageCount] = useState(Math.ceil(mockPagosData.length / 10));
    const [totalRows, setTotalRows] = useState(mockPagosData.length);
    // const [view, setView] = useState('table'); // Estado para controlar la vista

    const [iconos, setIconos] = useState([]);

    const { token } = useSelector(state => state.auth);

    const data = React.useMemo(() => {
        const nombres = ['Angelique Morse', 'Benny Fisher', 'Charlie Brown', 'Diana Prince', 'Evan Ross', 'Fiona Green', 'George Harrison', 'Hannah Montana', 'Ian Somerhalder', 'Jessica Alba', 'Kevin James', 'Laura Croft', 'Mike Tyson', 'Nancy Drew', 'Oscar Wilde', 'Penelope Cruz', 'Quentin Tarantino', 'Rachel Zane', 'Steve Rogers', 'Taylor Swift'];
        const empresas = ['Wuckert Inc', 'Stark Industries', 'Wayne Enterprises', 'Daily Planet', 'Oscorp', 'Cyberdyne Systems', 'Tyrell Corporation', 'Umbrella Corp'];
        const tipos = ['Content Creator', 'Admin', 'User', 'Moderator'];
        const estados = ['Active', 'Banned', 'Pending', 'Suspended'];
    
        return Array.from({ length: 20 }, (_, i) => {
            const nombreCompleto = nombres[i % nombres.length];
            const [primerNombre, apellido] = nombreCompleto.split(' ');
            const email = `${primerNombre.toLowerCase()}${i}@yahoo.com`;
    
            return {
                id: i + 1,
                nombre: nombreCompleto,
                email: email,
                telefono: `+46 8 123 ${i + 1}`,
                empresa: empresas[i % empresas.length],
                tipo_usuario: tipos[i % tipos.length],
                status: estados[i % estados.length],
            };
        });
    }, []);

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
    };

    useEffect(() => {
        const fetchIconos = async () => {
            const response = await getIconosGeocercas(token);
            setIconos(response.iconos);
        }

        if(token) {
            fetchIconos();
        }
    }, [token]);

    return (
        <ComponentWrapper>
            <ContentArea>
                <AnimatedViewContainer>
                    {/* Vista de la tabla */}
                    <AnimatedView $isActive={view === 'table'} $direction="left">
                    <Header>
                        <ButtonGroup>
                            <PrimaryButton onClick={() => setView('form')}>
                                <FaPlus style={{ marginRight: '8px' }} />
                                Nuevo
                            </PrimaryButton>
                        </ButtonGroup>
                    </Header>
                        {points.length > 0 ? (
                            isMobile ? (
                                <PointsList>
                                    {points.map(point => (
                                        <PointCard key={point.id}>
                                            <PointIcon>
                                                <FaMapMarkerAlt />
                                            </PointIcon>
                                            <PointInfo>
                                                <PointName>{point.name}</PointName>
                                                <PointLocation>{point.location}</PointLocation>
                                            </PointInfo>
                                            <PointCategory category={point.category}>{point.category}</PointCategory>
                                            <CardActions>
                                                <IconButton title="Editar Punto"><FaEdit /></IconButton>
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
                        <GeoCercasForm onBack={handleBackClick} iconos={iconos} />
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
    justify-content: flex-end; /* Alineado a la derecha */
    align-items: center;
    margin-bottom: 20px; 
    flex-wrap: wrap; 
    flex-shrink: 0; 
    @media (max-width: 768px) {
        flex-direction: column; 
        align-items: stretch; 
        gap: 15px;
    }
`;

const Button = styled.button`
    border-radius: 6px;
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
`;


const PrimaryButton = styled(Button)`
    background-color: #28A745;
    border: 1px solid #28A745;
    color: white;
    &:hover {
        background-color: #218838;
        border-color: #1e7e34;
    }
`;

const PointsList = styled.div`
    flex-grow: 1; 
    overflow-y: auto; 
    height: 100%; 
`;

const PointCard = styled.div`
    display: flex; 
    align-items: center; 
    background: #FFFFFF; 
    padding: 12px;
    border-radius: 8px; 
    border: 1px solid #E9ECEF; 
    margin-bottom: 10px;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
    @media (max-width: 480px) { flex-wrap: wrap; padding: 12px; }
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
    display: flex; 
    align-items: center; 
    gap: 10px; 
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