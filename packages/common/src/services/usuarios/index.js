import { getApiUrl, handleApiResponse, getCommonHeaders } from '../utils/apiUtils';

export async function getUsersTable(
    token,
    page,
    length,
    order,
    filters,
    search,
    id_tipo
) {
    let status = '';

    if (id_tipo) {
        status += `&id_tipo=${id_tipo}`;
    }

    const res = await fetch(`${getApiUrl()}/usuarios/table?draw=1&start=${page}&length=${length}&search=%7B%22value%22:%22${search}%22,%22regex%22:false%7D&order=%5B%7B%22column%22:0,%22dir%22:%22desc%22%7D%5D&columns=%5B%7B%22data%22:%22imei%22,%22name%22:%22imei%22,%22searchable%22:true,%22orderable%22:true,%22search%22:%7B%22value%22:%22%22,%22regex%22:false%7D%7D%5D${status}`, {
        headers: getCommonHeaders(token)
    });
    return await handleApiResponse(res, 'Error al obtener el historial');
}

export async function createUser(token, data) {
    const res = await fetch(`${getApiUrl()}/usuarios`, {
        method: 'POST',
        headers: getCommonHeaders(token),
        body: JSON.stringify(data)
    });
    return await handleApiResponse(res, 'Error al crear el usuario');
}

export async function checkNickname(token, nickname) {
    const res = await fetch(`${getApiUrl()}/usuarios/check-nickname`, {
        method: 'POST',
        headers: getCommonHeaders(token),
        body: JSON.stringify({ nickname })
    });
    return await handleApiResponse(res, 'Error al verificar el nickname');
}

export async function updateUser(token, id, data) {
    const res = await fetch(`${getApiUrl()}/usuarios/${id}`, {
        method: 'PUT',
        headers: getCommonHeaders(token),
        body: JSON.stringify(data)
    });
    return await handleApiResponse(res, 'Error al actualizar el usuario');
}