import React from "react";
import styled from "styled-components";
import { BsChevronDown } from "react-icons/bs";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled as muiStyled } from '@mui/system';
import GridsSmall from '../organismos/grids/GridsSmall';
import GridSpeed from "../organismos/grids/GridSpeed";
import GridCombustible from "../organismos/grids/GridCombustible";
import GridLocation from "../organismos/grids/GridLocation";
import GridHorometro from "../organismos/grids/GridHorometro";
import GridTimeOn from "../organismos/grids/GridTimeOn";
import GridUpdateLocation from "./grids/GridCurrent";
import GridUnlock from "./grids/GridDislock";
import GridLock from "./grids/GridLock";
import GridRootDay from "./grids/GridRootDay";
import GridHistory from "./grids/GridHistory";
import GridShareUbi from "./grids/GridShareUbi";
import GridViewRoute from "./grids/GridViewRoute";

const BottomSheetCar = ({
  show,
  bottomSheet,
  selectedOption,
  setSelectedOption,
  showSelectOptions,
  setShowSelectOptions,
  handleOptionSelect,
  selectedVehicle,
  slides,
  currentTab,
  setCurrentTab,
  onClose,
  getOrientation,
  onUpdateLocation,
  onLock,
  onUnlock
}) => {

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <StyledBottomSheet show={show}>
      {/* HEADER */}
      {bottomSheet === "config" && (
        <>
          <Title>Configuración de Vista</Title>
          <SelectContainer>
            <Select onClick={() => setShowSelectOptions(!showSelectOptions)}>
              <span>{selectedOption}</span>
              <BsChevronDown style={{ marginLeft: "8px" }} />
            </Select>
            {showSelectOptions && (
              <FloatingSelectOptions>
                <Option onClick={() => handleOptionSelect("Opción 1")}>
                  Opción 1
                </Option>
                <Option onClick={() => handleOptionSelect("Opción 2")}>
                  Opción 2
                </Option>
                <Option onClick={() => handleOptionSelect("Opción 3")}>
                  Opción 3
                </Option>
              </FloatingSelectOptions>
            )}
          </SelectContainer>
          <CheckboxContainer>
            <label htmlFor="customCheckbox">Activar geocercas</label>
            <input type="checkbox" id="customCheckbox" />
          </CheckboxContainer>
          <CloseButton onClick={onClose}>Cerrar</CloseButton>
        </>
      )}

      {bottomSheet === "details" && selectedVehicle && (
        <>
          {/* HEADER */}
          <Title>{selectedVehicle?.info.nombre}</Title>
          <Subtitle>Nissan</Subtitle>
          <Box sx={{ width: '100%' }}>
            <CustomTabs
              value={currentTab}
              onChange={handleTabChange}
              centered
            >
              <CustomTab label="Informacion" />
              <CustomTab label="Acciones" />
            </CustomTabs>
          </Box>

          {/* SCROLLABLE CONTENT */}
          <SheetContent>
            {currentTab === 0 && (
              <GridContainer>
                {slides[0].map((item, index) => (
                  <GridItem key={index}>
                    {item === "Elemento_1" ? (
                      <GridsSmall batteryLevel={selectedVehicle?.posicion_actual.bateria} voltage={selectedVehicle?.posicion_actual.voltaje_principal} />
                    ) : item === "Elemento_2" ? (
                      <GridSpeed speed={selectedVehicle?.posicion_actual.velocidad} orientation={getOrientation(selectedVehicle?.posicion_actual.orientacion)} />
                    ) : (
                      item
                    )}
                  </GridItem>
                ))}
                <FullWidthGridMedium>
                  <GridLocation
                    address="Av. Siempre Viva 742, Springfield"
                    iconColor="#ff5722"
                  />
                </FullWidthGridMedium>

                {slides[1].map((item, index) => (
                  <GridsSmallN key={index}>
                    {item === "Elemento_3" ? (
                      <GridHorometro horometro={selectedVehicle?.posicion_actual.horometro} odometro={selectedVehicle?.posicion_actual.odometro} />
                    ) : item === "Elemento_4" ? (
                      <GridTimeOn time="1h" />
                    ) : item}
                  </GridsSmallN>
                ))}
              </GridContainer>
            )}

            {currentTab === 1 && (
              <GridContainerActions>
                {slides[2].map((item, index) => (
                  <GridItemActions key={index}>
                    {item === "Elemento_5" ? (
                      <GridUpdateLocation onClick={onUpdateLocation} />
                    ) : item === "Elemento_6" ? (
                      <GridUnlock onClick={onUnlock} />
                    ) : item === "Elemento_7" ? (
                      <GridLock onClick={onLock} />
                    ) : item === "Elemento_8" ? (
                      <GridRootDay onClick={() => { }} />
                    ) : item === "Elemento_9" ? (
                      <GridHistory onClick={() => { }} />
                    ) : item === "Elemento_10" ? (
                      <GridShareUbi onClick={() => { }} />
                    ) : item === "Elemento_11" ? (
                      <GridViewRoute onClick={() => { }} />
                    ) : item}
                  </GridItemActions>
                ))}
              </GridContainerActions>
            )}
          </SheetContent>
        </>
      )}
    </StyledBottomSheet>
  );
};

export default BottomSheetCar;

// Styled-components
const StyledBottomSheet = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: #202020;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.2);
  border-top: 1px solid #333333;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  transition:
    bottom 0.3s ease-in-out,
    height 0.3s cubic-bezier(0.32, 0.72, 0.35, 1),
    padding 0.3s cubic-bezier(0.32, 0.72, 0.35, 1);
  display: flex;
  flex-direction: column;
  bottom: ${({ show }) => (show ? "0px" : "-100%")};
  height: ${({ show }) => (show ? "auto" : "0")};
  padding: ${({ show }) => (show ? "10px 20px" : "0")};
  overflow: ${({ show }) => (show ? "visible" : "hidden")};
`;

// Agregamos el contenedor de contenido con scroll
const SheetContent = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  min-height: 0; /* Fix for safari flexbox + scroll */
  margin-top: 10px;
`;

// El resto de tus estilos igual...

const Title = styled.h3`
  color: #fff;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 5px;
`;

const Subtitle = styled.h4`
  color: #aaa;
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  margin-bottom: 5px;
`;

const SelectContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const Select = styled.div`
  width: 100%;
  padding: 10px;
  border: 1px solid #555;
  border-radius: 8px;
  background-color: transparent;
  color: #fff;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const FloatingSelectOptions = styled.div`
  position: absolute;
  top: -150%; 
  left: 0;
  width: 100%;
  background-color: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  animation: slideDown 0.3s ease-in-out;
  z-index: 10;

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Option = styled.div`
  padding: 10px;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #444;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;

  label {
    color: #fff;
    font-size: 14px;
  }

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
  }
`;

const CloseButton = styled.div`
  margin-top: 10px;
  margin-bottom: 15px;
  padding: 10px;
  font-size: 14px;
  color: #fff;
  background-color: transparent;
  text-align: center;
  border: 1px solid #555;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 10px;
`;

const GridContainerActions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const GridItemActions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #242424;
  color: #fff;
  padding: 0px;
  text-align: center;
  border-radius: 5px;
  height: 80px;
`;

const GridItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #242424;
  color: #fff;
  padding: 5px;
  text-align: center;
  border: 1px solid #333333;
  border-radius: 5px;
  height: 90px;
`;

const GridsSmallN = styled.div`
  background-color: #242424;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  padding: 15px;
  text-align: center;
  border: 1px solid #333333;
  border-radius: 5px;
  height: 70px;
`;

const FullWidthGridMedium = styled(GridItem)`
  grid-column: span 2;
  height: 50px;
`;

// Material-UI Custom Styled Tabs
const CustomTabs = muiStyled(Tabs)`
  color: #fff;
  .MuiTabs-indicator { background-color: #888; }
`;
const CustomTab = muiStyled(Tab)`
  &.MuiTab-root {
    color: #ccc;
    text-transform: none;
    font-size: 13px;
  }
  &.Mui-selected { color: #fff; }
`;