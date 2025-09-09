let API_URL = '';
let navigateFunction = null;
let logoutFunction = null;

export function configureApi(apiUrl) {
    API_URL = apiUrl;
}

export function setNavigateFunction(navigate) {
    navigateFunction = navigate;
}

export function setLogoutFunction(logout) {
    logoutFunction = logout;
}

export function getApiUrl() {
    return API_URL;
}

export function getCommonHeaders(token) {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

export async function handleApiResponse(response, errorMessage = 'Error en la petición') {
    const data = await response.json();

    if (data.status === 401) {
        // Dispatch logout automático si está disponible
        if (logoutFunction) {
            logoutFunction();
        }
        
        // Redirigir al login usando navigate si está disponible
        if (navigateFunction) {
            navigateFunction();
        }

        throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
    } else if (data.status !== 200) {
        if(data.message){
            throw new Error(data.message);
        }
        throw new Error(errorMessage);
    }

    return data;
}

export function handleApiResponseWithoutThrow(response, errorMessage = 'Error en la petición') {
    return handleApiResponse(response, errorMessage);
}