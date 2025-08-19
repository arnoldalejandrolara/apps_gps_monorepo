import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTimes, FaSearch, FaFilter } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";

// MUY IMPORTANTE: Asegúrate de que la ruta a tu componente VehicleCard sea correcta.
import { VehicleCard } from '../CardVehicle'; 

// Datos de ejemplo actualizados para incluir la propiedad 'updated'.
const dummyVehicles = [
    { id: 1, name: 'Unidad #1', driver: 'Juan Pérez', status: 'En movimiento', updated: 'Hace 1 min' },
    { id: 2, name: 'Unidad #2', driver: 'Ana García', status: 'Detenido', updated: 'Hace 5 min' },
    { id: 3, name: 'Unidad #3', driver: 'Luis Martínez', status: 'Sin conexión', updated: 'Hace 1 hora' },
    { id: 4, name: 'Unidad #4', driver: 'Sofía López', status: 'En movimiento', updated: 'Ahora mismo' },
    { id: 5, name: 'Unidad #5', driver: 'Carlos Ruiz', status: 'En taller', updated: 'Hace 3 días' },
    { id: 6, name: 'Unidad #5', driver: 'Carlos Ruiz', status: 'En taller', updated: 'Hace 3 días' },
    { id: 7, name: 'Unidad #5', driver: 'Carlos Ruiz', status: 'En taller', updated: 'Hace 3 días' },
    { id: 8, name: 'Unidad #5', driver: 'Carlos Ruiz', status: 'En taller', updated: 'Hace 3 días' },
];

export function VehicleList({ isOpen, onClose, vehicles = dummyVehicles }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredVehicles = vehicles.filter(vehicle =>
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <VehicleListContainer $isOpen={isOpen}>
            <Header>
                <Title>Unidades</Title>
                <CloseButton onClick={onClose}>
                    <IoClose />
                </CloseButton>
            </Header>

            <SearchContainer>
                <InputWrapper>
                    <SearchIcon />
                    <SearchInput
                        type="text"
                        placeholder="Filtrar unidades..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </InputWrapper>
                <FilterButton onClick={() => alert('Función de filtro no implementada')}>
                    <FaFilter />
                </FilterButton>
            </SearchContainer>
            
            <List>
                {filteredVehicles.map(vehicle => (
                    <VehicleCard
                        key={vehicle.id}
                        name={vehicle.name}
                        driver={vehicle.driver}
                        status={vehicle.status}
                        updated={vehicle.updated}
                        onClick={() => console.log(`Vehículo seleccionado: ${vehicle.name}`)}
                    />
                ))}
            </List>
        </VehicleListContainer>
    );
}

// --- Estilos ---

const VehicleListContainer = styled.div`
    position: fixed;
    top: 100px;
    left: 15px;
    width: 320px;
    height: calc(100vh - 200px);
    /* CAMBIO: Se añade una altura mínima para evitar que sea demasiado pequeña */
    min-height: 300px; 
    
    background: #ffffff;
    color: #333333;
    border-radius: 8px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease-in-out;
    transform: translateX(${(props) => (props.$isOpen ? '0' : 'calc(-100% - 30px)')});

    @media (max-width: 480px) {
        width: calc(100% - 20px);
        left: 10px;
        top: 15px;
        height: calc(100vh - 30px);
        min-height: 0; /* En móvil no necesitamos altura mínima, que ocupe todo */
    }
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    border-bottom: 1px solid #f0f0f0;
    flex-shrink: 0;
`;

const Title = styled.h2`
    margin: 0;
    font-size: 16px;
    font-weight: 500;
`;

const CloseButton = styled.button`
    background: transparent;
    border: none;
    color: #888;
    font-size: 20px;
    cursor: pointer;
    &:hover {
        color: #000;
    }
`;

const SearchContainer = styled.div`
    padding: 10px 15px;
    border-bottom: 1px solid #f0f0f0;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 10px;
`;

const InputWrapper = styled.div`
    position: relative;
    flex-grow: 1;
`;

const SearchIcon = styled(FaSearch)`
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
    color: #aaa;
    font-size: 14px;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 8px 12px 8px 35px;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
    background-color: #f8f9fa;
    font-size: 12px;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:focus {
        border-color: #007bff;
        background-color: #fff;
    }
`;

const FilterButton = styled.button`
    flex-shrink: 0;
    width: 34px;
    height: 34px;
    border-radius: 6px;
    border: 1px solid transparent;
    background-color: #f8f9fa;
    color: #555;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease;

    &:hover {
        background-color: #e9ecef;
        border-color: #ccc;
    }
`;

const List = styled.div`
    overflow-y: auto;
    flex-grow: 1;
    padding: 0;
    border-radius: 0 0 8px 8px;
`;