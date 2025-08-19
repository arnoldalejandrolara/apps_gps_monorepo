const API_URL = import.meta.env.VITE_API_URL;
import { handleApiResponse, getCommonHeaders } from './apiUtils';

export async function getAlertasList(token, lastIdAlert) {
    const res = await fetch(`${API_URL}/alertas/listado/${lastIdAlert}`, {
        headers: getCommonHeaders(token)
    });

    return await handleApiResponse(res, 'Error al obtener las alertas');
}
