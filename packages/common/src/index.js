import { store } from './store/index.js';
import { logout } from './store/thunks/index.js';
import { setNavigateFunction, setLogoutFunction } from './services/utils/apiUtils.js';

// Configurar las dependencias para apiUtils
setLogoutFunction(() => store.dispatch(logout()));

// Exportar todo
export { store } from './store/index.js';
export {
    setVehicleRoute,
    addSelectedVehicle,
    removeSelectedVehicle,
    setVehicles,
    addSelectedVehicleMobile,
    setVehicleNewRegister,
    resetVehicles
} from './store/slices/index.js';

export { 
    useNotifications, 
    useFullScreen, 
    usePWA, 
    usePoperMenu 
} from './hooks/index.js';
export { 
    AuthProvider, 
    useAuth,
    WebSocketProvider,
    useWebSocket,
    GeoProvider,
    useGeoContext,
    MapViewProvider,
    useMapView,
    UbicacionProvider,
    useUbicacion,
    ViewProvider,
    useView
} from './context/index.js';
export {
    loginService,
    getProtectedData,
    getLast5Routes,
    sendComando,
    goStreetView,
    configureApi,
    getApiUrl,
    getCommonHeaders,
    handleApiResponse,
    handleApiResponseWithoutThrow,
    navigateToLogin,
    setNavigate,
    navigateTo,
    createVirtualGLTF,
    getHistorialTable,
    getAlertasList,
    getCuentasEspejoTable,
    createCuentasEspejo,
    updateCuentasEspejo,
    subscribeToNotificationsRequest,
    getCategoriasPIRequest,
    getIconosPIRequest,
    createPIRequest,
    getPITable,
    updatePIRequest,
    getIconosGeocercas,
    createGeocerca
} from './services/index.js';