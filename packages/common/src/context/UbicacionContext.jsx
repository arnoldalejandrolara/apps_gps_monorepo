import { createContext, useContext, useEffect, useState } from 'react';

const UbicacionContext = createContext();

export const UbicacionProvider = ({ children }) => {
    const [ubicacion, setUbicacion] = useState(null);

    useEffect(() => {
        const cached = localStorage.getItem('ubicacion');
        if (cached) {
            setUbicacion(JSON.parse(cached));
            return;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const loc = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    };
                    setUbicacion(loc);
                    localStorage.setItem('ubicacion', JSON.stringify(loc));
                },
                (err) => {
                    const fallback = { lat: 19.432608, lng: -99.133209 };
                    setUbicacion(fallback);
                    localStorage.setItem('ubicacion', JSON.stringify(fallback));
                }
            );
        }
    }, []);

    return (
        <UbicacionContext.Provider value={ubicacion}>
            {children}
        </UbicacionContext.Provider>
    );
};

export const useUbicacion = () => useContext(UbicacionContext);
