import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import styled, { css, keyframes } from 'styled-components';
import { MdModeEditOutline, MdDelete } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';

//--- HOOK PARA ESTADO Y LÓGICA DE APERTURA ---
let activeMenuCloser = null;
function usePopperMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    if (isOpen) {
      htmlElement.style.overflow = 'hidden';
      bodyElement.style.overflow = 'hidden';
    } else {
      htmlElement.style.overflow = '';
      bodyElement.style.overflow = '';
    }
    return () => {
      htmlElement.style.overflow = '';
      bodyElement.style.overflow = '';
    };
  }, [isOpen]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    activeMenuCloser = null;
  }, []);

  const openMenu = useCallback(() => {
    if (activeMenuCloser) activeMenuCloser();
    setIsOpen(true);
    activeMenuCloser = closeMenu;
  }, [closeMenu]);

  const toggle = useCallback((e) => {
    e.stopPropagation();
    isOpen ? closeMenu() : openMenu();
  }, [isOpen, openMenu, closeMenu]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
          anchorRef.current && !anchorRef.current.contains(event.target)) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeMenu]);

  return { isOpen, toggle, anchorRef, menuRef, closeMenu };
}

//--- HOOK DE POSICIONAMIENTO (ACTUALIZADO PARA PREFERIR IZQUIERDA) ---
function useMenuPositioner(anchorRef, menuRef, isOpen) {
  const [style, setStyle] = useState({});
  const [placement, setPlacement] = useState('left');

  useLayoutEffect(() => {
    if (isOpen && anchorRef.current && menuRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const { innerWidth, innerHeight } = window;
      const gap = 8;
      
      let currentPlacement = 'left';
      let left = anchorRect.left - menuRect.width - gap;
      
      // Si se sale por la izquierda, ábrelo a la derecha
      if (left < 0) {
        left = anchorRect.right + gap;
        currentPlacement = 'right';
      }

      // Centra verticalmente el menú con respecto al botón
      let top = anchorRect.top + (anchorRect.height / 2) - (menuRect.height / 2);

      // Evita que se salga por arriba o por abajo de la pantalla
      if (top < 0) {
        top = gap;
      } else if (top + menuRect.height > innerHeight) {
        top = innerHeight - menuRect.height - gap;
      }
      
      setStyle({
        top: `${top + window.scrollY}px`,
        left: `${left + window.scrollX}px`,
      });
      setPlacement(currentPlacement);
    }
  }, [isOpen, anchorRef, menuRef]);

  return { style, placement };
}

//--- ÍCONO SVG ---
const VerticalDotsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 7C13.1046 7 14 6.10457 14 5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5C10 6.10457 10.8954 7 12 7Z" fill="#888" />
    <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" fill="#888" />
    <path d="M12 21C13.1046 21 14 20.1046 14 19C14 17.8954 13.1046 17 12 17C10.8954 17 10 17.8954 10 19C10 20.1046 10.8954 21 12 21Z" fill="#888" />
  </svg>
);

//--- COMPONENTE PRINCIPAL ---
export function OptionsMenu({ actions = [] }) {
  const { isOpen, toggle, anchorRef, menuRef, closeMenu } = usePopperMenu();
  const { style, placement } = useMenuPositioner(anchorRef, menuRef, isOpen);

  if (!actions.length) return null;

  const handleActionClick = (e, onClick) => {
    e.stopPropagation();
    if (typeof onClick === 'function') onClick();
    closeMenu();
  };

  return (
    <>
      <MenuButton ref={anchorRef} onClick={toggle} aria-haspopup="true" aria-expanded={isOpen} aria-label="Abrir menú de opciones">
        <VerticalDotsIcon />
      </MenuButton>

      {isOpen && createPortal(
        <>
          <ModalBackdrop onClick={closeMenu} />
          <FloatingMenu ref={menuRef} style={style} placement={placement}>
            <MenuList role="menu">
              {actions.map((action, index) => (
                <MenuItem key={index} role="menuitem" className={action.className} onClick={(e) => handleActionClick(e, action.onClick)}>
                  {action.icon}
                  <span>{action.label}</span>
                </MenuItem>
              ))}
            </MenuList>
          </FloatingMenu>
        </>,
        document.body
      )}
    </>
  );
}

// --- ESTILOS (SIN CAMBIOS, SOLO SE APLICAN AHORA A 'LEFT' POR DEFECTO) ---
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const MenuButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease-in-out;
  &:hover, &:focus-visible {
    background-color: #f1f3f5;
    outline: none;
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0);
  z-index: 9999;
  animation: ${fadeIn} 0.2s ease-out;
`;

const FloatingMenu = styled.div`
  position: absolute;
  background: #fff;
  color: #333;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 6px;
  z-index: 10000;
  min-width: 150px;
  animation: ${fadeIn} 0.15s ease-out;
  transform-origin: ${props => props.placement === 'right' ? 'left center' : 'right center'};

  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    top: 50%;
    transform: translateY(-50%);
    
    ${props => props.placement === 'right' && css`
      left: -8px;
      border-width: 8px 8px 8px 0;
      border-color: transparent #fff transparent transparent;
    `}

    ${props => props.placement === 'left' && css`
      right: -8px;
      border-width: 8px 0 8px 8px;
      border-color: transparent transparent transparent #fff;
    `}
  }
`;

const MenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const MenuItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  transition: background-color 0.15s ease-in-out;
  color: #555;

  & svg {
    font-size: 18px;
    color: #888;
  }

  &:hover {
    background-color: #f1f3f5;
  }

  &.delete {
    color: #ff4d4f; 
    
    & svg {
      color: #ff4d4f;
    }
    
    &:hover {
      background-color: #fff1f0;
    }
  }
`;