import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { IoClose } from "react-icons/io5";

const sizeConfig = {
    small: {
        width: '90vw',
        maxWidth: '500px',
        height: 'auto',
        maxHeight: '80vh',
    },
    medium: {
        width: '90vw',
        maxWidth: '800px',
        height: '80vh',
        maxHeight: '700px',
    },
    large: {
        width: '95vw',
        maxWidth: '1200px',
        height: '90vh',
        maxHeight: '900px',
    },
    extraLarge: {
        width: '96vw',
        maxWidth: '1300px',
        height: '92vh',
        maxHeight: '1000px',
    },
    full: {
        width: '100vw',
        maxWidth: '100%',
        height: '100vh',
        maxHeight: '100%',
    },
};

export function ReusableModal({ isOpen, onClose, title, children, size = 'medium' }) {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 300); 
    };

    if (!isOpen && !isClosing) {
        return null;
    }

    return (
        <ModalBackdrop $isClosing={isClosing} onClick={handleClose}>
            <ModalWrapper $isClosing={isClosing} onClick={(e) => e.stopPropagation()} size={size}>
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

// --- CAMBIO: NUEVAS ANIMACIONES DE ESCALA Y DESVANECIMIENTO ---

// Animación para el fondo (solo desvanecimiento, sin cambios)
const fadeInBackdrop = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const fadeOutBackdrop = keyframes`from { opacity: 1; } to { opacity: 0; }`;

// Animación para el modal (crece desde adentro)
const scaleIn = keyframes`
    from { 
        opacity: 0; 
        transform: scale(0.95); 
    } 
    to { 
        opacity: 1; 
        transform: scale(1); 
    }
`;

// Animación para el modal (se desvanece hacia el centro)
const scaleOut = keyframes`
    from { 
        opacity: 1; 
        transform: scale(1); 
    } 
    to { 
        opacity: 0; 
        transform: scale(0.95); 
    }
`;

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
    animation: ${props => props.$isClosing ? fadeOutBackdrop : fadeInBackdrop} 0.3s ease-out forwards;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
`;

const ModalWrapper = styled.div`
    background: #ffffff;
    color: #333;
    border-radius: 12px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    display: flex;
    flex-direction: column;
    
    // Aplica la nueva animación de escala
    animation: ${props => props.$isClosing ? scaleOut : scaleIn} 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    
    ${({ size }) => {
        const styles = sizeConfig[size];
        if (styles) {
            return `
                width: ${styles.width};
                max-width: ${styles.maxWidth};
                height: ${styles.height};
                max-height: ${styles.maxHeight};
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
    flex-shrink: 0;
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
    padding: 20px;
    overflow-y: auto; 
    flex-grow: 1; 
    min-height: 0;
`;