import React from 'react';
import NotificacionesMobile from './ContentModMobile/NotificacionesMobile';
import ProfileMobile from './ContentModMobile/ProfileMobile';
export const ActiveContentMobile = ({ view }) => {
  // Usamos un 'switch' para decidir qué contenido renderizar
  // basado en la prop 'view' que recibimos desde App.js
  switch (view) {
    case 'dashboard':
      return (
        <div>
          <h2>Perfil de Usuario</h2>
          <p>Opciones del perfil aquí.</p>
        </div>
      );

    case 'notifications':
      return (
        <>
        <NotificacionesMobile/>
        </>
      );

    case 'profile':
      return (
        <>
            <ProfileMobile/>
        </>
      );

    // Si por alguna razón 'view' no coincide, no mostramos nada
    default:
      return null;
  }
};