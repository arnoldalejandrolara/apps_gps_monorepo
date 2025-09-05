import React from "react";
import styled from "styled-components";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// --- TEMA CLARO PARA MATERIAL-UI ---
const theme = createTheme({
  palette: {
    mode: "light", // 1. Se establece el modo claro
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        // 2. Se ajustan los estilos para un fondo blanco y texto oscuro
        root: {
          height: "48px",
          fontSize: "15px !important",
          backgroundColor: "#ffffff", // Fondo blanco
          borderRadius: "12px",
          "& .MuiInputBase-input": {
            height: "100%",
            color: "#212529", // Texto oscuro
            fontSize: "15px",
          },
          "& .MuiSvgIcon-root": {
            color: "#6c757d", // Icono gris
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: '#ced4da', // Borde gris claro
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: '#80bdff', // Borde azul en hover
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "15px",
          color: "#6c757d", // Color de etiqueta gris
        },
      },
    },
  },
});

/**
 * MobileDateRangePickerCustom
 * * Selector de rango de fechas para mobile, muestra los dos pickers en el mismo row y SIN ícono a la izquierda.
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
            slotProps={{
              field: {
                clearable: false,
              },
              textField: {
                fullWidth: true,
              },
               // 👇 SE AÑADE EL Z-INDEX DIRECTAMENTE AQUÍ
               dialog: {
                sx: { zIndex: 9999 }
              }
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
            slotProps={{
              field: {
                clearable: false,
              },
              textField: {
                fullWidth: true,
              },
               // 👇 SE AÑADE EL Z-INDEX DIRECTAMENTE AQUÍ
               dialog: {
                sx: { zIndex: 9999 }
              }
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