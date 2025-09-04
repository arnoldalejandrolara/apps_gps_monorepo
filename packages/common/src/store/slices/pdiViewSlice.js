// src/store/slices/pdiViewSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showPdiMarkers: false, // Por defecto, los marcadores están ocultos
  pdiData: [],
};

export const pdiViewSlice = createSlice({
  name: 'pdiView',
  initialState,
  reducers: {
    // Esta es nuestra "acción"
    togglePdiMarkers: (state) => {
      // Simplemente cambia el valor de true a false y viceversa
      state.showPdiMarkers = !state.showPdiMarkers;
    },
    setPdiData: (state, action) => {
      state.pdiData = action.payload;
    },
  },
});

// Exportamos la acción para usarla en los componentes
export const { togglePdiMarkers, setPdiData } = pdiViewSlice.actions;

// Exportamos el reducer para añadirlo a la tienda principal
export default pdiViewSlice.reducer;