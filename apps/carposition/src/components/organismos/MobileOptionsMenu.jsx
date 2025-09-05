// src/components/organismos/MobileOptionsMenu.jsx

import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { IoEllipsisHorizontal, IoClose } from 'react-icons/io5';
import { FaUserCog, FaCar, FaBell, FaChartBar, FaMapPin, FaDrawPolygon, FaUsers } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import {togglePdiMarkers} from "@mi-monorepo/common/store/pdiView";
import {toggleGeofences} from "@mi-monorepo/common/store/geofenceView";

// ... (las animaciones no cambian) ...
const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const OptionsButton = styled.button`
  position: fixed; top: 15px; right: 15px; z-index: 900; background: #ffffff; color: #333333; border: 1px solid #dddddd; border-radius: 8px; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; cursor: pointer; font-size: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;
const Backdrop = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); z-index: 1005; animation: ${fadeIn} 0.3s ease-out;
`;

// --- 2. NUEVOS ESTILOS: BARRA DE ARRASTRE Y TOGGLE SWITCH ---
const GrabBar = styled.div`
  width: 40px;
  height: 5px;
  background-color: #d0d0d0;
  border-radius: 10px;
  margin: 5px auto 10px; /* Centra la barra */
  cursor: grab;
`;

const PanelContainer = styled.div.attrs(props => ({
  style: {
    transform: `translateY(${props.$deltaY}px)`,
    transition: props.$isDragging ? 'none' : 'transform 0.3s ease-out'
  },
}))`
  position: fixed; bottom: 0; left: 0; width: 100%; max-height: 80vh; background: #ffffff; z-index: 1010; border-top-left-radius: 20px; border-top-right-radius: 20px; box-shadow: 0 -5px 20px rgba(0,0,0,0.1); padding: 0 10px 20px 10px; animation: ${slideUp} 0.3s ease-out; display: flex; flex-direction: column;
`;

const PanelHeader = styled.div`
  display: flex; justify-content: center; align-items: center; padding: 5px 0 15px 0; position: relative;
  h3 { margin: 0; font-size: 16px; color: #191919; font-weight: 600; }
  button { position: absolute; right: 10px; background: #f0f0f0; border: none; font-size: 16px; cursor: pointer; color: #555; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; }
`;

const PanelContent = styled.div`
  overflow-y: auto; padding: 0 5px;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 10px; }
`;

const MenuGroup = styled.div`
  background-color: #f7f7f7; border-radius: 12px; padding: 8px; margin-bottom: 12px;
  &:last-child { margin-bottom: 0; }
`;

const MenuList = styled.div`
  display: flex; flex-direction: column;
`;

const MenuItem = styled.button`
  display: flex; align-items: center; width: 100%; padding: 15px 12px; border-radius: 6px; background: none; border: none; cursor: pointer; text-align: left; transition: background-color 0.1s ease;
  &:active { background-color: #e9e9e9; }
`;

const MenuIcon = styled.div`
  font-size: 18px; color: #555; margin-right: 16px; width: 24px; display: flex; justify-content: center; align-items: center;
`;

const MenuLabel = styled.span`
  font-size: 14px; color: #191919;
`;

const ToggleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
`;

const ToggleSwitch = styled.label`
  position: relative; display: inline-block; width: 51px; height: 31px;
  input { opacity: 0; width: 0; height: 0; }
  span {
    position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;
  }
  span:before {
    position: absolute; content: ""; height: 23px; width: 23px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%;
  }
  input:checked + span { background-color: #2196F3; }
  input:checked + span:before { transform: translateX(20px); }
`;

export const MobileOptionsMenu = ({ onMenuItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const showPdiMarkers = useSelector((state) => state.pdiView.showPdiMarkers);
  const showGeofences = useSelector((state) => state.geofenceView.showGeofences);
  // --- 1. ESTADO ADICIONAL PARA LOS TOGGLES Y EL ARRASTRE ---
  const [dragState, setDragState] = useState({ startY: 0, deltaY: 0, isDragging: false });
  const panelRef = useRef(null);

  const topMenuItems = [
    { icon: <FaUserCog />, label: 'Control de Usuarios', to: '/configuration-user' },
    { icon: <FaCar />, label: 'Configuración del Dispositivo', to: '/device-config' },
    { icon: <FaBell />, label: 'Configuración de Notificaciones', to: '/notifications-config' },
  ];
  const mainMenuItems = [
    { icon: <FaChartBar />, label: 'Reportes', to: '/reports_mobile' },
    { icon: <FaMapPin />, label: 'Puntos de Interes', to: '/pdi' },
    { icon: <FaDrawPolygon />, label: 'Geocercas', to: '/geocercas' },
    { icon: <FaUsers />, label: 'Cuentas Espejo', to: '/mirror-accounts' },
  ];

  const togglePanel = () => { setIsOpen(!isOpen); };
  const handleItemClick = (item) => {
    if (onMenuItemClick) { onMenuItemClick(item , true); }
    togglePanel();
  };

  // --- 3. LÓGICA PARA EL GESTO DE DESLIZAR (DRAG) ---
  const handleTouchStart = (e) => {
    setDragState({ ...dragState, startY: e.touches[0].clientY, isDragging: true });
  };

  const handleTouchMove = (e) => {
    if (!dragState.isDragging) return;
    const delta = e.touches[0].clientY - dragState.startY;
    // Solo permite arrastrar hacia abajo
    if (delta > 0) {
      setDragState({ ...dragState, deltaY: delta });
    }
  };

  const handleTouchEnd = () => {
    const SWIPE_THRESHOLD = 100; // Si se arrastra más de 100px, se cierra
    if (dragState.deltaY > SWIPE_THRESHOLD) {
      togglePanel();
    }
    // Resetea el estado del arrastre
    setDragState({ startY: 0, deltaY: 0, isDragging: false });
  };

  return (
    <>
      <OptionsButton onClick={togglePanel}><IoEllipsisHorizontal /></OptionsButton>
      {isOpen && (
        <>
          <Backdrop onClick={togglePanel} />
          {/* --- 4. JSX ACTUALIZADO CON BARRA, TOGGLES Y EVENTOS DE ARRASTRE --- */}
          <PanelContainer
            ref={panelRef}
            $deltaY={dragState.deltaY}         // <-- Cambio aquí
            $isDragging={dragState.isDragging} // <-- Cambio aquí
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <GrabBar />
            <PanelHeader>
              <h3>Acciones</h3>
              {/* <button onClick={togglePanel}><IoClose /></button> */}
            </PanelHeader>
            <PanelContent>
              <MenuGroup>
                <ToggleRow>
                  <MenuLabel>Mostrar Puntos de Interés</MenuLabel>
                  <ToggleSwitch>
                    <input type="checkbox" checked={showPdiMarkers} onChange={() =>  dispatch(togglePdiMarkers())} />
                    <span />
                  </ToggleSwitch>
                </ToggleRow>
                <ToggleRow>
                  <MenuLabel>Mostrar Geocercas</MenuLabel>
                  <ToggleSwitch>
                    <input type="checkbox" checked={showGeofences} onChange={() =>  dispatch(toggleGeofences())} />
                    <span />
                  </ToggleSwitch>
                </ToggleRow>
              </MenuGroup>

              <MenuGroup>
                <MenuList>
                  {topMenuItems.map(item => (
                      <MenuItem key={item.label} onClick={() => handleItemClick(item)}>
                          <MenuIcon>{item.icon}</MenuIcon>
                          <MenuLabel>{item.label}</MenuLabel>
                      </MenuItem>
                  ))}
                </MenuList>
              </MenuGroup>
              
              <MenuGroup>
                <MenuList>
                  {mainMenuItems.map(item => (
                      <MenuItem key={item.label} onClick={() => handleItemClick(item)}>
                          <MenuIcon>{item.icon}</MenuIcon>
                          <MenuLabel>{item.label}</MenuLabel>
                      </MenuItem>
                  ))}
                </MenuList>
              </MenuGroup>
            </PanelContent>
          </PanelContainer>
        </>
      )}
    </>
  );
};