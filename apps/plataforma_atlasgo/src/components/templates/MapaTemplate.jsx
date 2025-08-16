import React, { useEffect,useState, useMemo, useRef } from "react";

import styled from "styled-components";
import { useMediaQuery } from 'react-responsive';
import { useNavigate, useLocation } from 'react-router-dom';
import { BsThreeDots ,  BsChevronDown} from "react-icons/bs";
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import DeckGL from '@deck.gl/react';
import { ScenegraphLayer } from '@deck.gl/mesh-layers';
import { useSelector } from "react-redux";
import { slides } from "../../utilities/dataEstatica";
import FloatingButton from "../moleculas/FloatingButton";
import BottomSheetCar from '../organismos/BottomSheetCar';
import { getOrientation } from "../../utilities/Functions";
import { TripBuilder } from '../../utilities/TripBuilder';

export const MapaTemplate = () => {
    const [bottomSheet, setBottomSheet] = useState(null); // null | 'config' | 'details'
    const [showSelectOptions, setShowSelectOptions] = useState(false); // Estado para mostrar/ocultar el contenedor del select
    const [selectedOption, setSelectedOption] = useState("Tipo pdi"); // Estado para el valor seleccionado
    const [showOptions, setShowOptions] = useState(false); // Estado para mostrar/ocultar la ventana
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const navigate = useNavigate();
    const location = useLocation();
    const [showCarDetails, setShowCarDetails] = useState(false);
    const [currentTab, setCurrentTab] = useState(0);
    const [timestamp, setTimestamp] = useState(0);
    const startTimeRef = useRef(null);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        console.log("MapaTemplate mobile MONTADO");
        return () => {
          console.log("MapaTemplate mobile DESMONTADO");
        };
      }, []);

    const handleChange = (event, newValue) => {
        setCurrentTab(newValue); // Cambiar el tab actual al seleccionado
    };

    // Estado inicial del viewState
    const [viewState, setViewState] = useState({
        longitude: -101.956114,
        latitude: 22.653024,
        zoom: 10,
        pitch: 0,
        bearing: 0,
    });

    const selectedVehicles = useSelector((state) => state.vehicle?.selectedVehicles || []);
    const selectedVehicle = useSelector((state) => state.vehicle?.selectedVehicles[0] || null);

    const API_URL = import.meta.env.VITE_API_URL;

    // Efecto para actualizar el viewState cuando se selecciona un vehículo
    useEffect(() => {
        if (selectedVehicles.length > 0) {
            const selectedVehicle = selectedVehicles[0];
            
            // Validate that we have a valid route with coordinates
            if (selectedVehicle?.route && 
                Array.isArray(selectedVehicle.route) && 
                selectedVehicle.route.length > 0 && 
                Array.isArray(selectedVehicle.route[0]) && 
                selectedVehicle.route[0].length >= 2) {
                
                console.log("🔍 Validando coordenadas");
                const [lng, lat] = selectedVehicle.route[0];
                
                // Validate that coordinates are valid numbers
                if (typeof lat === 'number' && typeof lng === 'number' &&
                    !isNaN(lat) && !isNaN(lng) &&
                    lat >= -90 && lat <= 90 && // Valid latitude range
                    lng >= -180 && lng <= 180) { // Valid longitude range
                    
                    console.log("🔍 Actualizando viewState con coordenadas:", { lat, lng });
                    // Esperar 500ms antes de actualizar el viewState
                    const timeoutId = setTimeout(() => {
                        setViewState({
                            longitude: lng,
                            latitude: lat,
                            zoom: 12,
                            pitch: 0,
                            bearing: 0,
                            transitionDuration: 500
                        });
                    }, 500);

                    // Limpiar el timeout si el componente se desmonta o cambia el vehículo
                    return () => clearTimeout(timeoutId);
                } else {
                    console.warn('Invalid coordinates:', { lat, lng });
                }
            } else {
                console.warn('Invalid or missing route data for vehicle:', selectedVehicle);
            }
        }
    }, [selectedVehicles]);

    // Referencia para controlar actualizaciones programáticas
    const isProgrammaticUpdate = useRef(false);

    const baseScale = 1;
    const zoomFactor = Math.pow(2, (19 - viewState.zoom));
    const dynamicScale = baseScale * zoomFactor;

    const [selectedCarId, setSelectedCarId] = useState(null);


    // Efecto para manejar la animación
    useEffect(() => {
        // Cancelar cualquier animación existente
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        // Si hay vehículos seleccionados, iniciar la animación inmediatamente
        if (selectedVehicles.length > 0) {
            console.log("🎬 Iniciando animación");
            startTimeRef.current = performance.now();
            setTimestamp(0);

            const animate = (currentTime) => {
                if (!startTimeRef.current) {
                    startTimeRef.current = currentTime;
                }

                const elapsedTime = (currentTime - startTimeRef.current) / 1000;
                setTimestamp(elapsedTime * 10);
                animationFrameRef.current = requestAnimationFrame(animate);
            };

            // Iniciar la animación inmediatamente
            animationFrameRef.current = requestAnimationFrame(animate);
        } else {
            // Si no hay vehículos seleccionados, limpiar la animación
            startTimeRef.current = null;
            setTimestamp(0);
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [selectedVehicles]);

    const trips = useMemo(() => {
        if (!selectedVehicles.length) return [];
        return selectedVehicles.map(vehicle => {
            if (!vehicle.route || vehicle.route.length === 0) {
                console.warn(`⚠️ Vehículo ${vehicle.id} no tiene ruta`);
                return null;
            }

            // Si solo hay un punto en la ruta, duplicarlo para tener una animación mínima
            const waypoints = vehicle.route.length === 1 
                ? [vehicle.route[0], vehicle.route[0]] 
                : vehicle.route;

            return new TripBuilder({
                waypoints: waypoints,
                speed: 100,
                turnSpeed: 90,
                loop: false
            });
        }).filter(trip => trip !== null);
    }, [selectedVehicles]);

    const layers = useMemo(() => {
        if (!selectedVehicles.length || !trips.length) return [];

        const layers_vehicles = selectedVehicles.map((vehicle, index) => {
            const trip = trips[index];
            if (!trip) {
                console.warn(`⚠️ No hay trip para el vehículo ${vehicle.id}`);
                return null;
            }

            const frame = trip.getFrame(timestamp);
            if (!frame) {
                console.warn(`⚠️ No hay frame para el vehículo ${vehicle.id}`);
                return null;
            }

            const layer = new ScenegraphLayer({
                id: `vehicle-${vehicle.id}`,
                data: [{
                    position: frame.point,
                    info: vehicle.info
                }],
                scenegraph: `${API_URL}/unidades/model3d?type=car&r=255&g=0&b=0`,
                getPosition: d => d.position,
                getOrientation: [0, 180 - frame.heading, 90],
                sizeScale: dynamicScale,
                _lighting: 'pbr',
                pickable: true,
                onClick: (info) => {
                    if (bottomSheet === "details" && selectedCarId === vehicle.id) {
                        setBottomSheet(null);
                        setSelectedCarId(null);
                    } else {
                        setBottomSheet("details");
                        setSelectedCarId(vehicle.id);
                    }
                }
            });
            return layer;
        }).filter(layer => layer !== null);

        return layers_vehicles;
    }, [selectedVehicles, trips, timestamp, dynamicScale]);

    useEffect(() => {
        if (!isMobile && location.pathname === "/mapa-mobile") {
            navigate("/");
        }

    }, [isMobile, location.pathname, navigate]);

    const handleOptionSelect = (option) => {
        console.log(`${option} seleccionada`);
        setSelectedOption(option); // Actualizamos el valor seleccionado
        setShowSelectOptions(false); // Cerramos el modal flotante del select

        setViewState({
            longitude: -101.956114,
            latitude: 22.653024,
            zoom: 15,
            pitch: 0,
            bearing: 0,
        });
    };

    const handleConfigClick = () => {
        if (bottomSheet === "config") {
        setBottomSheet(null);
        } else {
        setBottomSheet("config");
        setSelectedCarId(null);
        }
    };

    return (
        <MapContainer>
            {/* <div id="map" style={{ height: "100vh", width: "100%" }}></div> */}
            <DeckGL
                    initialViewState={viewState}
                    controller={true}
                    layers={layers}
                    onViewStateChange={params => {
                        // Solo actualizar si no es una actualización programática
                        setViewState(params.viewState);
                    }}
                >
                    <Map mapId="64d9b619826759eb"
                        mapTypeId={'roadmap'}
                        colorScheme={'DARK'}
                        // zoom={viewState.zoom} // Nivel de zoom
                        // center={{ lat: viewState.latitude, lng: viewState.longitude }} // Coor
                        defaultZoom={14}
                        defaultCenter={{ lat: 19.4326, lng: -99.1332 }} // Usa un centro por defecto
                        options={{
                            // styles:darkModeStyle,
                            mapTypeControl: false,
                            mapTypeControlOptions: {
                                style: 2, // HORIZONTAL_BAR
                                position: 3, // TOP_RIGHT
                                // mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain']
                            },
                            streetViewControl: false,
                            fullscreenControl: false,
                            zoomControl: false,
                            zoomControlOptions: {
                                position: 3 // TOP_RIGHT
                            },
                            gestureHandling: 'cooperative',
                        }}
                    />
                </DeckGL>

            <FloatingButton
            icon={BsThreeDots}
            onClick={handleConfigClick}
            position="top-right"
            size={40}
            />

        
            <BottomSheetCar
                show={bottomSheet !== null}
                bottomSheet={bottomSheet}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                showSelectOptions={showSelectOptions}
                setShowSelectOptions={setShowSelectOptions}
                handleOptionSelect={handleOptionSelect}
                selectedVehicle={selectedVehicle}
                slides={slides}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                onClose={() => setBottomSheet(null)}
                getOrientation={getOrientation}
            />


        </MapContainer>
    );
};

// Styled-components
const MapContainer = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
`;
