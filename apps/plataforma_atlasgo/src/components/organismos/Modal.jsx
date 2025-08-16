import React from 'react';
import styled from 'styled-components';

export function ModalComponent({ closeModal }) {
  return (
    <Modal>
      <ModalContent>
        <CloseButton onClick={closeModal}>X</CloseButton>
        <p>Contenido del modal aquí</p>
      </ModalContent>
    </Modal>
  );
}

const Modal = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  width: 90%;
  max-width: 2000;
  margin: 40px; /* Add margin */
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

export default ModalComponent;