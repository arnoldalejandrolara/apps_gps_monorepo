import { createAsyncThunk } from '@reduxjs/toolkit';
import { logout as logoutAction } from '../slices/authSlice';
import { resetNotifications } from '../slices/notificationSlice';
import { resetVehicles } from '../slices/vehicleSlice';

// Thunk para logout que limpia todos los slices
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { dispatch }) => {
        // Dispatch logout action
        dispatch(logoutAction());
        
        // Dispatch reset actions para limpiar otros slices
        dispatch(resetNotifications());
        dispatch(resetVehicles());
        
        return null;
    }
); 