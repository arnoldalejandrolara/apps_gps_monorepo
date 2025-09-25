import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { styled, keyframes } from 'styled-components';
import { FaChevronLeft, FaDrawPolygon } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";
import { FormInput } from './FormInput';
import Map, { useControl } from 'react-map-gl/mapbox';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { CustomSelect } from './CustomSelect';
import { createGeocerca, updateGeocerca } from '@mi-monorepo/common/services';
import { useSelector } from 'react-redux';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYXJub2xkYWxlamFuZHJvbGFyYSIsImEiOiJjbWVtZ3ZtOG0wcnJyMmpwbGZ6ajloamYzIn0.y2qjqVBVoFYJSPaDwayFGw';

// ==================================================================
// --- Componente Modal para el Mapa (Añadido) ---
// ==================================================================
function MapModal({ onClose, viewState, setViewState, children }) {
  return ReactDOM.createPortal(
    <ModalBackdrop>
      <ModalContent>
        <ModalHeader>
          <h4>Dibuja la Geocerca</h4>
          <CloseButton onClick={onClose}><IoClose /></CloseButton>
        </ModalHeader>
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          style={{ width: '100%', flexGrow: 1 }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          {children}
        </Map>
        <ModalFooter>
          <SaveButton onClick={onClose}>Aceptar</SaveButton>
        </ModalFooter>
      </ModalContent>
    </ModalBackdrop>,
    document.body
  );
}

// ==================================================================
// --- CORRECCIÓN: SE REINCORPORA EL COMPONENTE DrawControl ---
// ==================================================================
function DrawControl(props) {
  useControl(
    () => {
      const draw = new MapboxDraw(props);
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

// ==================================================================
// --- Componente Principal del Formulario ---
// ==================================================================
export function GeoCercasForm({ onBack, iconos, geoCerca }) {
  const { token } = useSelector(state => state.auth);
  const [drawRef, setDrawRef] = useState(null);
  const [editTrigger, setEditTrigger] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMapModalOpen, setMapModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '', polygon: [], icono: 1, color: '#3388ff', descripcion: '',
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if(geoCerca) {
      setFormData({
        nombre: geoCerca.nombre,
        polygon: geoCerca.polygon,
        icono: geoCerca.id_icono,
        color: '#' + geoCerca.hex_color,
        descripcion: geoCerca.comentarios
      });
      setEditTrigger(prev => prev + 1);
    }
  }, [geoCerca]);

  useEffect(() => {
    if (geoCerca && geoCerca.polygon && geoCerca.polygon.length > 0 && drawRef) {
      drawRef.deleteAll();
      const coordinates = geoCerca.polygon.map(coord => [coord[1], coord[0]]);
      const feature = {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [coordinates] },
        properties: {}
      };
      drawRef.add(feature);
      if (coordinates.length > 0) {
        let minLng = coordinates[0][0], maxLng = coordinates[0][0], minLat = coordinates[0][1], maxLat = coordinates[0][1];
        coordinates.forEach(coord => {
          minLng = Math.min(minLng, coord[0]); maxLng = Math.max(maxLng, coord[0]);
          minLat = Math.min(minLat, coord[1]); maxLat = Math.max(maxLat, coord[1]);
        });
        let area = 0, centerLng = 0, centerLat = 0;
        for (let i = 0; i < coordinates.length; i++) {
          const j = (i + 1) % coordinates.length;
          const cross = coordinates[i][0] * coordinates[j][1] - coordinates[j][0] * coordinates[i][1];
          area += cross;
          centerLng += (coordinates[i][0] + coordinates[j][0]) * cross;
          centerLat += (coordinates[i][1] + coordinates[j][1]) * cross;
        }
        area /= 2;
        centerLng /= (6 * area);
        centerLat /= (6 * area);
        const maxDiff = Math.max(maxLng - minLng, maxLat - minLat);
        const zoom = Math.max(8, Math.min(14, 14 - Math.log2(maxDiff * 20)));
        setViewState(prev => ({
          ...prev, longitude: centerLng, latitude: centerLat - (maxLat - minLat) * 0.4, zoom: zoom
        }));
      }
    }
  }, [editTrigger, drawRef]);

  const [viewState, setViewState] = useState({ longitude: -97.890107, latitude: 22.36190, zoom: 14 });

  const onUpdate = useCallback(e => {
    if (e.features.length > 0) {
      const updatedFeature = e.features[0];
      setFormData(prev => ({ ...prev, polygon: updatedFeature.geometry.coordinates.length > 0 ? updatedFeature.geometry.coordinates[0].map(coord => [coord[1], coord[0]]) : [] }));
    }
  }, []);

  const onDelete = useCallback(() => {
    setFormData(prev => ({ ...prev, polygon: [] }));
  }, []);
  
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleIconChange = (selectedValue) => setFormData(prev => ({ ...prev, icono: selectedValue }));
  const handleDrawReady = (draw) => setDrawRef(draw);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: formData.nombre,
        polygon: formData.polygon,
        id_icono: formData.icono,
        hex_color: formData.color.replace('#', ''),
        comentarios: formData.descripcion || ''
      };
      const response = geoCerca?.id ? await updateGeocerca(token, geoCerca.id, payload) : await createGeocerca(token, payload);
      if(response.status === 200){
        alert(`Geocerca ${geoCerca?.id ? 'actualizada' : 'creada'} correctamente`);
        resetForm();
        onBack();
      } else {
        alert(`Error al ${geoCerca?.id ? 'actualizar' : 'crear'} la geocerca`);
      }
    } catch (error) {
      alert(`Error al ${geoCerca?.id ? 'actualizar' : 'crear'} la geocerca`);
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', polygon: [], icono: 1, color: '#3388ff', descripcion: '' });
  };

  const handleBack = () => {
    // if (drawRef) drawRef.deleteAll();
    onBack();
  };

  const iconosOptions = iconos.map(icono => ({ id: icono.id, name: icono.nombre }));

  const drawControlContent = (
    <DrawControl
      position="top-left"
      displayControlsDefault={false}
      controls={{ polygon: true, trash: true }}
      onCreate={onUpdate}
      onUpdate={onUpdate}
      onDelete={onDelete}
      onDrawReady={handleDrawReady}
    />
  );
  
  return (
    <>
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
              label="Nombre de la Geocerca" type="text" name="nombre" value={formData.nombre}
              onChange={handleChange} placeholder="Ej. Bodega Central" required
            />
            <FormGroup>
              <Label htmlFor="tipo">Icono</Label>
              <CustomSelect id="icono" name="icono" value={formData.icono} onChange={handleIconChange}
                placeholder="Selecciona un icono" options={iconosOptions}
              />
            </FormGroup>
            <InputRow>
              <FormGroup>
                <Label htmlFor="color">Color</Label>
                <ColorInput type="color" id="color" name="color" value={formData.color} onChange={handleChange} />
              </FormGroup>
            </InputRow>
            <FormGroup>
              <Label htmlFor="descripcion">Descripción</Label>
              <TextArea id="descripcion" name="descripcion" value={formData.descripcion}
                onChange={handleChange} placeholder="Añade detalles adicionales sobre la geocerca"
              />
            </FormGroup>
            
            {isMobile && (
              <FormGroup>
                <PlaceOnMapButton onClick={() => setMapModalOpen(true)}>
                  <FaDrawPolygon style={{ marginRight: '8px' }}/>
                  Dibujar Geocerca en Mapa
                </PlaceOnMapButton>
              </FormGroup>
            )}

            <ButtonContainer>
              <SaveButton onClick={handleSubmit}>
                {geoCerca ? 'Actualizar' : 'Guardar'}
              </SaveButton>
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
              >
                {drawControlContent}
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
        >
          {drawControlContent}
        </MapModal>
      )}
    </>
  );
}

// --- ESTILOS ---
const FormContainer = styled.div` height: 100vh; display: flex; flex-direction: column; border-radius: 8px; background-color: #f8f9fa;`;
const FormHeader = styled.div` display: flex; align-items: center; padding:5px 20px; background-color: #fff; border-bottom: 1px solid #e9ecef;`;
const FormContent = styled.div` flex-grow: 1; padding: 20px; display: flex; gap: 20px; overflow: hidden; @media (max-width: 768px) { flex-direction: column; padding: 10px; }`;
const BackButton = styled.button` background: none; border: none; color: #495057; font-size: 14px; font-weight: 500; cursor: pointer; display: flex; align-items: center; transition: color 0.2s; &:hover { color: #007bff; }`;
const FormSection = styled.div` flex: 1 0 350px; max-width: 350px; min-width: 320px; display: flex; flex-direction: column; gap: 15px; overflow-y: auto; padding-right: 10px; h2{ font-size: 16px; font-weight: 500; } @media (max-width: 768px) { flex-basis: auto; max-width: 100%; overflow-y: visible; }`;
const MapSection = styled.div` flex: 1 1 auto; border-radius: 8px; overflow: hidden; @media (max-width: 768px) { min-height: 300px; }`;
const FormGroup = styled.div` display: flex; flex-direction: column;`;
const InputRow = styled.div` display: flex; gap: 15px; align-items: flex-end; & > ${FormGroup}:first-child { flex: 0 0 auto; } & > ${FormGroup}:last-child { flex: 1 1 auto; }`;
const Label = styled.label` font-size: 14px; color: #495057; margin-bottom: 5px; font-weight: 500;`;
const ColorInput = styled.input` padding: 5px; height: 40px; width: 60px; border: 1px solid #ced4da; border-radius: 4px; &:focus { outline: none; border-color: #007bff; box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25); }`;
const TextArea = styled.textarea` padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 14px; resize: vertical; min-height: 80px; &:focus { outline: none; border-color: #007bff; box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25); }`;
const ButtonContainer = styled.div` display: flex; justify-content: flex-end; `;
const SaveButton = styled.button` background-color: #28a745; color: white; border: none; padding: 10px 25px; font-size: 14px; font-weight: 600; border-radius: 8px; cursor: pointer; transition: background-color 0.2s ease; &:hover { background-color: #218838; }`;
const fadeIn = keyframes` from { opacity: 0; } to { opacity: 1; } `;
const ModalBackdrop = styled.div` position: fixed; top: 0; left: 0; width: 100vw; height: 100%; background-color: rgba(0, 0, 0, 0.6); z-index: 9999; display: flex; align-items: center; justify-content: center; animation: ${fadeIn} 0.3s; `;
const ModalContent = styled.div` position: relative; width: 100%; height: 100%; background-color: #fff; display: flex; flex-direction: column; overflow: hidden; z-index: 9999; `;
const ModalHeader = styled.div` display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #e9ecef; flex-shrink: 0; h4 { margin: 0; font-size: 16px; font-weight: 600; } `;
const CloseButton = styled.button` background: none; border: none; font-size: 24px; cursor: pointer; color: #6c757d; &:hover { color: #343a40; } `;
const ModalFooter = styled.div` padding: 15px; border-top: 1px solid #e9ecef; display: flex; justify-content: flex-end; flex-shrink: 0; `;
const PlaceOnMapButton = styled.button` display: flex; align-items: center; justify-content: center; padding: 10px; border: 1px dashed #007bff; border-radius: 6px; background-color: #e7f3ff; color: #007bff; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; &:hover { background-color: #d0e7ff; } `;