import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaChevronLeft, FaMapMarkerAlt, FaCar, FaBus, FaTruck } from 'react-icons/fa';
import { FormInput } from './FormInput';
import Map, { Marker, Source, Layer } from 'react-map-gl/mapbox';
import * as turf from '@turf/turf';
import { CustomSelect } from './CustomSelect'; // Asumo que este es el nombre correcto del componente

// --- ESTILOS ---

const FormContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-color: #f8f9fa;
`;

const FormHeader = styled.div`
  display: flex;
  align-items: center;
  padding:5px 20px;
  background-color: #fff;
  border-bottom: 1px solid #e9ecef;
`;

const FormContent = styled.div`
  flex-grow: 1;
  padding: 10px;
  display: flex;
  gap: 20px;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #495057;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.2s;
  &:hover {
    color: #007bff;
  }
`;

const FormSection = styled.div`
  flex: 1 0 320px;
  max-width: 320px;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
  padding-right: 10px;

  h2{
    font-size: 17px;
    font-weight: 500; 
  }

  @media (max-width: 768px) {
    flex-basis: auto;
    max-width: 100%;
    overflow-y: visible;
  }
`;

const MapSection = styled.div`
  flex: 1 1 auto;
  border-radius: 8px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    min-height: 300px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 14px;
  color: #495057;
  margin-bottom: 5px;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0); }
`;

const AnimatedMarkerIcon = styled.div`
  animation: ${floatAnimation} 2s ease-in-out infinite;
`;

// --- INICIO: ESTILOS PARA EL BOTÓN DE GUARDAR ---
const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SaveButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 25px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #218838;
  }
`;
// --- FIN: ESTILOS PARA EL BOTÓN DE GUARDAR ---


const MAPBOX_TOKEN = 'pk.eyJ1IjoiYXJub2xkYWxlamFuZHJvbGFyYSIsImEiOiJjbWVtZ3ZtOG0wcnJyMmpwbGZ6ajloamYzIn0.y2qjqVBVoFYJSPaDwayFGw';

export function PuntoInteresForm({ onBack }) {
  const [formData, setFormData] = useState({
    nombre: '',
    coordenadas: '',
    tipo: 'Tipo',
  });

  const [viewState, setViewState] = useState({
    longitude: -97.890107,
    latitude: 22.36190,
    zoom: 14
  });

  const [marker, setMarker] = useState(null);
  const [cursorStyle, setCursorStyle] = useState('grab');
  const [circleData, setCircleData] = useState(null);

  const handleMapClick = (evt) => {
    const { lng, lat } = evt.lngLat;
    setMarker({ longitude: lng, latitude: lat });
    setFormData(prev => ({ ...prev, coordenadas: `${lat.toFixed(6)}, ${lng.toFixed(6)}` }));

    const center = [lng, lat];
    const radius = 20;
    const options = { steps: 64, units: 'meters' };
    const circlePolygon = turf.circle(center, radius, options);
    
    setCircleData(circlePolygon);
  };

  const handleMouseEnter = () => setCursorStyle('pointer');
  const handleMouseLeave = () => setCursorStyle('grab');
  const handleDragStart = () => setCursorStyle('grabbing');
  const handleDragEnd = () => setCursorStyle('pointer');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Asumo que el nombre correcto del componente es CustomSelect
  const handleTipoChange = (selectedValue) => {
    setFormData(prev => ({ ...prev, tipo: selectedValue }));
  };

  const [selectedIcon, setSelectedIcon] = useState('tsuru');

  const vehicleOptions = [
    { id: 'tsuru', name: 'Unidad 1 - Tsuru', icon: <FaCar /> },
    { id: 'versa', name: 'Unidad 2 - Versa', icon: <FaCar /> },
    { id: 'bus', name: 'Unidad 3 - Autobús', icon: <FaBus /> },
    { id: 'truck', name: 'Unidad 4 - Camioneta', icon: <FaTruck /> }
  ];

  const tipoOptions = [
    { id: 'owner', name: 'Owner' },
    { id: 'admin', name: 'Administrator' },
    { id: 'dev', name: 'Developer' },
    { id: 'viewer', name: 'Viewer' }
  ];

  return (
    <FormContainer>
      <FormHeader>
        <BackButton onClick={onBack}>
          <FaChevronLeft style={{ marginRight: '8px' }} />
          Volver
        </BackButton>
      </FormHeader>
      <FormContent>
        <FormSection>
          <h2>Nuevo Punto de Interés</h2>
          <FormInput
            label="Nombre del Punto de Interés"
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej. Restaurante La Esquina"
            required
          />
          <FormGroup>
            <CustomSelect
              label="Icono"
              options={vehicleOptions}
              value={selectedIcon}
              onChange={setSelectedIcon}
              showSearch={true}
            />
          </FormGroup>
          
          <FormGroup>
            <CustomSelect
              showSearch={false}
              label="Tipo"
              options={tipoOptions}
              value={formData.tipo}
              onChange={handleTipoChange}
            />
          </FormGroup>

          <FormInput
            label="Coordenadas (haz clic en el mapa)"
            type="text"
            name="coordenadas"
            value={formData.coordenadas}
            onChange={handleChange}
            placeholder="Ej. 22.361900, -97.890107"
            required
            readOnly // Recomendado para que solo se actualice con el mapa
          />

          <FormGroup>
            <Label htmlFor="comentarios">Comentarios</Label>
            <TextArea id="comentarios" placeholder="Escribe comentarios adicionales"></TextArea>
          </FormGroup>

          {/* --- BOTÓN DE GUARDAR AÑADIDO --- */}
          <ButtonContainer>
            <SaveButton onClick={() => alert('Guardando punto de interés...')}>
              Guardar
            </SaveButton>
          </ButtonContainer>

        </FormSection>
        <MapSection>
          <Map
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            style={{width: '100%', height: '100%'}}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={MAPBOX_TOKEN}
            onClick={handleMapClick}
            cursor={cursorStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {circleData && (
              <Source id="circle-source" type="geojson" data={circleData}>
                <Layer
                  id="circle-fill-layer"
                  type="fill"
                  paint={{ 'fill-color': '#007bff', 'fill-opacity': 0.2 }}
                />
                <Layer
                  id="circle-outline-layer"
                  type="line"
                  paint={{ 'line-color': '#007bff', 'line-width': 2 }}
                />
              </Source>
            )}
            {marker && (
              <Marker 
                longitude={marker.longitude} 
                latitude={marker.latitude} 
                anchor="bottom"
              >
                <AnimatedMarkerIcon>
                  <FaMapMarkerAlt style={{ 
                    fontSize: '2.5rem', 
                    color: '#e63946',
                    filter: 'drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.4))'
                  }} />
                </AnimatedMarkerIcon>
              </Marker>
            )}
          </Map>
        </MapSection>
      </FormContent>
    </FormContainer>
  );
}