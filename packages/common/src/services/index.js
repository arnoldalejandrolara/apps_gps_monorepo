// Exportar explícitamente las funciones de cada módulo
export { loginService, getProtectedData } from './auth/index.js';
export { getLast5Routes, sendComando, goStreetView, getRouteToday } from './dispositivos/index.js';
export { configureApi, getApiUrl, getCommonHeaders, handleApiResponse, handleApiResponseWithoutThrow } from './utils/apiUtils.js';
export { navigateToLogin, setNavigate, navigateTo } from './navigation/index.js';
export { createVirtualGLTF } from './virtualGLTF/index.js';
export { getHistorialTable } from './reportes/index.js';
export { getAlertasList } from './alertas/index.js';
export { getCuentasEspejoTable, createCuentasEspejo, updateCuentasEspejo } from './cuentasEspejo/index.js';
export { subscribeToNotificationsRequest } from './notifications/index.js';
export { getCategoriasPIRequest, getIconosPIRequest, createPIRequest, getPITable, updatePIRequest } from './puntosInteres/index.js';
export { getIconosGeocercas, createGeocerca, getGeocercasTable, updateGeocerca } from './geocercas/index.js';
export { getUsersTable, createUser, checkNickname, updateUser, getDispositivosAsignadosByUser, updateDispositivosAsignadosByUser, asignarPermisos } from './usuarios/index.js';