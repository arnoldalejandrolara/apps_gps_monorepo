import { createContext, useContext, useState } from 'react';

const MapViewContext = createContext();

export function useMapView() {
    return useContext(MapViewContext);
}

export function MapViewProvider({ children }) {
    const [showMapMobile, setShowMapMobile] = useState(false);
    const [showMapWebLayer, setShowMapWebLayer] = useState(false);

    return (
        <MapViewContext.Provider
            value={{
                showMapMobile,
                setShowMapMobile,
                showMapWebLayer,
                setShowMapWebLayer,
            }}
        >
            {children}
        </MapViewContext.Provider>
    );
}
