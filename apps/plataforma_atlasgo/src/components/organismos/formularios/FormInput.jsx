import React from 'react';
import styled from 'styled-components';

// --- El componente de Input Personalizado ---
export function FormInput({ label, type, name, value, onChange, placeholder, required, statusComponent }) {
    
    const isValidEmail = (email) => {
        // Expresión regular para validar el formato de un correo electrónico
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const isPasswordValid = (password) => {
        // Valida que la contraseña tenga al menos 8 caracteres
        return password.length >= 8;
    };
    
    // Validar el campo basado en su tipo
    const isInvalid = (type === 'email' && value && !isValidEmail(value));
    const isInvalidPassword = (type === 'password' && value && !isPasswordValid(value));

    return (
        <FormGroup>
            {label && <Label>{label}</Label>}
            <Input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                $isInvalid={isInvalid || isInvalidPassword}
            />
            {isInvalid && <ValidationError>Por favor, ingresa un correo electrónico válido.</ValidationError>}
            {isInvalidPassword && <ValidationError>La contraseña debe tener al menos 8 caracteres.</ValidationError>}
            {statusComponent}
        </FormGroup>
    );
}

// --- Estilos ---
const FormGroup = styled.div`
    margin-bottom: 0;
    position: relative;
    width: 100%;
`;

const Label = styled.label`
    display: block; 
    margin-bottom: 8px; 
    font-size: 13px;
    font-weight: 500; 
    color: #495057;
`;

const Input = styled.input`
    width: 100%;
    height: 35px;
    padding: 10px; 
    border: 1px solid ${({ $isInvalid }) => ($isInvalid ? '#DC3545' : '#CED4DA')};
    border-radius: 6px; 
    font-size: 13px;
    transition: all 0.2s ease;
    
    &:focus { 
        outline: none; 
        border-color: ${({ $isInvalid }) => ($isInvalid ? '#DC3545' : '#007BFF')}; 
        box-shadow: 0 0 0 3px ${({ $isInvalid }) => ($isInvalid ? 'rgba(220, 53, 69, 0.15)' : 'rgba(0, 123, 255, 0.15)')};
    }
`;

const ValidationError = styled.span`
    display: block;
    margin-top: 5px;
    font-size: 11px;
    color: #DC3545;
`;