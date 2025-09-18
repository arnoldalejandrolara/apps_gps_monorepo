import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaChevronDown, FaCheck, FaSearch } from 'react-icons/fa';

// --- El Componente Select Personalizado ---
export function SelectWithIcon({ label, options, value, onChange, showSearch = true, size = 'small' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const selectRef = useRef(null);

    // Efecto para cerrar el menú si se hace clic afuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleOptionClick = (optionId) => {
        onChange(optionId);
        setIsOpen(false);
        setSearchTerm('');
    };

    const filteredOptions = options.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- CAMBIO: Obtiene el objeto completo de la opción seleccionada ---
    const selectedOption = options.find(opt => opt.id === value);
    const selectedLabel = selectedOption?.name || value;
    const selectedIcon = selectedOption?.icon;

    return (
        <SelectWrapper ref={selectRef}>
            {label && <SelectLabel>{label}</SelectLabel>}
            
            <SelectTrigger onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen} $size={size}>
                {/* --- CAMBIO: Muestra el ícono seleccionado --- */}
                {selectedIcon && <SelectedIcon>{selectedIcon}</SelectedIcon>}
                <span>{selectedLabel}</span>
                <ChevronIcon $isOpen={isOpen} />
            </SelectTrigger>

            {isOpen && (
                <OptionsContainer>
                    {showSearch && (
                        <SearchWrapper>
                            <SearchIcon />
                            <SearchInput
                                type="text"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                $size={size}
                                autoFocus
                            />
                        </SearchWrapper>
                    )}
                    <OptionsList>
                        {filteredOptions.length > 0 ? filteredOptions.map(option => (
                            <OptionItem 
                                key={option.id} 
                                onClick={() => handleOptionClick(option.id)}
                                $isSelected={value === option.id}
                            >
                                <CheckIconWrapper>
                                    {value === option.id && <FaCheck />}
                                </CheckIconWrapper>
                                {/* --- CAMBIO: Muestra el ícono de cada opción --- */}
                                {option.icon && <OptionIcon>{option.icon}</OptionIcon>}
                                {option.name}
                            </OptionItem>
                        )) : (
                            <NoResults>No se encontraron resultados.</NoResults>
                        )}
                    </OptionsList>
                </OptionsContainer>
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

// --- CAMBIO: Añadido 'gap' para el espacio del ícono ---
const SelectTrigger = styled.button`
    width: 100%;
    height: ${({ $size }) => ($size === 'large' ? '50px' : '35px')};
    padding: 0 12px;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px; // Espacio entre el ícono y el texto
    cursor: pointer;
    font-size: ${({ $size }) => ($size === 'large' ? '16px' : '13px')};
    color: #333;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    text-align: left;

    span {
      flex-grow: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

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
    flex-shrink: 0;
`;

const OptionsContainer = styled.div`
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 8px;
    z-index: 10;
`;

const SearchWrapper = styled.div`
    position: relative;
    margin-bottom: 8px;
`;

const SearchIcon = styled(FaSearch)`
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
    color: #888;
    font-size: 12px;
`;

const SearchInput = styled.input`
    width: 100%;
    height: ${({ $size }) => ($size === 'large' ? '40px' : '35px')};
    padding: 0 10px 0 30px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s ease;
    
    &:focus {
        border-color: #007BFF;
    }
`;

const OptionsList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 200px;
    overflow-y: auto;
    
    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #ddd;
        border-radius: 3px;
    }
`;

// --- CAMBIO: Añadido 'gap' y alineación ---
const OptionItem = styled.li`
    padding: 10px 12px;
    display: flex;
    align-items: center;
    gap: 8px; // Espacio entre íconos y texto
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
    width: 24px;
    color: #007BFF;
    flex-shrink: 0;
`;

// --- NUEVOS ESTILOS PARA LOS ICONOS ---
const OptionIcon = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #6c757d;
    font-size: 16px;
`;

const SelectedIcon = styled(OptionIcon)`
    font-size: 14px;
    color: #333;
`;

const NoResults = styled.li`
    padding: 10px 12px;
    color: #888;
    font-style: italic;
    text-align: center;
`;