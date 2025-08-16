import React, { useEffect,useState, useMemo } from "react";
import styled from "styled-components";
import { useMediaQuery } from 'react-responsive';
import { useNavigate, useLocation } from 'react-router-dom';
import { BsThreeDots ,  BsChevronDown} from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import DeckGL from '@deck.gl/react';
import { ScenegraphLayer } from '@deck.gl/mesh-layers';
import FloatingButton from "../moleculas/FloatingButton";
import { getOrientation } from "../../utilities/Functions";
import { slides } from "../../utilities/dataEstatica";
import { useSelector } from "react-redux";
import BottomSheetCar from './BottomSheetCar';

export const DetalleCar = ({onBack}) => {
    // Un solo estado para control del bottomsheet
    const [bottomSheet, setBottomSheet] = useState(null); // null | 'config' | 'details'
    const [showSelectOptions, setShowSelectOptions] = useState(false); // Estado para mostrar/ocultar el contenedor del select
    const [selectedOption, setSelectedOption] = useState("Tipo pdi"); // Estado para el valor seleccionado
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const navigate = useNavigate();
    const location = useLocation();
    const [currentTab, setCurrentTab] = useState(0);


    const [viewState, setViewState] = useState({
        longitude:  -99.195504 ,
        latitude:   19.523743,
        zoom: 13,
        pitch: 0,
        bearing: 0,
    });

    const selectedVehicles = useSelector((state) => state.vehicle?.selectedVehicles || []);
    const selectedVehicle = useSelector((state) => state.vehicle?.selectedVehicles[0] || null);

    useEffect(() => {
      // console.log("🎯 Vehículos seleccionados:", selectedVehicles);
        if (selectedVehicles.length > 0) {
            //console.log("🎯 Vehículos seleccionados:", selectedVehicles);
            const lastSelected = selectedVehicles[selectedVehicles.length - 1];
            if (lastSelected?.coordinates) {
                setViewState(prev => ({
                    ...prev,
                    longitude: lastSelected.coordinates[1],
                    latitude: lastSelected.coordinates[0],
                    zoom: 15,
                    transitionDuration: 1000
                }));
            }
        }
    }, [selectedVehicles]);

    const baseScale = 1;
    const zoomFactor = Math.pow(2, (19 - viewState.zoom));
    const dynamicScale = baseScale * zoomFactor;

    const [selectedCarId, setSelectedCarId] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    // LAYERS
    const layers = useMemo(() => {
        if (!selectedVehicles.length) return [];
        return selectedVehicles.map((vehicle) => {
            return new ScenegraphLayer({
                id: `vehicle-${vehicle.id}`,
                data: [{
                position: vehicle.route[0],
                info: vehicle.info,
                id: vehicle.id
                }],
                scenegraph: `${API_URL}/unidades/model3d?type=car&r=255&g=0&b=0`,
                getPosition: d => d.position,
                getOrientation: [0, 180, 90],
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
        });
    }, [selectedVehicles, dynamicScale, selectedCarId, bottomSheet]);

    useEffect(() => {
        if (!isMobile && location.pathname === "/mapa-mobile") {
            navigate("/");
        }

    }, [isMobile, location.pathname, navigate]);

    const handleOptionSelect = (option) => {
        console.log(`${option} seleccionada`);
        setSelectedOption(option); // Actualizamos el valor seleccionado
        setShowSelectOptions(false); // Cerramos el modal flotante del select
    };

    const handleConfigClick = () => {
        if (bottomSheet === "config") {
        setBottomSheet(null);
        } else {
        setBottomSheet("config");
        setSelectedCarId(null);
        }
    };

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    return (
        <MapContainer>
            <APIProvider apiKey="AIzaSyBgNmR7s6iIP55wskrCK-735AxUNm1KpU0">
                <DeckGL
                    initialViewState={viewState}
                    controller={true}
                    layers={layers}
                    onViewStateChange={params => setViewState(params.viewState)}
                >
                  
                    <Map mapId="64d9b619826759eb"
                        mapTypeId={'roadmap'}
                        colorScheme={'DARK'}
                        // zoom={viewState.zoom} // Nivel de zoom
                        // center={{ lat: viewState.latitude, lng: viewState.longitude }} // Coor
                        defaultZoom={14}
                        defaultCenter={{ lat:   19.523743, lng:  -99.195504 }} // Usa un centro por defecto
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
            </APIProvider>

            <FloatingButton
            icon={IoIosArrowBack}
            onClick={onBack}
            position="top-left"
            size={40}
            />

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
    height: 94vh;
    width: 100%;
    overflow: hidden;
`;

