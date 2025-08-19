import React from "react";

import { createPortal } from "react-dom";

import styled, { css, keyframes } from "styled-components";

const fadeIn = keyframes` from { opacity: 0; } to { opacity: 1; } `;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  background-color: rgba(0, 0, 0, 0);
  z-index: 9999;
`;

const FloatingMenuWrapper = styled.div`
  position: absolute; /* absolute porque el hook ya calcula la posición con el scroll */

  background: linear-gradient(145deg, #2e3a4d, #1c252e);

  color: #e5e7eb;
  border-radius: 12px;

  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  padding: 6px;

  z-index: 10000;
  min-width: 220px;

  transform-origin: ${(props) =>
      props.placement === "right" ? "left" : "right"}
    center;

  &::after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;

    border-style: solid;
    top: 50%;
    transform: translateY(-50%);

    ${(props) =>
      props.placement === "right" &&
      css`
        left: -8px;
        border-width: 8px 8px 8px 0;

        border-color: transparent #2e3a4d transparent transparent;
      `}

    ${(props) =>
      props.placement === "left" &&
      css`
        right: -8px;
        border-width: 8px 0 8px 8px;

        border-color: transparent transparent transparent #2e3a4d;
      `}
  }
`;

const MenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const MenuItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 10px 14px;
  cursor: pointer;
  font-size: 14px;

  font-weight: 500;
  border-radius: 8px;

  transition: background-color 0.15s ease-in-out;

  & svg {
    font-size: 18px;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.delete {
    color: #ff7043;
    &:hover {
      background-color: rgba(255, 112, 67, 0.15);
    }
  }
`;

export function FloatingMenu({
  isOpen,
  menuRef,
  style,
  placement,
  actions,
  closeMenu,
}) {
  if (!isOpen) return null;

  const handleActionClick = (e, onClick) => {
    e.stopPropagation();

    if (typeof onClick === "function") onClick();

    closeMenu();
  };

  return createPortal(
    <>
      <ModalBackdrop onClick={closeMenu} />

      <FloatingMenuWrapper ref={menuRef} style={style} placement={placement}>
        <MenuList role="menu">
          {actions.map((action, index) => (
            <MenuItem
              key={index}
              role="menuitem"
              className={action.className}
              onClick={(e) => handleActionClick(e, action.onClick)}
            >
              {action.icon}

              <span>{action.label}</span>
            </MenuItem>
          ))}
        </MenuList>
      </FloatingMenuWrapper>
    </>,

    document.body
  );
}
