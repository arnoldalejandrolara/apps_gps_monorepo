import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { CiMap, CiInboxIn } from "react-icons/ci";
import { IoCarOutline } from "react-icons/io5";
import { GoHome } from "react-icons/go";
import { useMapView } from '@mi-monorepo/common/context';

// Punto verde pegado al ícono
const GreenDot = styled.span`
  position: absolute;
  top: 6px;
  right: 17px;
  width: 10px;
  height: 10px;
  background: #00ff4b;
  border-radius: 50%;
  z-index: 2;
  pointer-events: none;
`;

const MenuItemWrapper = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const BuscarMenuItemWrapper = styled(MenuItemWrapper)`
  .menu-item {
    outline: 2px solid #393939;
  }
`;

const BottomMenuWrapper = styled.footer`
  gap: 10px;
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #202020;
  padding: auto ;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -4px 10px rgba(0,0,0,0.2);
  z-index: 1000;

  .menu-item {
    color: ${({ theme }) => theme.text || "#fff"};
    font-size: 26px;
    text-align: center;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 8px;
    border-radius: 12px;
    position: relative;
    background: none;
    border: none;
  }

  .menu-item:hover {
    color: white;
    transform: scale(1.1);
    background-color: #2c2c2c;
    margin: 0 10px;
  }

  .menu-item.active {
    color: white;
    background-color: #333;
    font-weight: bold;
    transform: scale(1);
  }
`;

export const BottomMenu = () => {
  const { showMapMobile, setShowMapMobile } = useMapView();
  const navigate = useNavigate();
  const location = useLocation();

  // Solo uno activo: si showMapMobile es true, solo el de mapa, si no, el que coincida con la ruta
  const isActive = (route) => location.pathname === route && !showMapMobile;
  const isMapActive = () => showMapMobile;

  // Navega y cierra el mapa si está abierto
  const handleNavigate = (route) => {
    console.log(showMapMobile, 'showMapMobile menu');
    if (showMapMobile) setShowMapMobile(false);
    navigate(route);
  };

  return (
    <BottomMenuWrapper>
      <MenuItemWrapper>
        <button
          type="button"
          className={`menu-item${isActive('/') ? ' active' : ''}`}
          onClick={() => handleNavigate('/home-mobile')}
          aria-label="Inicio"
        >
          <GoHome />
        </button>
      </MenuItemWrapper>
      <BuscarMenuItemWrapper>
        <button
          type="button"
          className={`menu-item${isActive('/buscar-mobile') ? ' active' : ''}`}
          onClick={() => handleNavigate('/buscar-mobile')}
          aria-label="Buscar"
        >
          <IoCarOutline />
          <GreenDot />
        </button>
      </BuscarMenuItemWrapper>
      <MenuItemWrapper>
        <button
          className={`menu-item${isMapActive() ? ' active' : ''}`}
          type="button"
          onClick={() => setShowMapMobile(!showMapMobile)}
          aria-label="Mapa"
        >
          <CiMap />
        </button>
      </MenuItemWrapper>
      <MenuItemWrapper>
        <button
          type="button"
          className={`menu-item${isActive('/notificaciones-mobile') ? ' active' : ''}`}
          onClick={() => handleNavigate('/notificaciones-mobile')}
          aria-label="Notificaciones"
        >
          <CiInboxIn />
        </button>
      </MenuItemWrapper>
    </BottomMenuWrapper>
  );
};