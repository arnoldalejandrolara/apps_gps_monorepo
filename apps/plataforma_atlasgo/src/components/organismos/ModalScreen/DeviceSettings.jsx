import React, { useState } from 'react';
import styled from 'styled-components';
import { Tabs, Tab, Box, MenuItem, Select } from '@mui/material';

const DeviceSettings = ({ deviceId, onBack }) => {
  const [activeTab, setActiveTab] = useState(0); // Estado para la pestaña activa
  const [carType, setCarType] = useState(''); // Estado para el tipo de carro
  const [carColor, setCarColor] = useState(''); // Estado para el color del carro

  const [notificationsEnabled2, setNotificationsEnabled2] = useState(false);


  const handleCheckboxChange2 = (e) => setNotificationsEnabled2(e.target.checked);

  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectChange = (e) => setSelectedOption(e.target.value);


  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCarTypeChange = (event) => {
    setCarType(event.target.value);
  };

  const handleCarColorChange = (event) => {
    setCarColor(event.target.value);
  };

  return (
    <MainContainer>
      <HeaderSection>
        <TitleText>Configuración de dispositivo {deviceId}</TitleText>
      </HeaderSection>
      <Box sx={{ width: '100%', marginTop: '10px', borderBottom: 1, borderColor: 'gray' }}>
        <StyledTabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="Configuración de la unidad"
        >
          <StyledTab label="Información Básica" />
          <StyledTab label="Configuración" />
        </StyledTabs>
      </Box>

      <ContentScrollable>
        {activeTab === 0 && (
          <RowContainer>
            {/* Columna Izquierda */}
            <LeftSection>
              <InputWrapper>
                <InputLabel>Nombre:</InputLabel>
                <StyledInput type="text" placeholder="Ingresa el nombre de la unidad" />
              </InputWrapper>
              <InputWrapper>
                <InputLabel>Marca:</InputLabel>
                <StyledInput type="text" placeholder="Ingresa la marca" />
              </InputWrapper>
              <InputWrapper>
                <InputLabel>Modelo:</InputLabel>
                <StyledInput type="text" placeholder="Ingresa el modelo" />
              </InputWrapper>
              <InputWrapper>
                <InputLabel>Placa:</InputLabel>
                <StyledInput type="text" placeholder="Ingresa la placa" />
              </InputWrapper>
              <InputWrapper>
                <InputLabel>Estatus:</InputLabel>
                <StyledInput type="text" placeholder="Ingresa el estatus" />
              </InputWrapper>
              
            </LeftSection>

            {/* Columna Derecha */}
            <RightSection>
              <SketchfabModel />
              <RowContainer style={{ justifyContent: 'space-between' , width : '100%' , padding : '10px 100px'}}>
                <Column>
                  <InputLabel>Color:</InputLabel>
                  <StyledInput
                    type="color"
                    value={carColor}
                    onChange={handleCarColorChange}
                    style={{ width: '50px', height: '30px' }}
                  />
                </Column>
                <Column>
                  <InputLabel>Tipo:</InputLabel>
                  <Select
                    value={carType}
                    onChange={handleCarTypeChange}
                    displayEmpty
                    fullWidth
                    sx={{
                      background: 'transparent',
                      color: 'white',
                      border: '1px solid gray',
                      borderRadius: '4px',
                      width: '150px',
                    }}
                  >
                    <MenuItem value=""><em>Selecciona un tipo</em></MenuItem>
                    <MenuItem value="Sedan">Sedan</MenuItem>
                    <MenuItem value="SUV">SUV</MenuItem>
                    <MenuItem value="Camioneta">Camioneta</MenuItem>
                  </Select>
                </Column>
              </RowContainer>
            </RightSection>
          </RowContainer>
        )}
        {activeTab === 1 && (
          <div>
            {/* <p>Aquí puedes configurar los ajustes de la unidad.</p> */}
            <RowContainer>
            <Section>
              
            <SecurityItem>
              <LeftAlignedContainer>
                <SecurityCheckbox type="checkbox" checked={notificationsEnabled2} onChange={handleCheckboxChange2} />
                <SecurityLabelContainer>
                  <SecurityLabel>Alarma de velocidad</SecurityLabel>
                  <SecurityValue>
                  Detecta la velocidad solo cuando el GPS envia la información.
                  </SecurityValue>
                </SecurityLabelContainer>
              </LeftAlignedContainer>
              <StyledInput
                type="text"
                placeholder="Velocidad (Km/H)"
                style={{
                  width: '150px',
                }}
              />
            </SecurityItem>

            <SecurityItem>
              <LeftAlignedContainer>
                <SecurityCheckbox type="checkbox" checked={notificationsEnabled2} onChange={handleCheckboxChange2} />
                <SecurityLabelContainer>
                  <SecurityLabel>Alarma por tiempo detenido</SecurityLabel>
                  <SecurityValue>
                  Activara la alerta cuando exceda el tiempo detenido en mismo lugar.
                  </SecurityValue>
                </SecurityLabelContainer>
              </LeftAlignedContainer>
              <StyledInput
                type="text"
                placeholder="Minutos"
                style={{
                  width: '150px',
                }}
              />
            </SecurityItem>


        <SecurityItem>
        <LeftAlignedContainer>
                <SecurityCheckbox type="checkbox" checked={notificationsEnabled2} onChange={handleCheckboxChange2} />
                <SecurityLabelContainer>
                  <SecurityLabel>Alarma de rutas y viajes</SecurityLabel>
                  <SecurityValue>
                  Seleccione la ruta previamente creada.
                  </SecurityValue>
                </SecurityLabelContainer>
              </LeftAlignedContainer>
          <SecuritySelect value={selectedOption} onChange={handleSelectChange}>
            <option value="">Selecciona ruta</option>
            <option value="option1">Punto A - Punto B</option>
            <option value="option2">Ruta 2</option>
            <option value="option3">Ruta 3</option>
          </SecuritySelect>
        </SecurityItem>


        <SecurityItem>
        <LeftAlignedContainer>
                <SecurityCheckbox type="checkbox" checked={notificationsEnabled2} onChange={handleCheckboxChange2} />
                <SecurityLabelContainer>
                  <SecurityLabel>Alarma primer encendido del dia</SecurityLabel>
                  <SecurityValue>
                  Se notificara cuando tenga el primer encendido.
                  </SecurityValue>
                </SecurityLabelContainer>
              </LeftAlignedContainer>
        
        </SecurityItem>

        <SecurityItem>
              <LeftAlignedContainer>
                <SecurityCheckbox type="checkbox" checked={notificationsEnabled2} onChange={handleCheckboxChange2} />
                <SecurityLabelContainer>
                  <SecurityLabel>Alarma de nivel bateria (%)</SecurityLabel>
                  <SecurityValue>
                  Solo aplica para Dispositivos con la función de nivel de batería.
                  </SecurityValue>
                </SecurityLabelContainer>
              </LeftAlignedContainer>
              <StyledInput
                type="text"
                placeholder="Nivel de bateria (%)"
                style={{
                  width: '150px',
                }}
              />
            </SecurityItem>

        {/* <HorizontalLine /> */}

          </Section>
            </RowContainer>
          </div>
        )}
      </ContentScrollable>

      <FooterSection>
        <ButtonBack onClick={onBack}>Regresar</ButtonBack>
        <ButtonSave>Guardar Información</ButtonSave>
      </FooterSection>
    </MainContainer>
  );
};

const SketchfabModel = () => {
  return (
    <div className="sketchfab-embed-wrapper" style={{ width: '100%', textAlign: 'center' }}>
      <iframe
        title="Generic passenger car pack"
        frameBorder="0"
        allowFullScreen
        mozallowfullscreen="true"
        webkitallowfullscreen="true"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        src="https://sketchfab.com/models/9dea494b447e442fafbddfc7eccbf158/embed?autostart=1&ui_controls=0&ui_infos=0&ui_stop=0&background=dark"
        style={{
          width: '80%',
          height: '200px',
          border: 'none',
          borderRadius: '8px',
        }}
      ></iframe>
    </div>
  );
};

const SecurityItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  width: 100%; /* Asegura que ocupe todo el ancho */
`;

const LeftAlignedContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center; /* Centra verticalmente el contenido */
  gap: 20px; /* Espaciado entre el checkbox y el texto */
`;

const HorizontalLine = styled.hr`
  width: 100%;
  border: 1px solid #333;
  margin-bottom: 20px;
`;

const Section = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

// const SecurityItem = styled.div`
//   display: flex;
//   flex-direction: row;
//   justify-content: space-between;
//   margin-bottom: 20px;
//   flex-wrap: wrap;
// `;

const SecurityLabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SecurityLabel = styled.div`
  font-size: 14px;
  color: white;
`;

const SecurityValue = styled.div`
  font-size: 13px;
  color: grey;
`;

const SecurityCheckbox = styled.input`
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

const SecuritySelect = styled.select`
  font-size: 13px;
  color: white;
  background: transparent;
  border: 1px solid grey;
  border-radius: 8px;
  padding: 8px 10px;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 5px;
  color: white;
  scroll-y: auto;
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const TitleText = styled.h1`
  font-size: 16px;
  font-weight: 500;
`;

const StyledTabs = styled(Tabs)`
  .MuiTabs-indicator {
    background-color: white; /* Indicador blanco */
  }
`;

const StyledTab = styled((props) => <Tab {...props} />)`
  color: gray !important; /* Color gris por defecto */
  &.Mui-selected {
    font-size: 12px; /* Aumentar el tamaño de la fuente al seleccionar */
    color: white !important; /* Texto blanco cuando está seleccionado */
  }
`;

const ContentScrollable = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  margin-top: 20px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RightSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const InputLabel = styled.label`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.81);
`;

const StyledInput = styled.input`
  padding: 5px;
  border: 1px solid gray;
  border-radius: 8px;
  padding: 8px 10px;
  background-color: transparent; /* Fondo transparente */
  color: white;

  &:focus {
    outline: none;
    border-color: white; /* Borde blanco al enfocar */
  }
`;

const FooterSection = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
`;

const ButtonSave = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ButtonBack = styled.button`
  padding: 8px 16px;
  border: none;
  background-color: #333333;
  color: white;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #555555;
  }
`;

export default DeviceSettings;