import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

export function ModalOverlay({ content , position, onClose }) {

  console.log("content", content);
  
  const handleOutsideClick = (event) => {
    if (event.target.id === "modal-overlay") {
      onClose();
    }
  };

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const handleCheckboxChange = (e) => setNotificationsEnabled(e.target.checked);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const options = ["Opción 1", "Opción 2", "Opción 3", "Opción 4"];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <Overlay id="modal-overlay" onClick={handleOutsideClick}>
      <Modal style={{ top: position.top, left: position.left }}>
        <Title>Configuración de {content}</Title>
        <Description>
          <Text>Activar {content} para visualizarlos en el mapa</Text>
          <SecurityCheckbox
            type="checkbox"
            checked={notificationsEnabled}
            onChange={handleCheckboxChange}
          />
        </Description>
        <Label>Tipo de {content}</Label>
        <DropdownContainer>
          <DropdownInput onClick={toggleDropdown}>
            {selectedOptions.length > 0
              ? selectedOptions.join(", ")
              : "Selecciona opciones"}
          </DropdownInput>
          {isDropdownOpen && (
            <DropdownMenu>
              {options.map((option) => (
                <DropdownOption
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  selected={selectedOptions.includes(option)}
                >
                  {option}
                </DropdownOption>
              ))}
            </DropdownMenu>
          )}
        </DropdownContainer>
      </Modal>
    </Overlay>
  );
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const SecurityCheckbox = styled.input`
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0); /* Fondo oscuro */
  z-index: 999;
`;

const Modal = styled.div`
  position: absolute;
  background: #272727;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #333333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  width: 350px;
  color: white;
  text-align: center;
  animation: ${fadeIn} 0.3s ease-out; /* Animación de entrada */
`;

const Title = styled.h2`
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #9b9b9b;
`;

const Description = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 20px;
`;

const Text = styled.span`
  text-align: left;
  font-size: 13px;
  color: #9b9b9b;
  margin-right: 12px;
  flex-grow: 1; /* Ocupa todo el espacio disponible en el contenedor */
`;

const Label = styled.label`
  display: block;
  margin-top: 15px;
  margin-bottom: 5px;
  text-align: left;
  font-size: 13px;
  color: #9b9b9b;
`;

const DropdownContainer = styled.div`
  margin-top: 15px;
  position: relative;
  width: 100%;
`;

const DropdownInput = styled.div`
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px solid gray;
  border-radius: 8px;
  color: white;
  font-size: 13px;
  cursor: pointer;
  text-align: left;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #272727;
  border: 1px solid gray;
  border-radius: 8px;
  margin-top: 5px;
  z-index: 1000;
`;

const DropdownOption = styled.div`
  padding: 10px;
  font-size: 13px;
  color: ${(props) => (props.selected ? "#272727" : "white")};
  background: ${(props) => (props.selected ? "#9b9b9b" : "transparent")};
  cursor: pointer;
  user-select: none;


  &:hover {
    background: rgba(255, 255, 255, 0.055);
  }
`;