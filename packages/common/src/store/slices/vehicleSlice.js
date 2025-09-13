import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedVehicles: [],
    initialImei: null,
    vehicles: [],
    isLoading: false,
    error: null
};

export const vehicleSlice = createSlice({
    name: 'vehicle',
    initialState,
    reducers: {
        setSelectedVehicles: (state, action) => {
            state.selectedVehicles = action.payload;
        },
        addSelectedVehicle: (state, action) => {
            //console.log("🚗 Añadiendo vehículo:", action.payload);
            // if (!state.selectedVehicles.some(vehicle => vehicle.id === action.payload.id)) {
            //     state.selectedVehicles.push(action.payload);
            // } else {
            //     state.selectedVehicles = state.selectedVehicles.filter(
            //         vehicle => vehicle.id !== action.payload.id
            //     );
            // }

            state.selectedVehicles = [action.payload];
        },
        addSelectedVehicleMobile: (state, action) => { // Añadir vehículo seleccionado desde el mapa solo uno
            state.selectedVehicles = [state.vehicles.find(vehicle => vehicle.id === action.payload.id)];
        },
        removeSelectedVehicle: (state, action) => {
            state.selectedVehicles = state.selectedVehicles.filter(
                vehicle => vehicle.id !== action.payload.id
            );
        },
        setVehicles: (state, action) => {
            state.vehicles = action.payload;
        },
        setVehicleRoute: (state, action) => {
            // search vehicle by imei and set route
            const vehicle = state.vehicles.find(vehicle => vehicle.id === action.payload.id);
            if (vehicle) {
                vehicle.route.push(...action.payload.route);
                //console.log(vehicle.route, "vehicle.route");
            }

            // state.vehicles = state.vehicles.map(vehicle => {
            //     if (vehicle.id === action.payload.id) {
            //         return { ...vehicle, route: action.payload.route };
            //     }
            //     return vehicle;
            // });
        },
        setVehicleNewRegister: (state, action) => {
            const vehicle = state.vehicles.find(vehicle => vehicle.imei === action.payload.imei);

            if (vehicle) {
                // Ensure vehicle.route exists, if not initialize it
                if (!vehicle.route) {
                    vehicle.route = [];
                }

                // Add new coordinates from action.payload.location
                if (action.payload.location && typeof action.payload.location.x === 'number' && typeof action.payload.location.y === 'number') {
                    // Si ya hay puntos en la ruta, mantener solo el último y añadir el nuevo
                    if (vehicle.route.length > 0) {
                        const lastPoint = vehicle.route[vehicle.route.length - 1];
                        vehicle.route = [lastPoint, [action.payload.location.y, action.payload.location.x]];
                    } else {
                        // Si no hay puntos, solo añadir el nuevo
                        vehicle.route = [[action.payload.location.y, action.payload.location.x]];
                    }
                }
                vehicle.posicion_actual.id_alerta = action.payload.id_alerta;
                vehicle.posicion_actual.alerta = action.payload.alerta;
                vehicle.posicion_actual.fecha = action.payload.fecha;
                vehicle.posicion_actual.velocidad = action.payload.velocidad;
                vehicle.posicion_actual.odometro = action.payload.odometro;
                vehicle.posicion_actual.horometro = action.payload.horometro;

                // Actualizar también en selectedVehicles si el vehículo está seleccionado
                const selectedIndex = state.selectedVehicles.findIndex(v => v.id === vehicle.id);
                if (selectedIndex !== -1) {
                    state.selectedVehicles = [vehicle];
                }
            }
        },
        resetVehicles: (state) => {
            state.vehicles = [];
            state.selectedVehicles = [];
        },
        setInitialImei: (state, action) => {
            state.initialImei = action.payload;
        }
    }
});

export const { 
    setSelectedVehicles, 
    addSelectedVehicle, 
    removeSelectedVehicle, 
    setVehicles,
    addSelectedVehicleMobile,
    setVehicleRoute,
    setVehicleNewRegister,
    resetVehicles,
    setInitialImei
} = vehicleSlice.actions;

export default vehicleSlice.reducer;