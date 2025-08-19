import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { IoClose } from "react-icons/io5";


// --- Mapeo de tamaños del modal por título ---
const modalSizes = {
    'Control de Usuarios': { maxWidth: '1000px', height: '80%' },
    'Configuración del Dispositivo': { maxWidth: '70%', height: '90%' },
    'Configuración de Notificaciones': { maxWidth: '65%', height: '95%' },
    // Añade más títulos y tamaños según tus necesidades
};

export function ReusableModal({ isOpen, onClose, title, children }) {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 300); 
    };

    if (!isOpen) {
        return null;
    }

    return (
        <ModalBackdrop $isClosing={isClosing} onClick={handleClose}>
            {/* Se pasa el título como prop para que el ModalWrapper pueda ajustar su tamaño */}
            <ModalWrapper $isClosing={isClosing} onClick={(e) => e.stopPropagation()} modalTitle={title}>
                <ModalHeader>
                    <ModalTitle>{title}</ModalTitle>
                    <CloseButton onClick={handleClose}>
                        <IoClose />
                    </CloseButton>
                </ModalHeader>
                <ModalBody>
                    {children}
                </ModalBody>
            </ModalWrapper>
        </ModalBackdrop>
    );
}

// --- Estilos para el Modal ---

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const fadeOut = keyframes`from { opacity: 1; } to { opacity: 0; }`;

const ModalBackdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 2000;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: ${props => props.$isClosing ? fadeOut : fadeIn} 0.3s ease-out forwards;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
`;

const ModalWrapper = styled.div`
    background: #ffffff;
    color: #333;
    border-radius: 8px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    width: 90%;
    max-width: 1000px;
    display: flex;
    flex-direction: column;
    animation: ${props => props.$isClosing ? fadeOut : fadeIn} 0.3s ease-out forwards;
    
    /* Estilos por defecto */
    height: 80%; 

    /* Lógica condicional para ajustar el tamaño según el título */
    ${props => {
        const size = modalSizes[props.modalTitle];
        if (size) {
            return `
                max-width: ${size.maxWidth};
                height: ${size.height};
            `;
        }
        return '';
    }}
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #f0f0f0;
`;

const ModalTitle = styled.h3`
    margin: 0;
    font-size: 15px;
    font-weight: 500;
`;

const CloseButton = styled.button`
    background: transparent;
    border: none;
    color: #888;
    font-size: 20px;
    cursor: pointer;
    transition: color 0.2s ease;
    &:hover { color: #000; }
`;

const ModalBody = styled.div`
    padding: 15px;
    overflow-y: auto; 
    flex-grow: 1; 
    min-height: 0; 
`;