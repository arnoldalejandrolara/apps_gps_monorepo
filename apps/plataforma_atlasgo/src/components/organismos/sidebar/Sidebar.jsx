import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { CiLogout } from "react-icons/ci";
import { IoDownloadOutline } from "react-icons/io5";
import { FaRegMap } from "react-icons/fa6";
import { logout } from "../../../store/thunks/authThunks";
import { useNavigate, useLocation } from 'react-router-dom';
import { LinksArray, LinksArray2 } from "../../../utilities/dataEstatica";
import { v } from "../../../utilities/variables";
import { ModalOverlay } from "../ModelScreenConfig/ModalOverlay";
import { useDispatch } from "react-redux";
import { useMapaWeb } from "../../../context/MapViewContext";

export function Sidebar() {
  const { showMapaWebLayer, setShowMapaWebLayer } = useMapaWeb();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (route) => location.pathname.startsWith(route) && !showMapaWebLayer;
  const isMapActive = () => showMapaWebLayer;

  const handleNavigate = (route) => {
    if (route === location.pathname) {
      setShowMapaWebLayer(false);
    } else {
      navigate(route);
    }
  };

  useEffect(() => {
    setShowMapaWebLayer(false);
  }, [location.pathname]);

  const [modalConfig, setModalConfig] = useState({
    visible: false,
    content: "",
    position: { top: 0, left: 0 },
  });

  const dispatch = useDispatch();

  const cerrarSesion = () => {
    dispatch(logout());
    navigate('/login');
  };

  const [hovered, setHovered] = useState(false);

  const handleRipple = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add("ripple-effect");
    button.appendChild(ripple);
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  return (
    <SidebarContainer
      $isopen={hovered}
      className={hovered ? "active" : ""}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ContentContainer>
        <div>
          {[...LinksArray, { icon: <FaRegMap />, label: "Mapa", to: "MAPA_WEB_LAYER", isMap: true }, ...LinksArray2].map((item, idx) => {
            const { icon, label, to, isMap } = item;
            const active = isMap ? isMapActive() : isActive(to);
            const originalOnClick = isMap
              ? () => setShowMapaWebLayer(!showMapaWebLayer)
              : () => handleNavigate(to);

            return (
              <SidebarItem
                key={label + idx}
                onClick={(e) => {
                  handleRipple(e);
                  originalOnClick();
                }}
                $isopen={hovered}
                className={active ? "active" : ""}
              >
                <IconSlot>{icon}</IconSlot>
                <LabelSlot $isopen={hovered}>{label}</LabelSlot>
              </SidebarItem>
            );
          })}
        </div>
        <BottomOptions>
          <SidebarItem
            onClick={(e) => {
              handleRipple(e);
              cerrarSesion();
            }}
            $isopen={hovered}
          >
            <IconSlot><CiLogout /></IconSlot>
            <LabelSlot $isopen={hovered}>Cerrar sesión</LabelSlot>
          </SidebarItem>
        </BottomOptions>
      </ContentContainer>
      {modalConfig.visible && (
        <ModalOverlay
          content={modalConfig.content}
          position={modalConfig.position}
          onClose={() => setModalConfig({ ...modalConfig, visible: false })}
        />
      )}
    </SidebarContainer>
  );
}

// Estilos

const rippleAnimation = keyframes`
  to {
    transform: scale(4);
    opacity: 0;
  }
`;

const SidebarContainer = styled.div`
  color: ${(props) => props.theme.text};
  background: ${(props) => props.theme.bg};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  border-right: 1px solid ${(props) => props.theme.bg4};
  z-index: 100;
  height: calc(100vh - 47px);
  width: 47px;
  position: sticky;
  left: 0;
  padding: 4px 4px;
  top: 47;
  bottom: 0;
  transition: width 0.2s cubic-bezier(0.86, 0, 0.07, 1);
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 0 0 18px 0 rgba(0,0,0,0.04);

  &.active {
    width: 207px;
    box-shadow: 2px 0 14px 0 rgba(0,0,0,0.10);
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1 1 auto;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
  > div, > ${'' /* BottomOptions */} {
    width: 100%;
  }
`;

const SidebarItem = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  height: 32px;
  background: transparent;
  width: 100%;
  cursor: pointer;
  border-radius: 6px;
  margin: 5px 0;
  padding-left: 0;
  
  // <--- CAMBIO: Color gris por defecto para el contenido (ícono y texto)
  color: #8A8A8E; 
  // <--- CAMBIO: Añadir 'color' a la transición para un cambio suave
  transition: background 0.14s, color 0.14s;

  // Estilos de hover y active
  &:hover, &.active {
    background: ${(props) => props.theme.bgAlpha};
    box-shadow: 0 0 0 4px transparent;
    // <--- CAMBIO: Color blanco cuando está activo o en hover
    color: #FFFFFF; 

    &::before {
      content: '';
      display: block;
      width: 8px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background: transparent;
    }
  }

  // Estilos para el elemento SPAN del ripple
  .ripple-effect {
    position: absolute;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.4);
    transform: scale(0);
    animation: ${rippleAnimation} 0.6s linear;
    pointer-events: none;
    z-index: 1;
  }
`;

const IconSlot = styled.div`
  width: 47px;
  min-width: 47px;
  max-width: 47px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  left: -4px;
  z-index: 2;

  svg {
    font-size: 20px;
    display: block;
  }
`;

const LabelSlot = styled.span`
  display: flex;
  align-items: center;
  height: 38px;
  white-space: nowrap;
  overflow: hidden;
  // El color se hereda del padre (SidebarItem), por lo que no necesita cambios aquí.
  color: inherit; 
  font-size: 12px;
  opacity: ${({ $isopen }) => ($isopen ? 1 : 0)};
  width: ${({ $isopen }) => ($isopen ? "140px" : "0px")};
  transition: width 0.18s cubic-bezier(.5,.3,.6,1.2), opacity 0.13s cubic-bezier(.8,.4,.6,1.2);
  pointer-events: none;
  margin-left: 0;
  z-index: 2;
`;

const BottomOptions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
`;