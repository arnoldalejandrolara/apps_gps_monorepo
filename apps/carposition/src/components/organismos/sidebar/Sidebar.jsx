import React, { useState , useRef } from "react";
import styled, { keyframes , css } from "styled-components";
import { CiLogout } from "react-icons/ci";
import { logout } from "@mi-monorepo/common/store/thunks";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useModal } from "../../../hooks/useModal";
import { PuntosInteresControl } from "../ContentModals/PuntosInteresControl";
import { menuItems , logoutItem } from "../../../utilities/dataEstatica";
import { useSelector } from 'react-redux';
import {togglePdiMarkers} from "@mi-monorepo/common/store/mapView";
import {toggleGeofences} from "@mi-monorepo/common/store/geofenceView";


export function Sidebar({onToggleNotifications}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeSubMenu, setActiveSubMenu] = useState(null);
    const [subMenuTop, setSubMenuTop] = useState(0);
    const { openModal } = useModal();
    const [isAlertsPanelOpen, setAlertsPanelOpen] = useState(false);
    const [alertsPanelTop, setAlertsPanelTop] = useState(0);
    
    const showPdiMarkers = useSelector((state) => state.mapView.showPdiMarkers);
    const showGeofences = useSelector((state) => state.geofenceView.showGeofences);

    const pdiItemRef = useRef(null);
    const pdiItemIndex = menuItems.findIndex(item => item.id === 'pdi');

    const cerrarSesion = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleOpenPdiTable = () => {
        // openModal(
        //     <PuntosInteresControl initialView="table" />,
        //     'Control de Puntos de Interes', 
        //     'large'
        // );
        alert('Funcionalidad en desarrollo ver pdi en mapa');
    };
    
    const handleOpenPdiForm = () => {
        openModal(
            <PuntosInteresControl initialView="form" />, // <-- Pasa la prop para abrir el formulario directamente
            'Agregar Nuevo Punto de Interés',
             'large'
        );
    };
    
    const handleMouseEnter = (index, e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setSubMenuTop(rect.top);
        setActiveSubMenu(index);
    };

    const handleMouseLeave = () => {
        setActiveSubMenu(null);
    };

    const handleSubMenuClick = (item) => {
        console.log('Submenu item clicked:', item);

        if (item.action === 'openPdiTable') {
            // handleOpenPdiTable();
            dispatch(togglePdiMarkers());
        } else if (item.action === 'openPdiForm') {
            handleOpenPdiForm();
        } else if (item.action === 'openAlertsPanel') {
            console.log('Toggle Notifications');
            onToggleNotifications();
        }else if(item.action === 'viewGeocercas'){
            dispatch(toggleGeofences());
          
        }else {
            navigate(item.to); 
        }
        setActiveSubMenu(null);
    };

    const activeItemIndex = activeSubMenu;
    let itemToShow = null;

    if (activeItemIndex !== null) {
        itemToShow = (activeItemIndex === 'logout') ? logoutItem : menuItems[activeItemIndex];
    }

    return (
        <div onMouseLeave={handleMouseLeave}>
            <SidebarContainer>
                <ProfileContainer>
                    <ProfileCircle>
                        <span>U</span>
                    </ProfileCircle>
                </ProfileContainer>
                <ContentContainer>
                    <div>
                    {menuItems.map((item, index) => {
                            const isHoverActive = activeSubMenu === index;
                            const isPdiActive = item.id === 'pdi' && showPdiMarkers;
                            const isGeofenceActive = item.id === 'geocercas' && showGeofences; 
                            const isReduxActive = isPdiActive || isGeofenceActive;


                            return (
                                <SidebarItem
                                    // --> 5. ASIGNA LA REFERENCIA AL ÍTEM CORRECTO
                                    ref={item.id === 'pdi' ? pdiItemRef : null}
                                    key={item.label + index}
                                    onMouseEnter={(e) => handleMouseEnter(index, e)}
                                    className={isHoverActive || isReduxActive ? 'active' : ''}
                                >
                                    <IconSlot>{item.icon}</IconSlot>
                                </SidebarItem>
                            );
                        })}
                    </div>
                    <BottomOptions>
                        <SidebarItem 
                          onMouseEnter={(e) => handleMouseEnter('logout', e)}
                          className={activeSubMenu === 'logout' ? 'active' : ''}
                        >
                            <IconSlot>{logoutItem.icon}</IconSlot>
                        </SidebarItem>
                    </BottomOptions>
                </ContentContainer>
            </SidebarContainer>

            {activeSubMenu !== null && itemToShow?.subMenu && (
                <SubMenuContainer 
                    key={activeItemIndex} 
                    style={{ top: `${subMenuTop}px` }}
                >
                    <h4>{itemToShow.label}</h4>
                    {itemToShow.subMenu.map(subItem => {
                        // --> 2. CREA UNA CONSTANTE PARA SABER SI ESTE SUB-ITEM ESTÁ ACTIVO
                        const isPdiSubItemActive = subItem.action === 'openPdiTable' && showPdiMarkers;
                        const isGeofenceSubItemActive = subItem.action === 'viewGeocercas' && showGeofences;
                        const isSubItemActive = isPdiSubItemActive || isGeofenceSubItemActive;
                        
                        return (
                            <SubMenuItem 
                                key={subItem.label} 
                                onClick={() => handleSubMenuClick(subItem)}
                                // --> 3. PASA LA CONSTANTE COMO UNA PROP 'isActive'
                                isActive={isSubItemActive}
                            >
                                {subItem.label}
                            </SubMenuItem>
                        );
                    })}
                </SubMenuContainer>
            )}
        </div>
    );
}

// --- Estilos ---

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.98) translateX(5px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateX(0);
  }
`;

const SidebarContainer = styled.div`
  background: #FCFCFC;
  color: ${(props) => props.theme.text};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  z-index: 100;
  height: 100vh;
  width: 55px; 
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  box-shadow: -2px 0 14px 0 rgba(0,0,0,0.08);
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1 1 auto;
  align-items: stretch;
  width: 100%;
  padding: 0px;
  overflow-y: auto;
`;

const SidebarItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 50px;
  width: 100%;
  cursor: pointer;
  border-radius: 0px;
  
  color: #5a5a5a; 
  transition: background 0.14s, color 0.14s;

  &:hover, &.active {
    background: #EDEDED;
    color: #000000;
  }
`;

const IconSlot = styled.div`
  width: 100%;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    font-size: 18px;
  }
`;

const SubMenuContainer = styled.div`
  position: fixed;
  right: 55px;
  background: #EDEDED;
  border: 1px solid #EAEAEA;
  
  border-radius: 8px 0px 0px 8px;
  padding: 8px;
  z-index: 101;
  width: 200px;
  box-shadow: -5px 5px 15px rgba(0,0,0,0.1);
  animation: ${fadeIn} 0.2s ease-out;

  h4 {
    color: #212529;
    margin: 0 0 10px 10px;
    font-size: 13px;
    font-weight: 500;
  }
`;

const SubMenuItem = styled.div`
  padding: 10px;
  font-size: 12px;
  color: #495057;
  font-weight: 500;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background: #F0F7FF;
    color: #007BFF;
  }
  
  // --> 4. AÑADE ESTE BLOQUE DE CÓDIGO
  // Aplica estos estilos si la prop 'isActive' es true
  ${props => props.isActive && css`
    background-color: #E6F2FF;
    color: #0069D9;
    font-weight: 600;
  `}
`;


const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 0;
`;

const ProfileCircle = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #e9ecef;
  color: #495057;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #dee2e6;
  }
`;

const BottomOptions = styled.div`
  width: 100%;
  margin-top: auto;
`;