import React from 'react';
import styled, { keyframes } from 'styled-components';

export function StatusLabel({ checking, available, message }) {
    if (checking) {
        return <CheckingLabel>Verificando...</CheckingLabel>;
    }

    if (available === null || !message) {
        return null;
    }

    return (
        <StatusLabelStyled $available={available}>
            {message}
        </StatusLabelStyled>
    );
}

// --- Estilos ---
const pulse = keyframes`
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
`;

const CheckingLabel = styled.span`
    display: block;
    margin-top: 5px;
    font-size: 11px;
    color: #6c757d;
    animation: ${pulse} 1.5s ease-in-out infinite;
`;

const StatusLabelStyled = styled.span`
    display: block;
    margin-top: 5px;
    font-size: 11px;
    font-weight: 500;
    color: ${({ $available }) => ($available ? '#28a745' : '#dc3545')};
    
    &::before {
        content: ${({ $available }) => ($available ? '"✓ "' : '"✗ "')};
        font-weight: bold;
    }
`;
