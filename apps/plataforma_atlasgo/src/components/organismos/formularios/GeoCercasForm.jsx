import React, { useState, useCallback, useEffect } from 'react';
import { styled, keyframes } from 'styled-components';
import { FaChevronLeft } from 'react-icons/fa';
import { FormInput } from './FormInput';
// Importaciones correctas
import Map, { useControl } from 'react-map-gl/mapbox';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import mapboxgl from 'mapbox-gl';
import { CustomSelect } from './CustomSelect';
import { createGeocerca, updateGeocerca } from '@mi-monorepo/common/services';
import { useSelector } from 'react-redux';

// (Tus styled-components se mantienen exactamente igual, excepto los cambios indicados)
const FormContainer = styled.div`
  height: 100vh; 
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
  padding: 20px;
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
  flex: 1 0 350px; 
  max-width: 350px; 
  min-width: 320px; 
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto; 
  padding-right: 10px;

  h2{
   font-size: 16px;
   font-weight: 500; // Corregido: 'font-weight'
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

// --- CAMBIO 1: Ajusta cómo se distribuye el espacio en la fila ---
const InputRow = styled.div`
  display: flex;
  gap: 15px;
  align-items: flex-end; // Alinea los inputs en la base para un mejor look

  // El primer elemento (color) no crece
  & > ${FormGroup}:first-child {
    flex: 0 0 auto; 
  }
  // El segundo elemento (estado) ocupa el resto del espacio
  & > ${FormGroup}:last-child {
    flex: 1 1 auto;
  }
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

// --- CAMBIO 2: Define un ancho fijo para el input de color ---
const ColorInput = styled(Input)`
  padding: 5px;
  height: 40px;
  width: 60px; // Ancho fijo para el selector de color
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  height: 40px;
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


// --- Componente de Control de Dibujo (debe estar en este archivo) ---
function DrawControl(props) {
  useControl(
    () => {
      const draw = new MapboxDraw(props);
      // Pasar la referencia al componente padre
      if (props.onDrawReady) {
        props.onDrawReady(draw);
      }
      return draw;
    },
    ({ map }) => {
      map.on('draw.create', props.onCreate);
      map.on('draw.update', props.onUpdate);
      map.on('draw.delete', props.onDelete);
    },
    ({ map }) => {
      map.off('draw.create', props.onCreate);
      map.off('draw.update', props.onUpdate);
      map.off('draw.delete', props.onDelete);
    },
    {
      position: props.position
    }
  );
  return null;
}


const MAPBOX_TOKEN = 'pk.eyJ1IjoiYXJub2xkYWxlamFuZHJvbGFyYSIsImEiOiJjbWVtZ3ZtOG0wcnJyMmpwbGZ6ajloamYzIn0.y2qjqVBVoFYJSPaDwayFGw'; // TU TOKEN REAL

export function GeoCercasForm({ onBack, iconos, geoCerca }) {
  const { token } = useSelector(state => state.auth);
  const [drawRef, setDrawRef] = useState(null);
  const [editTrigger, setEditTrigger] = useState(0); // Trigger para forzar recarga

  const [formData, setFormData] = useState({
    nombre: '',
    polygon: [],
    icono: 1,
    color: '#3388ff',
    descripcion: '',
  });

  useEffect(() => {
    if(geoCerca) {
      setFormData({
        nombre: geoCerca.nombre,
        polygon: geoCerca.polygon,
        icono: geoCerca.id_icono,
        color: '#' + geoCerca.hex_color,
        descripcion: geoCerca.comentarios
      });
      // Incrementar el trigger para forzar la recarga del polígono
      setEditTrigger(prev => prev + 1);
    }
  }, [geoCerca]);

  // Efecto para dibujar el polígono existente cuando se carga en modo edición
  useEffect(() => {
    if (geoCerca && geoCerca.polygon && geoCerca.polygon.length > 0 && drawRef) {
      // Limpiar cualquier polígono existente
      drawRef.deleteAll();
      // Convertir las coordenadas al formato que espera Mapbox Draw
      const coordinates = geoCerca.polygon.map(coord => [coord[1], coord[0]]); // [lat, lng] -> [lng, lat]
      
      // Crear el feature para dibujar
      const feature = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates]
        },
        properties: {}
      };
      
      // Dibujar el polígono existente
      drawRef.add(feature);
      
      // Centrar el mapa en el polígono
      if (coordinates.length > 0) {
        // Calcular los límites del polígono
        let minLng = coordinates[0][0];
        let maxLng = coordinates[0][0];
        let minLat = coordinates[0][1];
        let maxLat = coordinates[0][1];
        
        coordinates.forEach(coord => {
          minLng = Math.min(minLng, coord[0]);
          maxLng = Math.max(maxLng, coord[0]);
          minLat = Math.min(minLat, coord[1]);
          maxLat = Math.max(maxLat, coord[1]);
        });
        
        // Calcular el centro usando el centroide geométrico del polígono (más preciso)
        let area = 0;
        let centerLng = 0;
        let centerLat = 0;
        
        for (let i = 0; i < coordinates.length; i++) {
          const j = (i + 1) % coordinates.length;
          const cross = coordinates[i][0] * coordinates[j][1] - coordinates[j][0] * coordinates[i][1];
          area += cross;
          centerLng += (coordinates[i][0] + coordinates[j][0]) * cross;
          centerLat += (coordinates[i][1] + coordinates[j][1]) * cross;
        }
        
        area = area / 2;
        centerLng = centerLng / (6 * area);
        centerLat = centerLat / (6 * area);
        
        // Calcular el zoom dinámicamente basado en el tamaño del polígono
        const lngDiff = maxLng - minLng;
        const latDiff = maxLat - minLat;
        const maxDiff = Math.max(lngDiff, latDiff);
        
        // Calcular zoom usando fórmula logarítmica para mejor distribución
        // Zoom más alto = más cerca, zoom más bajo = más lejos
        // Ajustar para que el polígono se vea completo con un poco de margen
        const zoom = Math.max(8, Math.min(14, 14 - Math.log2(maxDiff * 20)));
        
        // Ajustar la vista del mapa para mostrar todo el polígono
        // Añadir un offset hacia arriba para mejor centrado visual
        setViewState(prev => ({
          ...prev,
          longitude: centerLng,
          latitude: centerLat - (maxLat - minLat) * 0.4, // Offset hacia arriba (un poco más)
          zoom: zoom
        }));
        
        console.log('Centrado del mapa:', {
          center: [centerLng, centerLat],
          zoom: zoom,
          bounds: { minLng, maxLng, minLat, maxLat },
          size: { lngDiff, latDiff, maxDiff }
        });
      }
    }
  }, [editTrigger, drawRef]); // Usar editTrigger en lugar de geoCerca?.id

  const [viewState, setViewState] = useState({
    longitude: -97.890107,
    latitude: 22.36190,
    zoom: 14
  });

  const onUpdate = useCallback(e => {
    if (e.features.length > 0) {
      const updatedFeature = e.features[0];
      console.log(updatedFeature);
      setFormData(prev => ({ ...prev, polygon: updatedFeature.geometry.coordinates.length > 0 ? updatedFeature.geometry.coordinates[0].map(coord => [coord[1], coord[0]]) : [] }));
    }
  }, []);

  const onDelete = useCallback(e => {
    setFormData(prev => ({ ...prev, polygon: [] }));
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIconChange = (selectedValue) => {
    setFormData(prev => ({ ...prev, icono: selectedValue }));
  };

  // Función para capturar la referencia del draw control
  const handleDrawReady = (draw) => {
    setDrawRef(draw);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    
    try {
      let response;
      
      if (geoCerca?.id) {
        // Actualizar geocerca existente
        response = await updateGeocerca(token, geoCerca.id, {
          nombre: formData.nombre,
          polygon: formData.polygon,
          id_icono: formData.icono,
          hex_color: formData.color.replace('#', ''),
          comentarios: formData.descripcion
        });
      } else {
        // Crear nueva geocerca
        response = await createGeocerca(token, {
          nombre: formData.nombre,
          polygon: formData.polygon,
          id_icono: formData.icono,
          hex_color: formData.color.replace('#', ''),
          comentarios: formData.descripcion
        });
      }
      
      if(response.status === 200){
        alert(geoCerca?.id ? 'Geocerca actualizada correctamente' : 'Geocerca creada correctamente');
        resetForm();
        onBack();
      } else {
        console.error(response.error);
        alert('Error al ' + (geoCerca?.id ? 'actualizar' : 'crear') + ' la geocerca');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al ' + (geoCerca?.id ? 'actualizar' : 'crear') + ' la geocerca');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      polygon: [],
      icono: 1,
      color: '#3388ff',
      descripcion: ''
    });
  }
  
  const handleReset = () => {
    resetForm();
    if (drawRef) {
      drawRef.deleteAll();
    }
    setViewState({
      longitude: -97.890107,
      latitude: 22.36190,
      zoom: 14
    });
    setDrawRef(null);
  }
  
  const handleBack = () => {
    if (drawRef) {
      drawRef.deleteAll();
    }
    setViewState({
      longitude: -97.890107,
      latitude: 22.36190,
      zoom: 14
    });
    onBack();
  }

  const iconosOptions = iconos.map(icono => ({ id: icono.id, name: icono.nombre }));
  
  return (
    <FormContainer>
      <FormHeader>
        <BackButton onClick={handleBack}>
          <FaChevronLeft style={{ marginRight: '8px' }} />
          Volver
        </BackButton>
      </FormHeader>
      <FormContent>
        <FormSection>
          <h2>{geoCerca ? 'Editar Geocerca' : 'Nueva Geocerca'}</h2>
          <FormInput
            label="Nombre de la Geocerca"
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej. Bodega Central"
            required
          />
          <FormGroup>
            <Label htmlFor="tipo">Icono</Label>
            <CustomSelect 
              id="icono"
              name="icono"
              value={formData.icono}
              onChange={handleIconChange}
              placeholder="Selecciona un icono" 
              options={iconosOptions}
            />
          </FormGroup>
          <InputRow>
            <FormGroup>
              <Label htmlFor="color">Color</Label>
              <ColorInput 
                type="color" 
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
              />
            </FormGroup>
          </InputRow>
          <FormGroup>
            <Label htmlFor="descripcion">Descripción</Label>
            <TextArea 
              id="descripcion" 
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Añade detalles adicionales sobre la geocerca"
            />
          </FormGroup>

          <ButtonContainer>
            <SaveButton onClick={handleSubmit}>
              {geoCerca ? 'Actualizar' : 'Guardar'}
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
          >
            <DrawControl
              position="top-left"
              displayControlsDefault={false}
              controls={{ polygon: true, trash: true }}
              onCreate={onUpdate}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onDrawReady={handleDrawReady}
            />
          </Map>
        </MapSection>
      </FormContent>
    </FormContainer>
  );
}

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