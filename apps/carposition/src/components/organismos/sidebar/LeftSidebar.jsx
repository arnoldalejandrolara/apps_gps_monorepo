import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaUserCog, FaCar, FaBell, FaRoute, FaChartBar, FaMapPin, FaDrawPolygon, FaCalendarAlt, FaUsers, FaTachometerAlt, FaGasPump, FaMapSigns, FaLayerGroup } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";


const topMenuItems = [
    { icon: <FaUserCog />, label: 'Control de Usuarios', to: '/configuration-user' },
    { icon: <FaCar />, label: 'Configuración del Dispositivo', to: '/device-config' },
    { icon: <FaBell />, label: 'Configuración de Notificaciones', to: '/notifications-config' },
];

const mainMenuItems = [
    { icon: <FaRoute />, label: 'Rutas', to: '/routes' },
    { icon: <FaChartBar />, label: 'Reportes', to: '/reports' },
    { icon: <FaMapPin />, label: 'Puntos de Interés', to: '/poi' },
    { icon: <FaDrawPolygon />, label: 'Geocercas', to: '/geofences' },
    { icon: <FaCalendarAlt />, label: 'Eventos', to: '/events' },
    { icon: <FaUsers />, label: 'Cuentas Espejo', to: '/mirror-accounts' },
    { icon: <FaTachometerAlt />, label: 'Dashboard', to: '/dashboard' },
    { icon: <FaGasPump />, label: 'Dashboard Combustible', to: '/fuel-dashboard' },
    { icon: <FaMapSigns />, label: 'Viajes', to: '/trips' },
    { icon: <FaLayerGroup />, label: 'Grupos', to: '/groups' },
];

export function LeftSidebar({ isOpen, onClose, onMenuItemClick }) {
    const navigate = useNavigate();

    const handleItemClick = (item) => {
        // Llama a la función del padre para abrir el modal
        onMenuItemClick(item);
        // Cierra el sidebar
        onClose();
    };

    return (
        <LeftSidebarContainer $isOpen={isOpen}>
            <SidebarHeader>
                <MenuTitle>Menú</MenuTitle>
                <CloseButton onClick={onClose}>
                    <IoClose />
                </CloseButton>
            </SidebarHeader>
            <MenuList>
                {topMenuItems.map(item => (
                    <MenuItem key={item.label} onClick={() => handleItemClick(item)}>
                        <MenuIcon>{item.icon}</MenuIcon>
                        <MenuLabel>{item.label}</MenuLabel>
                    </MenuItem>
                ))}
            </MenuList>
            <Divider />
            <MenuList>
                {mainMenuItems.map(item => (
                    <MenuItem key={item.label} onClick={() => handleItemClick(item)}>
                        <MenuIcon>{item.icon}</MenuIcon>
                        <MenuLabel>{item.label}</MenuLabel>
                    </MenuItem>
                ))}
            </MenuList>
        </LeftSidebarContainer>
    );
}

// Estilos (movidos de App.js a este archivo)
const LeftSidebarContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 300px;
    height: 100vh;
    background: #ffffff;
    color: #333333;
    box-shadow: 4px 0 15px rgba(0,0,0,0.1);
    z-index: 1001;
    transform: translateX(${(props) => (props.$isOpen ? '0' : '-100%')});
    transition: transform 0.3s ease-in-out;
    padding: 0;
    display: flex;
    flex-direction: column;
`;
const SidebarHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #f0f0f0;
`;
const MenuTitle = styled.h2`
    margin: 0;
    font-size: 16px;
    font-weight: 400;
`;
const CloseButton = styled.button`
    background: transparent;
    border: none;
    color: #888;
    font-size: 22px;
    cursor: pointer;
    padding: 5px;
    line-height: 1;
    &:hover { color: #000; }
`;
const MenuList = styled.div`
    padding: 10px 0;
    overflow-y: auto;
`;
const MenuItem = styled.a`
    display: flex;
    align-items: center;
    padding: 12px 20px;
    cursor: pointer;
    text-decoration: none;
    color: #333;
    transition: background-color 0.2s ease;
    &:hover { background-color: #f8f8f8; }
`;
const MenuIcon = styled.span`
    margin-right: 15px;
    font-size: 20px;
    color: #555;
    width: 24px;
    text-align: center;
`;
const MenuLabel = styled.span`
    font-size: 12px;
    font-weight: 400;
`;
const Divider = styled.hr`
    border: none;
    border-top: 1px solid #f0f0f0;
    margin: 5px 0;
`;