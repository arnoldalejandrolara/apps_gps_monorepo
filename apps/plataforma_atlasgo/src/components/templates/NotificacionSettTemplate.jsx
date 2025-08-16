import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
// Iconos (se eliminó FaCheck ya que no se usa)
import { FaSearch, FaKey, FaMapPin, FaDoorOpen, FaTruckMoving, FaExclamationTriangle, FaTachometerAlt, FaCarBattery, FaWrench } from 'react-icons/fa';
import { IoIosPower, IoLogoWhatsapp, IoMdMail, IoIosChatbubbles } from "react-icons/io";

// --- DATA: La data de notificaciones no cambia ---
const notificationsData = [
  { id: 'encendido', title: 'Alerta de Encendido / Apagado', description: 'Recibir una alerta cuando el motor se encienda o apague.', icon: <FaKey />, category: 'seguridad' },
  { id: 'geocerca', title: 'Geocercas', description: 'Notificaciones al entrar o salir de las zonas definidas.', icon: <FaMapPin />, category: 'seguridad' },
  { id: 'corteCorriente', title: 'Corte de Corriente', description: 'Alerta si el GPS es desconectado de la batería.', icon: <IoIosPower />, category: 'seguridad' },
  { id: 'puertas', title: 'Apertura de Puertas', description: 'Recibir una alerta si las puertas del vehículo se abren.', icon: <FaDoorOpen />, category: 'seguridad' },
  { id: 'movimientoNoAutorizado', title: 'Movimiento no Autorizado', description: 'Alerta si el vehículo se mueve con el motor apagado (remolque).', icon: <FaTruckMoving />, category: 'seguridad' },
  { id: 'panico', title: 'Botón de Pánico / SOS', description: 'Alerta prioritaria activada por el conductor en emergencia.', icon: <FaExclamationTriangle />, category: 'seguridad' },
  { id: 'excesoVelocidad', title: 'Exceso de Velocidad', description: 'Alerta si el vehículo supera el límite establecido.', icon: <FaTachometerAlt />, category: 'mantenimiento' },
  { id: 'bateriaBaja', title: 'Batería Baja del Vehículo', description: 'Alerta cuando la batería del vehículo está por agotarse.', icon: <FaCarBattery />, category: 'mantenimiento' },
  { id: 'mantenimiento', title: 'Mantenimiento Próximo', description: 'Recordatorio para el próximo servicio (aceite, etc.).', icon: <FaWrench />, category: 'mantenimiento' },
];

// --- Componente Reutilizable para el Interruptor (Toggle Switch) ---
const ToggleSwitch = ({ isOn, handleToggle }) => {
  return (
    <SwitchContainer>
      <HiddenCheckbox checked={isOn} onChange={handleToggle} />
      <Slider />
    </SwitchContainer>
  );
};

// --- Componente Reutilizable para cada fila de Notificación ---
const NotificationItem = ({ icon, title, description, isOn, onToggle }) => {
  return (
    <ItemRow>
      <IconWrapper>{icon}</IconWrapper>
      <TextContainer>
        <ItemTitle>{title}</ItemTitle>
        {/* La descripción solo se muestra si existe */}
        {description && <ItemDescription>{description}</ItemDescription>}
      </TextContainer>
      <ToggleSwitch isOn={isOn} handleToggle={onToggle} />
    </ItemRow>
  );
};

// --- Componente Principal de la Plantilla ---
export function NotificacionSettTemplate() {
  // Estado para los toggles de notificaciones
  const [notifications, setNotifications] = useState({
    encendido: true, excesoVelocidad: false, geocerca: true, bateriaBaja: true,
    corteCorriente: true, puertas: false, movimientoNoAutorizado: true, panico: true,
    mantenimiento: false,
  });

  // Estado para el buscador
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para los canales de notificación
  const [deliveryChannels, setDeliveryChannels] = useState({
    whatsapp: true,
    email: true,
    sms: false,
  });

  // Handler para los toggles de notificaciones
  const handleNotificationToggle = (notificationName) => {
    setNotifications(prev => ({ ...prev, [notificationName]: !prev[notificationName] }));
  };
  
  // Handler para los toggles de canales
  const handleChannelToggle = (channelName) => {
    setDeliveryChannels(prev => ({ ...prev, [channelName]: !prev[channelName] }));
  };

  // Lógica de filtrado de notificaciones
  const filteredNotifications = useMemo(() => 
    notificationsData.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    ), 
  [searchTerm]);
  
  // Separamos los items filtrados por categoría para renderizarlos
  const securityItems = filteredNotifications.filter(n => n.category === 'seguridad');
  const maintenanceItems = filteredNotifications.filter(n => n.category === 'mantenimiento');

  return (
    <PageContainer>
      <Header>
        <PageTitle>Configuración de Notificaciones</PageTitle>
        <PageSubtitle>Selecciona las alertas y cómo deseas recibirlas.</PageSubtitle>
      </Header>

      <SearchContainer>
        <SearchIcon><FaSearch /></SearchIcon>
        <SearchInput
          type="text"
          placeholder="Buscar notificación o canal..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>
      
      <SectionsWrapper>
        {/* --- Sección de Canales de Notificación (Ahora con Toggles) --- */}
        <Section>
            <SectionTitle>Canales de Notificación</SectionTitle>
            {/* Reutilizamos NotificationItem para mantener la consistencia */}
            <NotificationItem
                icon={<IoLogoWhatsapp style={{color: '#25D366'}} />}
                title="WhatsApp"
                isOn={deliveryChannels.whatsapp}
                onToggle={() => handleChannelToggle('whatsapp')}
            />
            <NotificationItem
                icon={<IoMdMail />}
                title="Correo Electrónico"
                isOn={deliveryChannels.email}
                onToggle={() => handleChannelToggle('email')}
            />
            <NotificationItem
                icon={<IoIosChatbubbles />}
                title="Mensaje de Texto (SMS)"
                isOn={deliveryChannels.sms}
                onToggle={() => handleChannelToggle('sms')}
            />
        </Section>

        {/* --- Sección de Notificaciones de Seguridad --- */}
        {securityItems.length > 0 && (
          <Section>
            <SectionTitle>Alertas de Seguridad</SectionTitle>
            {securityItems.map((item) => (
              <NotificationItem
                key={item.id}
                icon={item.icon}
                title={item.title}
                description={item.description}
                isOn={notifications[item.id]}
                onToggle={() => handleNotificationToggle(item.id)}
              />
            ))}
          </Section>
        )}
        
        {/* --- Sección de Notificaciones de Mantenimiento --- */}
        {maintenanceItems.length > 0 && (
          <Section>
            <SectionTitle>Alertas de Mantenimiento y Conducción</SectionTitle>
            {maintenanceItems.map((item) => (
              <NotificationItem
                key={item.id}
                icon={item.icon}
                title={item.title}
                description={item.description}
                isOn={notifications[item.id]}
                onToggle={() => handleNotificationToggle(item.id)}
              />
            ))}
          </Section>
        )}
        
        {/* Mensaje si no hay resultados en la búsqueda */}
        {filteredNotifications.length === 0 && searchTerm && (
            <NoResults>No se encontraron notificaciones para "{searchTerm}"</NoResults>
        )}
      </SectionsWrapper>
    </PageContainer>
  );
}

// #region --- ESTILOS CON STYLED-COMPONENTS ---

// --- Contenedores Principales ---
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: #171717;
  color: #FFFFFF;
  padding: 1rem 2rem;
  overflow: hidden; 
`;

const Header = styled.header`
  padding-bottom: 1rem;
`;

const PageTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0;
  color: #FFFFFF;
`;

const PageSubtitle = styled.p`
  font-size: 0.9rem;
  color: #A0A0A0;
  margin-top: 0.5rem;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  background-color: #2C2C2E;
  border: 1px solid #3A3A3C;
  border-radius: 8px;
  color: #FFFFFF;
  font-size: 0.9rem;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  outline: none;
  transition: border-color 0.2s;
  &::placeholder { color: #888888; }
  &:focus { border-color: #0A84FF; }
`;

const SearchIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: #888888;
  pointer-events: none;
`;

const SectionsWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 1rem;
  margin-right: -1rem;

  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-track { background: #171717; }
  &::-webkit-scrollbar-thumb { background-color: #3A3A3C; border-radius: 10px; border: 2px solid #171717; }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 0.9rem;
  font-weight: 600;
  color: #A0A0A0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #333333;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.8px;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  gap: 1.5rem;
`;

const IconWrapper = styled.div`
  font-size: 1.25rem;
  color: #A0A0A0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ItemTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
  color: #F5F5F5;
`;

const ItemDescription = styled.p`
  font-size: 0.8rem;
  color: #888888;
  margin: 0.25rem 0 0 0;
`;

const NoResults = styled.p`
    text-align: center;
    color: #888888;
    margin-top: 2rem;
`;

// --- Estilos para el Toggle Switch ---
const SwitchContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
`;
const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  opacity: 0;
  width: 0;
  height: 0;
`;
const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #3A3A3C;
  border-radius: 34px;
  transition: .4s;
  &::before {
    position: absolute; content: "";
    height: 22px; width: 22px;
    left: 3px; bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: .4s;
  }
  ${HiddenCheckbox}:checked + & { background-color: #34C759; }
  ${HiddenCheckbox}:checked + &::before { transform: translateX(22px); }
`;

// #endregion

export default NotificacionSettTemplate;