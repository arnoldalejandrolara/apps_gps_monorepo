import React, { createContext, useState, useContext } from 'react';

// 1. Creamos el contexto
const ViewContext = createContext();

// 2. Creamos el Proveedor del contexto
export const ViewProvider = ({ children }) => {
  // 'map' será la vista por defecto al cargar la página
  const [activeView, setActiveView] = useState('map');

  return (
    <ViewContext.Provider value={{ activeView, setActiveView }}>
      {children}
    </ViewContext.Provider>
  );
};

// 3. Creamos un hook para usar el contexto fácilmente
export const useView = () => {
  return useContext(ViewContext);
};