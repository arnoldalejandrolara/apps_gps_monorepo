import { handleApiResponseWithoutThrow, getCommonHeaders, getApiUrl } from '../utils/apiUtils';

export async function getIconosGeocercas(token) {
    const res = await fetch(`${getApiUrl()}/geocercas/iconos`, {
        method: 'GET',
        headers: getCommonHeaders(token)
    });

    return await handleApiResponseWithoutThrow(res, 'Error al obtener los iconos de las geocercas');
}

export async function createGeocerca(token, data) {
    const res = await fetch(`${getApiUrl()}/geocercas`, {
        method: 'POST',
        headers: getCommonHeaders(token),
        body: JSON.stringify(data)
    });

    return await handleApiResponseWithoutThrow(res, 'Error al crear la geocerca');
}