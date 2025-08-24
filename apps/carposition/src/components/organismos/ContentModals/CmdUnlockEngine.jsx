import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaCheck, FaTimes, FaUnlock } from 'react-icons/fa';

// Importa los mismos archivos de sonido
import successSoundFile from '../../../assets/sounds/done.mp3';
import errorSoundFile from '../../../assets/sounds/error.mp3';

// --- Animaciones (sin cambios) ---
const scanline = keyframes`
  0% { top: -20%; }
  100% { top: 100%; }
`;
const fadeInBounce = keyframes`
  0% { opacity: 0; transform: scale(0.5); }
  60% { opacity: 1; transform: scale(1.1); }
  80% { transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;

// --- Estilos ---
const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 30px;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-sizing: border-box;
  min-height: 300px;
`;

const AnimationContainer = styled.div`
  width: 120px;
  height: 120px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  color: #6c757d;
  border-radius: 50%;
  border: 4px solid #f8f9fa;
  box-shadow: 0 0 0 4px #e9ecef;
`;

// --- Animación de envío de comando (ahora en verde) ---
const SendingAnimationContainer = styled(AnimationContainer)`
  border-color: rgba(40, 167, 69, 0.2);
  box-shadow: 0 0 0 4px rgba(40, 167, 69, 0.2);
  color: #28a745;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    width: 100%;
    height: 20%;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(40, 167, 69, 0.3), rgba(255, 255, 255, 0));
    animation: ${scanline} 2s linear infinite;
  }
`;

const SuccessContainer = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #28a745;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  animation: ${fadeInBounce} 0.5s ease-out;
`;

const FailureContainer = styled(SuccessContainer)`
  background-color: #dc3545;
`;

const StatusTitle = styled.h3`
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  animation: ${fadeIn} 0.5s ease-out;
`;

const StatusDescription = styled.p`
  font-size: 16px;
  font-weight: 400;
  color: #6c757d;
  margin: 0;
  max-width: 300px;
  line-height: 1.5;
  animation: ${fadeIn} 0.5s ease-out;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
`;

const ActionButton = styled.button`
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${({ primary }) => primary ? '#28a745' : '#e9ecef'};
  color: ${({ primary }) => primary ? '#ffffff' : '#495057'};
  border: 1px solid ${({ primary }) => primary ? '#28a745' : '#dee2e6'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

// --- Componente Principal ---
export function UnlockEngineModal({ onClose }) {
  const [status, setStatus] = useState('confirming'); // 'confirming', 'sending', 'success', 'error'
  const successAudioRef = useRef(null);
  const errorAudioRef = useRef(null);

  useEffect(() => {
    let timer;
    if (status === 'sending') {
      timer = setTimeout(() => {
        const didSucceed = Math.random() < 0.9; // 90% de probabilidad de éxito
        setStatus(didSucceed ? 'success' : 'error');
      }, 4000);
    }
    if (status === 'success') {
      timer = setTimeout(onClose, 2500);
    }
    return () => clearTimeout(timer);
  }, [status, onClose]);

  useEffect(() => {
    if (status === 'success' && successAudioRef.current) {
      successAudioRef.current.play().catch(e => console.error("Error:", e));
    }
    if (status === 'error' && errorAudioRef.current) {
      errorAudioRef.current.play().catch(e => console.error("Error:", e));
    }
  }, [status]);

  const renderContent = () => {
    switch (status) {
      case 'sending':
        return (
          <>
            <SendingAnimationContainer>
              <FaUnlock size={50} />
            </SendingAnimationContainer>
            <StatusTitle>Enviando Comando</StatusTitle>
            <StatusDescription>Esperando confirmación del dispositivo...</StatusDescription>
          </>
        );
      case 'success':
        return (
          <>
            <AnimationContainer>
              <SuccessContainer>
                <FaCheck />
              </SuccessContainer>
            </AnimationContainer>
            <StatusTitle>Comando Enviado</StatusTitle>
            <StatusDescription>El motor ha sido desbloqueado. El vehículo ya puede encenderse.</StatusDescription>
          </>
        );
      case 'error':
        return (
            <>
              <AnimationContainer>
                <FailureContainer>
                  <FaTimes />
                </FailureContainer>
              </AnimationContainer>
              <StatusTitle>Comando Fallido</StatusTitle>
              <StatusDescription>No se pudo comunicar con el dispositivo. Inténtalo de nuevo.</StatusDescription>
              <ButtonContainer>
                <ActionButton onClick={onClose}>Cerrar</ActionButton>
                <ActionButton primary onClick={() => setStatus('sending')}>Reintentar</ActionButton>
              </ButtonContainer>
            </>
          );
      case 'confirming':
      default:
        return (
          <>
            <AnimationContainer>
                <FaUnlock size={60} />
            </AnimationContainer>
            <StatusTitle>Confirmar Desbloqueo de Motor</StatusTitle>
            <StatusDescription>Esta acción permitirá que el vehículo pueda ser encendido. ¿Deseas continuar?</StatusDescription>
            <ButtonContainer>
              <ActionButton onClick={onClose}>No, cancelar</ActionButton>
              <ActionButton primary onClick={() => setStatus('sending')}>Sí, desbloquear</ActionButton>
            </ButtonContainer>
          </>
        );
    }
  };

  return (
    <ModalContentWrapper>
      <audio ref={successAudioRef} src={successSoundFile} preload="auto" />
      <audio ref={errorAudioRef} src={errorSoundFile} preload="auto" /> 
      {renderContent()}
    </ModalContentWrapper>
  );
}