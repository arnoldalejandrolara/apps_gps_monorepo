import React, { useRef, useEffect, useState } from "react";
import styled, { css } from "styled-components"; // Importa 'css'

import HelpContent from "../../moleculas/HelpContent";
import InboxContent from "../../moleculas/InboxContent";

function FloatingModal({
  open,
  onClose,
  children,
  anchorPosition,
  direction = "left",
  variant = "help",
}) {
  const modalRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // La lógica de montaje y animación que ya teníamos es perfecta, no se toca.
  useEffect(() => {
    let openTimer;
    let closeTimer;
    if (open) {
      setIsMounted(true);
      openTimer = setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      closeTimer = setTimeout(() => setIsMounted(false), 200); // <-- Ajustado a la nueva duración (0.2s)
    }
    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, [open]);

  // El hook para cerrar al hacer clic afuera tampoco necesita cambios.
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event) {
      const isTriggerButton = event.target.closest('.action-btn');
      if (modalRef.current && !modalRef.current.contains(event.target) && !isTriggerButton) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  if (!isMounted || !anchorPosition) return null;

  const modalStyles = {
    help: { width: "390px", height: "315px" },
    inbox: { width: "448px", height: "490px" }
  };
  let left = direction === "left" ? anchorPosition.left + anchorPosition.width : anchorPosition.left;
  let ContentComponent = variant === "help" ? HelpContent : (variant === "inbox" ? InboxContent : React.Fragment);

  // --- INICIO DE LA MODIFICACIÓN EN LA ESTRUCTURA JSX ---
  return (
    <ModalOverlay>
      <AnimationWrapper
        $isAnimating={isAnimating}
        style={{
          top: `${anchorPosition.top + anchorPosition.height + 8}px`, // Un poco más de espacio
          left: `${left}px`,
        }}
      >
        <ModalContent
          ref={modalRef}
          style={{
            width: modalStyles[variant].width,
            height: modalStyles[variant].height,
            // El transform de posicionamiento ahora está aquí, separado de la animación
            transform: direction === "left" ? "translateX(-100%)" : "translateX(0)"
          }}
        >
          <ContentComponent>
            {children}
          </ContentComponent>
        </ModalContent>
      </AnimationWrapper>
    </ModalOverlay>
  );
  // --- FIN DE LA MODIFICACIÓN EN LA ESTRUCTURA JSX ---
}

export default FloatingModal;


// --- INICIO DE LA MODIFICACIÓN DE ESTILOS ---

const ModalOverlay = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 0; 
  z-index: 2000;
`;

// NUEVO CONTENEDOR: Se encarga 100% de la animación
const AnimationWrapper = styled.div`
  position: fixed;
  z-index: 2100;
  /* El punto de origen de la animación de escala */
  transform-origin: top; 

  /* Transición más profesional con una curva de aceleración personalizada */
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  /* Estilos para cuando está CERRADO o abriendo */
  opacity: 0;
  transform: scale(0.95);

  /* Estilos para cuando está ABIERTO y la animación terminó */
  ${props => props.$isAnimating && css`
    opacity: 1;
    transform: scale(1);
  `}
`;

// CONTENIDO SIMPLIFICADO: Ya no se encarga de la animación, solo del aspecto.
const ModalContent = styled.div`
  border-radius: 8px; /* Un poco más redondeado */
  box-shadow: 0 10px 38px -10px rgba(22, 23, 24, 0.35), 0 10px 20px -15px rgba(22, 23, 24, 0.2);
  padding: 0;
  overflow: hidden;
  /* No necesita position, visibility, opacity ni la transición de antes. */
`;

// --- FIN DE LA MODIFICACIÓN DE ESTILOS ---