    import { handleApiResponseWithoutThrow, getCommonHeaders, getApiUrl } from '../utils/apiUtils';

export async function subscribeToNotificationsRequest(token, subscription) {
    const res = await fetch(`${getApiUrl()}/notifications/subscribe`, {
        method: 'POST',
        headers: getCommonHeaders(token),
        body: JSON.stringify({ subscription })
    });

    return await handleApiResponseWithoutThrow(res, 'Error al suscribirse a las notificaciones');
}