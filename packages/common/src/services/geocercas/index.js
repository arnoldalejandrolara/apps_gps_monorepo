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

export async function updateGeocerca(token, id, data) {
    const res = await fetch(`${getApiUrl()}/geocercas/${id}`, {
        method: 'PUT',
        headers: getCommonHeaders(token),
        body: JSON.stringify(data)
    });

    return await handleApiResponseWithoutThrow(res, 'Error al actualizar la geocerca');
}

export async function getGeocercasTable(token, page, length, order, search) {
    const res = await fetch(`${getApiUrl()}/geocercas/table?draw=1&start=${page}&length=${length}&search=%7B%22value%22:%22${search}%22,%22regex%22:false%7D&order=%5B%7B%22column%22:0,%22dir%22:%22desc%22%7D%5D&columns=%5B%7B%22data%22:%22nombre%22,%22name%22:%22nombre%22,%22searchable%22:true,%22orderable%22:true,%22search%22:%7B%22value%22:%22%22,%22regex%22:false%7D%7D%5D`, {
        method: 'GET',
        headers: getCommonHeaders(token),
    });

    return await handleApiResponseWithoutThrow(res, 'Error al obtener la tabla de geocercas');
}