let navigateFunction = null;

export function setNavigate(navigate) {
    navigateFunction = navigate;
}

export function navigateTo(path, options = {}) {
    if (navigateFunction) {
        navigateFunction(path, options);
    } else {
        // Fallback a window.location si navigate no está disponible
        window.location.href = path;
    }
}

export function navigateToLogin() {
    navigateTo('/login');
} 