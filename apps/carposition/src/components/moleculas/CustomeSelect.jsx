// Todo el código sigue igual excepto la parte donde mapeas las opciones en el modal y la lógica en selectOption.
// Aquí está el componente completo con la opción "Todos":

import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { MdExpandMore, MdCheck, MdClose } from "react-icons/md";
import { RiErrorWarningLine } from "react-icons/ri";

const CustomSelect = ({
    size,
    options,
    selectedOption,
    setSelectedOption,
    placeholder,
    hasError = false,
    setHasError,
    withSearch = false,
    multiSelect = false,
}) => {
    const [activeModal, setActiveModal] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const toggleModal = () => setActiveModal(!activeModal);

    const isSelected = (option) => {
        if (!multiSelect) {
            return selectedOption === option ||
                (typeof option === 'object' && typeof selectedOption === 'object' && option.value === selectedOption.value);
        }
        if (Array.isArray(selectedOption)) {
            return selectedOption.some(sel =>
                (typeof option === 'object' && typeof sel === 'object' && option.value === sel.value) ||
                option === sel
            );
        }
        return false;
    };

    const areAllSelected = () => {
        return Array.isArray(selectedOption) && selectedOption.length === options.length;
    };

    const selectOption = (option) => {
        if (multiSelect) {
            if (option === "__all__") {
                if (areAllSelected()) {
                    setSelectedOption([]);
                } else {
                    setSelectedOption([...options]);
                }
                return;
            }

            let newSelection = Array.isArray(selectedOption) ? [...selectedOption] : [];
            if (isSelected(option)) {
                newSelection = newSelection.filter(sel =>
                    (typeof option === 'object' && typeof sel === 'object' && option.value !== sel.value) ||
                    option !== sel
                );
            } else {
                newSelection.push(option);
            }
            setSelectedOption(newSelection);
            if (setHasError) setHasError(false);
        } else {
            setSelectedOption(option);
            setActiveModal(false);
            setSearchValue("");
            if (setHasError) setHasError(false);
        }
    };

    const removeSelected = (optionToRemove) => {
        if (!multiSelect || !Array.isArray(selectedOption)) return;
        setSelectedOption(
            selectedOption.filter(sel =>
                (typeof optionToRemove === 'object' && typeof sel === 'object' && optionToRemove.value !== sel.value) ||
                optionToRemove !== sel
            )
        );
    };

    const clearAllSelected = (e) => {
        e.stopPropagation();
        setSelectedOption([]);
        if (setHasError) setHasError(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".custom-modal") && !event.target.closest(".select")) {
                setActiveModal(false);
                setSearchValue("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getSelectedLabel = () => {
        if (!selectedOption) return "";
        if (multiSelect && Array.isArray(selectedOption)) {
            if (selectedOption.length === 0) return "";
            return selectedOption.map(opt =>
                typeof opt === "string" ? opt : opt.label
            ).join(", ");
        }
        if (typeof selectedOption === 'string') return selectedOption;
        return selectedOption.label || "";
    };

    const filteredOptions = !withSearch || !searchValue
        ? options
        : options.filter(option => {
            const label = typeof option === 'string' ? option : option.label;
            return label?.toLowerCase().includes(searchValue.toLowerCase());
        });

    return (
        <SelectWrapper size={size}>
            <SelectWrapperInner>
                <Placeholder $isActive={multiSelect ? (selectedOption && selectedOption.length > 0) || activeModal : !!getSelectedLabel() || activeModal}>
                    {placeholder}
                </Placeholder>
                <Select className="select" onClick={toggleModal} $hasError={hasError}>
                    {multiSelect ? (
                        <ChipsWrapper onClick={e => { e.stopPropagation(); }}>
                            {Array.isArray(selectedOption) && selectedOption.length > 0 ? (
                                <>
                                    {selectedOption.length === options.length ? (
                                        <Chip>
                                            Todos
                                            <ChipRemove
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    clearAllSelected(e);
                                                }}
                                            >
                                                <MdClose size={16} />
                                            </ChipRemove>
                                        </Chip>
                                    ) : (
                                        selectedOption.map((opt, idx) => (
                                            <Chip key={idx}>
                                                {typeof opt === "string" ? opt : opt.label}
                                                <ChipRemove
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        removeSelected(opt);
                                                    }}
                                                >
                                                    <MdClose size={16} />
                                                </ChipRemove>
                                            </Chip>
                                        ))
                                    )}
                                </>
                            ) : (
                                <span style={{ color: "#696969" }}></span>
                            )}
                        </ChipsWrapper>
                    ) : (
                        getSelectedLabel() || ""
                    )}
                    <MdExpandMore style={{ fontSize: "20px" }} />
                    {hasError ? (
                        <RiErrorWarningLine style={{ fontSize: "20px", color: "red" }} />
                    ) : null}
                </Select>
            </SelectWrapperInner>

            {activeModal && (
                <Modal className="custom-modal">
                    {withSearch && (
                        <SearchInput
                            type="text"
                            autoFocus
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                            placeholder="Buscar..."
                        />
                    )}
                    <OptionsScroll>
                        {multiSelect && (
                            <ModalOption
                                onClick={() => selectOption("__all__")}
                                $selected={areAllSelected()}
                            >
                                Todos
                                {areAllSelected() && (
                                    <CheckMark>
                                        <MdCheck />
                                    </CheckMark>
                                )}
                            </ModalOption>
                        )}
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <ModalOption
                                    key={index}
                                    onClick={() => selectOption(option)}
                                    $selected={isSelected(option)}
                                >
                                    {typeof option === 'string' ? option : option.label}
                                    {isSelected(option) && (
                                        <CheckMark>
                                            <MdCheck />
                                        </CheckMark>
                                    )}
                                </ModalOption>
                            ))
                        ) : (
                            <ModalOption disabled style={{ color: "#888" }}>
                                Sin resultados
                            </ModalOption>
                        )}
                    </OptionsScroll>
                </Modal>
            )}
        </SelectWrapper>
    );
};

// 🔽 styled components siguen igual aquí abajo (puedes usar los que ya tenías en tu archivo)

// === Styled components ===

const SelectWrapper = styled.div`
    position: relative;
    width: ${({ size }) =>
        size === "small" ? "190px" : size === "medium" ? "300px" : "100%"};
`;

const SelectWrapperInner = styled.div`
    position: relative;
    height: 50px;
`;

const Select = styled.div`
    height: 100%;
    background: #202020;
    display: flex;
    user-select: none;
    justify-content: space-between;
    align-items: center;
    color: white;
    border-radius: 8px;
    border: 1px solid ${({ $hasError }) => ($hasError ? "red" : "#696969")};
    padding: 10px;
    font-size: 13px;
    cursor: pointer;
    flex-wrap: wrap;
    gap: 8px;

    &:hover {
        border-color: #ffffff;
    }
`;

const ChipsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    align-items: center;
    min-height: 22px;
`;

const Chip = styled.div`
    display: flex;
    align-items: center;
    background: #444;
    color: #fff;
    border-radius: 12px;
    padding: 2px 8px 2px 10px;
    font-size: 12px;
    margin-right: 4px;
    margin-bottom: 2px;
    white-space: nowrap;
`;

const ChipRemove = styled.span`
    display: flex;
    align-items: center;
    margin-left: 6px;
    cursor: pointer;
    &:hover {
        color: #ff6161;
    }
`;

const ClearAllBtn = styled.span`
    display: flex;
    align-items: center;
    margin-left: 8px;
    color: #a9a9a9;
    cursor: pointer;
    &:hover {
        color: #ff6161;
    }
`;

const Placeholder = styled.span`
    position: absolute;
    left: 12px;
    top: ${({ $isActive }) => ($isActive ? "-10px" : "50%")};
    transform: translateY(${({ $isActive }) => ($isActive ? "0" : "-50%")});
    font-size: ${({ $isActive }) => ($isActive ? "11px" : "13px")};
    font-weight: ${({ $isActive }) => ($isActive ? "bold" : "normal")};
    color: ${({ $isActive }) => ($isActive ? "#a9a9a9" : "#696969")};
    transition: all 0.3s ease;
    background-color: #202020;
    padding: ${({ $isActive }) => ($isActive ? "0 5px" : "0")};
`;

const slideFadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const Modal = styled.div`
    position: absolute;
    top: 110%;
    left: 0;
    background: #191919;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10;
    width: 100%;
    padding: 10px 0 0 0;
    animation: ${slideFadeIn} 0.2s ease-out;
`;

const OptionsScroll = styled.div`
    max-height: 200px;
    overflow-y: auto;
    padding: 0 0 10px 0;
`;

const SearchInput = styled.input`
    width: 95%;
    height: 50px;
    padding: 7px 10px;
    border-radius: 7px;
    border: 1px solid #696969;
    font-size: 13px;
    outline: none;
    background: transparent;
    color: white;
    box-sizing: border-box;
    margin: 0 auto;
    display: block;

    &::placeholder {
        color: #888;
    }
`;

const ModalOption = styled.div`
    margin: 5px 10px;
    padding: 8px 15px;
    border-radius: 8px;
    color: white;
    cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
    user-select: none;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: ${({ $selected }) => ($selected ? "#222" : "none")};

    &:hover {
        background: ${({ disabled }) => (disabled ? "none" : "#444")};
    }
`;

const CheckMark = styled.span`
    margin-left: 8px;
    color: #00d26a;
    font-size: 16px;
    display: flex;
    align-items: center;
`;

export default CustomSelect;