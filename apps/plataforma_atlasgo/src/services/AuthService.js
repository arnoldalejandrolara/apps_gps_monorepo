const API_URL = import.meta.env.VITE_API_URL;
import { handleApiResponse, getCommonHeaders } from './apiUtils';

export async function loginService(username, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    let data = await res.json();

    if (data.status != 200) throw new Error('Credenciales incorrectas');

    return data;
}

export async function getProtectedData(token) {
    const res = await fetch(`${API_URL}/auth/protected-data`, {
        headers: getCommonHeaders(token)
    });

    return await handleApiResponse(res, 'No autorizado');
}
