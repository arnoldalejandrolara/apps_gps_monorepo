import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { CiLogout } from "react-icons/ci";
import { logout } from "@mi-monorepo/common/store/thunks";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { 
  FaChartBar, 
  FaDrawPolygon, 
  FaBell, 
  FaRoute, 
  FaHistory, 
  FaMapPin, 
  FaSearchLocation, 
  FaShareAlt, 
  FaUsers 
} from "react-icons/fa";

const menuItems = [
    {
        label: "Reportes",
        icon: <FaChartBar />, 
        subMenu: [
            { label: "Crear Reporte", to: "/reports/new" },
            { label: "Historial de Reportes", to: "/reports/history" }
        ]
    },
    {
        label: "Geocercas",
        icon: <FaDrawPolygon />,
        subMenu: [
            { label: "Ver Geocercas", to: "/geofences/view" },
            { label: "Crear Nueva", to: "/geofences/create" }
        ]
    },
    {
        label: "Alertas",
        icon: <FaBell />,
        subMenu: [
            { label: "Ver Alertas Activas", to: "/alerts/active" },
            { label: "Configurar Alertas", to: "/alerts/config" }
        ]
    },
    {
        label: "Ruta del Día",
        icon: <FaRoute />,
        subMenu: [
            { label: "Asignar Ruta", to: "/daily-route/assign" },
            { label: "Optimizar Rutas", to: "/daily-route/optimize" }
        ]
    },
    {
        label: "Historial",
        icon: <FaHistory />,
        subMenu: [
            { label: "Historial de Viajes", to: "/history/trips" },
            { label: "Historial de Eventos", to: "/history/events" }
        ]
    },
    {
        label: "PDI",
        icon: <FaMapPin />,
        subMenu: [
            { label: "Mis Puntos de Interés", to: "/poi/list" },
            { label: "Agregar PDI", to: "/poi/add" }
        ]
    },
    {
        label: "Ver Ruta",
        icon: <FaSearchLocation />,
        subMenu: [
            { label: "Buscar Ruta Actual", to: "/view-route/current" },
            { label: "Planificar Nueva Ruta", to: "/view-route/plan" }
        ]
    },
    {
        label: "Compartir Ubicación",
        icon: <FaShareAlt />,
        subMenu: [
            { label: "Compartir Viaje Actual", to: "/share-location/live" },
            { label: "Crear Enlace Temporal", to: "/share-location/link" }
        ]
    },
    {
        label: "Cuenta Espejo",
        icon: <FaUsers />,
        subMenu: [
            { label: "Administrar Cuentas", to: "/mirror-account/manage" },
            { label: "Solicitar Acceso", to: "/mirror-account/request" }
        ]
    }
];

const logoutItem = {
    label: "Salir",
    icon: <CiLogout />,
    subMenu: [
        { label: "Confirmar Salida", action: 'logout' }
    ]
};

export function Sidebar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeSubMenu, setActiveSubMenu] = useState(null);
    const [subMenuTop, setSubMenuTop] = useState(0);

    const cerrarSesion = () => {
        dispatch(logout());
        navigate('/login');
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
        console.log(item);
        if (item.action === 'logout') {
            cerrarSesion();
        } else if (item.to) {
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
                            const isActive = activeSubMenu === index;
                            return (
                                <SidebarItem
                                    key={item.label + index}
                                    onMouseEnter={(e) => handleMouseEnter(index, e)}
                                    className={isActive ? 'active' : ''}
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
                    {itemToShow.subMenu.map(subItem => (
                        <SubMenuItem key={subItem.label} onClick={() => handleSubMenuClick(subItem)}>
                            {subItem.label}
                        </SubMenuItem>
                    ))}
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
  /* CAMBIO: Se quita justify-content y se añade overflow para el scroll */
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
  /* CAMBIO: Este truco empuja el botón de logout hasta abajo */
  margin-top: auto;
`;