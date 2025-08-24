import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaInfoCircle, FaWhatsapp, FaSms, FaEnvelope, FaCopy, FaCheck, FaChevronLeft } from 'react-icons/fa';
import { FormInput } from '../formularios/FormInput';

// --- Estilos ---
const ComponentWrapper = styled.div`
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #333;
    position: relative;
    /* La altura ahora es dinámica y tiene una transición suave */
    transition: height 0.4s ease-in-out; 
`;

const AnimatedView = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    /* La altura se ajustará al contenido, ya no es 100% */
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    padding: 10px;
    box-sizing: border-box;
    transition: transform 0.4s ease-in-out, opacity 0.3s ease-in-out;
    
    opacity: ${({ $isActive }) => ($isActive ? 1 : 0)};
    pointer-events: ${({ $isActive }) => ($isActive ? 'auto' : 'none')};
    
    transform: translateX(${({ $isActive, $initialPosition }) =>
        $isActive ? '0%' : ($initialPosition === 'right' ? '100%' : '-100%')
    });
`;

const InfoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #fffbe6;
  color: #664d03;
  border: 1px solid #ffe58f;
  border-radius: 8px;
  padding: 12px;
  font-size: 13px;
  margin-bottom: 24px;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 10px;
`;

const IconToggleButton = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  border: 2px solid ${({ $isSelected }) => $isSelected ? '#007bff' : '#e9ecef'};
  background-color: ${({ $isSelected }) => $isSelected ? '#e7f1ff' : '#f8f9fa'};
  color: ${({ $isSelected }) => $isSelected ? '#007bff' : '#495057'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-align: center;
  
  &:hover {
    border-color: #007bff;
    background-color: #e7f1ff;
  }
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  display: none;
`;

const IconWrapper = styled.div`
  font-size: 24px;
  margin-bottom: 8px;
  color: ${({ color }) => color};
`;

const IconLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const CopyContainer = styled.div`
  margin-top: 2px;
`;

const CopyLabel = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #495057;
  margin: 0 0 8px 0;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const LinkInput = styled.input`
  flex-grow: 1;
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8f9fa;
  &:focus {
    outline: none;
  }
`;

const CopyButton = styled.button`
  flex-shrink: 0;
  width: 45px;
  height: 45px;
  border: 1px solid ${({ $isCopied }) => $isCopied ? '#28a745' : '#007bff'};
  background-color: ${({ $isCopied }) => $isCopied ? '#28a745' : '#e7f1ff'};
  color: ${({ $isCopied }) => $isCopied ? '#ffffff' : '#007bff'};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  padding-top: 20px;
`;

const ActionButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 12px 28px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease, opacity 0.2s;

  &:hover {
    background-color: #218838;
  }
  
  &:disabled {
    background-color: #a3d9b1;
    cursor: not-allowed;
  }
`;

const DetailsHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;
    h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
    }
`;

const BackButton = styled.button`
    background: #f0f2f5;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
        background: #e9ecef;
    }
`;


// --- Componente Principal ---
export function ShareLocationModal({ onClose }) {
  const [view, setView] = useState('selection');
  const [selectedMethods, setSelectedMethods] = useState([]);
  const [contactInfo, setContactInfo] = useState({ phone: '', email: '' });
  const [copyStatus, setCopyStatus] = useState(false);

  // --- 1. Refs para medir la altura ---
  const wrapperRef = useRef(null);
  const selectionViewRef = useRef(null);
  const detailsViewRef = useRef(null);
  
  const shareLink = `http://maps.google.com/?q=19.432608,-99.133209`;

  // --- 2. useEffect para ajustar la altura del contenedor ---
  useEffect(() => {
    const setWrapperHeight = () => {
      if (wrapperRef.current) {
        const activeView = view === 'selection' ? selectionViewRef.current : detailsViewRef.current;
        if (activeView) {
          wrapperRef.current.style.height = `${activeView.scrollHeight}px`;
        }
      }
    };
    
    setWrapperHeight();
  }, [view, selectedMethods]);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedMethods(prev =>
      checked ? [...prev, value] : prev.filter(method => method !== value)
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000);
    });
  };

  const handleSend = () => {
    alert(`Enviando a ${selectedMethods.join(', ')} con la siguiente info: Teléfono - ${contactInfo.phone}, Email - ${contactInfo.email}`);
    onClose();
  };

  const showPhoneInput = selectedMethods.includes('whatsapp') || selectedMethods.includes('sms');
  const showEmailInput = selectedMethods.includes('email');

  return (
    <ComponentWrapper ref={wrapperRef}>
        <AnimatedView ref={selectionViewRef} $isActive={view === 'selection'} $initialPosition="left">
          <InfoBox>
            <FaInfoCircle size={24} />
            <span>Selecciona un método de envío para compartir la coordenada actual de la unidad seleccionada.</span>
          </InfoBox>
          <OptionsGrid>
            <IconToggleButton $isSelected={selectedMethods.includes('whatsapp')}>
              <HiddenCheckbox value="whatsapp" onChange={handleCheckboxChange} />
              <IconWrapper color="#25D366"><FaWhatsapp /></IconWrapper>
              <IconLabel>WhatsApp</IconLabel>
            </IconToggleButton>
            <IconToggleButton $isSelected={selectedMethods.includes('sms')}>
              <HiddenCheckbox value="sms" onChange={handleCheckboxChange} />
              <IconWrapper color="#007bff"><FaSms /></IconWrapper>
              <IconLabel>SMS</IconLabel>
            </IconToggleButton>
            <IconToggleButton $isSelected={selectedMethods.includes('email')}>
              <HiddenCheckbox value="email" onChange={handleCheckboxChange} />
              <IconWrapper color="#6c757d"><FaEnvelope /></IconWrapper>
              <IconLabel>Correo</IconLabel>
            </IconToggleButton>
          </OptionsGrid>
          <CopyContainer>
            <CopyLabel>O copia el enlace directamente</CopyLabel>
            <InputGroup>
              <LinkInput type="text" value={shareLink} readOnly />
              <CopyButton onClick={handleCopy} $isCopied={copyStatus}>
                {copyStatus ? <FaCheck /> : <FaCopy />}
              </CopyButton>
            </InputGroup>
          </CopyContainer>
          <Footer>
            <ActionButton onClick={() => setView('details')} disabled={selectedMethods.length === 0}>
              Siguiente
            </ActionButton>
          </Footer>
        </AnimatedView>

        <AnimatedView ref={detailsViewRef} $isActive={view === 'details'} $initialPosition="right">
            <DetailsHeader>
                <BackButton onClick={() => setView('selection')}>
                    <FaChevronLeft />
                </BackButton>
                <h3>Ingresa los detalles</h3>
            </DetailsHeader>
            
            {showPhoneInput && (
                <FormInput
                    label="Número de Teléfono"
                    type="tel"
                    placeholder="Escribe el número de teléfono"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                />
            )}
            {showEmailInput && (
                <FormInput
                    label="Correo Electrónico"
                    type="email"
                    placeholder="Escribe el correo electrónico"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                />
            )}

            <Footer>
                <ActionButton onClick={handleSend}>
                  Enviar
                </ActionButton>
            </Footer>
        </AnimatedView>
    </ComponentWrapper>
  );
}