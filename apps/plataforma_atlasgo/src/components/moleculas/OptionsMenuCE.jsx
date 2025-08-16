import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { MdModeEditOutline, MdDelete } from 'react-icons/md';
import { FaInfo } from 'react-icons/fa6';
import { FaPaperPlane } from 'react-icons/fa';

// 🔁 Control global para cerrar otros menús
let closeLastMenu = null;

export function OptionsMenuCE({ row, onEdit, onSend }) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isReady, setReady] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const toggleMenu = (e) => {
    e.stopPropagation();
    if (isMenuOpen) {
      setMenuOpen(false);
      setReady(false);
    } else {
      if (closeLastMenu) closeLastMenu();
      setMenuOpen(true);
      closeLastMenu = () => {
        setMenuOpen(false);
        setReady(false);
      };
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    console.log("handleEdit called");
    if (typeof onEdit === 'function') {
      onEdit();
    }
    setMenuOpen(false);
    setReady(false);
  };

  const handleSend = (e) => {
    e.stopPropagation();
    if (typeof onSend === 'function') {
      onSend();
    }
    setMenuOpen(false);
    setReady(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && 
          buttonRef.current && 
          !buttonRef.current.contains(e.target) &&
          menuRef.current &&
          !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
        setReady(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + (-70),
        left: rect.left + window.scrollX - 130,
      });
      setReady(true);
    }
  }, [isMenuOpen]);

  return (
    <>
      <OptionsWrapper ref={buttonRef} onClick={toggleMenu}>
        <ThreeDots>⋮</ThreeDots>
      </OptionsWrapper>

      {isMenuOpen && isReady &&
        createPortal(
          <FloatingMenu ref={menuRef} style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}>
            <MenuList>
              <MenuItem onClick={handleEdit}>
                <MdModeEditOutline style={{ marginRight: '5px' }} /> Editar
              </MenuItem>
              <MenuItem onClick={handleSend}>
                <FaPaperPlane style={{ marginRight: '5px' }} /> Enviar
              </MenuItem>
              {/* <MenuItem className="delete">
                <MdDelete style={{ marginRight: '5px' }} /> Eliminar
              </MenuItem> */}
            </MenuList>
          </FloatingMenu>,
          document.body
        )}
    </>
  );
}


const OptionsWrapper = styled.div`
  position: relative;
  cursor: pointer;
  display: inline-block;
  padding: 0px 15px;
  border-radius: 50%;

  &:hover {
    background: #444;
  }
`;

const ThreeDots = styled.div`
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
`;

const FloatingMenu = styled.div`
  position: absolute;
  background: #2a2a2a;
  color: #fff;
  border: 1px solid #444;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  padding: 5px;
  z-index: 9999;
  min-width: 140px;
`;

const MenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const MenuItem = styled.li`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 13px;
  border-radius: 8px;

  &:hover {
    background: #444;
  }

  &.delete {
    color: #FF5530;
  }
`;