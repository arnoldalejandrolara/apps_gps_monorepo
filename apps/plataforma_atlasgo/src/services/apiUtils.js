import { store } from '../store';
import { logout } from '../store/thunks/authThunks';
import { navigateToLogin } from './navigationService';

/**
 * Maneja las respuestas de la API de forma centralizada
 * @param {Response} response - La respuesta de fetch
 * @param {string} errorMessage - Mensaje de error personalizado
 * @returns {Promise<Object>} Los datos de la respuesta
 */
export async function handleApiResponse(response, errorMessage = 'Error en la petición') {
    const data = await response.json();

    if (data.status === 401) {
        // Dispatch logout automático
        store.dispatch(logout());
        
        // Redirigir al login usando navigate
        navigateToLogin();
        
        throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
    } else if (data.status !== 200) {
        throw new Error(errorMessage);
    }

    return data;
}

export async function handleApiResponseWithoutThrow(response, errorMessage = 'Error en la petición') {
    const data = await response.json();

    if (data.status === 401) {
        // Dispatch logout automático
        store.dispatch(logout());
        
        // Redirigir al login usando navigate
        navigateToLogin();
        
        throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
    }

    return data;
}

/**
 * Configuración común para las peticiones fetch
 * @param {string} token - Token de autenticación
 * @returns {Object} Headers comunes
 */
export function getCommonHeaders(token) {
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
} 