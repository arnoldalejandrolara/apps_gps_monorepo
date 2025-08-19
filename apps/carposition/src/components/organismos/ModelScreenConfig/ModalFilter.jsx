import React, { useRef, useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export function ModalFilters({ content, position, onClose }) {
  const handleOutsideClick = (event) => {
    if (event.target.id === "modal-overlay") {
      onClose();
    }
  };

  const [isDateEnabled, setIsDateEnabled] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [cleared]);

  const startRef = useRef(null);
  const endRef = useRef(null);

  const options = ["Opción 1", "Opción 2", "Opción 3", "Opción 4"];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const isDateValid = !startDate || !endDate || startDate <= endDate;

  const theme = createTheme({
    palette: {
      mode: "dark",
    },
    components: {
      MuiPickersToolbar: {
        styleOverrides: {
          root: {
            backgroundColor: "#0d47a1",
            color: "#bbdefb",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            height: "40px", // Establece la altura total del input
            fontSize: "13px !important", // Tamaño para todo el input
            "& .MuiInputBase-input": {
              height: "100%", // Asegura que el texto ocupe toda la altura
              padding: "0px", // Añade espacio interno para centrar el texto
              color: "white",
              fontSize: "13px", // Tamaño de fuente del texto dentro del input
            },
            "& .MuiSvgIcon-root": {
              color: "#bbdefb",
            },
            backgroundColor: "#333333",
            borderRadius: "8px",
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: "13px", // Tamaño de letra del label
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            fontSize: "13px", // Tamaño de fuente de los días en el calendario
          },
        },
      },
      MuiPickersCalendarHeader: {
        styleOverrides: {
          label: {
            fontSize: "13px", // Tamaño de la etiqueta del encabezado del calendario
          },
        },
      },
      MuiPickersYear: {
        styleOverrides: {
          root: {
            fontSize: "13px", // Tamaño de los años en la vista de selección de años
          },
        },
      },
      MuiPickersMonth: {
        styleOverrides: {
          root: {
            fontSize: "13px", // Tamaño de los meses en la vista de selección de meses
          },
        },
      },
      MuiPickersDayCalendar: {
        styleOverrides: {
          day: {
            fontSize: "13px", // Tamaño del texto en los días del calendario
          },
        },
      },
      MuiPickersInputBase: {
        styleOverrides: {
          section: {
            fontSize: "13px", // Apunta específicamente al tamaño de los `span` donde se colocan las fechas
          },
        },
      },
    },
  });

  return (
    <Overlay id="modal-overlay" onClick={handleOutsideClick}>
      <Modal style={{ top: position.top, left: position.left }}>
        <Title>{content}</Title>

        {/* <CheckboxContainer>
          <input
            type="checkbox"
            id="date-checkbox"
            checked={isDateEnabled}
            onChange={(e) => setIsDateEnabled(e.target.checked)}
          />
          <label htmlFor="date-checkbox">Fecha</label>
        </CheckboxContainer> */}

       
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateContainer>
                <DatePicker
                  label="Fecha inicial"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  disablePortal
                  PopperProps={{
                    modifiers: [
                      { name: "offset", options: { offset: [0, 10] } },
                      { name: "preventOverflow", options: { boundary: "viewport" } },
                      { name: "flip", options: { fallbackPlacements: ["bottom"] } },
                    ],
                  }}
                  sx={{ width: "100%" }}
                  slotProps={{
                    field: { clearable: true, onClear: () => setCleared(true) },
                  }}
                />

                {/* <Label>Fecha final</Label> */}
                <DatePicker
                 label="Fecha final"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  disablePortal
                  PopperProps={{
                    anchorEl: endRef.current,
                    modifiers: [
                      { name: "offset", options: { offset: [0, 10] } },
                      { name: "preventOverflow", options: { boundary: "viewport" } },
                    ],
                  }}
                  sx={{ width: "100%" }}
                  slotProps={{
                    field: { clearable: true, onClear: () => setCleared(true) },
                  }}
                />

                {/* <ApplyButton onClick={() => console.log("Aplicar fechas")}>
                  Aplicar
                </ApplyButton> */}
              </DateContainer>
            </LocalizationProvider>
          </ThemeProvider>
     

        {/* <Label>Alerta</Label> */}
        <DropdownContainer>
          <DropdownInput onClick={toggleDropdown}>
            {selectedOptions.length > 0
              ? selectedOptions.join(", ")
              : "Selecciona opciones"}
          </DropdownInput>
          {isDropdownOpen && (
            <DropdownMenu>
              {options.map((option) => (
                <DropdownOption
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  selected={selectedOptions.includes(option)}
                >
                  {option}
                </DropdownOption>
              ))}
            </DropdownMenu>
          )}
        </DropdownContainer>

        {/* <Label>Unidad</Label> */}
        <DropdownContainer>
          <DropdownInput onClick={toggleDropdown}>
            {selectedOptions.length > 0
              ? selectedOptions.join(", ")
              : "Selecciona opciones"}
          </DropdownInput>
          {isDropdownOpen && (
            <DropdownMenu>
              {options.map((option) => (
                <DropdownOption
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  selected={selectedOptions.includes(option)}
                >
                  {option}
                </DropdownOption>
              ))}
            </DropdownMenu>
          )}
        </DropdownContainer>
      </Modal>
    </Overlay>
  );
}

// Estilos
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  z-index: 999;
`;

const Modal = styled.div`
  position: absolute;
  background: #252525;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #333333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  width: 250px;
  color: white;
  text-align: center;
  animation: ${fadeIn} 0.3s ease-out;
`;

const Title = styled.h2`
  margin: 0 0 15px 0;
  font-size: 13px;
  color: #9b9b9b;
  display: flex;
  justify-content: start;
`;

const Label = styled.label`
  display: block;
  margin-top: 15px;
  margin-bottom: 5px;
  text-align: left;
  font-size: 13px;
  color: #9b9b9b;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;

  label {
    font-size: 13px;
    color: #9b9b9b;
  }
`;

const DateContainer = styled.div`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: transparent;
  padding: 0px;
  border-radius: 8px;
`;

const ApplyButton = styled.button`
  margin-top: 10px;
  padding: 10px;
  font-size: 13px;
  color: white;
  background-color: #444444;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #1565c0;
  }
`;

const DropdownContainer = styled.div`
  margin-top: 15px;
  position: relative;
  width: 100%;
  height: 50px;
`;

const DropdownInput = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border: 1px solid gray;
  border-radius: 8px;
  color: white;
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  height: 100%;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #272727;
  border: 1px solid gray;
  border-radius: 8px;
  margin-top: 5px;
  z-index: 1000;
`;

const DropdownOption = styled.div`
  padding: 10px;
  font-size: 13px;
  color: ${(props) => (props.selected ? "#272727" : "white")};
  background: ${(props) => (props.selected ? "#9b9b9b" : "transparent")};
  cursor: pointer;
  user-select: none;

  &:hover {
    background: rgba(255, 255, 255, 0.055);
  }
`;