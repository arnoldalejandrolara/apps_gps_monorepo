// src/store/slices/pdiViewSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showPdiMarkers: false, // Por defecto, los marcadores están ocultos
};

export const pdiViewSlice = createSlice({
  name: 'mapView',
  initialState,
  reducers: {
    // Esta es nuestra "acción"
    togglePdiMarkers: (state) => {
      // Simplemente cambia el valor de true a false y viceversa
      state.showPdiMarkers = !state.showPdiMarkers;
    },
  },
});

// Exportamos la acción para usarla en los componentes
export const { togglePdiMarkers } = pdiViewSlice.actions;

// Exportamos el reducer para añadirlo a la tienda principal
export default pdiViewSlice.reducer;