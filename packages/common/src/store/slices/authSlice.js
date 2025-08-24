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
                secure: false,
                sameSite: 'lax',
                path: '/'
            };

            try {
                Cookies.remove('token');
                Cookies.remove('user');
                Cookies.set('user', JSON.stringify(action.payload.user), cookieOptions);
                Cookies.set('token', action.payload.user.access_token, cookieOptions);
            } catch (error) {
                console.error('Error guardando cookies:', error);
            }
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            
            Cookies.remove('user', { path: '/' });
            Cookies.remove('token', { path: '/' });
        },
        setPushEndpoint: (state, action) => {
            state.pushEndpoint = action.payload;

            let cookieOptions = {
                expires: 7,
                secure: false,
                sameSite: 'lax',
                path: '/'
            };

            Cookies.set('pushEndpoint', JSON.stringify(action.payload), cookieOptions);
        },
        removePushEndpoint: (state) => {
            state.pushEndpoint = null;

            let cookieOptions = {
                expires: 7,
                secure: false,
                sameSite: 'lax',
                path: '/'
            };

            Cookies.remove('pushEndpoint', cookieOptions);
        }
    }
});

export const { login, logout, setPushEndpoint, removePushEndpoint } = authSlice.actions;
export default authSlice.reducer;
