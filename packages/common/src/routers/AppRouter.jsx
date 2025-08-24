import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';

export function AppRouter(pages) {
    return (
        <Routes>
            <Route path="/login" element={<pages.Login />} />
            <Route path="/" element={<pages.Home />} />

            <Route
                path="/home-mobile"
                element={
                    <PrivateRoute>
                        <pages.HomeMobile />
                    </PrivateRoute>
                }
            />

            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <pages.Dashboard />
                    </PrivateRoute>
                }
            />

            <Route
                path="/cuentas-espejo"
                element={
                    <PrivateRoute>
                        <pages.CuentasEspejo />
                    </PrivateRoute>
                }
            />

            {/* --- BLOQUE DE CONFIGURACIÓN CORREGIDO --- */}
            <Route
                path="/configuracion"
                element={
                    <PrivateRoute>
                        <pages.Configuracion />
                    </PrivateRoute>
                }
            >
                {/* LÍNEA AÑADIDA: Redirección por defecto */}
                <Route
                    index
                    element={<Navigate to="notificaciones-settings" replace />}
                />

                {/* Tus rutas existentes */}
                <Route
                    path="notificaciones-settings"
                    element={<pages.NotificacionSetting />}
                />
                <Route path="usuarios-settings" element={<pages.UsuariosSetting />} />

                {/* Aquí puedes añadir las otras rutas de configuración en el futuro */}
                {/* <Route path="general-settings" element={<GeneralSetting />} />
        <Route path="seguridad-settings" element={<SeguridadSetting />} />
        <Route path="integraciones-settings" element={<IntegracionesSetting />} />
        */}
            </Route>

            {/* --- BLOQUE DE CONFIGURACIÓN CORREGIDO --- */}
            <Route path="/reportes" element={<pages.Reportes />}>
                {/* LÍNEA AÑADIDA: Redirección por defecto */}
                <Route
                    index
                    element={<Navigate to="reporte-historial" replace />}
                />

                {/* Tus rutas existentes */}
                <Route
                    path="reporte-historial"
                    element={<pages.ReporteHistorial />}
                />
                {/* <Route path="usuarios-settings" element={<UsuariosSetting />} />*/}

                {/* Aquí puedes añadir las otras rutas de configuración en el futuro */}
                {/* <Route path="general-settings" element={<GeneralSetting />} />
        <Route path="seguridad-settings" element={<SeguridadSetting />} />
        <Route path="integraciones-settings" element={<IntegracionesSetting />} />
        */}
            </Route>

            <Route
                path="/puntos-interes"
                element={
                    <PrivateRoute>
                        <pages.PuntosInteres />
                    </PrivateRoute>
                }
            />

            <Route
                path="/geocercas"
                element={
                    <PrivateRoute>
                        <pages.Geocercas />
                    </PrivateRoute>
                }
            />

            <Route
                path="/mapa-mobile"
                element={
                    <PrivateRoute>
                        <pages.MapaClasicoTemplate />
                    </PrivateRoute>
                }
            />

            <Route
                path="/buscar-mobile"
                element={
                    <PrivateRoute>
                        <pages.SearchMobile />
                    </PrivateRoute>
                }
            />

            <Route
                path="/notificaciones-mobile"
                element={
                    <PrivateRoute>
                        <pages.NotificationMobile />
                    </PrivateRoute>
                }
            />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}
