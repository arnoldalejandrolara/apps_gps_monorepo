import { getApiUrl, handleApiResponse, getCommonHeaders } from '../utils/apiUtils';

export async function getMarcasUnidades(token) {
    const res = await fetch(`${getApiUrl()}/unidades/marcas`, {
        headers: getCommonHeaders(token)
    });

    return await handleApiResponse(res, 'Error al obtener las marcas de las unidades');
}

export async function getTiposUnidades(token) {
    const res = await fetch(`${getApiUrl()}/unidades/tipos`, {
        headers: getCommonHeaders(token)
    });

    return await handleApiResponse(res, 'Error al obtener los tipos de las unidades');
}