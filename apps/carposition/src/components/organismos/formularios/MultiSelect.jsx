import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaChevronDown, FaCheck, FaSearch, FaTimes } from 'react-icons/fa';

// --- El Componente MultiSelect Personalizado ---
export function MultiSelect({ label, options, value = [], onChange, showSearch = true, size = 'small' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
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

    const handleOptionClick = (optionId) => {
        const newValue = value.some(id => id == optionId)
            ? value.filter(id => id != optionId)
            : [...value, optionId];
        onChange(newValue);
        setSearchTerm('');
    };

    const handleTriggerClick = () => {
        setIsOpen(!isOpen);
        if (isOpen) {
            setSearchTerm('');
        }
    };

    const removeSelected = (optionId, e) => {
        e.stopPropagation();
        const newValue = value.filter(id => id != optionId);
        onChange(newValue);
    };

    const filteredOptions = options.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOptions = options.filter(opt => value.some(id => id == opt.id));
    const selectedLabels = selectedOptions.map(opt => opt.name);

    return (
        <SelectWrapper ref={selectRef}>
            {label && <SelectLabel>{label}</SelectLabel>}
            
            <SelectTrigger onClick={handleTriggerClick} $isOpen={isOpen} $size={size}>
                <SelectedItemsContainer>
                    {selectedOptions.length > 0 ? (
                        selectedOptions.map(option => (
                            <SelectedItem key={option.id}>
                                <span>{option.name}</span>
                                <RemoveButton onClick={(e) => removeSelected(option.id, e)}>
                                    <FaTimes />
                                </RemoveButton>
                            </SelectedItem>
                        ))
                    ) : (
                        <span style={{ color: '#999' }}>Seleccionar unidades...</span>
                    )}
                </SelectedItemsContainer>
                <ChevronIcon $isOpen={isOpen} />
            </SelectTrigger>

            {isOpen && (
                <OptionsContainer>
                    {/* Renderizado condicional del input de búsqueda */}
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
                            />
                        </SearchWrapper>
                    )}
                    <OptionsList>
                        {filteredOptions.map(option => (
                            <OptionItem 
                                key={option.id} 
                                onClick={() => handleOptionClick(option.id)}
                                $isSelected={value.some(id => id == option.id)}
                            >
                                <CheckIconWrapper>
                                    {value.some(id => id == option.id) && <FaCheck />}
                                </CheckIconWrapper>
                                {option.name}
                            </OptionItem>
                        ))}
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

const SelectTrigger = styled.button`
    width: 100%;
    min-height: ${({ $size }) => ($size === 'large' ? '50px' : '35px')};
    padding: ${({ $size }) => ($size === 'large' ? '12px' : '8px 12px')};
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    cursor: pointer;
    font-size: ${({ $size }) => ($size === 'large' ? '16px' : '13px')};
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

const SelectedItemsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    flex: 1;
    align-items: center;
`;

const SelectedItem = styled.div`
    display: flex;
    align-items: center;
    background-color: #007BFF;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    gap: 4px;
`;

const RemoveButton = styled.button`
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    font-size: 10px;
    
    &:hover {
        opacity: 0.8;
    }
`;

const ChevronIcon = styled(FaChevronDown)`
    transition: transform 0.3s ease;
    transform: ${props => (props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
    color: #888;
    margin-left: 8px;
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
    
    // Ocultar la barra de desplazamiento en navegadores basados en Webkit
    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #ddd;
        border-radius: 3px;
    }
    &::-webkit-scrollbar-track {
        background-color: transparent;
    }
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
    width: 24px;
    color: #007BFF;
`;
