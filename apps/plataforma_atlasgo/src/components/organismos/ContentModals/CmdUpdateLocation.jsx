import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';

// Importa tu archivo de sonido local
import successSoundFile from '../../../assets/sounds/done.mp3';
import errorSoundFile from '../../../assets/sounds/error.mp3'; // Opcional: un sonido para el error
import { sendComando } from '@mi-monorepo/common/services';

// --- Animaciones ---
const pulseGreenIntense = keyframes`
  0% { transform: scale(0.5); opacity: 0.7; }
  70% { transform: scale(1.5); opacity: 0; }
  100% { transform: scale(1.5); opacity: 0; }
`;
const fadeInBounce = keyframes`
  0% { opacity: 0; transform: scale(0.5); }
  60% { opacity: 1; transform: scale(1.1); }
  80% { transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const loadingDots = keyframes`
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60% { content: '...'; }
  80%, 100% { content: '.'; }
`;
const progress = keyframes`
  from { width: 100%; }
  to { width: 0%; }
`;

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
  position: relative;
`;

const AnimationContainer = styled.div`
  width: 140px;
  height: 140px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const RadarCircle = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid rgba(40, 167, 69, 0.5); 
  position: absolute;
  animation: ${pulseGreenIntense} 1.2s ease-out infinite;
  animation-delay: ${({ delay }) => delay || '0s'};
`;

const RadarCenter = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: #28a745;
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

const LoadingText = styled(StatusDescription)`
  font-weight: 500;
  color: #28a745;
  &:after {
    content: '.';
    animation: ${loadingDots} 1.5s infinite;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
`;

const ConfirmationButton = styled.button`
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${({ primary, error }) => 
    error ? '#dc3545' : primary ? '#28a745' : '#e9ecef'};
  color: ${({ primary, error }) => (primary || error) ? '#ffffff' : '#495057'};
  border: 1px solid ${({ primary, error }) => 
    error ? '#dc3545' : primary ? '#28a745' : '#dee2e6'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background-color: #28a745;
  animation: ${progress} 3s linear forwards;
`;

// --- Componente Principal ---
export function UpdateLocationModal({ onClose }) {
  const [status, setStatus] = useState('confirming');
  const successAudioRef = useRef(null);
  const errorAudioRef = useRef(null);
  const selectedVehicles = useSelector(state => state.vehicle.selectedVehicles, (prev, next) => {
    return JSON.stringify(prev) === JSON.stringify(next);
  });
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    let timer;
    if (status === 'updating') {
      timer = setTimeout(async () => {
        try {
          const imei = selectedVehicles[0].imei;

          if(!imei){
            setStatus('error');
            return;
          }

          const response = await sendComando(token, imei, 'posicion');
          const response_cmd = JSON.parse(response.response);

          if(response_cmd.type == 1){
            setStatus('success');
          } else {
            setStatus('error');
          }
        } catch (error) {
          console.error(error);
          setStatus('error');
        }
      }, 4000);
    }
    // Auto-cierre para el estado de éxito
    if (status === 'success') {
      timer = setTimeout(() => {
        onClose();
      }, 3000); // Cierra 3 segundos después de mostrar éxito
    }
    return () => clearTimeout(timer);
  }, [status, onClose]);

  useEffect(() => {
    if (status === 'success' && successAudioRef.current) {
      successAudioRef.current.play().catch(e => console.error("Error al reproducir sonido de éxito:", e));
    }
    if (status === 'error' && errorAudioRef.current) {
      errorAudioRef.current.play().catch(e => console.error("Error al reproducir sonido de error:", e));
    }
  }, [status]);

  const renderContent = () => {
    switch (status) {
      case 'updating':
        return (
          <>
            <AnimationContainer>
              <RadarCircle />
              <RadarCircle delay="0.4s" />
              <RadarCircle delay="0.8s" />
              <RadarCenter />
            </AnimationContainer>
            <LoadingText key="updating-text">Actualizando posición</LoadingText>
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
            <StatusTitle key="success-title">¡Éxito!</StatusTitle>
            <StatusDescription key="success-desc">La posición del vehículo ha sido actualizada.</StatusDescription>
            <ProgressBar key="progress-bar" />
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
              <StatusTitle key="error-title">Error en la Actualización</StatusTitle>
              <StatusDescription key="error-desc">No se pudo obtener la última posición. Revisa la conexión y vuelve a intentarlo.</StatusDescription>
              <ButtonContainer>
                <ConfirmationButton onClick={onClose}>Cerrar</ConfirmationButton>
                <ConfirmationButton error onClick={() => setStatus('updating')}>Reintentar</ConfirmationButton>
              </ButtonContainer>
            </>
          );
      case 'confirming':
      default:
        return (
          <>
            <StatusTitle>Confirmar Acción</StatusTitle>
            <StatusDescription>¿Estás seguro de que deseas actualizar la posición del vehículo?</StatusDescription>
            <ButtonContainer>
              <ConfirmationButton onClick={onClose}>No, cancelar</ConfirmationButton>
              <ConfirmationButton primary onClick={() => setStatus('updating')}>Sí, actualizar</ConfirmationButton>
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