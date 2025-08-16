import React, { useState } from "react";
import styled from "styled-components";
import { IoIosArrowDown } from "react-icons/io";
import { MdLocationOn, MdLock, MdLockOpen } from "react-icons/md";
import { IoIosLock,IoIosUnlock } from "react-icons/io";
import { IoPaperPlane } from "react-icons/io5";

import Car from "../../assets/Car.svg";
import { calculateDateDifference } from "../../utilities/Functions";

export function VehicleCard({ name, status, updated, driver, onClick }) {
  const [expanded, setExpanded] = useState(false);

  let formato_actualizado = calculateDateDifference(updated);

  return (
    <CardContainer onClick={onClick}>
      <CardTop>
        <CarIconContainer>
          <img
            src={Car}
            alt="Car Icon"
            style={{ width: "25px", height: "25px" }}
          />
        </CarIconContainer>
        <VehicleInfo>
          <h4>{name}</h4>
          <p>Estado: {status}</p>
          <p>Actualizado: {formato_actualizado.message}</p>
          <p>Chofer: {driver}</p>
        </VehicleInfo>
        <ExpandIcon
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          title={expanded ? "Cerrar controles" : "Expandir controles"}
          expanded={expanded}
        >
          <IoIosArrowDown
            style={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </ExpandIcon>
      </CardTop>
      <AnimatedPanel expanded={expanded}>
        <Separator />
        <HorizontalButtonGroup>
          <ActionButton title="Posición">
            <IoPaperPlane />
          </ActionButton>
          <ActionButton title="Bloqueo Motor">
            <IoIosLock />
          </ActionButton>
          <ActionButton title="Desbloqueo Motor">
            <IoIosUnlock />
          </ActionButton>
        </HorizontalButtonGroup>
      </AnimatedPanel>
    </CardContainer>
  );
}

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: #212121;
  padding: 10px 5px;
  border-radius: 6px;
  border: 1px solid #333333;
  gap: 0;
  width: 100%;
  position: relative;
  transition: box-shadow 0.18s;
  user-select: none;
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CarIconContainer = styled.div`
  position: relative;
  background: #2c2c2c;
  padding: 6px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const VehicleInfo = styled.div`
  flex-grow: 1;
  color: #fff;
  h4 {
    margin: 0;
    font-size: 11px;
  }
  p {
    margin: 1px 0;
    font-size: 10px;
    color: #aaa;
  }
`;

const ExpandIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ expanded }) => (expanded ? "#53a2ff" : "#b4b4b4")};
  background: #282828;
  border-radius: 100px;
  padding: 6px;
  font-size: 18px;
  margin-left: 8px;
  transition: background 0.15s, color 0.15s;
  &:hover {
    background: #333;
    color: #53a2ff;
  }
`;

const AnimatedPanel = styled.div`
  width: 100%;
  overflow: hidden;
  max-height: ${({ expanded }) => (expanded ? "100px" : "0px")};
  opacity: ${({ expanded }) => (expanded ? "1" : "0")};
  transform: translateY(${({ expanded }) => (expanded ? "0px" : "-10px")});
  transition: all 0.4s cubic-bezier(0.45, 1.5, 0.55, 1); /* Suave y con rebote */
  pointer-events: ${({ expanded }) => (expanded ? "auto" : "none")};
  margin-top: ${({ expanded }) => (expanded ? "10px" : "0")};
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Separator = styled.div`
  width: 100%;
  height: 1px;
  background: #373737;
  margin-bottom: 8px;
  border-radius: 2px;
`;

const HorizontalButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

const ActionButton = styled.button`
  background: #292929;
  color: #fff;
  border: none;
  border-radius: 6px;
  flex: 1 1 0;
  min-width: 0;
  padding: 6px 0;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.14s, color 0.14s, box-shadow 0.14s;
  &:hover {
    background: #2070ff;
    color: #fff;
    box-shadow: 0 2px 6px #2070ff33;
  }
  &:not(:last-child) {
    margin-right: 10px;
  }
`;