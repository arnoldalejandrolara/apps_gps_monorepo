import React from "react";
import styled from "styled-components";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          height: "48px",
          fontSize: "15px !important",
          backgroundColor: "#222",
          borderRadius: "12px",
          "& .MuiInputBase-input": {
            height: "100%",
            color: "#fff",
            fontSize: "15px",
          },
          "& .MuiSvgIcon-root": {
            color: "#90caf9",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "15px",
          color: "#aaa",
        },
      },
    },
  },
});

/**
 * MobileDateRangePickerCustom
 * 
 * Selector de rango de fechas para mobile, muestra los dos pickers en el mismo row y SIN ícono a la izquierda.
 */
export function MobileDateRangePickerCustom({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  labelStart = "Fecha inicial",
  labelEnd = "Fecha final",
}) {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <PickerRow>
          <StyledMobileDatePicker
            label={labelStart}
            value={startDate}
            onChange={onStartChange}
            disablePortal
            slotProps={{
              // Quitar la cruz: clearable: false
              field: {
                clearable: false,
              },
              textField: {
                fullWidth: true,
              },
            }}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root, & .MuiPickersInputBase-root": {
                borderRadius: "12px",
              },
              "& .MuiInputLabel-root": {
                fontSize: "15px",
              },
            }}
          />
          <StyledMobileDatePicker
            label={labelEnd}
            value={endDate}
            onChange={onEndChange}
            disablePortal
            slotProps={{
              field: {
                clearable: false,
              },
              textField: {
                fullWidth: true,
              },
            }}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root, & .MuiPickersInputBase-root": {
                borderRadius: "12px",
              },
              "& .MuiInputLabel-root": {
                fontSize: "15px",
              },
            }}
          />
        </PickerRow>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

// Ahora los pickers estarán en el mismo row, pero en mobile (max-width: 600px) estarán en columna
const PickerRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 12px;
  max-width: 450px;
  margin: 0 auto;
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 8px;
    max-width: 100%;
  }
`;

const StyledMobileDatePicker = styled(MobileDatePicker)`
  width: 100%;
`;

export default MobileDateRangePickerCustom;