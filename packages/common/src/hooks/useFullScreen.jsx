import { useState, createContext, useContext } from "react";

// Crear el contexto
const FullScreenContext = createContext();

// Proveedor del contexto para encapsular la lógica
export const FullScreenProvider = ({ children }) => {
    const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);

    const openFullScreen = () => setIsFullScreenOpen(true);
    const closeFullScreen = () => setIsFullScreenOpen(false);

    return (
        <FullScreenContext.Provider value={{ isFullScreenOpen, openFullScreen, closeFullScreen }}>
        {children}
        </FullScreenContext.Provider>
    );
};

// Hook para usar el contexto
export const useFullScreen = () => {
    const context = useContext(FullScreenContext);

    if (!context) {
        throw new Error("useFullScreen debe usarse dentro de un FullScreenProvider");
    }

    return context;
};