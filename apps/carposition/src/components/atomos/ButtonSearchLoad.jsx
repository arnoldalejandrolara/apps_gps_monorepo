import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FaSearch, FaTimes } from 'react-icons/fa';

// Animación de llenado de la barra de progreso
const fillAnimation = keyframes`
    from {
        transform: scaleX(0);
    }
    to {
        transform: scaleX(1);
    }
`;

// Contenedor principal que une ambos botones
const ButtonContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
`;

// Estilos del botón base de búsqueda
const SearchButton = styled.button`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 18px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    height: 50px;
    /* Eliminamos el min-width para que el ancho se ajuste al contenido */
    overflow: hidden;
    background-color: #007BFF;
    color: white;

    &:hover:not(:disabled) {
        background-color: #0056b3;
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }
`;

// Botón de cancelar (pequeño)
const CancelButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border: none;
    border-radius: 6px;
    background-color: #dc3545;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    height: 50px;
    width: 50px;
    font-size: 16px;

    &:hover {
        background-color: #c82333;
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.3);
    }
`;

// Contenedor del contenido (ícono y texto)
const ButtonContent = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    z-index: 2;
    
    ${props => props.$loading && css`
        min-width: 100px;
    `}
`;

// Barra de progreso
const ProgressBar = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    transform-origin: left;
    z-index: 1;
    pointer-events: none;

    ${props => props.$loading && css`
        transform: scaleX(0);
        animation: ${fillAnimation} 10s linear forwards;
    `}
`;

export function SearchButtonWithLoading({ 
    onClick, 
    loading, 
    onCancel, 
    children 
}) {
    return (
        <ButtonContainer>
            <SearchButton
                onClick={onClick}
                disabled={loading}
            >
                {loading && <ProgressBar $loading={loading} />}
                
                <ButtonContent $loading={loading}>
                    <FaSearch />
                    <span>{loading ? 'Buscando...' : children}</span>
                </ButtonContent>
            </SearchButton>

            {/* Botón de cancelar que solo aparece cuando está cargando */}
            {loading && (
                <CancelButton
                    onClick={onCancel}
                    title="Cancelar búsqueda"
                    aria-label="Cancelar búsqueda"
                >
                    <FaTimes />
                </CancelButton>
            )}
        </ButtonContainer>
    );
}