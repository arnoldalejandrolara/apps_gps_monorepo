import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { FormInput } from './FormInput';
import { CustomSelect } from './CustomSelect';
import { MultiSelect } from './MultiSelect';
import { useSelector } from 'react-redux';
import { createCuentasEspejo, updateCuentasEspejo } from '@mi-monorepo/common/services';
import { MobileInputDateTime } from '../../moleculas/MobileInputDateTime';
import { useMediaQuery } from 'react-responsive';


// --- ESTILOS ---

const FormContainer = styled.div`
  background-color: #ffffff;
  padding: 5px;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #1a1a1a;
  overflow: hidden;

  // --- INICIO: ESTILOS MÓVILES ---
  @media (max-width: 768px) {
    padding: 20px 15px;
  }
  // --- FIN: ESTILOS MÓVILES ---
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 24px;
  h1 {
    font-size: 18px;
    font-weight: 500;
    margin: 0 0 4px 0;
  }
  p {
    font-size: 14px;
    color: #6c757d;
    margin: 0;
  }

  // --- INICIO: ESTILOS MÓVILES ---
  @media (max-width: 768px) {
    h1 {
      font-size: 16px;
    }
    p {
      font-size: 13px;
    }
  }
  // --- FIN: ESTILOS MÓVILES ---
`;

const StepperContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  position: relative;
`;

const StepLine = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #e9ecef;
  transform: translateY(-50%);
  z-index: 1;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  background: #ffffff;
  padding: 0 10px;
`;

const StepNumber = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  background-color: ${({ $isActive, $isCompleted }) => ($isActive || $isCompleted ? '#007bff' : '#e9ecef')};
  color: ${({ $isActive, $isCompleted }) => ($isActive || $isCompleted ? '#ffffff' : '#6c757d')};
  border: 2px solid ${({ $isActive, $isCompleted }) => ($isActive || $isCompleted ? '#007bff' : 'transparent')};
`;

const StepLabel = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${({ $isActive }) => ($isActive ? '#007bff' : '#6c757d')};

  // --- INICIO: ESTILOS MÓVILES ---
  // Se ocultan las etiquetas en móvil para evitar que se amontonen
  @media (max-width: 768px) {
    display: none;
  }
  // --- FIN: ESTILOS MÓVILES ---
`;

const StepContentWrapper = styled.div`
  overflow: hidden;
`;

const StepSlider = styled.div`
  display: flex;
  transition: transform 0.4s ease-in-out;
  transform: translateX(calc(-100% * ${({ $currentStep }) => $currentStep - 1}));
`;

const StepContent = styled.div`
  width: 100%;
  flex-shrink: 0;
  padding: 2px;
`;

const FormGroup = styled.div`
  margin-bottom: 10px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  // --- INICIO: ESTILOS MÓVILES ---
  // Cambia a una sola columna en pantallas pequeñas
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px; // Se reduce el espacio entre elementos
  }
  // --- FIN: ESTILOS MÓVILES ---
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #495057;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  height: 35px;
  font-size: 13px;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
  }
  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Checkbox = styled.input`
  margin-right: 10px;
  width: 18px;
  height: 18px;
`;

const Summary = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e9ecef;
  h4{
    font-size: 14px;
    font-weight: 600;
    color: #343a40;
  }

  h3 {
    margin-top: 0;
    border-bottom: 1px solid #dee2e6;
    padding-bottom: 10px;
    margin-bottom: 15px;
  }
`;

const AccessCard = styled.div`
  background: #ffffff;
  border: 2px solid #28a745;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  color: #495057;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.1);
  position: relative;
`;

const AccessCardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  
  h5 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #28a745;
  }
  
  svg {
    margin-right: 8px;
    width: 20px;
    height: 20px;
    color: #28a745;
  }
`;

const AccessInfo = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
`;

const AccessLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #6c757d;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const AccessValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  word-break: break-all;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CopyButton = styled.button`
  background: #007bff;
  border: 1px solid #007bff;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 8px;
  min-width: 60px;

  &:hover {
    background: #0056b3;
    border-color: #0056b3;
  }

  &:active {
    transform: translateY(0);
  }

  &.copied {
    background: #28a745;
    border-color: #28a745;
  }
`;

const AccessDescription = styled.p`
  font-size: 13px;
  color: #6c757d;
  margin: 0;
  line-height: 1.4;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  strong {
    color: #495057;
  }

  // --- INICIO: ESTILOS MÓVILES ---
  // Permite que el contenido largo se ajuste mejor en pantallas pequeñas
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  // --- FIN: ESTILOS MÓVILES ---
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;

  // --- INICIO: ESTILOS MÓVILES ---
  // Apila los botones verticalmente
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
  // --- FIN: ESTILOS MÓVILES ---
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  ${({ $primary }) => $primary ? `
    background-color: #007bff;
    color: white;
    &:hover {
      background-color: #0056b3;
    }
  ` : `
    background-color: #e9ecef;
    color: #495057;
    border: 1px solid #ced4da;
    &:hover {
      background-color: #dee2e6;
    }
  `}

  // --- INICIO: ESTILOS MÓVILES ---
  // Hace que los botones ocupen todo el ancho
  @media (max-width: 768px) {
    width: 100%;
    padding: 12px; // Aumenta el padding para que sean más fáciles de presionar
  }
  // --- FIN: ESTILOS MÓVILES ---
`;

const Step2Title = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #343a40;
  margin-bottom: 24px;
`;

const OptionBox = styled.label`
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: #adb5bd;
  }
  
  &:has(input:checked) {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
  }
`;

const OptionBoxCheckbox = styled.input`
  width: 20px;
  height: 20px;
  margin-right: 12px;
`;

// --- COMPONENTE PRINCIPAL (SIN CAMBIOS EN LA LÓGICA) ---
export function CuentasEspejoForm({ onBack, cuentaEspejoData }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [responseData, setResponseData] = useState(null);
  const [copyStates, setCopyStates] = useState({ pin: false, url: false });
  const token = useSelector(state => state.auth.token);

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [fechaValue, setFechaValue] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  const vehicles = useSelector(state => state.vehicle.vehicles, (prev, next) => {
    return JSON.stringify(prev) === JSON.stringify(next);
  });

  const [formData, setFormData] = useState({
    nombre: cuentaEspejoData?.nombre || '',
    email: cuentaEspejoData?.email || '',
    telefono: cuentaEspejoData?.telefono || '',
    unidades: cuentaEspejoData?.unidades || [],
    usaCaducidad: cuentaEspejoData?.usaCaducidad || false,
    fechaCaducidad: cuentaEspejoData?.fechaCaducidad || '',
    accesoLibre: false,
    metodoEnvio: '', 
  });

  useEffect(() => {
    if (cuentaEspejoData) {
      setFormData({
        nombre: cuentaEspejoData.nombre,
        email: cuentaEspejoData.email,
        telefono: cuentaEspejoData.telefono,
        unidades: [],
        usaCaducidad: cuentaEspejoData.fechaCaducidad ? true : false,
        fechaCaducidad: cuentaEspejoData.fechaCaducidad,
        accesoLibre: cuentaEspejoData.libre,
        metodoEnvio: cuentaEspejoData.metodoEnvio,
      });
    }
  }, [cuentaEspejoData]);

  useEffect(() => {
    if (cuentaEspejoData && vehicles.length > 0) {
      let dispositivosArray = [];
      if (cuentaEspejoData.ids_dispositivos) {
        if (typeof cuentaEspejoData.ids_dispositivos === 'string') {
          dispositivosArray = cuentaEspejoData.ids_dispositivos.split(',').map(id => id.trim());
        } else if (Array.isArray(cuentaEspejoData.ids_dispositivos)) {
          dispositivosArray = cuentaEspejoData.ids_dispositivos;
        }
      }
      
      const validIds = dispositivosArray.filter(id => 
        vehicles.some(vehicle => vehicle.id == id)
      );
      
      console.log('IDs válidos encontrados:', validIds);
      setSelectUnidades(validIds);
    }
  }, [vehicles, cuentaEspejoData]);

  const handleNext = () => setCurrentStep(prev => prev < 3 ? prev + 1 : prev);
  const handleBack = () => setCurrentStep(prev => prev > 1 ? prev - 1 : prev);
 
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const steps = ['Datos principales', 'Medio de envío', 'Confirmación', 'Acceso'];

  const unidades = useMemo(() => {
    return vehicles.map(vehicle => ({
      id: vehicle.id,
      name: vehicle.info.nombre,
      value: vehicle.id
    }));
  }, [vehicles]);

  const [selectUnidades, setSelectUnidades] = useState([]);

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStates(prev => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopyStates(prev => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

   // --- CAMBIO 3: Nueva función para manejar el cambio de fecha desde el DateTimePicker ---
   const handleDateChange = (newValue) => {
    // Formatear la fecha a un string compatible con el input 'datetime-local'
    const formattedDate = newValue ? new Date(newValue.getTime() - (newValue.getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : '';
    setFormData(prev => ({
        ...prev,
        fechaCaducidad: formattedDate
    }));
    setIsDatePickerOpen(false); // Cierra el picker al seleccionar
  };

  const convertIdsToString = (idsArray) => {
    if (Array.isArray(idsArray)) {
      return idsArray.join(',');
    }
    return idsArray;
  };

  const handleSubmit = async () => {
    try {
      let response;
      
      if (cuentaEspejoData?.id) {
        response = await updateCuentasEspejo(token, {
          id: cuentaEspejoData.id,
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          dispositivos: selectUnidades,
          fecha_expiracion: formData.usaCaducidad ? formData.fechaCaducidad : null,
          libre: formData.accesoLibre,
        });
      } else {
        response = await createCuentasEspejo(token, {
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          dispositivos: selectUnidades,
          fecha_expiracion: formData.usaCaducidad ? formData.fechaCaducidad : null,
          libre: formData.accesoLibre,
        });
      }
      
      if(response.status == 200){
        if (cuentaEspejoData?.id) {
          alert('¡Cuenta espejo actualizada exitosamente!');
          onBack();
        } else {
          setResponseData({
            pin: response.pin,
            url: response.url
          });
          setCurrentStep(4);
        }
      } else {
        alert(`Error al ${cuentaEspejoData?.id ? 'actualizar' : 'crear'} la cuenta espejo`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Error al ${cuentaEspejoData?.id ? 'actualizar' : 'crear'} la cuenta espejo`);
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      unidades: [],
      usaCaducidad: false,
      fechaCaducidad: '',
      accesoLibre: false,
      metodoEnvio: '', 
    });
    setSelectUnidades([]);
    setResponseData(null);
    setCopyStates({ pin: false, url: false });
    setCurrentStep(1);
  }

  return (
    <FormContainer>
      <Header>
        <h1>{cuentaEspejoData?.id ? 'Editar cuenta espejo' : 'Agregar cuenta espejo'}</h1>
        <p>Una herramienta fácil y sencilla para compartir con sus clientes el seguimiento de sus activos.</p>
      </Header>

      <StepperContainer>
        <StepLine />
        {steps.map((label, index) => (
          <Step key={index}>
            <StepNumber $isActive={currentStep === index + 1} $isCompleted={currentStep > index + 1}>
              {index + 1}
            </StepNumber>
            <StepLabel $isActive={currentStep === index + 1}>{label}</StepLabel>
          </Step>
        ))}
      </StepperContainer>

      <StepContentWrapper>
        <StepSlider $currentStep={currentStep}>
          <StepContent> {/* Paso 1 */}
              <FormRow>
                <FormGroup>
                  <FormInput
                    label="Nombre Completo"
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej. Juan Pérez"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <MultiSelect
                      showSearch={true}
                      label="Unidades" 
                      options={unidades}
                      value={selectUnidades}
                      onChange={setSelectUnidades}
                  />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <FormInput
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ejemplo@correo.com"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <FormInput
                    label="Teléfono"
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Ej. +52 123 456 7890"
                    required
                  />
                </FormGroup>
              </FormRow>
              <CheckboxWrapper>
                <Checkbox type="checkbox" id="usaCaducidad" name="usaCaducidad" checked={formData.usaCaducidad} onChange={handleChange} />
                <Label htmlFor="usaCaducidad" style={{ marginBottom: 0 }}>Fecha caducidad</Label>
              </CheckboxWrapper>

              <FormGroup>
                  {isMobile ? (

                  <MobileInputDateTime
                    value={formData.fechaCaducidad ? new Date(formData.fechaCaducidad) : null}
                    onChange={handleDateChange} // Esta función ya la tienes y actualiza el estado
                    disabled={!formData.usaCaducidad} // <-- ¡Esta es la línea clave que lo habilita/deshabilita!
                  />
                   
                  ) : (
                    // Versión de Escritorio (la que ya tenías)
                    <Input 
                      type="datetime-local" 
                      id="fechaCaducidad" 
                      name="fechaCaducidad" 
                      value={formData.fechaCaducidad} 
                      onChange={handleChange} 
                      disabled={!formData.usaCaducidad} 
                    />
                  )}
                </FormGroup>

              <CheckboxWrapper>
                <Checkbox type="checkbox" id="accesoLibre" name="accesoLibre" checked={formData.accesoLibre} onChange={handleChange} />
                <Label htmlFor="accesoLibre" style={{ marginBottom: 0 }}>Acceso libre</Label>
              </CheckboxWrapper>
          </StepContent>

          <StepContent> {/* Paso 2 */}
              <Step2Title>¿Por dónde quieres enviar la cuenta espejo?</Step2Title>
              <FormGroup>
                <OptionBox>
                  <OptionBoxCheckbox 
                    type="radio"
                    name="metodoEnvio" 
                    value="portapapeles"
                    checked={formData.metodoEnvio === 'portapapeles'}
                    onChange={handleChange}
                  />
                  <span>Portapapeles</span>
                </OptionBox>
              </FormGroup>
          </StepContent>

          <StepContent> {/* Paso 3 */}
              <Summary>
                <h4>Confirmar Datos</h4>
                <SummaryItem><strong>Nombre:</strong> <span>{formData.nombre || 'No especificado'}</span></SummaryItem>
                <SummaryItem><strong>Email:</strong> <span>{formData.email || 'No especificado'}</span></SummaryItem>
                <SummaryItem><strong>Teléfono:</strong> <span>{formData.telefono || 'No especificado'}</span></SummaryItem>
                <SummaryItem><strong>Unidades:</strong> <span>{selectUnidades.length > 0 ? selectUnidades.map(id => unidades.find(u => u.id == id)?.name).join(', ') : 'No especificado'}</span></SummaryItem>
                <SummaryItem><strong>Caducidad:</strong> <span>{formData.usaCaducidad ? formData.fechaCaducidad.replace('T', ' ') : 'No aplica'}</span></SummaryItem>
                <SummaryItem><strong>Método de envío:</strong> <span>{formData.metodoEnvio || 'No seleccionado'}</span></SummaryItem>
              </Summary>
          </StepContent>

          <StepContent> {/* Paso 4 */}
            {responseData && (
              <AccessCard>
                <AccessCardHeader>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <h5>¡Cuenta Espejo Creada!</h5>
                </AccessCardHeader>
                
                <AccessDescription>
                  Comparte estos datos con tu cliente para que pueda acceder al seguimiento de sus activos.
                </AccessDescription>

                <AccessInfo>
                  <AccessLabel>PIN de Acceso</AccessLabel>
                  <AccessValue>
                    <span>{responseData.pin}</span>
                    <CopyButton 
                      onClick={() => copyToClipboard(responseData.pin, 'pin')}
                      className={copyStates.pin ? 'copied' : ''}
                    >
                      {copyStates.pin ? '¡Copiado!' : 'Copiar'}
                    </CopyButton>
                  </AccessValue>
                </AccessInfo>

                <AccessInfo>
                  <AccessLabel>URL del Formulario</AccessLabel>
                  <AccessValue>
                    <span>{responseData.url}</span>
                    <CopyButton 
                      onClick={() => copyToClipboard(responseData.url, 'url')}
                      className={copyStates.url ? 'copied' : ''}
                    >
                      {copyStates.url ? '¡Copiado!' : 'Copiar'}
                    </CopyButton>
                  </AccessValue>
                </AccessInfo>
              </AccessCard>
            )}
          </StepContent>
        </StepSlider>
      </StepContentWrapper>

      <Footer>
        {currentStep === 1 && <Button onClick={() => {
          resetForm();
          onBack();
        }}>REGRESAR</Button>}
        {currentStep > 1 && currentStep < 4 && <Button onClick={handleBack}>ATRÁS</Button>}
        {currentStep < 3 && <Button $primary onClick={handleNext}>SIGUIENTE</Button>}
        {currentStep === 3 && <Button $primary onClick={handleSubmit}>{cuentaEspejoData?.id ? 'ACTUALIZAR' : 'FINALIZAR'}</Button>}
        {currentStep === 4 && <Button $primary onClick={() => {
          resetForm();
          onBack();
        }}>COMPLETAR</Button>}
      </Footer>
    </FormContainer>
  );
}