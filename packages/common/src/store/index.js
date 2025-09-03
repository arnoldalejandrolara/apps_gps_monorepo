import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import vehicleReducer from './slices/vehicleSlice';
import notificationReducer from './slices/notificationSlice';
import mapViewReducer from './slices/pdiViewSlice'; // 👈 1. IMPÓRTALO AQUÍ
import geoViewReducer from './slices/geoViewSlice'; // 👈 1. IMPÓRTALO AQUÍ

export const store = configureStore({
    reducer: {
        auth: authReducer,
        vehicle: vehicleReducer,
        notification: notificationReducer,
        mapView: mapViewReducer, // 👈 2. AÑÁDELO AQUÍ A LA LISTA
        geofenceView: geoViewReducer, // 👈 2. AÑÁDELO AQUÍ A LA LISTA
    },
});

export default store;
