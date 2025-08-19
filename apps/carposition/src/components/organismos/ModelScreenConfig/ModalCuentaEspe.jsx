import React, { useState , useEffect} from 'react';
import styled from 'styled-components';
import CustomInput from '../../moleculas/InputCustome';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CustomSelect from '../../moleculas/CustomeSelect';
import { useSelector } from 'react-redux';
import { createCuentasEspejo, updateCuentasEspejo } from '../../../services/CuentasEspejoService.js';

const steps = ['Datos principales', 'Medio de envío', 'Cuenta enviada'];

export default function ModalFormulario({ visible, onClose, onSubmit, cuentaEdit, modo }) {
  // Si es edición, inicializa los estados con los datos
  const [activeStep, setActiveStep] = useState(0);
  const [nombreCuentaEspejo, setNombreCuentaEspejo] = useState('');
  const [hasErrorNombreCuentaEspejo, setHasErrorNombreCuentaEspejo] = useState(false);

  const [idCuentaEspejo, setIdCuentaEspejo] = useState('0');

  const [telefono, setTelefono] = useState('');
  const [hasErrorTelefono, setHasErrorTelefono] = useState(false);

  const [email, setEmail] = useState('');
  const [hasErrorEmail, setHasErrorEmail] = useState(false);

  const unidades = useSelector((state) => state.vehicle?.vehicles);
  const [unidadesSelected, setUnidadesSelected] = useState([]);
  const [hasErrorUnidades, setHasErrorUnidades] = useState(false);

  const [fecha, setFecha] = useState('');
  const [hasErrorFecha, setHasErrorFecha] = useState(false);
  const [fechaEspecifica, setFechaEspecifica] = useState(false);
  const [accesoLibre, setAccesoLibre] = useState(false);

  const [envioWhatsapp, setEnvioWhatsapp] = useState(false);
  const [envioEmail, setEnvioEmail] = useState(false);
  const [envioTelefono, setEnvioTelefono] = useState(false);
  const [envioPortapapeles, setEnvioPortapapeles] = useState(false);

  const [cuentaCodigo, setCuentaCodigo] = useState('');
  const [cuentaUrl, setCuentaUrl] = useState('');

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const [copiedMessage, setCopiedMessage] = useState(false);

  // Mensaje de éxito y control para mostrar/ocultar CopyBox en el paso 3
  const [successText, setSuccessText] = useState('');
  const [hideCopyBox, setHideCopyBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const token = useSelector((state) => state.auth?.token);

//   const [selected, setSelected] = useState(null);
//   const [hasErrorUnidad, setHasErrorUnidad] = useState(false);


  const [options, setOptions] = useState([]);

  const resetForm = () => {
    setNombreCuentaEspejo('');
    setTelefono('');
    setEmail('');
    setUnidadesSelected([]);
    setFecha('');
    setFechaEspecifica(false);
    setAccesoLibre(false);
    setEnvioWhatsapp(false);
    setEnvioEmail(false);
    setEnvioTelefono(false);
    setEnvioPortapapeles(false);
    setCuentaCodigo('');
    setCuentaUrl('');
    setSuccessText('');
    setHideCopyBox(false);
    setIsLoading(false);
    setActiveStep(0);
    setCopiedCode(false);
    setCopiedUrl(false);
    setHasErrorNombreCuentaEspejo(false);
    setHasErrorTelefono(false);
    setHasErrorEmail(false);
    setHasErrorUnidades(false);
    setHasErrorFecha(false);
  }

  useEffect(() => {
    if (cuentaEdit) {
      setIdCuentaEspejo(cuentaEdit.id);
      setNombreCuentaEspejo(cuentaEdit.nombre);
      setTelefono(cuentaEdit.telefono);
      setEmail(cuentaEdit.email);
      setUnidadesSelected(cuentaEdit.ids_dispositivos.split(',').map(id => parseInt(id)));
      setFecha(cuentaEdit.fecha_expiracion || '');
      setFechaEspecifica(!!cuentaEdit.fecha_expiracion);
      setAccesoLibre(cuentaEdit.libre);
      setCuentaCodigo(cuentaEdit.pin);
      setCuentaUrl('https://carp.to/' + cuentaEdit.clave_acceso);
      // ...el resto de tus campos

      if(modo === 'enviar'){
        setActiveStep(1);
      } else if(modo === 'editar'){
        setActiveStep(0);
      }
    } else {
      resetForm();
    }
    // Resetear estados de copiado cuando se abre el modal
    setCopiedCode(false);
    setCopiedUrl(false);
  }, [cuentaEdit, visible]); // se reinicia cada vez que cambia la cuenta a editar o se abre el modal

  useEffect(() => {
    if(unidades){
        // console.log(unidades);
        setOptions(unidades.map(unidad => ({ label: unidad.info.nombre, value: unidad.id })));
    }
  }, [unidades]);

  if (!visible) return null;

  const handleInputChange = (fieldName, value, setter) => {
    setter(value);
    switch (fieldName) {
      case 'nombreCuentaEspejo': setHasErrorNombreCuentaEspejo(false); break;
      case 'telefono': setHasErrorTelefono(false); break;
      case 'email': setHasErrorEmail(false); break;
    //   case 'unidades': setHasErrorUnidades(false); break;
      case 'id_unidad': setUnidades(false); break;
      case 'fecha': setHasErrorFecha(false); break;
      default: break;
    }
  };

  const validateStep = async (step) => {
    let error = false;
    if (step === 0) {
      if (!nombreCuentaEspejo) { setHasErrorNombreCuentaEspejo(true); error = true; }
      if (!telefono) { setHasErrorTelefono(true); error = true; }
      if (!email) { setHasErrorEmail(true); error = true; }
      if (!unidadesSelected.length) { setHasErrorUnidades(true); error = true; }
      if (fechaEspecifica && !fecha) { setHasErrorFecha(true); error = true; }
      console.log('error', error);
    }
    if (step === 1) {
      if (!envioWhatsapp && !envioEmail && !envioTelefono && !envioPortapapeles) {
        error = true;
        alert('Selecciona al menos un medio de envío');
      }
    }
    return error;
  };

  const submitRequest = async () => {
    setIsLoading(true);
    try {
      console.log({nombreCuentaEspejo, telefono, email, unidadesSelected, fechaEspecifica, fecha, accesoLibre, envioWhatsapp, envioEmail, envioTelefono});
      
      // Formatear la fecha para PostgreSQL timestampz
      let fechaFormateada = null;
      if (fechaEspecifica && fecha) {
        try {
          // Crear la fecha de forma más segura
          console.log(fecha);
          const [day, month, year] = fecha.split('/').map(x => parseInt(x));
          console.log({day, month, year});
          const fechaObj = new Date(year, month - 1, day); // month - 1 porque los meses van de 0-11
          fechaObj.setHours(23, 59, 59, 999);
          fechaFormateada = fechaObj.toISOString();
        } catch (error) {
          console.error('Error al formatear la fecha:', error);
          alert('Error al formatear la fecha');
          setIsLoading(false);
          return;
        }
      }

      const response = await createCuentasEspejo(token, {
        nombre: nombreCuentaEspejo,
        fecha_expiracion: fechaFormateada,
        libre: accesoLibre,
        email: email,
        telefono: telefono,
        dispositivos: unidadesSelected
      });

      if(response.status == 200){
        setSuccessText('¡Se guardó exitosamente!');
        setCuentaCodigo(response.pin);
        setCuentaUrl(response.url);
      } else {
        alert('Error al crear la cuenta espejo');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear la cuenta espejo');
    } finally {
      setIsLoading(false);
    }
  }

  const updateRequest = async () => {
    setIsLoading(true);
    try {
      const response = await updateCuentasEspejo(token, {
        id: idCuentaEspejo,
        nombre: nombreCuentaEspejo,
        libre: accesoLibre,
        email: email,
        telefono: telefono,
        dispositivos: unidadesSelected
      });

      if(response.status == 200){
        setSuccessText('¡Se actualizó exitosamente!');
      } else {
        alert('Error al actualizar la cuenta espejo');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar la cuenta espejo');
    } finally {
      setIsLoading(false);
    }
  }

  const handleNext = async (e) => {
    if (e) e.preventDefault();
    if (!await validateStep(activeStep)) setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepperSubmit = async (e) => {
    e.preventDefault();
    let error = await validateStep(activeStep);
    if (error) return;
    
    console.log('activeStep', activeStep);
    console.log('modo', modo);
    console.log('idCuentaEspejo', idCuentaEspejo);

    if (activeStep === 1 && modo === 'nuevo' && idCuentaEspejo === '0') {
      await submitRequest();
    } else if (activeStep === 1 && modo === 'editar' && idCuentaEspejo !== '0') {
      console.log('updateRequest');
      await updateRequest();
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleCopy = async (text, setCopied) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (error) {
      //console.error('Error al copiar al portapapeles:', error);
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } catch (fallbackError) {
        console.error('Error en fallback de copiado:', fallbackError);
      }
      document.body.removeChild(textArea);
    }
  };

  // Manejadores para los botones Guardar y Guardar y Enviar en el paso 2
  const handleGuardarSolo = async (e) => {
    if (e) e.preventDefault();
    if (!await validateStep(activeStep)) {
      setSuccessText('¡Se guardó exitosamente!');
      setHideCopyBox(true); // Oculta CopyBox
      setActiveStep(2);
    }
  };

  const handleGuardarYEnviar = async (e) => {
    if (e) e.preventDefault();
    if (!await validateStep(activeStep)) {
      setSuccessText('¡Se guardó y se envió exitosamente!');
      setHideCopyBox(false); // Muestra CopyBox
      setActiveStep(2);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h5 style={{ fontWeight: 500 }}>
        {modo === 'editar' ? 'Editar cuenta espejo' : modo === 'enviar' ? 'Enviar cuenta espejo' : 'Agregar cuenta espejo'}
        </h5>
        <SubText>
          Una herramienta fácil y sencilla para compartir con sus clientes el seguimiento de sus activos. Siga las instrucciones.
        </SubText>
        <Box sx={{ width: '100%', mb: 2 }}>
          <StyledStepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, idx) => (
              <StyledStep key={label}>
                <StyledStepLabel $show={idx === activeStep}>
                  <span className="step-label-text">{idx === activeStep ? label : ''}</span>
                </StyledStepLabel>
              </StyledStep>
            ))}
          </StyledStepper>
        </Box>
        <form onSubmit={handleStepperSubmit} autoComplete="off">
          {activeStep === 0 && (
            <Campos>
              <CustomInput
                placeholder="Nombre contacto"
                value={nombreCuentaEspejo}
                onChange={e => handleInputChange('nombreCuentaEspejo', e.target.value, setNombreCuentaEspejo)}
                hasError={hasErrorNombreCuentaEspejo}
                setHasError={setHasErrorNombreCuentaEspejo}
              />
              <Row>
                <CustomInput
                  placeholder="Email"
                  value={email}
                  onChange={e => handleInputChange('email', e.target.value, setEmail)}
                  hasError={hasErrorEmail}
                  setHasError={setHasErrorEmail}
                  style={{ flex: 1 }}
                />
                <CustomInput
                  placeholder="Teléfono"
                  value={telefono}
                  onChange={e => handleInputChange('telefono', e.target.value, setTelefono)}
                  hasError={hasErrorTelefono}
                  setHasError={setHasErrorTelefono}
                  style={{ flex: 1, marginLeft: 8, marginRight: 8 }}
                />
              </Row>

              {/* <CustomInput
                placeholder="Unidades"
                value={unidades}
                onChange={e => handleInputChange('unidades', e.target.value, setUnidades)}
                hasError={hasErrorUnidades}
                setHasError={setHasErrorUnidades}
                type="number"
              /> */}

                <CustomSelect
                    options={options}
                    selectedOption={options.filter(opt => unidadesSelected.includes(opt.value))}
                    setSelectedOption={optionsArr => {
                        setUnidadesSelected(optionsArr.map(opt => opt.value));
                        setHasErrorUnidades(false);
                    }}
                    placeholder={"Unidades"}
                    hasError={hasErrorUnidades}
                    setHasError={setHasErrorUnidades}
                    withSearch={true}
                    multiSelect={true} // <-- importante
                />

              <DottedLine />

              <CheckLabel>
                <input
                  type="checkbox"
                  checked={fechaEspecifica}
                  disabled={modo === 'editar'}
                  onChange={e => {
                    setFechaEspecifica(e.target.checked);
                    if (!e.target.checked) setFecha('');
                  }}
                />
                Fecha caducidad
              </CheckLabel>

              <CustomInput
                placeholder=""
                value={fecha}
                onChange={e => handleInputChange('fecha', e.target.value, setFecha)}
                hasError={hasErrorFecha}
                setHasError={setHasErrorFecha}
                type="date"
                disabled={!fechaEspecifica || modo === 'editar'}
              />

              <CheckLabel>
                <input
                  type="checkbox"
                  checked={accesoLibre}
                  onChange={e => {
                    setAccesoLibre(e.target.checked);
                  }}
                />
                Acceso libre
              </CheckLabel>
            </Campos>
          )}
          {activeStep === 1 && (
            <Campos>
              <EnvioLabel>¿Por dónde quieres enviar la cuenta espejo?</EnvioLabel>
              <CheckOptionGrid>
                {/* <CheckOption
                  $checked={envioWhatsapp}
                  onClick={() => setEnvioWhatsapp((v) => !v)}
                  tabIndex={0}
                >
                  <Checkbox
                    checked={envioWhatsapp}
                    tabIndex={-1}
                    sx={{
                      color: '#b0bec5',
                      '&.Mui-checked': { color: '#27bcb7' },
                    }}
                  />
                  <span>WhatsApp</span>
                </CheckOption>
                <CheckOption
                  $checked={envioEmail}
                  onClick={() => setEnvioEmail((v) => !v)}
                  tabIndex={0}
                >
                  <Checkbox
                    checked={envioEmail}
                    tabIndex={-1}
                    sx={{
                      color: '#b0bec5',
                      '&.Mui-checked': { color: '#27bcb7' },
                    }}
                  />
                  <span>Email</span>
                </CheckOption>
                <CheckOption
                  $checked={envioTelefono}
                  onClick={() => setEnvioTelefono((v) => !v)}
                  tabIndex={0}
                >
                  <Checkbox
                    checked={envioTelefono}
                    tabIndex={-1}
                    sx={{
                      color: '#b0bec5',
                      '&.Mui-checked': { color: '#27bcb7' },
                    }}
                  />
                  <span>Mensaje SMS</span>
                </CheckOption> */}
                <CheckOption
                  $checked={envioPortapapeles}
                  onClick={() => setEnvioPortapapeles((v) => !v)}
                  tabIndex={0}
                >
                  <Checkbox
                    checked={envioPortapapeles}
                    tabIndex={-1}
                    sx={{
                      color: '#b0bec5',
                      '&.Mui-checked': { color: '#27bcb7' },
                    }}
                  />
                  <span>Portapapeles</span>
                </CheckOption>
              </CheckOptionGrid>
            </Campos>
          )}
          {activeStep === 2 && (
            <Campos>
              <SuccessMsg>
                {successText
                  ? (
                      <>
                        ✅ {successText}
                      </>
                    )
                  : (
                      <>
                        ✅ ¡La cuenta espejo ha sido enviada exitosamente!
                      </>
                    )
                }
              </SuccessMsg>
              {!hideCopyBox && (
                <CopyBox>
                  <CopyLabel>Código de acceso</CopyLabel>
                  <CopyInputContainer>
                    <CopyInput type="text" value={cuentaCodigo} readOnly />
                    <Tooltip title={copiedCode ? "Copiado" : "Copiar"}>
                      <IconButton
                        onClick={() => handleCopy(cuentaCodigo, setCopiedCode)}
                        edge="end"
                        size="small"
                      >
                        <ContentCopyIcon sx={{ color: "white" }} fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CopyInputContainer>
                  <CopyLabel>URL de acceso</CopyLabel>
                  <CopyInputContainer>
                    <CopyInput type="text" value={cuentaUrl} readOnly />
                    <Tooltip title={copiedUrl ? "Copiado" : "Copiar"}>
                      <IconButton
                        onClick={() => handleCopy(cuentaUrl, setCopiedUrl)}
                        edge="end"
                        size="small"
                      >
                        <ContentCopyIcon sx={{ color: "white" }} fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CopyInputContainer>
                  <CopyLabel>Mensaje de acceso</CopyLabel>
                  <CopyInputContainer>
                    <CopyTextarea type="text" value={`Hola, te hemos compartido una cuenta espejo. Para acceder, visita la siguiente URL: ${cuentaUrl} con el código: ${cuentaCodigo}`} readOnly />
                    <Tooltip title={copiedMessage ? "Copiado" : "Copiar"}>
                      <IconButton
                        onClick={() => handleCopy(`Hola, te hemos compartido una cuenta espejo. Para acceder, visita la siguiente URL: ${cuentaUrl} con el código: ${cuentaCodigo}`, setCopiedMessage)}
                        edge="end"
                        size="small"
                      >
                        <ContentCopyIcon sx={{ color: "white" }} fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CopyInputContainer>
                </CopyBox>
              )}
              <Button
                variant="contained"
                color="success"
                style={{
                  background: '#222222',
                  color: '#fff',
                  borderColor: '#C8C8C8',
                  borderWidth: 2,          
                  borderStyle: 'solid',    
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: 15,
                  marginTop: 24,
                }}
                onClick={() => {
                  onSubmit && onSubmit({
                    nombreCuentaEspejo,
                    telefono,
                    email,
                    unidades: unidadesSelected,
                    fecha: fechaEspecifica ? fecha : '',
                    fechaEspecifica,
                    accesoLibre,
                    envioWhatsapp,
                    envioEmail,
                    envioTelefono,
                  });
                  console.log('resetForm');
                  resetForm();
                  onClose();
                }}
                type="button"
              >
                Hecho
              </Button>
            </Campos>
          )}
          {activeStep < 2 && (
            <ModalActions style={{ justifyContent: 'end' }}>
              {modo !== 'enviar' && (
              <Button
                variant="outlined"
                onClick={activeStep === 0 ? onClose : handleBack}
                color="inherit"
                style={{
                  borderColor: '#fff',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 13,
                }}
                type="button"
              >
                {activeStep === 0 ? 'Cancelar' : 'Atrás'}
              </Button>
              )}
              {activeStep === steps.length - 2 ? (
                modo === 'editar' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <Button
                      variant="contained"
                      style={{
                        background: 'white',
                        color: '#222',
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                      type="submit"
                      // onClick={handleGuardarSolo}
                    >
                      Guardar
                    </Button>
                    {/* <Button
                      variant="contained"
                      style={{
                        background: '#27bcb7',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                      type="submit"
                      // onClick={handleGuardarYEnviar}
                    >
                      Guardar y Enviar
                    </Button> */}
                  </div>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    style={{
                      background: 'white',
                      color: '#222',
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    {isLoading ? 'Enviando...' : 'Enviar'}
                  </Button>
                )
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  style={{
                    background: 'white',
                    color: '#222',
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                  type="button"
                >
                  Siguiente
                </Button>
              )}
            </ModalActions>
          )}
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}

// Stepper: círculos futuros blancos, label solo step actual.
const StyledStepper = styled(Stepper)`
  background: transparent;
  .MuiStep-root {
    background: transparent;
  }
  .MuiStepIcon-root {
    background: #fff;
    border-radius: 50%;
  }
  .MuiStepIcon-root.Mui-active,
  .MuiStepIcon-root.Mui-completed {
    background: transparent;
  }
  .MuiStepIcon-root:not(.Mui-active):not(.Mui-completed) {
    color: #bdbdbd !important;
  }
`;

const StyledStep = styled(Step)``;
const StyledStepLabel = styled(StepLabel)`
  .step-label-text {
    color: #fff !important;
    font-size: 12px !important;
    font-weight: 600;
    display: inline-block;
    min-height: 16px;
  }
  ${({ $show }) => !$show && `
    .step-label-text {
      color: transparent !important;
      font-size: 0 !important;
      min-height: 16px;
    }
  `}
`;

const CheckOptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px 12px;
  margin-bottom: 12px;

 @media (max-width: 768px) {
    /* Cambia a 2 columnas en mobile */
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

const CheckOption = styled.div`
  display: flex;
  align-items: center;
  background: ${({ $checked }) => ($checked ? '#222b2e' : 'transparent')};
  border: 1px solid ${({ $checked }) => ($checked ? '#27bcb7' : '#696969')};
  border-radius: 8px;
  padding: 10px 12px;
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: border 0.15s, background 0.15s;
  box-shadow: ${({ $checked }) => ($checked ? '0 0 0 2px #27bcb744' : 'none')};

  span {
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    margin-left: 4px;
    user-select: none;
  }
  &:hover, &:focus {
    border-color: #27bcb7;
    outline: none;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  z-index: 3000;
  display: flex; align-items: center; justify-content: center;
`;

const ModalContent = styled.div`
  background: #202020;
  color: white;
  padding: 25px 45px;
  border-radius: 12px;
  max-width: 700px;
  min-width: 350px;
  max-height: 90%;
  box-shadow: 0 2px 24px 0 #000a;
  display: flex;
  flex-direction: column;
  gap: 12px;
  /* SCROLL SI LA ALTURA NO CABE */
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 18px 8px;
    max-width: 98vw;
    min-width: unset;
    border-radius: 10px;
    font-size: 15px;
  }
`;

const SubText = styled.div`
  font-size: 12px;
  color: #cfd8dc;
  margin-bottom: 16px;
`;

const Campos = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const DottedLine = styled.div`
  border-top: 1px dashed #696969;
  margin: 10px 0 10px 0;
`;

const CheckLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 13px;
  gap: 8px;
  margin-bottom: 3px;
  color: #fff;
  user-select: none;

  input[type="checkbox"] {
    accent-color: #27bcb7;
  }
`;

const EnvioLabel = styled.div`
  font-size: 14px;
  color: #fff;
  font-weight: 500;
  margin-bottom: 18px;
  margin-top: 5px;
`;

const SuccessMsg = styled.div`
  color: #27bcb7;
  background: #202c28;
  padding: 24px 20px;
  border-radius: 10px;
  font-size: 17px;
  text-align: center;
  font-weight: 700;
  margin-top: 15px;
  margin-bottom: 8px;
`;

const CopyBox = styled.div`
  margin: 16px 0 8px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 768px) {
    gap: 4px;
    margin: 12px 0 6px 0;
  }
`;

const CopyInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #2A2A2A;
  border-radius: 7px;
  padding: 5px 12px;
`;

const CopyLabel = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #b0bec5;
  margin-bottom: 2px;
`;

const CopyInput = styled.input`
  border: none;
  background: transparent;
  color: #fff;
  font-size: 15px;
  width: 100%;
  outline: none;
  font-weight: 600;
`;

const CopyTextarea = styled.textarea`
  border: none;
  background: transparent;
  color: #fff;
  font-size: 15px;
  width: 100%;
  outline: none;
  font-weight: 600;
  height: 90px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 32px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    gap: 8px;
    margin-top: 20px;
  }
`;