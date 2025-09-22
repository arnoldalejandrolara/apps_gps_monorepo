import styled, { keyframes } from "styled-components";
import { useState, useEffect, useMemo, useRef } from "react";
// 1. Limpieza de importaciones: solo necesitamos Map de react-map-gl
import Map from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { useWebSocket } from "../../context/WebSocketContext";
import { useSelector, useDispatch } from "react-redux";

import { SidebarListaCar } from "../organismos/sidebar/SidebarListaCar.jsx";
import "../../styled-components/sweetAlert.css";
import { useCommandDialog } from "../../utilities/useCommandDialog.jsx";

// La ventana flotante no necesita cambios
function VehicleWindowInfo({ vehicle }) {
    if (!vehicle) return null;

    return (
        <WindowContainer>
            <Header>
                <span>Unidad #{vehicle.id || 'N/A'}</span>
            </Header>
            <Body>
                <Row><strong>Estado:</strong> {vehicle.info?.status || 'Encendido'}</Row>
                <Row><strong>Chofer:</strong> {vehicle.info?.driver || 'Lara'}</Row>
                <Row><strong>Última actualización:</strong> N/A</Row>
            </Body>
        </WindowContainer>
    );
}

export function HomeTemplate() {
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("success");
    const [alertKey, setAlertKey] = useState(0);

    const showCommandDialog = useCommandDialog({ setAlertMessage, setAlertSeverity });

    // 2. Eliminación de estados y hooks de DeckGL:
    // Se eliminó 'timestamp', 'startTimeRef', 'animationFrameRef' y el useEffect para la animación.
    const vehicles = useSelector((state) => state.vehicle?.vehicles || []);
    const selectedVehicles = useSelector((state) => state.vehicle?.selectedVehicles || []);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth?.token);

    const [viewState, setViewState] = useState({
        longitude: -98.1726, // Centrado cerca de Miramar, Tamaulipas
        latitude: 22.3331,
        zoom: 10,
        pitch: 0,
        bearing: 0,
    });

    const { sendMessage, addMessageHandler } = useWebSocket();
    
    useEffect(() => {
        // Este efecto sigue funcionando para centrar el mapa en un vehículo seleccionado
        if (selectedVehicles.length > 0) {
            const selectedVehicle = selectedVehicles[0];
            if (
                selectedVehicle?.route &&
                Array.isArray(selectedVehicle.route) &&
                selectedVehicle.route.length > 0
            ) {
                const [lng, lat] = selectedVehicle.route[0];
                if (typeof lat === "number" && typeof lng === "number") {
                    setViewState(prev => ({
                        ...prev,
                        longitude: lng,
                        latitude: lat,
                        zoom: 15,
                        transitionDuration: 1000, // react-map-gl maneja la transición suave
                    }));
                }
            }
        }
    }, [selectedVehicles]);
    
    const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    // Se eliminó el 'useMemo' para 'trips' y 'layers' ya que no se usa DeckGL.
    
    const vehicleToShow = selectedVehicles.length > 0 ? selectedVehicles[0] : null;

    return (
        <Container>
            <MainContent>
                <SidebarListaCar vehicles={vehicles} handleCardClick={() => {}} />
                <MapSection>
                    <VehicleWindowInfo vehicle={vehicleToShow} />
                    
                    {/* 3. Modificación del componente Map */}
                    <Map
                        // viewState controla la cámara del mapa
                        {...viewState}
                        // onMove actualiza el estado cuando el usuario mueve el mapa
                        onMove={evt => setViewState(evt.viewState)}
                        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
                        // Estilo de mapa oscuro proporcionado por Mapbox
                        mapStyle="mapbox://styles/mapbox/dark-v11" 
                        style={{ width: '100%', height: '100%' }}
                    >
                        {/* Aquí podrías agregar marcadores para los vehículos si lo deseas */}
                    </Map>
                </MapSection>
            </MainContent>

            {alertMessage && (
                <AlertContainer key={alertKey}>
                    <Stack sx={{ width: "100%" }} spacing={2}>
                        <Alert variant="filled" severity={alertSeverity}>
                            {alertMessage}
                        </Alert>
                    </Stack>
                </AlertContainer>
            )}
        </Container>
    );
}

// Los styled-components no necesitan cambios
const slideOutLeft = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
`;

const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const AlertContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 70px;
  z-index: 1000;
  width: auto;
  max-width: 300px;
  animation: ${slideInRight} 0.5s ease-in-out, ${slideOutLeft} 0.5s ease-in-out 3s;
`;

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f4f4;
  position: relative;
`;

const MainContent = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  min-height: 0;
  min-width: 0;
`;

const MapSection = styled.section`
  flex: 1;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  position: relative;
`;

const WindowContainer = styled.div`
  position: absolute;
  left: 32px;
  bottom: 32px;
  z-index: 1200;
  background-color: #2c3e50; /* Color oscuro para que combine */
  color: #ecf0f1; /* Texto claro */
  border-radius: 6px;
  box-shadow: 0 8px 32px #00000050;
  min-width: 260px;
  max-width: 350px;
  padding: 18px 22px 16px 22px;
  font-size: 15px;
  border: 1px solid #34495e;
  animation: fadeIn 0.25s;
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(.92); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-bottom: 10px;
  color: #ffffff;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  color: #bdc3c7; /* Color de texto secundario */
`;

const Row = styled.div`
  font-size: 15px;
  strong {
    color: #ecf0f1;
  }
`;