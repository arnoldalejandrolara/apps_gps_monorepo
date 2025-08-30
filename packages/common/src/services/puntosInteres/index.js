import { handleApiResponseWithoutThrow, getCommonHeaders, getApiUrl } from '../utils/apiUtils';

export async function getCategoriasPIRequest(token) {
    const res = await fetch(`${getApiUrl()}/pi/categorias`, {
        method: 'GET',
        headers: getCommonHeaders(token)
    });

    return await handleApiResponseWithoutThrow(res, 'Error al obtener las categorías de puntos de interés');
}

export async function getIconosPIRequest(token) {
    const res = await fetch(`${getApiUrl()}/pi/iconos`, {
        method: 'GET',
        headers: getCommonHeaders(token)
    });

    return await handleApiResponseWithoutThrow(res, 'Error al obtener los iconos de puntos de interés');
}

export async function createPIRequest(token, data) {
    const res = await fetch(`${getApiUrl()}/pi`, {
        method: 'POST',
        headers: getCommonHeaders(token),
        body: JSON.stringify(data)
    });

    return await handleApiResponseWithoutThrow(res, 'Error al crear el punto de interés');
}

export async function getPITable(token, page, pageSize, sort, filter) {
    const res = await fetch(`${getApiUrl()}/pi/table?page=${page}&pageSize=${pageSize}&sort=${sort}&filter=${filter}`, {
        method: 'GET',
        headers: getCommonHeaders(token)
    });

    return await handleApiResponseWithoutThrow(res, 'Error al obtener la tabla de puntos de interés');
}

export async function updatePIRequest(token, id, data) {
    const res = await fetch(`${getApiUrl()}/pi/${id}`, {
        method: 'PUT',
        headers: getCommonHeaders(token),
        body: JSON.stringify(data)
    });

    return await handleApiResponseWithoutThrow(res, 'Error al actualizar el punto de interés');
}