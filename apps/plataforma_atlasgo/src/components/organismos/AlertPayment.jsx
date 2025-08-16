import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Este componente muestra un modal con el tiempo restante para pagar la mensualidad
export function AlertPaymentModal({ closeModal, dueDate }) {
  // dueDate debe ser un string (o Date) con la fecha límite de pago, por ejemplo: '2025-06-01T00:00:00'
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(dueDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(dueDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [dueDate]);

  function getTimeLeft(toDate) {
    const now = new Date();
    const deadline = new Date(toDate);
    const total = deadline - now;
    if (total <= 0) return null;
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / (1000 * 60)) % 60);
    const seconds = Math.floor((total / 1000) % 60);
    return { days, hours, minutes, seconds };
  }

  function pad(num) {
    return String(num).padStart(2, '0');
  }

  return (
    <FullScreenContainer onClick={closeModal}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={closeModal}>&times;</CloseButton>
        <Title>¡Atención! Tu pago está pendiente</Title>
        <Description>
          Para evitar la suspensión de tu servicio, realiza el pago de tu mensualidad antes de que el tiempo expire.<br/>
          Si tienes algún inconveniente o necesitas ayuda, no dudes en contactarnos. ¡Gracias por tu preferencia!
        </Description>
        {
          timeLeft ? (
            <TimerSection>
              <TimerLabel>Tiempo restante para pagar:</TimerLabel>
              <TimerDisplay>
                <TimerBox>
                  <TimerNumber>{pad(timeLeft.days)}</TimerNumber>
                  <TimerText>días</TimerText>
                </TimerBox>
                <Colon>:</Colon>
                <TimerBox>
                  <TimerNumber>{pad(timeLeft.hours)}</TimerNumber>
                  <TimerText>horas</TimerText>
                </TimerBox>
                <Colon>:</Colon>
                <TimerBox>
                  <TimerNumber>{pad(timeLeft.minutes)}</TimerNumber>
                  <TimerText>minutos</TimerText>
                </TimerBox>
                <Colon>:</Colon>
                <TimerBox>
                  <TimerNumber>{pad(timeLeft.seconds)}</TimerNumber>
                  <TimerText>segundos</TimerText>
                </TimerBox>
              </TimerDisplay>
            </TimerSection>
          ) : (
            <Message>
              <span>El tiempo para pagar la mensualidad ha expirado.</span>
            </Message>
          )
        }
      </ModalContent>
    </FullScreenContainer>
  );
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const FullScreenContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.1);
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease;
`;

const ModalContent = styled.div`
  background: #FF5530;
  color: #fff;
  border-radius: 8px;
  padding: 40px 32px 36px 32px;
  min-width: 340px;
  max-width: 95vw;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  position: relative;
  text-align: center;
  animation: ${fadeIn} 0.25s;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 1rem;
  margin-bottom: 18px;
  color: #fff;
  font-weight: 700;
`;

const Description = styled.div`
  font-size: 0.9rem;
  margin-bottom: 28px;
  color: #fff;
  line-height: 1.5;
  max-width: 420px;
`;

const TimerSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TimerLabel = styled.div`
  font-size: 0.9rem;
  margin-bottom: 10px;
  letter-spacing: 0.04em;
`;

const TimerDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 3px;
`;

const TimerBox = styled.div`
  background: rgba(255,255,255,0.15);
  border-radius: 10px;
  padding: 10px 16px 6px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 54px;
  box-shadow: 0 2px 7px rgba(0,0,0,0.08);
`;

const TimerNumber = styled.div`
  font-size: 2.2rem;
  font-family: 'Roboto Mono', monospace;
  font-weight: 700;
  color: #fff;
`;

const TimerText = styled.div`
  font-size: 0.88rem;
  margin-top: 3px;
  color: #fff;
`;

const Colon = styled.div`
  font-size: 2.1rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 5px;
`;

const Message = styled.div`
  font-size: 1.18rem;
  margin-top: 30px;
  margin-bottom: 10px;
  color: #fff;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 14px;
  right: 16px;
  background: none;
  border: none;
  font-size: 2.2rem;
  color: #fff;
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: #222;
  }
`;

export default AlertPaymentModal;