import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { IoClose } from "react-icons/io5";
import { FaChevronLeft, FaMapMarkerAlt, FaLocationArrow } from 'react-icons/fa';
import Map, { Marker, Source, Layer } from 'react-map-gl/mapbox';
import * as turf from '@turf/turf';
import { CustomSelect } from './CustomSelect';
import { createPIRequest, updatePIRequest } from '@mi-monorepo/common/services';
import { useSelector } from 'react-redux';

// --- Componente Modal para el Mapa ---
function MapModal({
  onClose,
  viewState,
  setViewState,
  marker,
  circleData,
  isResizing,
  handleMapClick,
  handleCircleResize,
  setIsResizing,
  circleRadius,
  mapContent // Se recibe el contenido del mapa como prop
}) {
  return ReactDOM.createPortal(
    <ModalBackdrop>
      <ModalContent>
        <ModalHeader>
          <h4>Selecciona la Ubicación</h4>
          <CloseButton onClick={onClose}><IoClose /></CloseButton>
        </ModalHeader>
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          style={{ width: '100%', flexGrow: 1 }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={MAPBOX_TOKEN}
          onClick={handleMapClick}
          cursor="crosshair" // Cursor fijo para móvil
        >
          {mapContent}
        </Map>
        <ModalFooter>
          <SaveButton onClick={onClose}>Aceptar</SaveButton>
        </ModalFooter>
      </ModalContent>
    </ModalBackdrop>,
    document.body
  );
}

// --- Componente Principal del Formulario ---
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYXJub2xkYWxlamFuZHJvbGFyYSIsImEiOiJjbWVtZ3ZtOG0wcnJyMmpwbGZ6ajloamYzIn0.y2qjqVBVoFYJSPaDwayFGw';

export function PuntoInteresForm({ onBack, point, categorias, iconos }) {
  const token = useSelector(state => state.auth.token);
  const [formData, setFormData] = useState({
    nombre: '', coordenadas: '', latitud: '', longitud: '', categoria: 1,
    icono: 1, comentarios: '', radio: 50
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMapModalOpen, setMapModalOpen] = useState(false);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (point) {
      const lat = point.coordenadas.x;
      const lng = point.coordenadas.y;
      setFormData({
        nombre: point.nombre, latitud: lat, longitud: lng,
        categoria: point.id_categoria, icono: point.id_icono, comentarios: point.comentarios,
        radio: point.radio, coordenadas: `${lat}, ${lng}`
      });
      setViewState({ longitude: lng, latitude: lat, zoom: 14 });
      setMarker({ longitude: lng, latitude: lat });
      updateCircle(point.radio, { longitude: lng, latitude: lat });
    }
  }, [point]);

  const [viewState, setViewState] = useState({ longitude: -97.872464, latitude: 22.289529, zoom: 11 });
  const [marker, setMarker] = useState(null);
  const [cursorStyle, setCursorStyle] = useState('grab'); // Estado para el cursor del mapa de escritorio
  const [circleData, setCircleData] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [circleRadius, setCircleRadius] = useState(50);

  const updateCircle = (newRadius, customMarker = marker) => {
    if (customMarker) {
      const center = [customMarker.longitude, customMarker.latitude];
      const circlePolygon = turf.circle(center, newRadius, { steps: 64, units: 'meters' });
      setCircleData(circlePolygon);
      setCircleRadius(newRadius);
      setFormData(prev => ({ ...prev, radio: Math.round(newRadius) }));
    }
  };

  const handleMapClick = (evt) => {
    const { lng, lat } = evt.lngLat;
    const newMarker = { longitude: lng, latitude: lat };
    setMarker(newMarker);
    setFormData(prev => ({ ...prev, latitud: lat.toFixed(6), longitud: lng.toFixed(6), coordenadas: `${lat.toFixed(6)}, ${lng.toFixed(6)}` }));
    updateCircle(circleRadius, newMarker);
  };

  const handleCircleResize = (evt) => {
    if (marker) {
      const { lng, lat } = evt.lngLat;
      const center = [marker.longitude, marker.latitude];
      const mousePos = [lng, lat];
      const distance = turf.distance(center, mousePos, { units: 'meters' });
      const newRadius = Math.max(5, Math.min(500000, distance));
      updateCircle(newRadius);
    }
  };

  // CORRECCIÓN: Manejadores del cursor para el mapa de escritorio
  const handleMouseEnter = () => setCursorStyle('pointer');
  const handleMouseLeave = () => setCursorStyle('grab');
  const handleDragStart = () => setCursorStyle('grabbing');
  const handleDragEnd = () => setCursorStyle('grab');

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleCategoriaChange = (val) => setFormData(prev => ({ ...prev, categoria: val }));
  const handleIconChange = (val) => setFormData(prev => ({ ...prev, icono: val }));

  const iconosOptions = iconos.map(icon => ({ id: icon.id, name: icon.nombre }));
  const categoriasOptions = categorias.map(categoria => ({ id: categoria.id, name: categoria.nombre }));

  const handleSave = async () => {
    // ... (lógica de guardado sin cambios)
  };

  // CAMBIO: Se define el contenido del mapa en una variable para reutilizarlo
  const mapContent = (
    <>
      {circleData && (
        <Source id="circle-source" type="geojson" data={circleData}>
          <Layer id="circle-fill-layer" type="fill" paint={{ 'fill-color': '#007bff', 'fill-opacity': 0.2 }} />
          <Layer id="circle-outline-layer" type="line" paint={{ 'line-color': '#007bff', 'line-width': 2 }} />
        </Source>
      )}
      {circleData && marker && (
        <Marker
          longitude={marker.longitude + (circleRadius / 111320) * Math.cos(0)}
          latitude={marker.latitude}
          anchor="center"
          draggable={true}
          onDragStart={() => setIsResizing(true)}
          onDrag={handleCircleResize}
          onDragEnd={() => setIsResizing(false)}
        >
          {/* CORRECCIÓN: Se unifica el manejador de redimensión */}
          
          <ResizeHandle>
            <div style={{ width: '16px', height: '16px', backgroundColor: isResizing ? '#ff6b35' : '#007bff', border: '2px solid white', borderRadius: '50%', cursor: 'ew-resize', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }} />
          </ResizeHandle>

        </Marker>
      )}
      {marker && (
        <Marker longitude={marker.longitude} latitude={marker.latitude} anchor="bottom">
          {/* CORRECCIÓN: Se unifica el marcador animado */}
          <AnimatedMarkerIcon>
            <FaMapMarkerAlt style={{ fontSize: '2.5rem', color: '#e63946', filter: 'drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.4))' }} />
          </AnimatedMarkerIcon>
        </Marker>
      )}
    </>
  );

  return (
    <>
      <FormContainer>
        <FormHeader>
          <BackButton onClick={onBack}>
            <FaChevronLeft style={{ marginRight: '8px' }} />
            Volver
          </BackButton>
        </FormHeader>
        <FormContent>
          <FormSection>
            <h2>{point ? 'Editar Punto de Interés' : 'Nuevo Punto de Interés'}</h2>
            <FormGroup>
                <Label>Nombre del Punto</Label>
                <Input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej. Oficina Principal" />
            </FormGroup>
            <FormGroup>
              <CustomSelect label="Icono" options={iconosOptions} value={formData.icono} onChange={handleIconChange} showSearch={true} />
            </FormGroup>
            <FormGroup>
              <CustomSelect showSearch={false} label="Tipo" options={categoriasOptions} value={formData.categoria} onChange={handleCategoriaChange} />
            </FormGroup>

            {isMobile ? (
              <FormGroup>
                <Label>Ubicación en el Mapa</Label>
                <PlaceOnMapButton onClick={() => setMapModalOpen(true)}>
                  <FaLocationArrow style={{marginRight: '8px'}} />
                  {formData.coordenadas ? `(${formData.coordenadas})` : 'Colocar PDI'}
                </PlaceOnMapButton>
              </FormGroup>
            ) : (
              <FormGroup>
                  <Label>Coordenadas (haz clic en el mapa)</Label>
                  <Input name="coordenadas" value={formData.coordenadas} readOnly placeholder="Selecciona en el mapa" />
              </FormGroup>
            )}

            <FormGroup>
              <Label>Radio del círculo: {Math.round(circleRadius)}m</Label>
              <RadiusInfo><span>💡 Arrastra el punto azul en el borde para cambiar el tamaño.</span></RadiusInfo>
              <ResetRadiusButton onClick={() => updateCircle(50)}>Resetear a 50m</ResetRadiusButton>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="comentarios">Comentarios</Label>
              <TextArea id="comentarios" placeholder="Escribe notas adicionales aquí..." name="comentarios" value={formData.comentarios} onChange={handleChange} />
            </FormGroup>
            <ButtonContainer>
              <SaveButton onClick={handleSave}>Guardar</SaveButton>
            </ButtonContainer>
          </FormSection>

          {!isMobile && (
            <MapSection>
              <Map
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                style={{width: '100%', height: '100%'}}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken={MAPBOX_TOKEN}
                onClick={handleMapClick}
                // CAMBIO: Se aplica el cursor dinámico solo en escritorio
                cursor={cursorStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                {/* CAMBIO: Se usa la variable con el contenido del mapa */}
                {mapContent}
              </Map>
            </MapSection>
          )}
        </FormContent>
      </FormContainer>
      
      {isMobile && isMapModalOpen && (
        <MapModal
          onClose={() => setMapModalOpen(false)}
          viewState={viewState}
          setViewState={setViewState}
          marker={marker}
          circleData={circleData}
          isResizing={isResizing}
          handleMapClick={handleMapClick}
          handleCircleResize={handleCircleResize}
          setIsResizing={setIsResizing}
          circleRadius={circleRadius}
          mapContent={mapContent} // Se pasa el contenido del mapa al modal
        />
      )}
    </>
  );
}


// --- ESTILOS ---
// ... (El resto de estilos no necesitan cambios)
const FormContainer = styled.div` height: 100%; display: flex; flex-direction: column; border-radius: 8px; background-color: #f8f9fa; `;
const FormHeader = styled.div` display: flex; align-items: center; padding: 15px 20px; background-color: #fff; border-bottom: 1px solid #e9ecef; `;
const FormContent = styled.div` flex-grow: 1; padding: 20px; display: flex; gap: 20px; overflow: auto; @media (max-width: 768px) { flex-direction: column; padding: 15px; } `;
const BackButton = styled.button` background: none; border: none; color: #495057; font-size: 14px; font-weight: 500; cursor: pointer; display: flex; align-items: center; transition: color 0.2s; &:hover { color: #007bff; } `;
const FormSection = styled.div` flex: 1 0 350px; max-width: 350px; display: flex; flex-direction: column; gap: 15px; overflow-y: auto; padding-right: 10px; h2 { font-size: 18px; font-weight: 600; color: #343a40; } @media (max-width: 768px) { flex-basis: auto; max-width: 100%; overflow-y: visible; padding-right: 0; } `;
const MapSection = styled.div` flex: 1 1 auto; border-radius: 8px; overflow: hidden; @media (max-width: 768px) { min-height: 300px; } `;
const FormGroup = styled.div` display: flex; flex-direction: column; `;
const Label = styled.label` font-size: 14px; color: #495057; margin-bottom: 5px; font-weight: 500; `;
const Input = styled.input` padding: 10px; border: 1px solid #ced4da; border-radius: 6px; font-size: 14px; &:focus { outline: none; border-color: #007bff; box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25); } `;
const TextArea = styled.textarea` padding: 10px; border: 1px solid #ced4da; border-radius: 6px; font-size: 14px; resize: vertical; min-height: 80px; &:focus { outline: none; border-color: #007bff; box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25); } `;
const floatAnimation = keyframes` 0% { transform: translateY(0); } 50% { transform: translateY(-8px); } 100% { transform: translateY(0); } `;
// CORRECCIÓN: Se define como styled-component para ser usado directamente
const AnimatedMarkerIcon = styled.div` animation: ${floatAnimation} 2s ease-in-out infinite; `;
const ButtonContainer = styled.div` display: flex; justify-content: flex-end; margin-top: 10px; `;
const SaveButton = styled.button` background-color: #28a745; color: white; border: none; padding: 10px 25px; font-size: 14px; font-weight: 600; border-radius: 8px; cursor: pointer; transition: background-color 0.2s ease; &:hover { background-color: #218838; } `;
const RadiusInfo = styled.div` background-color: #e3f2fd; border: 1px solid #bbdefb; border-radius: 6px; padding: 10px; font-size: 13px; color: #1976d2; line-height: 1.4; span { display: flex; align-items: center; gap: 8px; } `;
const ResetRadiusButton = styled.button` background-color: #6c757d; color: white; border: none; padding: 8px 16px; font-size: 12px; font-weight: 500; border-radius: 4px; cursor: pointer; margin-top: 8px; transition: background-color 0.2s ease; &:hover { background-color: #5a6268; } `;
// CORRECCIÓN: Se define como styled-component
const ResizeHandle = styled.div` display: flex; align-items: center; justify-content: center; z-index: 1000; `;
const PlaceOnMapButton = styled.button` display: flex; align-items: center; justify-content: center; padding: 10px; border: 1px dashed #007bff; border-radius: 6px; background-color: #e7f3ff; color: #007bff; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; &:hover { background-color: #d0e7ff; } `;
const fadeIn = keyframes` from { opacity: 0; } to { opacity: 1; } `;
const ModalBackdrop = styled.div` position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.6); z-index: 9999; display: flex; align-items: center; justify-content: center; animation: ${fadeIn} 0.3s; `;
const ModalContent = styled.div` position: relative; width: 100%; height: 100%; background-color: #fff; display: flex; flex-direction: column; overflow: hidden; z-index: 9999; `;
const ModalHeader = styled.div` display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #e9ecef; flex-shrink: 0; h4 { margin: 0; font-size: 16px; font-weight: 600; } `;
const CloseButton = styled.button` background: none; border: none; font-size: 24px; cursor: pointer; color: #6c757d; &:hover { color: #343a40; } `;
const ModalFooter = styled.div` padding: 15px; border-top: 1px solid #e9ecef; display: flex; justify-content: flex-end; flex-shrink: 0; `;