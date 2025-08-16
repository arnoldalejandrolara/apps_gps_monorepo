import React from 'react';
import styled from 'styled-components';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

export function ReportesTemplate() {
  const location = useLocation();

  const options = [
    { key: 'historial', label: 'Historial', path: '/reportes/reporte-historial' },
    
    { key: 'usuarios', label: 'Kilometraje', path: '/reportes/usuarios' },
    { key: 'inventario', label: 'Inventario', path: '/reportes/inventario' },
    { key: 'financieros', label: 'Horas trabajadas', path: '/reportes/financieros' },
    { key: 'actividad', label: 'Traslados', path: '/reportes/actividad' },
  ];


  return (
    <MainContainer>
      <LeftContainer>
        <Title>Reportes</Title>
        <Divider />
        <OptionsList>
          {/* === CAMBIO: Usando el nuevo componente de subtítulo === */}
          <ListSubtitle>REPORTES INTEGRADOS</ListSubtitle>

          {options.map(option => (
            <li key={option.key}>
              <NavOption
                to={option.path}
                className={({ isActive }) => 
                  (isActive || location.pathname.startsWith(option.path + '/')) ? "active" : ""
                }
                end={!location.pathname.startsWith(option.path + '/')}
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

// --- ESTILOS ---

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

const RightContainer = styled.div`
  flex: 1;
  background: #171717;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  
  @media (max-width: 765px) {
    display: none;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
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

// --- NUEVO COMPONENTE PARA EL SUBTÍTULO ---
const ListSubtitle = styled.h3`
  font-size: 13px;
  font-weight: 400;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 10px;
  margin: 10px 0 6px 0;
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

export default ReportesTemplate;