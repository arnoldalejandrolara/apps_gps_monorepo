import { createAsyncThunk } from '@reduxjs/toolkit';
import { addSelectedVehicle, setVehicles } from '../slices/vehicleSlice';

// Thunk para verificar y obtener coordenadas de un vehículo
export const checkAndFetchVehicleCoordinates = createAsyncThunk(
    'vehicle/checkAndFetchCoordinates',
    async (vehicle, { dispatch, getState }) => {
        try {
            // Si el vehículo ya tiene coordenadas, lo añadimos directamente
            if (vehicle.historial_coordenadas) {
                const vehicleObject = {
                    id: vehicle.imei,
                    route: [
                        [
                            vehicle.historial_coordenadas.y,
                            vehicle.historial_coordenadas.x
                        ]
                    ],
                    speed: vehicle.historial_velocidad || 0,
                    color: hexToRgb(vehicle.unidad_color),
                    info: {
                        año: vehicle.unidad_anio,
                        placas: vehicle.placa,
                        modelo: vehicle.unidad_modelo,
                        color: vehicle.unidad_color
                    }
                };
                dispatch(addSelectedVehicle(vehicleObject));
                return vehicleObject;
            }

            // Si no tiene coordenadas, hacemos la petición para obtenerlas
            const API_URL = import.meta.env.VITE_API_URL;
            const response = await fetch(`${API_URL}/unidades/${vehicle.imei}/coordenadas`);
            
            if (!response.ok) {
                throw new Error('Error al obtener coordenadas del vehículo');
            }

            const data = await response.json();
            
            // Actualizamos el vehículo con las nuevas coordenadas
            const updatedVehicle = {
                ...vehicle,
                historial_coordenadas: data.coordenadas
            };

            const vehicleObject = {
                id: updatedVehicle.imei,
                route: [
                    [
                        updatedVehicle.historial_coordenadas.y,
                        updatedVehicle.historial_coordenadas.x
                    ]
                ],
                speed: updatedVehicle.historial_velocidad || 0,
                color: hexToRgb(updatedVehicle.unidad_color),
                info: {
                    año: updatedVehicle.unidad_anio,
                    placas: updatedVehicle.placa,
                    modelo: updatedVehicle.unidad_modelo,
                    color: updatedVehicle.unidad_color
                }
            };

            dispatch(addSelectedVehicle(vehicleObject));
            return vehicleObject;
        } catch (error) {
            console.error('Error al procesar el vehículo:', error);
            throw error;
        }
    }
);

// Función auxiliar para convertir color hex a RGB
function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b];
} 