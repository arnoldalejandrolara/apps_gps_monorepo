import styled, { keyframes } from "styled-components";
import { useState, useEffect, useMemo, useRef } from "react";
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import DeckGL from '@deck.gl/react';
import { ScenegraphLayer } from '@deck.gl/mesh-layers';
import { TripBuilder } from '../../utilities/TripBuilder';
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { useWebSocket } from "../../context/WebSocketContext";
import { useSelector, useDispatch } from "react-redux";

import { SidebarListaCar } from "../organismos/sidebar/SidebarListaCar.jsx";
import "../../styled-components/sweetAlert.css";
import { useCommandDialog } from "../../utilities/useCommandDialog.jsx";

// Ventana flotante SIEMPRE visible en la esquina inferior izquierda
function VehicleWindowInfo({ vehicle }) {
    
    return (
        <WindowContainer>
            <Header>
                <span>Unidad #1</span>
            </Header>
            <Body>
                <Row><strong>Estado:</strong> Encendido</Row>
                <Row><strong>Chofer:</strong> Lara</Row>
                <Row><strong>Última actualización:</strong> N/A</Row>
                {/* Puedes agregar más información aquí */}
            </Body>
        </WindowContainer>
    );
}

export function HomeTemplate() {
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("success");
    const [alertKey, setAlertKey] = useState(0);

    const showCommandDialog = useCommandDialog({ setAlertMessage, setAlertSeverity });

    const [timestamp, setTimestamp] = useState(0);
    const vehicles = useSelector((state) => state.vehicle?.vehicles || []);
    const startTimeRef = useRef(null);
    const animationFrameRef = useRef(null);

    const selectedVehicles = useSelector((state) => state.vehicle?.selectedVehicles || []);
    const dispatch = useDispatch();

    const token = useSelector((state) => state.auth?.token);

    const [viewState, setViewState] = useState({
        longitude: -101.956114,
        latitude: 22.653024,
        zoom: 5,
        pitch: 0,
        bearing: 0,
    });

    const { sendMessage, addMessageHandler } = useWebSocket();

    useEffect(() => {
        console.log("MapaTemplate MONTADO");
        return () => {
            console.log("MapaTemplate DESMONTADO");
        };
    }, []);

    useEffect(() => {
        if (selectedVehicles.length > 0) {
            const selectedVehicle = selectedVehicles[0];
            if (
                selectedVehicle?.route &&
                Array.isArray(selectedVehicle.route) &&
                selectedVehicle.route.length > 0 &&
                Array.isArray(selectedVehicle.route[0]) &&
                selectedVehicle.route[0].length >= 2
            ) {
                const [lng, lat] = selectedVehicle.route[0];
                if (
                    typeof lat === "number" &&
                    typeof lng === "number" &&
                    !isNaN(lat) &&
                    !isNaN(lng) &&
                    lat >= -90 &&
                    lat <= 90 &&
                    lng >= -180 &&
                    lng <= 180
                ) {
                    setViewState({
                        longitude: lng,
                        latitude: lat,
                        zoom: 15,
                        pitch: 0,
                        bearing: 0,
                        transitionDuration: 500,
                    });
                }
            }
        }
    }, [selectedVehicles]);

    useEffect(() => {
        const animate = (currentTime) => {
            if (!startTimeRef.current) {
                startTimeRef.current = currentTime;
            }
            const elapsedTime = (currentTime - startTimeRef.current) / 1000;
            setTimestamp(elapsedTime * 10);
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        startTimeRef.current = performance.now();
        setTimestamp(0);
        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [selectedVehicles]);

    const trips = useMemo(() => {
        if (!selectedVehicles.length) return [];
        return selectedVehicles
            .map((vehicle) => {
                if (!vehicle.route || vehicle.route.length === 0) {
                    return null;
                }
                const waypoints = vehicle.route;
                return new TripBuilder({
                    waypoints: waypoints,
                    speed: 100,
                    turnSpeed: 90,
                    loop: false,
                });
            })
            .filter((trip) => trip !== null);
    }, [selectedVehicles]);

    useEffect(() => {
        const cleanup = addMessageHandler((data) => {
            try {
                // Aquí tu lógica de procesamiento de mensajes
            } catch (error) {
                console.error("Error al procesar el mensaje:", error);
            }
        });
        return cleanup;
    }, [addMessageHandler]);

    const baseScale = 1;
    const zoomFactor = Math.pow(2, 19 - viewState.zoom);
    const dynamicScale = baseScale * zoomFactor;
    const API_URL = import.meta.env.VITE_API_URL;

    const layers = useMemo(() => {
        if (!selectedVehicles.length || !trips.length) return [];
        const layers_vehicles = selectedVehicles.map((vehicle, index) => {
            const trip = trips[index];
            if (!trip) return null;
            const frame = trip.getFrame(timestamp);
            if (!frame) return null;
            const layer = new ScenegraphLayer({
                id: `vehicle-${vehicle.id}`,
                data: [
                    {
                        position: frame.point,
                        info: vehicle.info,
                    },
                ],
                scenegraph: `${API_URL}/unidades/model3d?type=car&r=255&g=0&b=0`,
                getPosition: (d) => d.position,
                getOrientation: [0, 180 - frame.heading, 90],
                sizeScale: dynamicScale,
                _lighting: "pbr",
                pickable: true,
                onClick: (info) => {
                    // No hace falta condicional, no hay botón de cerrar
                },
            });
            return layer;
        }).filter(layer => layer !== null);
        return layers_vehicles;
    }, [selectedVehicles, trips, timestamp, dynamicScale]);

    // Mostrar SIEMPRE la info del primer vehículo seleccionado (si hay alguno)
    const vehicleToShow = selectedVehicles.length > 0 ? selectedVehicles[0] : null;

    return (
        <Container>
            <MainContent>
                {/* <SidebarListaCar vehicles={vehicles} handleCardClick={() => {}} /> */}
                <MapSection>
                    {/* Ventana flotante SIEMPRE en la esquina inferior izquierda */}
                    {/* <VehicleWindowInfo vehicle={vehicleToShow} /> */}
                    <DeckGL
                        initialViewState={viewState}
                        controller={true}
                        layers={layers}
                        onViewStateChange={(params) => setViewState(params.viewState)}
                    >
                        <Map
                            mapId="64d9b619826759eb"
                            mapTypeId={"roadmap"}
                            colorScheme={"LIGHT"}
                            defaultZoom={14}
                            defaultCenter={{ lat: 19.4326, lng: -99.1332 }}
                            onTilesLoaded={() => {
                                console.log(
                                    "Mapa cargado correctamente - Tiles cargados"
                                );
                            }}
                            options={{
                                mapTypeControl: false,
                                mapTypeControlOptions: {
                                    style: 2,
                                    position: 3,
                                },
                                streetViewControl: false,
                                fullscreenControl: false,
                                zoomControl: false,
                                zoomControlOptions: {
                                    position: 3,
                                },
                                gestureHandling: "cooperative",
                            }}
                        />
                    </DeckGL>
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

// Estilos para la ventana flotante en la esquina inferior izquierda
const WindowContainer = styled.div`
  position: absolute;
  left: 32px;
  bottom: 32px;
  z-index: 1200;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 8px 32px #0003;
  min-width: 260px;
  max-width: 350px;
  padding: 18px 22px 16px 22px;
  font-size: 15px;
  border: 1px solid #e3e3e3;
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
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  color: #222;
`;

const Row = styled.div`
  font-size: 15px;
`;