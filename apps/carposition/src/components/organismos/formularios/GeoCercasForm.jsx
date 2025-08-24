import React, { useState, useCallback } from 'react';
import { styled, keyframes } from 'styled-components';
import { FaChevronLeft } from 'react-icons/fa';
import { FormInput } from './FormInput';
// Importaciones correctas
import Map, { useControl } from 'react-map-gl/mapbox';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

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
    () => new MapboxDraw(props),
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

export function GeoCercasForm({ onBack }) {
  const [formData, setFormData] = useState({
    nombre: '',
    geometria: '',
    tipo: '',
    color: '#3388ff',
    estado: 'activa',
    descripcion: '',
  });

  const [viewState, setViewState] = useState({
    longitude: -97.890107,
    latitude: 22.36190,
    zoom: 14
  });

  const onUpdate = useCallback(e => {
    if (e.features.length > 0) {
      const updatedFeature = e.features[0];
      setFormData(prev => ({ ...prev, geometria: JSON.stringify(updatedFeature.geometry) }));
    }
  }, []);

  const onDelete = useCallback(e => {
    setFormData(prev => ({ ...prev, geometria: '' }));
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          <h2>Nueva Geocerca</h2>
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
            <Label htmlFor="tipo">Tipo</Label>
            <Input 
              type="text" 
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              placeholder="Ej. Zona de Trabajo, Área Restringida" 
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
            <FormGroup>
              <Label htmlFor="estado">Estado</Label>
              <Select name="estado" id="estado" value={formData.estado} onChange={handleChange}>
                <option value="activa">Activa</option>
                <option value="inactiva">Inactiva</option>
              </Select>
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
            />
          </Map>
        </MapSection>
      </FormContent>
    </FormContainer>
  );
}