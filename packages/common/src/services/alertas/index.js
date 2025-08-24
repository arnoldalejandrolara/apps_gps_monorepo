import { handleApiResponse, getCommonHeaders, getApiUrl } from '../utils/apiUtils';

export async function getAlertasList(token, lastIdAlert) {
    const res = await fetch(`${getApiUrl()}/alertas/listado/${lastIdAlert}`, {
        headers: getCommonHeaders(token)
    });

    return await handleApiResponse(res, 'Error al obtener las alertas');
}
