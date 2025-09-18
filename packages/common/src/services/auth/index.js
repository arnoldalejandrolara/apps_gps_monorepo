import { getApiUrl, handleApiResponse, getCommonHeaders } from '../utils/apiUtils';

export async function loginService(username, password) {
    const res = await fetch(`${getApiUrl()}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    let data = await res.json();

    if (data.status != 200) throw new Error('Credenciales incorrectas');

    return data;
}

export async function getProtectedData(token) {
    const res = await fetch(`${getApiUrl()}/auth/protected-data`, {
        headers: getCommonHeaders(token)
    });

    return await handleApiResponse(res, 'No autorizado');
}

/**
 * Valida un token de URL y obtiene los datos del usuario
 * @param {string} token - Token obtenido de la URL
 * @returns {Promise<Object>} Datos del usuario si el token es válido
 */
export async function validateTokenFromUrl(token) {
    const res = await fetch(`${getApiUrl()}/auth/validate-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
    });

    return await handleApiResponse(res, 'Token inválido o expirado');
}