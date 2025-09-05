import React from 'react';
import styled from 'styled-components';
// --- Íconos sin cambios ---
import { CiMap, CiGrid41, CiInboxIn, CiUser } from "react-icons/ci"; 

const MenuItemWrapper = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const BottomMenuWrapper = styled.footer`
  gap: 10px;
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #ffffff;
  padding: 0 5px; /* Un poco de padding horizontal */
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
  border-top: 1px solid #e0e0e0;
  z-index: 1000;

  .menu-item {
    color: ${({ theme }) => theme.textSecondary || "#555"};
    font-size: 26px;
    text-align: center;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 75%; /* Altura para el botón */
    border-radius: 12px;
    position: relative;
    background: none;
    border: none;
    padding: 10px;
  }

  .menu-item:hover {
    color: #000000;
    transform: scale(1.1);
    background-color: #f0f0f0;
  }

  .menu-item.active {
    color: #000000;
    background-color: #e0e0e0;
    font-weight: bold;
    transform: scale(1);
  }
`;

// --- 1. ACEPTA LAS PROPS PARA CONTROLAR EL ESTADO DESDE APP.JS ---
export const BottomMenu = ({ onViewChange, activeView }) => {

  // --- 2. SE ELIMINAN LOS HOOKS DE RUTAS Y MAPVIEW ---
  // La lógica ahora es controlada por App.js, por lo que ya no son necesarios aquí.

  return (
    <BottomMenuWrapper>
      {/* Primer ícono: Mapa 
        - Su estado "activo" es cuando no hay ninguna otra vista activa (activeView es null).
        - Su onClick establece la vista activa a null, cerrando cualquier contenedor.
      */}
      <MenuItemWrapper>
        <button
          className={`menu-item ${!activeView ? 'active' : ''}`}
          type="button"
          onClick={() => onViewChange(null)}
          aria-label="Mapa"
        >
          <CiMap />
        </button>
      </MenuItemWrapper>

      {/* Botón de Dashboard
        - Su estado "activo" es cuando activeView es 'dashboard'.
        - Su onClick establece la vista activa a 'dashboard'.
      */}
      {/* <MenuItemWrapper>
        <button
          type="button"
          className={`menu-item ${activeView === 'dashboard' ? 'active' : ''}`}
          onClick={() => onViewChange('dashboard')}
          aria-label="Dashboard"
        >
          <CiGrid41 />
        </button>
      </MenuItemWrapper> */}

      {/* Tercer ícono: Notificaciones */}
      <MenuItemWrapper>
        <button
          type="button"
          className={`menu-item ${activeView === 'notifications' ? 'active' : ''}`}
          onClick={() => onViewChange('notifications')}
          aria-label="Notificaciones"
        >
          <CiInboxIn />
        </button>
      </MenuItemWrapper>

      {/* Cuarto ícono: Perfil */}
      <MenuItemWrapper>
        <button
          type="button"
          className={`menu-item ${activeView === 'profile' ? 'active' : ''}`}
          onClick={() => onViewChange('profile')}
          aria-label="Perfil"
        >
          <CiUser />
        </button>
      </MenuItemWrapper>
    </BottomMenuWrapper>
  );
};