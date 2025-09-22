import React from "react";
import styled from "styled-components";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// --- TEMA CLARO PARA MATERIAL-UI (Sin cambios) ---
const theme = createTheme({
  palette: {
    mode: "light",
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          height: "35px",
          fontSize: "15px !important",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          "& .MuiInputBase-input": {
            height: "100%",
            color: "#212529",
            fontSize: "15px",
          },
          "& .MuiSvgIcon-root": {
            color: "#6c757d",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: '#ced4da',
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: '#80bdff',
          },
           // Estilo para cuando el campo está deshabilitado
          "&.Mui-disabled": {
            backgroundColor: "#f8f9fa", // Fondo gris claro
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: '#e9ecef', // Borde más claro
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "15px",
          color: "#6c757d",
        },
      },
    },
  },
});

/**
 * MobileDatePickerCustom
 * * Selector de fecha único para mobile.
 */
// --- CAMBIO 1: Se añade `disabled` a las props que recibe el componente ---
export function MobileInputDateTime({
  value,
  onChange,
  label = "Fecha",
  disabled = false, // Se le da un valor por defecto
}) {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <PickerRow>
          <StyledMobileDatePicker
            label={label}
            value={value}
            onChange={onChange}
            // --- CAMBIO 2: Se pasa la prop `disabled` al componente de Material-UI ---
            disabled={disabled}
            slotProps={{
              field: {
                clearable: false,
              },
              textField: {
                fullWidth: true,
              },
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