import React, { useState } from "react";
import styled from "styled-components";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export function DateRangePickerCustom({ startDate, endDate, onStartChange, onEndChange }) {
  const [internalStart, setInternalStart] = useState(startDate || null);
  const [internalEnd, setInternalEnd] = useState(endDate || null);

  const startValue = onStartChange ? startDate : internalStart;
  const endValue = onEndChange ? endDate : internalEnd;

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
            height: "50px",
            fontSize: "13px !important",
            backgroundColor: "#333333",
            borderRadius: "8px",
            "& .MuiInputBase-input": {
              height: "100%",
              color: "white",
              fontSize: "13px",
            },
            "& .MuiSvgIcon-root": {
              color: "#bbdefb",
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: { fontSize: "13px" },
        },
      },
      MuiPickersDay: { styleOverrides: { root: { fontSize: "13px" } } },
      MuiPickersCalendarHeader: { styleOverrides: { label: { fontSize: "13px" } } },
      MuiPickersYear: { styleOverrides: { root: { fontSize: "13px" } } },
      MuiPickersMonth: { styleOverrides: { root: { fontSize: "13px" } } },
      MuiPickersDayCalendar: { styleOverrides: { day: { fontSize: "13px" } } },
      MuiPickersInputBase: { styleOverrides: { section: { fontSize: "13px" } } },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <RowContainer>
          <DatePicker
            label="Fecha inicial"
            value={startValue}
            onChange={(newValue) => {
              if (onStartChange) onStartChange(newValue);
              else setInternalStart(newValue);
            }}
            disablePortal
            slotProps={{
              field: {
                clearable: true,
                onClear: () => {
                  if (onStartChange) onStartChange(null);
                  else setInternalStart(null);
                },
              },
            }}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px !important",
              },
              "& .MuiPickersInputBase-root": {
                borderRadius: "8px !important",
              }
            }}
          />
          <DatePicker
            label="Fecha final"
            value={endValue}
            onChange={(newValue) => {
              if (onEndChange) onEndChange(newValue);
              else setInternalEnd(newValue);
            }}
            disablePortal
            slotProps={{
              field: {
                clearable: true,
                onClear: () => {
                  if (onEndChange) onEndChange(null);
                  else setInternalEnd(null);
                },
              },
            }}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px !important",
              },
              "& .MuiPickersInputBase-root": {
                borderRadius: "8px !important",
              }
            }}
          />
        </RowContainer>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

// Estilos
const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding: 6px;
  border-radius: 8px;
  width: 45%;
`;