import React, { createContext, useState, useContext } from "react";

// Crear el Context
const GeoContext = createContext();

// Proveedor del Context
export const GeoProvider = ({ children }) => {
  const [geoState, setGeoState] = useState({
    isPointOfInterestOpen: false,
    isGeofenceOpen: false,
  });

  const togglePointOfInterest = () => {
    setGeoState((prevState) => ({
      ...prevState,
      isPointOfInterestOpen: !prevState.isPointOfInterestOpen,
    }));
  };

  const toggleGeofence = () => {
    setGeoState((prevState) => ({
      ...prevState,
      isGeofenceOpen: !prevState.isGeofenceOpen,
    }));
  };

  return (
    <GeoContext.Provider
      value={{
        geoState,
        togglePointOfInterest,
        toggleGeofence,
      }}
    >
      {children}
    </GeoContext.Provider>
  );
};

// Hook personalizado para usar el Context
export const useGeoContext = () => {
  return useContext(GeoContext);
};