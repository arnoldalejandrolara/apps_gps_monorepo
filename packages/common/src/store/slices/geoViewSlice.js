import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showGeofences: false, // Por defecto, las geocercas están ocultas
};

export const geofenceViewSlice = createSlice({
  name: 'geofenceView',
  initialState,
  reducers: {
    // Acción para mostrar/ocultar las geocercas
    toggleGeofences: (state) => {
      state.showGeofences = !state.showGeofences;
    },
  },
});

// Exportamos la acción para usarla en los componentes
export const { toggleGeofences } = geofenceViewSlice.actions;

// Exportamos el reducer para añadirlo a la tienda principal
export default geofenceViewSlice.reducer;