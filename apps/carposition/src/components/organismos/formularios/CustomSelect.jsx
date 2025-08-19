import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaChevronDown, FaCheck } from 'react-icons/fa';

// --- El Componente Select Personalizado ---
export function CustomSelect({ label, options, value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    // Efecto para cerrar el menú si se hace clic afuera o se presiona "Escape"
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleOptionClick = (optionValue) => {
        onChange(optionValue); // Llama a la función del padre para actualizar el estado
        setIsOpen(false);     // Cierra el menú
    };

    // Encuentra la etiqueta de la opción seleccionada para mostrarla en el botón
    const selectedLabel = options.find(opt => opt.value === value)?.label || 'Seleccionar...';

    return (
        <SelectWrapper ref={selectRef}>
            {label && <SelectLabel>{label}</SelectLabel>}
            
            <SelectTrigger onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
                <span>{selectedLabel}</span>
                <ChevronIcon $isOpen={isOpen} />
            </SelectTrigger>

            {isOpen && (
                <OptionsList>
                    {options.map(option => (
                        <OptionItem 
                            key={option.value} 
                            onClick={() => handleOptionClick(option.value)}
                            $isSelected={value === option.value}
                        >
                            <CheckIconWrapper>
                                {value === option.value && <FaCheck />}
                            </CheckIconWrapper>
                            {option.label}
                        </OptionItem>
                    ))}
                </OptionsList>
            )}
        </SelectWrapper>
    );
}

// --- Estilos con Styled-Components ---

const SelectWrapper = styled.div`
    position: relative;
    width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`;

const SelectLabel = styled.label`
    display: block;
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 500;
    color: #333;
`;

const SelectTrigger = styled.button`
    width: 100%;
    height: 35px;
    padding: 10px 12px;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-size: 13px;
    color: #333;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        border-color: #aaa;
    }

    &:focus, &:focus-visible {
        outline: none;
        border-color: #007BFF;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
    }
`;

const ChevronIcon = styled(FaChevronDown)`
    transition: transform 0.3s ease;
    transform: ${props => (props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
    color: #888;
`;

const OptionsList = styled.ul`
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    list-style: none;
    padding: 4px;
    margin: 0;
    z-index: 10;
    max-height: 200px;
    overflow-y: auto;
`;

const OptionItem = styled.li`
    padding: 10px 12px;
    display: flex;
    align-items: center;
    cursor: pointer;
    border-radius: 4px;
    font-size: 13px;
    color: ${props => (props.$isSelected ? '#000' : '#333')};
    font-weight: ${props => (props.$isSelected ? '500' : '400')};

    &:hover {
        background-color: #f0f0f0;
    }
`;

const CheckIconWrapper = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px; /* Ancho fijo para alinear el texto */
    color: #007BFF;
`;