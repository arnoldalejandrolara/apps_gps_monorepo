import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaChevronLeft, FaMapMarkerAlt, FaCar, FaBus, FaTruck } from 'react-icons/fa';
import { FormInput } from './FormInput';
import Map, { Marker, Source, Layer } from 'react-map-gl/mapbox';
import * as turf from '@turf/turf';
import { CustomSelect } from './CustomSelect'; // Asumo que este es el nombre correcto del componente
import { createPIRequest, updatePIRequest } from '@mi-monorepo/common/services';
import { useSelector } from 'react-redux';

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

const RadiusInfo = styled.div`
  background-color: #e3f2fd;
  border: 1px solid #bbdefb;
  border-radius: 6px;
  padding: 10px;
  font-size: 13px;
  color: #1976d2;
  line-height: 1.4;
  margin-bottom: 10px;
  
  span {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const ResetRadiusButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #5a6268;
  }
`;

const ResizeHandle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
// --- FIN: ESTILOS PARA EL BOTÓN DE GUARDAR ---


const MAPBOX_TOKEN = 'pk.eyJ1IjoiYXJub2xkYWxlamFuZHJvbGFyYSIsImEiOiJjbWVtZ3ZtOG0wcnJyMmpwbGZ6ajloamYzIn0.y2qjqVBVoFYJSPaDwayFGw';

export function PuntoInteresForm({ onBack, point, categorias, iconos }) {
  const token = useSelector(state => state.auth.token);
  const [formData, setFormData] = useState({
    nombre: '',
    coordenadas: '',
    latitud: '',
    longitud: '',
    categoria: 1,
    icono: 1,
    comentarios: '',
    radio: 50
  });

  useEffect(() => {
    if (point) {
      setFormData({
        nombre: point.nombre,
        latitud: point.coordenadas.x,
        longitud: point.coordenadas.y,
        categoria: point.id_categoria,
        icono: point.id_icono,
        comentarios: point.comentarios,
        radio: point.radio,
        coordenadas: `${point.coordenadas.x}, ${point.coordenadas.y}`
      });

      setViewState({
        longitude: point.coordenadas.y,
        latitude: point.coordenadas.x,
        zoom: 11
      });

      setMarker({ longitude: point.coordenadas.y, latitude: point.coordenadas.x });

      setCircleData(turf.circle([point.coordenadas.y, point.coordenadas.x], point.radio, { steps: 64, units: 'meters' }));

      setCircleRadius(point.radio);

      setIsResizing(false);
    }
  }, [point]);

  const [viewState, setViewState] = useState({
    longitude: -97.872464,
    latitude: 22.289529,
    zoom: 11
  });

  const resetForm = () => {
    setFormData({
      nombre: '',
      latitud: '',
      longitud: '',
      categoria: 1,
      icono: 1,
      comentarios: '',
      radio: 50
    });
    setViewState({
      longitude: -97.872464,
      latitude: 22.289529,
      zoom: 11
    });
    setMarker(null);
    setCircleData(null);
    setIsResizing(false);
    setCircleRadius(50);
  };

  const [marker, setMarker] = useState(null);
  const [cursorStyle, setCursorStyle] = useState('grab');
  const [circleData, setCircleData] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [circleRadius, setCircleRadius] = useState(50); // Radio inicial en metros



  // Función para actualizar el círculo con nuevo radio
  const updateCircle = (newRadius) => {
    if (marker) {
      const center = [marker.longitude, marker.latitude];
      const options = { steps: 64, units: 'meters' };
      const circlePolygon = turf.circle(center, newRadius, options);
      setCircleData(circlePolygon);
      setCircleRadius(newRadius);
      setFormData(prev => ({ ...prev, radio: Math.round(newRadius) }));
    }
  };

  // Función para manejar el click en el mapa
  const handleMapClick = (evt) => {
    const { lng, lat } = evt.lngLat;
    setMarker({ longitude: lng, latitude: lat });
    setFormData(prev => ({ ...prev, latitud: lat.toFixed(6), longitud: lng.toFixed(6), coordenadas: `${lat.toFixed(6)}, ${lng.toFixed(6)}` }));

    const center = [lng, lat];
    const options = { steps: 64, units: 'meters' };
    const circlePolygon = turf.circle(center, circleRadius, options);
    
    setCircleData(circlePolygon);
  };

  // Función para redimensionar el círculo con el mouse
  const handleCircleResize = (evt) => {
    if (marker) {
      const { lng, lat } = evt.lngLat;
      const center = [marker.longitude, marker.latitude];
      const mousePos = [lng, lat];
      const distance = turf.distance(center, mousePos, { units: 'meters' });
      
      // Limitar el radio mínimo y máximo (5m - 500km)
      const newRadius = Math.max(5, Math.min(500000, distance));
      updateCircle(newRadius);
    }
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
  const handleCategoriaChange = (selectedValue) => {
    setFormData(prev => ({ ...prev, categoria: selectedValue }));
  };

  const handleIconChange = (selectedValue) => {
    setFormData(prev => ({ ...prev, icono: selectedValue }));
  };

  const [selectedIcon, setSelectedIcon] = useState(null);

  const iconosOptions = iconos.map(icon => ({ id: icon.id, name: icon.nombre }));

  const categoriasOptions = categorias.map(categoria => ({ id: categoria.id, name: categoria.nombre }));

  const handleSave = async () => {
    if(point) {
      const response = await updatePIRequest(token, point.id, {
        nombre: formData.nombre,
        latitud: parseFloat(formData.latitud),
        longitud: parseFloat(formData.longitud),
        id_categoria: formData.categoria,
        id_icono: formData.icono,
        comentarios: formData.comentarios,
        radio: formData.radio
      });

      if (response.status === 200) {
        alert('Punto de interés actualizado correctamente');
        resetForm();
        onBack();
      } else {
        console.error(response.error);
      }
    } else {
      const response = await createPIRequest(token, {
        nombre: formData.nombre,
        latitud: parseFloat(formData.latitud),
        longitud: parseFloat(formData.longitud),
        id_categoria: formData.categoria,
        id_icono: formData.icono,
        comentarios: formData.comentarios,
        radio: formData.radio
      });

      if (response.status === 200) {
        alert('Punto de interés creado correctamente');
        resetForm();
        onBack();
      } else {
        console.error(response.error);
      }
    }
  };

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
          <h2>{point ? 'Editar Punto de Interés' : 'Nuevo Punto de Interés'}</h2>
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
              options={iconosOptions}
              value={formData.icono}
              onChange={handleIconChange}
              showSearch={true}
            />
          </FormGroup>
          
          <FormGroup>
            <CustomSelect
              showSearch={false}
              label="Tipo"
              options={categoriasOptions}
              value={formData.categoria}
              onChange={handleCategoriaChange}
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
            <Label>Radio del círculo: {Math.round(circleRadius)}m</Label>
            <RadiusInfo>
              <span>💡 Arrastra el punto azul en el borde para cambiar el tamaño (5m - 5km)</span>
            </RadiusInfo>
            <ResetRadiusButton onClick={() => updateCircle(50)}>
              Resetear a 50m
            </ResetRadiusButton>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="comentarios">Comentarios</Label>
            <TextArea id="comentarios" placeholder="Escribe comentarios adicionales" name="comentarios" value={formData.comentarios} onChange={handleChange}></TextArea>
          </FormGroup>

          {/* --- BOTÓN DE GUARDAR AÑADIDO --- */}
          <ButtonContainer>
            <SaveButton onClick={handleSave}>
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
                  paint={{ 
                    'fill-color': isResizing ? '#ff6b35' : '#007bff', 
                    'fill-opacity': isResizing ? 0.3 : 0.2 
                  }}
                />
                <Layer
                  id="circle-outline-layer"
                  type="line"
                  paint={{ 
                    'line-color': isResizing ? '#ff6b35' : '#007bff', 
                    'line-width': isResizing ? 3 : 2,
                    'line-dasharray': isResizing ? [2, 2] : [1]
                  }}
                />
              </Source>
            )}
            
            {/* Marcador para redimensionar el círculo */}
            {circleData && marker && (
              <Marker 
                longitude={marker.longitude + (circleRadius / 111320) * Math.cos(0)} 
                latitude={marker.latitude + (circleRadius / 111320) * Math.sin(0)}
                anchor="center"
                draggable={true}
                onDragStart={() => setIsResizing(true)}
                onDrag={handleCircleResize}
                onDragEnd={() => setIsResizing(false)}
              >
                <ResizeHandle>
                  <div style={{ 
                    width: '16px', 
                    height: '16px', 
                    backgroundColor: isResizing ? '#ff6b35' : '#007bff',
                    border: '2px solid white',
                    borderRadius: '50%',
                    cursor: 'ns-resize',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }} />
                </ResizeHandle>
              </Marker>
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