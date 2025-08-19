const API_URL_ONLY = import.meta.env.VITE_API_URL_ONLY;
import { handleApiResponse, handleApiResponseWithoutThrow, getCommonHeaders } from './apiUtils';

export async function subscribeToNotificationsRequest(token, subscription) {
    const res = await fetch(`${API_URL_ONLY}/notifications/subscribe`, {
        method: 'POST',
        headers: getCommonHeaders(token),
        body: JSON.stringify({ subscription })
    });

    return await handleApiResponseWithoutThrow(res, 'Error al suscribirse a las notificaciones');
}