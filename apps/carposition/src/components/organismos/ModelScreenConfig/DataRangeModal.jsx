// src/organismos/ModelScreenConfig/DateRangeModal.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, Stack } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

// Estilos para el contenedor del modal, imitando tu tema oscuro
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'fit-content',
  bgcolor: '#2E2E2E',
  border: '1px solid #444',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
  color: '#E0E0E0',
};

export function DateRangeModal({ open, onClose, onApply, initialRange }) {
  // Estado interno para no modificar el estado principal hasta aplicar
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Sincronizar estado interno cuando el modal se abre con las fechas actuales
  useEffect(() => {
    if (open) {
      setStartDate(initialRange.start ? dayjs(initialRange.start) : null);
      setEndDate(initialRange.end ? dayjs(initialRange.end) : null);
    }
  }, [open, initialRange]);
  
  const handleApply = () => {
    onApply({ start: startDate, end: endDate });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
            Seleccionar Rango de Fechas
          </Typography>
          
          <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
            <DatePicker
              label="Fecha de inicio"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              sx={datePickerStyles}
            />
            <DatePicker
              label="Fecha de finalización"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              minDate={startDate} // No se puede seleccionar una fecha final anterior a la de inicio
              sx={datePickerStyles}
            />
          </Stack>
          
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={onClose} sx={{ color: '#A0A0A0' }}>Cancelar</Button>
            <Button 
              onClick={handleApply} 
              variant="contained" 
              sx={{ backgroundColor: '#6EE7B7', color: '#111', '&:hover': { backgroundColor: '#58d6a3' } }}
            >
              Aplicar
            </Button>
          </Stack>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
}

// Estilos para que los DatePicker encajen con el tema oscuro
const datePickerStyles = {
  // Estilo del label
  '& label': {
    color: '#A0A0A0',
  },
  '& label.Mui-focused': {
    color: '#6EE7B7',
  },
  // Estilo del input
  '& .MuiOutlinedInput-root': {
    color: '#E0E0E0',
    '& fieldset': {
      borderColor: '#4a4a4a',
    },
    '&:hover fieldset': {
      borderColor: '#777',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6EE7B7',
    },
    '& .MuiSvgIcon-root': { // Estilo del icono del calendario
      color: '#A0A0A0',
    }
  }
};