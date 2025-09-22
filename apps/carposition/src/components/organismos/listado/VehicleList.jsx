import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaTimes, FaSearch, FaFilter } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";

// MUY IMPORTANTE: Asegúrate de que la ruta a tu componente VehicleCard sea correcta.
import { VehicleCard } from '../CardVehicle'; 
import { useSelector } from 'react-redux';
import { getLast5Routes } from '@mi-monorepo/common/services';
import { setVehicleRoute, addSelectedVehicle } from '@mi-monorepo/common/store/vehicle';
import { useDispatch } from 'react-redux';

export function VehicleList({ isOpen, onClose, onVehicleSelect }) {
    const [searchTerm, setSearchTerm] = useState('');
    const vehicles = useSelector((state) => state.vehicle?.vehicles || []);
    const selectedVehicles = useSelector((state) => state.vehicle?.selectedVehicles || []);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth?.token);
    const [activeVehicleId, setActiveVehicleId] = useState(null);

    const filteredVehicles = vehicles.filter(vehicle =>
        vehicle.info.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.info.chofer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCardClick = async (vehicle) => {
        try {
            console.log("🚗 Vehículo seleccionado:", vehicle);
            
            if (!vehicle || !vehicle.imei) {
                console.error("❌ Datos del vehículo inválidos:", vehicle);
                return;
            }
    
            // Primero actualizamos la ruta si es necesario
            if(vehicle.route.length <= 1){
                //console.log("🔍 Obteniendo últimas 5 rutas");
                let last5Routes = await getLast5Routes(token, vehicle.imei);
    
                if(last5Routes.status == 200){
                    let coordinates = last5Routes.registros.map(registro => [registro.location.x, registro.location.y]).reverse();
                    // Actualizamos la ruta primero
                    await dispatch(setVehicleRoute({ id: vehicle.id, route: coordinates }));
                    // Esperamos un momento para asegurar que la actualización se complete
                    await new Promise(resolve => setTimeout(resolve, 200));
                    // Actualizamos el vehículo con la nueva ruta
                    vehicle = {
                        ...vehicle,
                        route: coordinates
                    };
                } else {
                    console.error("❌ Error al obtener las últimas 5 rutas:", last5Routes);
                }
            }

            //setActiveVehicleId(activeVehicleId === vehicle.id ? null : vehicle.id);
            // Notifica al componente App sobre el cambio de selección
            onVehicleSelect(vehicle);
    
            // Después de asegurarnos de que la ruta está actualizada, seleccionamos el vehículo
            dispatch(addSelectedVehicle(vehicle));
            
        } catch (error) {
            console.error("❌ Error al procesar el vehículo:", error);
        }
    };

    useEffect(() => {
        console.log(filteredVehicles, "filteredVehicles");
        if (selectedVehicles.length > 0) {
            setActiveVehicleId(selectedVehicles[0].id);
        }
    }, [selectedVehicles]);

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
                        name={vehicle.info.nombre}
                        driver={vehicle.info.chofer}
                        status={vehicle.status}
                        updated={vehicle.posicion_actual.fecha}
                        onClick={() => {
                            handleCardClick(vehicle);
                        }}
                        isSelected={vehicle.id === activeVehicleId}
                    />
                ))}
            </List>
        </VehicleListContainer>
    );
}

const VehicleListContainer = styled.div`
    position: fixed;
    top: 100px;
    left: 15px;
    width: 320px;
    height: calc(100vh - 200px);
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
        min-height: 0;
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