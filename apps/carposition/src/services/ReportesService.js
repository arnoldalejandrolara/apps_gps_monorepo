const API_URL = import.meta.env.VITE_API_URL;
import { handleApiResponse, getCommonHeaders } from './apiUtils';

export async function getHistorialTable(
    page,
    length,
    order,
    filters,
    search,
    token,
    fecha_inicio,
    fecha_fin,
    imei
) {
    let status = '';

    if (fecha_inicio) {
        status += `&fecha_inicio=${fecha_inicio}`;
    }
    if (fecha_fin) {
        status += `&fecha_fin=${fecha_fin}`;
    }
    if (imei) {
        status += `&imei=${imei}`;
    }

    const res = await fetch(
        `${API_URL}/reportes/historial?draw=1&start=${page}&length=${length}&search=%7B%22value%22:%22${search}%22,%22regex%22:false%7D&order=%5B%7B%22column%22:0,%22dir%22:%22desc%22%7D%5D&columns=%5B%7B%22data%22:%22imei%22,%22name%22:%22imei%22,%22searchable%22:true,%22orderable%22:true,%22search%22:%7B%22value%22:%22%22,%22regex%22:false%7D%7D%5D${status}`,
        {
            headers: getCommonHeaders(token)
        }
    );
    
    return await handleApiResponse(res, 'Error al obtener el historial');
}