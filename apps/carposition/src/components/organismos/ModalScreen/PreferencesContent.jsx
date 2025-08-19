import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import expandIcon from '../../../assets/expand-right.svg';

const PreferencesContent = () => {
  const [isAppearanceMenuOpen, setAppearanceMenuOpen] = useState(false);
  const [isStartupMenuOpen, setStartupMenuOpen] = useState(false);
  const [appearance, setAppearance] = useState('Oscuro');
  const [startupOption, setStartupOption] = useState('Inicio');

  const appearanceMenuRef = useRef(null);
  const startupMenuRef = useRef(null);

  const toggleAppearanceMenu = () => {
    setAppearanceMenuOpen(!isAppearanceMenuOpen);
    setStartupMenuOpen(false); // Close other menu if open
  };

  const toggleStartupMenu = () => {
    setStartupMenuOpen(!isStartupMenuOpen);
    setAppearanceMenuOpen(false); // Close other menu if open
  };

  const handleAppearanceSelect = (option) => {
    setAppearance(option);
    setAppearanceMenuOpen(false);
  };

  const handleStartupSelect = (option) => {
    setStartupOption(option);
    setStartupMenuOpen(false);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        appearanceMenuRef.current &&
        !appearanceMenuRef.current.contains(event.target) &&
        startupMenuRef.current &&
        !startupMenuRef.current.contains(event.target)
      ) {
        setAppearanceMenuOpen(false);
        setStartupMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Container>
      <Section>
        <Title>Mis preferencias</Title>
        <HorizontalLine />
        <SecurityItem>
          <SecurityLabelContainer>
            <SecurityLabel>Apariencia</SecurityLabel>
            <SecurityValue>Personaliza la apariencia de Notion en tu dispositivo.</SecurityValue>
          </SecurityLabelContainer>
          <DropdownContainer ref={appearanceMenuRef}>
            <ButtonWithIcon onClick={toggleAppearanceMenu}>
              {appearance}
              <Icon src={expandIcon} alt="Expand icon" />
            </ButtonWithIcon>
            {isAppearanceMenuOpen && (
              <DropdownMenu>
                <DropdownItem onClick={() => handleAppearanceSelect('Oscuro')}>Oscuro</DropdownItem>
                <DropdownItem onClick={() => handleAppearanceSelect('Claro')}>Claro</DropdownItem>
              </DropdownMenu>
            )}
          </DropdownContainer>
        </SecurityItem>

        {/* <SecurityItem>
          <SecurityLabelContainer>
            <SecurityLabel>Abrir al inicio</SecurityLabel>
            <SecurityValue>Elige qué mostrar cuando Notion se inicie o al cambiar de espacio de trabajo.</SecurityValue>
          </SecurityLabelContainer>
          <DropdownContainer ref={startupMenuRef}>
            <ButtonWithIcon onClick={toggleStartupMenu}>
              {startupOption}
              <Icon src={expandIcon} alt="Expand icon" />
            </ButtonWithIcon>
            {isStartupMenuOpen && (
              <DropdownMenu>
                <DropdownItem onClick={() => handleStartupSelect('Inicio')}>Inicio</DropdownItem>
                <DropdownItem onClick={() => handleStartupSelect('Tablero')}>Tablero</DropdownItem>
              </DropdownMenu>
            )}
          </DropdownContainer>
        </SecurityItem> */}
      </Section>
    </Container>
  );
};

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  color: white;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

const Section = styled.div`
  margin-bottom: 40px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
  width: 100%;
  text-align: left;
`;

const HorizontalLine = styled.hr`
  width: 100%;
  border: 1px solid #333333;
  margin-bottom: 10px;
`;

const SecurityItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
`;

const SecurityLabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

const SecurityLabel = styled.div`
  font-size: 14px;
  color: white;
`;

const SecurityValue = styled.div`
  font-size: 13px;
  color: grey;
`;

const ButtonWithIcon = styled.button`
  font-size: 13px;
  color: white;
  background: none;
  border: 1px solid grey;
  border-radius: 8px;
  padding: 8px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px; /* Space between text and icon */
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Icon = styled.img`
  width: 12px;
  height: 12px;
`;

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: #1e1e1e;
  border: 1px solid black;
  border-radius: 8px;
  margin-top: 5px;
  z-index: 10;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.2s ease-out;
`;

const DropdownItem = styled.div`
  padding: 12px 16px;
  font-size: 13px;
  color: white;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export default PreferencesContent;