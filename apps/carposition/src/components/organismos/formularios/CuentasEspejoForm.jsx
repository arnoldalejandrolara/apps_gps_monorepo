import React, { useState } from 'react';
import styled from 'styled-components';
import { FormInput } from './FormInput'; // Asegúrate de tener este componente creado
import { CustomSelect } from './CustomSelect'; // Asegúrate de tener este componente creado
import { useSelector } from 'react-redux';

// --- ESTILOS ---

const FormContainer = styled.div`
  background-color: #ffffff;
  padding: 5px;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #1a1a1a;
  overflow: hidden; 
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

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  strong {
    color: #495057;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
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
`;

// --- INICIO: NUEVOS ESTILOS PARA EL PASO 2 ---
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
  
  // Estilo cuando el checkbox dentro está seleccionado
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
// --- FIN: NUEVOS ESTILOS PARA EL PASO 2 ---

// --- COMPONENTE PRINCIPAL ---

export function CuentasEspejoForm({ onBack }) {
  const [currentStep, setCurrentStep] = useState(1);
  const vehicles = useSelector(state => state.vehicle.vehicles);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    unidades: '',
    usaCaducidad: false,
    fechaCaducidad: '',
    accesoLibre: false,
    // --- CAMBIO: Actualizado para el nuevo paso 2 ---
    metodoEnvio: '', 
  });

  const handleNext = () => setCurrentStep(prev => prev < 3 ? prev + 1 : prev);
  const handleBack = () => setCurrentStep(prev => prev > 1 ? prev - 1 : prev);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const steps = ['Datos principales', 'Medio de envío', 'Confirmación'];

  const unidades = vehicles.map(vehicle => ({
    id: vehicle.id,
    name: vehicle.info.nombre_corto,
    value: vehicle.id
  }));

  const [selectUnidad, setSelectUnidad] = useState('');

  return (
    <FormContainer>
      <Header>
        <h1>Agregar cuenta espejo</h1>
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
                  <CustomSelect
                      showSearch={true}
                      label="Unidades" 
                      options={unidades}
                      value={selectUnidad}
                      onChange={setSelectUnidad}
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
                <Input type="datetime-local" id="fechaCaducidad" name="fechaCaducidad" value={formData.fechaCaducidad} onChange={handleChange} disabled={!formData.usaCaducidad} />
              </FormGroup>
              <CheckboxWrapper>
                <Checkbox type="checkbox" id="accesoLibre" name="accesoLibre" checked={formData.accesoLibre} onChange={handleChange} />
                <Label htmlFor="accesoLibre" style={{ marginBottom: 0 }}>Acceso libre</Label>
              </CheckboxWrapper>
          </StepContent>

          {/* --- INICIO: CONTENIDO DEL PASO 2 ACTUALIZADO --- */}
          <StepContent> 
              <Step2Title>¿Por dónde quieres enviar la cuenta espejo?</Step2Title>
              <FormGroup>
                <OptionBox>
                  <OptionBoxCheckbox 
                    type="radio" // Usamos radio para que solo se pueda seleccionar uno
                    name="metodoEnvio" 
                    value="portapapeles"
                    checked={formData.metodoEnvio === 'portapapeles'}
                    onChange={handleChange}
                  />
                  <span>Portapapeles</span>
                </OptionBox>
              </FormGroup>
          </StepContent>
          {/* --- FIN: CONTENIDO DEL PASO 2 ACTUALIZADO --- */}

          <StepContent> {/* Paso 3 */}
              <Summary>
                <h4>Confirmar Datos</h4>
                <SummaryItem><strong>Nombre:</strong> <span>{formData.nombre || 'No especificado'}</span></SummaryItem>
                <SummaryItem><strong>Email:</strong> <span>{formData.email || 'No especificado'}</span></SummaryItem>
                <SummaryItem><strong>Teléfono:</strong> <span>{formData.telefono || 'No especificado'}</span></SummaryItem>
                <SummaryItem><strong>Unidades:</strong> <span>{selectUnidad || 'No especificado'}</span></SummaryItem>
                <SummaryItem><strong>Caducidad:</strong> <span>{formData.usaCaducidad ? formData.fechaCaducidad.replace('T', ' ') : 'No aplica'}</span></SummaryItem>
                <SummaryItem><strong>Método de envío:</strong> <span>{formData.metodoEnvio || 'No seleccionado'}</span></SummaryItem>
              </Summary>
          </StepContent>
        </StepSlider>
      </StepContentWrapper>

      <Footer>
        {currentStep === 1 && <Button onClick={onBack}>REGRESAR</Button>}
        {currentStep > 1 && <Button onClick={handleBack}>ATRÁS</Button>}
        {currentStep < 3 && <Button $primary onClick={handleNext}>SIGUIENTE</Button>}
        {currentStep === 3 && <Button $primary onClick={() => alert('¡Cuenta espejo creada!')}>FINALIZAR</Button>}
      </Footer>
    </FormContainer>
  );
}