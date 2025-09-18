import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Home } from '../pages/Home';
import { HomeMobile } from '../pages/HomeMobile';
import { Reportes } from '../pages/Reportes';
import { CuentasEspejo } from '../pages/CuentasEspejo';
import { PuntosInteres } from '../pages/PuntosInteres';
import { Geocercas } from '../pages/Geocercas';
import { PrivateRoute } from './PrivateRoute';
import  {SearchMobile}  from '../pages/SearchMobile';
import { NotificationMobile } from '../pages/NotificationMobile';
import { MapaClasicoTemplate } from '../components/templates/MapaClasicoTemplate';
import {Dashboard} from '../pages/Dashboard';
import { Configuracion } from '../pages/Configuracion';
import { NotificacionSetting } from '../pages/NotificacionSetting';
import { UsuariosSetting } from '../pages/UsuariosSetting';
import { ReporteHistorial } from '../pages/ReporteHistorial';

export function AppRouter() {
  return (
    <Routes>
      <Route 
        path="/login" 
        element={<Login />} 
      />
      <Route 
        path="/" 
        element={
         
            <Home />
         
        } 
      />

      <Route 
        path="/home-mobile" 
        element={
          // <PrivateRoute>
            <HomeMobile  />
          // </PrivateRoute>
        } 
      />

      <Route 
        path="/dashboard" 
        element={
          // <PrivateRoute>
            <Dashboard />
          // </PrivateRoute>
        } 
      />
{/* 
      <Route 
        path="/reportes" 
        element={
          <PrivateRoute>
            <Reportes />
          </PrivateRoute>
        } 
      /> */}

      <Route 
        path="/cuentas-espejo" 
        element={
          // <PrivateRoute>
            <CuentasEspejo />
          // </PrivateRoute>
        } 
      />

      {/* --- BLOQUE DE CONFIGURACIÓN CORREGIDO --- */}
      <Route path="/configuracion" element={<PrivateRoute><Configuracion /></PrivateRoute>}>
        
        {/* LÍNEA AÑADIDA: Redirección por defecto */}
        <Route index element={<Navigate to="notificaciones-settings" replace />} />

        {/* Tus rutas existentes */}
        <Route path="notificaciones-settings" element={<NotificacionSetting />} />
        <Route path="usuarios-settings" element={<UsuariosSetting />} />
        
        {/* Aquí puedes añadir las otras rutas de configuración en el futuro */}
        {/* <Route path="general-settings" element={<GeneralSetting />} />
        <Route path="seguridad-settings" element={<SeguridadSetting />} />
        <Route path="integraciones-settings" element={<IntegracionesSetting />} />
        */}
      </Route>


 {/* --- BLOQUE DE CONFIGURACIÓN CORREGIDO --- */}
      <Route path="/reportes" element={<Reportes />}>
        
        {/* LÍNEA AÑADIDA: Redirección por defecto */}
        <Route index element={<Navigate to="reporte-historial" replace />} />

        {/* Tus rutas existentes */}
        <Route path="reporte-historial" element={<ReporteHistorial />} />
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
            <PuntosInteres />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/geocercas" 
        element={
          <PrivateRoute>
            <Geocercas />
          </PrivateRoute>
        } 
      />

       <Route 
        path="/mapa-mobile" 
        element={
          <PrivateRoute>
            <MapaClasicoTemplate />
          </PrivateRoute>
        } 
      />

      {/* <Route 
        path="/dashboard-mobile" 
        element={
          <PrivateRoute>
            <DashboardMobile />
          </PrivateRoute>
        } 
      /> */}
 

      <Route 
        path="/buscar-mobile" 
        element={
          <PrivateRoute>
            <SearchMobile />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/notificaciones-mobile" 
        element={
          <PrivateRoute>
            <NotificationMobile />
          </PrivateRoute>
        } 
      /> 

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}