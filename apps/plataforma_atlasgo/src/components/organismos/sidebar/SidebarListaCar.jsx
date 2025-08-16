import styled from "styled-components";

import { Title } from "../../atomos/Title.jsx";
import {InputSearch} from "../../moleculas/InputSearch.jsx";

import { VehicleListContainer } from "../listado/ListaVehicleCon";

export function SidebarListaCar({ vehicles, handleCardClick }) {
  return (
    <SidebarStyled>
      <Title />
      <InputSearch /> 
      <VehicleListContainer vehicles={vehicles} handleCardClick={handleCardClick} />
    </SidebarStyled>
  );
}

const SidebarStyled = styled.aside`
  width: 280px;
  background: #171717;
  color: #fff;
  padding: 18px 10px 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  box-shadow: 0 0 4px #0002;
  overflow-y: auto;
  height: 100%;
  min-height: 0;
  min-width: 0;
`;