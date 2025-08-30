import React, { useState, useCallback } from 'react';
import { styled, keyframes } from 'styled-components';
import { FaChevronLeft } from 'react-icons/fa';
import { FormInput } from './FormInput';
// Importaciones correctas
import Map, { useControl } from 'react-map-gl/mapbox';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { CustomSelect } from './CustomSelect';
import { createGeocerca } from '@mi-monorepo/common/services';
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

export function GeoCercasForm({ onBack, iconos }) {
  const { token } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    nombre: '',
    polygon: [],
    icono: 1,
    color: '#3388ff',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const response = await createGeocerca(token, {
      nombre: formData.nombre,
      polygon: formData.polygon,
      id_icono: formData.icono,
      hex_color: formData.color.replace('#', ''),
      comentarios: formData.descripcion
    });
    if(response.status === 200) {
      alert('Geocerca creada correctamente');
      onBack();
    } else {
      console.error(response.error);
    }
  };

  const iconosOptions = iconos.map(icono => ({ id: icono.id, name: icono.nombre }));
  
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