import { handleApiResponse, getCommonHeaders, getApiUrl } from '../utils/apiUtils';

export async function getLast5Routes(token, imei) {
    const res = await fetch(`${getApiUrl()}/dispositivos/${imei}/5-registros`, {
        headers: getCommonHeaders(token)
    });
    
    return await handleApiResponse(res, 'Error al obtener las últimas 5 rutas');
}

export async function sendComando(token, imei, comando) {
    const res = await fetch(`${getApiUrl()}/dispositivos/comando`, {
        method: 'POST',
        headers: getCommonHeaders(token),
        body: JSON.stringify({ imei, comando })
    });

    return await handleApiResponse(res, 'Error al enviar el comando');
}

export async function goStreetView(latitude, longitude) {
    // go to google maps street view with new URL format
    window.open(`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}`, '_blank');
}