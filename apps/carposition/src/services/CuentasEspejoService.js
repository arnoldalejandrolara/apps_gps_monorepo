const API_URL = import.meta.env.VITE_API_URL;
import { handleApiResponse, getCommonHeaders } from './apiUtils';

export async function getCuentasEspejoTable(token, page, length, order, filters, search) {
    const res = await fetch(`${API_URL}/cuentas-espejo/table?draw=1&start=${page}&length=${length}&search=%7B%22value%22:%22${search}%22,%22regex%22:false%7D&order=%5B%7B%22column%22:0,%22dir%22:%22desc%22%7D%5D&columns=%5B%7B%22data%22:%22imei%22,%22name%22:%22imei%22,%22searchable%22:true,%22orderable%22:true,%22search%22:%7B%22value%22:%22%22,%22regex%22:false%7D%7D%5D`, {
        headers: getCommonHeaders(token)
    });

    return await handleApiResponse(res, 'Error al obtener el historial');
}

export async function createCuentasEspejo(token, body) {
    const res = await fetch(`${API_URL}/cuentas-espejo/create`, {
        method: 'POST',
        headers: getCommonHeaders(token),
        body: JSON.stringify(body)
    });

    return await handleApiResponse(res, 'Error al crear la cuenta espejo');
}

export async function updateCuentasEspejo(token, body) {
    console.log('body', body);
    const {id, ...rest} = body;
    const res = await fetch(`${API_URL}/cuentas-espejo/${id}`, {
        method: 'PUT',
        headers: getCommonHeaders(token),
        body: JSON.stringify(rest)
    });

    return await handleApiResponse(res, 'Error al actualizar la cuenta espejo');
}