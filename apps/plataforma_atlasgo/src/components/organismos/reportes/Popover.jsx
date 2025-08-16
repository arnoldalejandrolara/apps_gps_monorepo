// src/components/ui/Popover.jsx

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const PopoverWrapper = styled.div`
  position: fixed;
  background: #3a3a3a;
  color: #fff;
  border: 1px solid #555;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  padding: 16px;
  width: 250px;
`;

export const Popover = ({ isOpen, onClose, parentRef, children }) => {
  const popoverRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    // ✅ Se añade la comprobación "parentRef &&"
    if (isOpen && parentRef && parentRef.current) {
      const rect = parentRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
  }, [isOpen, parentRef]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // ✅ Se añade la comprobación "parentRef &&" también aquí
      if (
        isOpen &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        parentRef && 
        parentRef.current &&
        !parentRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, parentRef]);

  // Si no está abierto o no tiene una ref válida, no se muestra nada.
  if (!isOpen || !parentRef) {
    return null;
  }

  return (
    <PopoverWrapper ref={popoverRef} style={{ top: `${position.top}px`, left: `${position.left}px` }}>
      {children}
    </PopoverWrapper>
  );
};