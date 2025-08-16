// Servicio de navegación que permite usar navigate desde cualquier parte de la app
let navigateFunction = null;

/**
 * Configura la función de navegación (debe ser llamada desde un componente con useNavigate)
 * @param {Function} navigate - Función de navigate de React Router
 */
export function setNavigate(navigate) {
    navigateFunction = navigate;
}

/**
 * Navega a una ruta específica
 * @param {string} path - Ruta a la que navegar
 * @param {Object} options - Opciones adicionales de navegación
 */
export function navigateTo(path, options = {}) {
    if (navigateFunction) {
        navigateFunction(path, options);
    } else {
        // Fallback a window.location si navigate no está disponible
        window.location.href = path;
    }
}

/**
 * Navega al login (usado para logout)
 */
export function navigateToLogin() {
    navigateTo('/login');
} 