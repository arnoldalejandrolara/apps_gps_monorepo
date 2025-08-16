import React from 'react';
import styled from 'styled-components';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

export function ConfiguracionTemplate() {
  const location = useLocation();

  const options = [
    { key: 'general', label: 'General', path: '/configuracion/general-settings' },
    { key: 'usuarios', label: 'Usuarios', path: '/configuracion/usuarios-settings' },
    { key: 'notificaciones', label: 'Notificaciones', path: '/configuracion/notificaciones-settings' },
    { key: 'seguridad', label: 'Seguridad', path: '/configuracion/seguridad-settings' },
    { key: 'integraciones', label: 'Integraciones', path: '/configuracion/integraciones-settings' },
  ];


  return (
    <MainContainer>
      <LeftContainer>
        <Title>Configuración</Title>
        <Divider />
        <OptionsList>
          {options.map(option => (
            <li key={option.key}>
              <NavOption
                to={option.path}
                className={({ isActive }) => (isActive || (option.key === 'notificaciones' && location.pathname.startsWith('/configuracion/notificaciones'))) ? "active" : ""}
                end
              >
                {option.label}
              </NavOption>
            </li>
          ))}
        </OptionsList>
      </LeftContainer>

      <RightContainer>
        <ContentWrapper>
            <Outlet />
        </ContentWrapper>
      </RightContainer>
    </MainContainer>
  );
}

const MainContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  background: #171717;
`;

const LeftContainer = styled.div`
  width: 260px;
  background: #171717;
  padding: 10px 0; 
  border-right: 1px solid #2E2E2E;
  
  @media (max-width: 765px) {
    width: 100%;
    padding: 6px 0;
    border-right: none;
  }
`;

// --- CAMBIOS CLAVE ---
const RightContainer = styled.div`
  flex: 1;
  background: #171717;
  display: flex; /* 1. Convertir en contenedor flex */
  flex-direction: column; /* 2. Organizar hijos verticalmente */
  height: 100%; /* Asegurar que ocupe toda la altura */
  overflow: hidden; /* Prevenir cualquier scroll inesperado en este contenedor */
  
  @media (max-width: 765px) {
    display: none;
  }
`;

// --- NUEVO COMPONENTE WRAPPER ---
const ContentWrapper = styled.div`
  flex: 1; /* 3. Hacer que este wrapper ocupe todo el espacio sobrante */
  position: relative; /* Contexto de posicionamiento por si es necesario */
  overflow: hidden; /* Asegura que el contenido hijo no se desborde */
`;


const Title = styled.h2`
  color: #fff;
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 8px;
  padding: 8px 20px; 
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: #2E2E2E;
  margin-bottom: 15px;
`;

const OptionsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 15px; 

  li {
    margin-bottom: 4px;
  }
`;

const NavOption = styled(NavLink)`
  display: block;
  padding: 5px 10px; 
  color: #ccc;
  font-size: 13px;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s, background-color 0.2s;
  font-weight: 400;
  border-radius: 6px;

  &.active {
    color: #fff;
    font-weight: 400;
    background-color: #2a2a2a;
  }

  &:hover {
    color: #fff;
    background-color: #2a2a2a;
  }
`;



export default ConfiguracionTemplate;