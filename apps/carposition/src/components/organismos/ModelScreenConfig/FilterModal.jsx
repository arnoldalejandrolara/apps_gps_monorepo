import React, { useRef, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import FilterContent from "../../moleculas/FilterContent.jsx";

// --- INICIO DE LA MODIFICACIÓN ---
// 1. Ya no se importan los contenidos variantes.
// Se podría importar un componente de filtro, pero lo definiremos abajo por simplicidad.

// 2. Componente renombrado a "FilterModal" para ser más específico.
function FilterModal({
  open,
  onClose,
  anchorPosition,
  direction = "left",
  // 3. Se eliminan las props "variant" y "children" que ya no son necesarias.
}) {
  const modalRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // La lógica de animación y montaje no se toca, sigue siendo perfecta.
  useEffect(() => {
    let openTimer;
    let closeTimer;
    if (open) {
      setIsMounted(true);
      openTimer = setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      closeTimer = setTimeout(() => setIsMounted(false), 200);
    }
    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, [open]);

  // La lógica para cerrar al hacer clic afuera tampoco se toca.
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

  // 4. Se elimina la lógica que dependía de la variante.
  let left = direction === "left" ? anchorPosition.left + anchorPosition.width : anchorPosition.left;

  return (
    <ModalOverlay>
      <AnimationWrapper
        $isAnimating={isAnimating}
        style={{
          top: `${anchorPosition.top + anchorPosition.height + 8}px`,
          left: `${left}px`,
        }}
      >
        <ModalContent
          ref={modalRef}
          style={{
            // 5. Dimensiones ahora fijas para el modal de filtros.
            //    La altura es automática para adaptarse al contenido.
            width: "250px",
            height: "auto",
            transform: direction === "left" ? "translateX(-100%)" : "translateX(0)"
          }}
        >
          {/* 6. Se renderiza directamente el contenido del filtro */}
          <FilterContent />
        </ModalContent>
      </AnimationWrapper>
    </ModalOverlay>
  );
}

export default FilterModal;


// --- Estilos ---
// AnimationWrapper y ModalOverlay no necesitan cambios.

const ModalOverlay = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 0; 
  z-index: 2000;
`;

const AnimationWrapper = styled.div`
  position: fixed;
  z-index: 2100;
  transform-origin: top; 
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 0;
  transform: scale(0.95);

  ${props => props.$isAnimating && css`
    opacity: 1;
    transform: scale(1);
  `}
`;

const ModalContent = styled.div`
  border-radius: 8px;
  background-color: #2E2E2E; // Color de fondo para que el contenido se vea
  color: #E0E0E0;
  box-shadow: 0 10px 38px -10px rgba(0, 0, 0, 0.35), 0 10px 20px -15px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;