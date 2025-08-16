import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
    user: Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null,
    isAuthenticated: !!Cookies.get('token'),
    token: Cookies.get('token') || null,
    pushEndpoint: Cookies.get('pushEndpoint') || null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.user.access_token;
            state.isAuthenticated = true;

            // Configuración de cookies para desarrollo
            let cookieOptions = {
                expires: 7,
                secure: false, // Cambiado a false para desarrollo local
                sameSite: 'lax', // Cambiado a lax para desarrollo
                path: '/'
            };

            // Guardar en cookies con las opciones
            try {
                // Primero, limpiar cookies existentes
                Cookies.remove('token');
                Cookies.remove('user');

                // Guardar nuevas cookies
                Cookies.set('user', JSON.stringify(action.payload.user), cookieOptions);
                Cookies.set('token', action.payload.user.access_token, cookieOptions);
                
                // Verificación extendida
                console.log('Payload recibido:', {
                    user: action.payload.user,
                    token: action.payload.user.access_token
                });
                
                console.log('Cookies después de guardar:', {
                    savedToken: Cookies.get('token'),
                    savedUser: Cookies.get('user'),
                    allCookies: document.cookie
                });
            } catch (error) {
                console.error('Error completo:', error);
                console.error('Error guardando cookies:', {
                    message: error.message,
                    stack: error.stack
                });
            }
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            
            // Eliminar cookies con path específico
            Cookies.remove('user', { path: '/' });
            Cookies.remove('token', { path: '/' });
        },
        setPushEndpoint: (state, action) => {
            state.pushEndpoint = action.payload;

            let cookieOptions = {
                expires: 7,
                secure: false, // Cambiado a false para desarrollo local
                sameSite: 'lax', // Cambiado a lax para desarrollo
                path: '/'
            };

            Cookies.set('pushEndpoint', JSON.stringify(action.payload), cookieOptions);
        },
        removePushEndpoint: (state) => {
            state.pushEndpoint = null;

            let cookieOptions = {
                expires: 7,
                secure: false, // Cambiado a false para desarrollo local
                sameSite: 'lax', // Cambiado a lax para desarrollo
                path: '/'
            };

            Cookies.remove('pushEndpoint', cookieOptions);
        }
    }
});

export const { login, logout, setPushEndpoint, removePushEndpoint } = authSlice.actions;
export default authSlice.reducer;