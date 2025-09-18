import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
// 1. Se cambian los íconos a sus versiones 'outline' de Ant Design y Ionicons
import {
  AiOutlineSetting,
  AiOutlineCar,
  AiOutlineBell,
  AiOutlineBarChart,
  AiOutlinePushpin,
  AiOutlineTeam,
  AiOutlineLogout,
} from 'react-icons/ai'

import { IoShapesOutline } from "react-icons/io5";
import { logout } from '../../../store/thunks/authThunks'
import { useNavigate, useLocation } from 'react-router-dom'
import { ModalOverlay } from '../ModelScreenConfig/ModalOverlay'
import { useDispatch } from 'react-redux'
import { useModal } from '../../../hooks/useModal';
import {UserControlComponent} from "../ContentModals/UserControl.jsx";

// 2. Se actualizan los arrays con los nuevos íconos
const topMenuItems = [
  { icon: <AiOutlineSetting />, label: 'Configuracion Usuarios', to: '/configuration-user' },
  { icon: <AiOutlineCar />, label: 'Configuracion Dispositivo', to: '/device-config' },
  { icon: <AiOutlineBell />, label: 'Configuracion Notificaciones', to: '/notifications-config' },
]

const mainMenuItems = [
  { icon: <AiOutlineBarChart />, label: 'Reportes', to: '/reports' },
  { icon: <AiOutlinePushpin />, label: 'Puntos de Interes', to: '/pdi' },
  { icon: <IoShapesOutline />, label: 'Geocercas', to: '/geocercas' },
  { icon: <AiOutlineTeam />, label: 'Cuentas Espejo', to: '/mirror-accounts' },
]

export function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { openModal } = useModal();

  const isActive = (route) => location.pathname.startsWith(route)
  // const handleNavigate = (route) => navigate(route)

  const [modalConfig, setModalConfig] = useState({
    visible: false,
    content: '',
    position: { top: 0, left: 0 },
  })

  const cerrarSesion = () => {
    dispatch(logout())
    navigate('/login')
  }

  const [hovered, setHovered] = useState(false) // Inicia cerrado

  const handleNavigate = (route) => {
    console.log('Intentando navegar a:', route);
    switch(route) {
      case '/configuration-user':
        console.log('Abriendo modal de Configuracion Usuarios');
        openModal(
          <UserControlComponent initialView="table" />,
          'Configuracion Usuarios',
          'large'
        );
        break;
        default:
          console.log('Navegando a:', route);
      }
  }

  const handleRipple = (e) => {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const ripple = document.createElement('span')
    const size = Math.max(rect.width, rect.height)
    ripple.style.width = ripple.style.height = `${size}px`
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`
    ripple.classList.add('ripple-effect')
    button.appendChild(ripple)
    setTimeout(() => {
      ripple.remove()
    }, 600)
  }

  const renderSidebarItem = (item, idx) => {
    const { icon, label, to } = item
    const active = isActive(to)

    return (
      <SidebarItem
        key={label + idx}
        onClick={(e) => {
          handleRipple(e)
          handleNavigate(to) // NAVEGACIÓN REACTIVADA
        }}
        $isopen={hovered}
        className={active ? 'active' : ''}
      >
        <IconSlot>{icon}</IconSlot>
        <LabelSlot $isopen={hovered}>{label}</LabelSlot>
      </SidebarItem>
    )
  }

  return (
    <SidebarContainer
      $isopen={hovered}
      className={hovered ? 'active' : ''}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ContentContainer>
        <div>
          {topMenuItems.map(renderSidebarItem)}
          <Divider $isopen={hovered} />
          {mainMenuItems.map(renderSidebarItem)}
        </div>

        <BottomOptions>
          <SidebarItem
            onClick={(e) => {
              handleRipple(e)
              cerrarSesion()
            }}
            $isopen={hovered}
          >
            <IconSlot>
              <AiOutlineLogout />
            </IconSlot>
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
  )
}

// Styled Components

// ===============================================================
// CAMBIO PRINCIPAL: Se ajusta el 'margin' del Divider
// ===============================================================
const Divider = styled.div`
  height: 1.5px;
  background: #242424;
  
  /* Se elimina 'auto' y se define un margen izquierdo para anclarlo */
  margin: 10px 0 10px 10px;
  
  /* La animación de ancho ahora expandirá desde la izquierda */
  width: ${({ $isopen }) => ($isopen ? 'calc(100% - 24px)' : '50%')};
  transition: width 0.1s ease-in-out;
`

const rippleAnimation = keyframes`
  to {
    transform: scale(4);
    opacity: 0;
  }
`

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
  top: 47px;
  bottom: 0;
  transition: width 0.1s cubic-bezier(0.86, 0, 0.07, 1);
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.04);

  &.active {
    width: 250px;
    box-shadow: 2px 0 14px 0 rgba(0, 0, 0, 0.1);
  }
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1 1 auto;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
  > div {
    width: 100%;
  }
`

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

  color: #8a8a8e;
  transition: background 0.1s, color 0.14s;

  &:hover,
  &.active {
    background: ${(props) => props.theme.bgAlpha};
    color: #ffffff;
  }

  .ripple-effect {
    position: absolute;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.4);
    transform: scale(0);
    animation: ${rippleAnimation} 0.6s linear;
    pointer-events: none;
    z-index: 1;
  }
`

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
`

const LabelSlot = styled.span`
  display: flex;
  align-items: center;
  height: 38px;
  white-space: nowrap;
  overflow: hidden;
  color: inherit;
  font-size: 12px;
  opacity: ${({ $isopen }) => ($isopen ? 1 : 0)};
  width: ${({ $isopen }) => ($isopen ? '180px' : '0px')};
  transition: width 0.1s cubic-bezier(0.5, 0.3, 0.6, 1.2),
    opacity 0.13s cubic-bezier(0.8, 0.4, 0.6, 1.2);
  pointer-events: none;
  margin-left: 0;
  z-index: 2;
`

const BottomOptions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`