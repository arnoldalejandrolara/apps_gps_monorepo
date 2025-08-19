import { createContext, useContext, useState } from 'react';

const MapaWebContext = createContext();

export function useMapaWeb() {
  return useContext(MapaWebContext);
}

export function MapaWebProvider({ children }) {
  const [showMapMobile, setShowMapMobile] = useState(false);
  const [showMapaWebLayer, setShowMapaWebLayer] = useState(false); // Nueva variable

  return (
    <MapaWebContext.Provider value={{
      showMapMobile,
      setShowMapMobile,
      showMapaWebLayer,
      setShowMapaWebLayer,
    }}>
      {children}
    </MapaWebContext.Provider>
  );
}