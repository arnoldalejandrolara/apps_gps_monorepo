import React from 'react';
import styled from 'styled-components';
import { IoMdClose } from 'react-icons/io';

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const ModalContent = styled.div`
  background: #2E2E2E;
  color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  position: relative;
  width: 90%;
  max-width: 500px;
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-20px)'};
  transition: transform 0.3s ease;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #aaa;
  font-size: 24px;
  
  &:hover {
    color: #fff;
  }
`;

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  // Cierra el modal si se hace clic en el fondo
  const handleBackdropClick = () => {
    onClose();
  };

  // Evita que el clic en el contenido cierre el modal
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <ModalWrapper isOpen={isOpen} onClick={handleBackdropClick}>
      <ModalContent isOpen={isOpen} onClick={handleContentClick}>
        <CloseButton onClick={onClose}><IoMdClose /></CloseButton>
        {title && <h2>{title}</h2>}
        {children}
      </ModalContent>
    </ModalWrapper>
  );
};