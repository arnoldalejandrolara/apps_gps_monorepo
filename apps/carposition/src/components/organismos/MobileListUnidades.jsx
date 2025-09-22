// src/components/organismos/MobileListUnidades.jsx

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { IoSearch } from 'react-icons/io5';
import { VehicleCard } from '../organismos/CardVehicle'; // <-- ¡IMPORTANTE! Asegúrate de que este componente exista y se importe.
import Car from "../../assets/Car.svg";
import { useSelector, useDispatch } from 'react-redux';
import { getLast5Routes } from '@mi-monorepo/common/services';
import { setVehicleRoute, addSelectedVehicle } from '@mi-monorepo/common/store/vehicle';

// --- ESTILOS (Sin cambios) ---
const slideUp = keyframes`from { transform: translateY(100%); } to { transform: translateY(0); }`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const shimmer = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`;
const OptionsButton = styled.button`
  position: fixed; top: 15px; left: 15px; z-index: 900; background: #ffffff; color: #333333; border: 1px solid #dddddd; border-radius: 8px; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; cursor: pointer; font-size: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;
const Backdrop = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); z-index: 1010; animation: ${fadeIn} 0.3s ease-out;
`;
const GrabBar = styled.div`
  width: 40px; height: 5px; background-color: #d0d0d0; border-radius: 10px; margin: 5px auto 10px; cursor: grab;
`;
const PanelContainer = styled.div.attrs(props => ({
  style: { transform: `translateY(${props.deltaY}px)`, transition: props.isDragging ? 'none' : 'transform 0.3s ease-out' },
}))`
  position: fixed; bottom: 0; left: 0; width: 100%; height: 85vh; background: #ffffff; z-index: 1010; border-top-left-radius: 20px; border-top-right-radius: 20px; box-shadow: 0 -5px 20px rgba(0,0,0,0.1); padding: 0 10px 20px 10px; display: flex; flex-direction: column;
`;
const PanelHeader = styled.div`
  display: flex; justify-content: center; align-items: center; padding: 5px 0 10px 0; position: relative;
  h3 { margin: 0; font-size: 16px; color: #191919; font-weight: 600; }
`;
const PanelContent = styled.div`
  overflow-y: auto; padding: 0 5px; flex-grow: 1; display: flex; flex-direction: column;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 10px; }
`;
const SearchContainer = styled.div`
  position: relative; margin-bottom: 15px;
`;
const SearchInput = styled.input`
  width: 100%; padding: 12px 15px 12px 40px; border: 1px solid #e0e0e0; border-radius: 10px; font-size: 15px;
  &:focus { outline: none; border-color: #2196F3; }
`;
const SearchIcon = styled(IoSearch)`
  position: absolute; top: 50%; left: 15px; transform: translateY(-50%); color: #999;
`;
const Skeleton = styled.div`
  width: 100%; height: 80px; background: #f6f7f8; background-image: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%); background-repeat: no-repeat; background-size: 800px 104px; animation: ${shimmer} 1s linear infinite; border-radius: 12px; margin-bottom: 10px;
`;


// --- CAMBIO 1: Acepta la prop `onOpen` que viene del componente padre ---
export const MobileListUnidades = ({ isOpen, onClose, onVehicleSelect, onOpen }) => {
    
    // --- CAMBIO 2: Se elimina el estado `openButton` y la función `togglePanel` ---
    // Ya no son necesarios porque el padre controla la visibilidad.
    
    const [isLoading, setIsLoading] = useState(true);
    const [allVehicles, setAllVehicles] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dragState, setDragState] = useState({ startY: 0, deltaY: 0, isDragging: false });

    const vehicles = useSelector((state) => state.vehicle?.vehicles || []);
    const token = useSelector((state) => state.auth?.token || "");
    const dispatch = useDispatch();
    
    useEffect(() => {
      if (isOpen) {
        setIsLoading(true);
        setTimeout(() => {
          setAllVehicles(vehicles);
          setFilteredData(vehicles);
          setIsLoading(false);
        }, 1500);
      }
    }, [isOpen, vehicles]);
  
    useEffect(() => {
      const results = allVehicles.filter(vehicle =>
        vehicle.info.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vehicle.info.chofer && vehicle.info.chofer.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredData(results);
    }, [searchTerm, allVehicles]);
  
    const handleCardClick = async (vehicle) => {
      try {
        if (!vehicle || !vehicle.imei) {
            console.error("❌ Datos del vehículo inválidos:", vehicle);
            return;
        }

        if (vehicle.route.length <= 1) {
            const last5Routes = await getLast5Routes(token, vehicle.imei);
            if (last5Routes.status === 200) {
                const coordinates = last5Routes.registros.map(r => [r.location.x, r.location.y]).reverse();
                dispatch(setVehicleRoute({ id: vehicle.id, route: coordinates }));
                vehicle = { ...vehicle, route: coordinates };
            }
        }

        // Se usan las props del padre
        onVehicleSelect(vehicle);
        dispatch(addSelectedVehicle(vehicle));
        
        // --- CAMBIO 3: Llama a `onClose()` para cerrar el panel después de seleccionar ---
        onClose();

      } catch (error) {
        console.error("❌ Error al procesar el vehículo:", error);
      }
    };
    
    const handleTouchStart = (e) => { setDragState({ ...dragState, startY: e.touches[0].clientY, isDragging: true }); };

    const handleTouchMove = (e) => {
      if (!dragState.isDragging) return;
      const delta = e.touches[0].clientY - dragState.startY;
      if (delta > 0) { setDragState({ ...dragState, deltaY: delta }); }
    };

    const handleTouchEnd = () => {
      // --- CAMBIO 4: Llama a `onClose()` para cerrar con el gesto de deslizar ---
      if (dragState.deltaY > 100) { 
        onClose(); 
      }
      setDragState({ startY: 0, deltaY: 0, isDragging: false });
    };
  
    return (
      <>
        {/* --- CAMBIO 5: El botón principal llama a `onOpen()` para pedirle al padre que abra el panel --- */}
        <OptionsButton onClick={onOpen}>
          <img src={Car} alt="Car Icon" style={{ width: "30px", height: "30px" }} />
        </OptionsButton>
        
        {isOpen && (
          <>
            {/* --- CAMBIO 6: El fondo llama a `onClose()` para cerrar el panel --- */}
            <Backdrop onClick={onClose} />
            <PanelContainer
              deltaY={dragState.deltaY} isDragging={dragState.isDragging}
              onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
            >
              <GrabBar />
              <PanelHeader>
                <h3>Unidades ({filteredData.length})</h3>
              </PanelHeader>
              <PanelContent>
                <SearchContainer>
                  <SearchIcon />
                  <SearchInput 
                    type="text" 
                    placeholder="Buscar por nombre o chofer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </SearchContainer>
  
                {isLoading
                  ? Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} />)
                  : filteredData.length === 0 
                    ? <span style={{ textAlign: 'center', marginTop: '20px', color: '#888' }}>No se encontró ninguna unidad.</span>
                    : filteredData.map((vehicle) => (
                        <VehicleCard // Recuerda que este componente debe existir
                          key={vehicle.id}
                          name={vehicle.info.nombre}
                          status={vehicle.posicion_actual.id_status_motor === 1 ? "En movimiento" : "Detenido"}
                          updated={vehicle.posicion_actual.fecha}
                          driver={vehicle.info.chofer}
                          onClick={() => handleCardClick(vehicle)}
                        />
                      ))
                }
              </PanelContent>
            </PanelContainer>
          </>
        )}
      </>
    );
};