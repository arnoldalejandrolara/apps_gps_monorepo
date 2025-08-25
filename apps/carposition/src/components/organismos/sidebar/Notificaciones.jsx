import React, { useState } from 'react';
import styled from 'styled-components';
// --- Iconos importados para las alertas ---
import { IoCheckmarkDoneSharp, IoSettingsOutline } from 'react-icons/io5';
import { FaTachometerAlt, FaKey, FaGasPump } from 'react-icons/fa';
import { useSelector } from 'react-redux';

// --- NUEVOS DATOS DE EJEMPLO PARA ALERTAS DE VEHÍCULOS ---
const mockNotifications = [
  {
    id: 1,
    type: 'speeding',
    vehicleName: 'Tsuru GS-1 (A1B-2C3)',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // Hace 5 minutos
    isNew: true,
    details: {
      speed: '125 km/h',
      limit: '80 km/h',
      location: 'Autopista Mante-Tampico',
    },
  },
  {
    id: 2,
    type: 'ignition_on',
    vehicleName: 'Nissan Versa (X4Y-5Z6)',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // Hace 30 minutos
    isNew: true,
    details: {
      location: 'Calle Hidalgo #123, Centro',
    },
  },
  {
    id: 3,
    type: 'low_fuel',
    vehicleName: 'Camioneta Ford (R7S-8T9)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // Hace 2 horas
    isNew: false,
    details: {
      level: '15%',
      range: 'Aprox. 60 km restantes',
    },
  },
  {
    id: 4,
    type: 'ignition_off',
    vehicleName: 'Nissan Versa (X4Y-5Z6)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // Hace 5 horas
    isNew: false,
    details: {
      location: 'Estacionamiento Soriana Aeropuerto',
    },
  },
];

const tabs = ['Todas', 'No Leídas'];

// --- MAPA DE ICONOS Y TEXTOS PARA CADA TIPO DE ALERTA ---
const alertConfig = {
  'speed': {
    icon: <FaTachometerAlt />,
    text: 'excedió el límite de velocidad.',
    color: '#DC3545', // Rojo
  },
  'acc on': {
    icon: <FaKey />,
    text: 'ha encendido el motor.',
    color: '#28A745', // Verde
  },
  'acc off': {
    icon: <FaKey />,
    text: 'ha apagado el motor.',
    color: '#6C757D', // Gris
  },
  'fuel low': {
    icon: <FaGasPump />,
    text: 'tiene un nivel de combustible bajo.',
    color: '#FD7E14', // Naranja
  },
};


// --- COMPONENTE PRINCIPAL ---
export const Notificaciones = () => {
  const [activeTab, setActiveTab] = useState('Todas');
  const notifications = useSelector(state => state.notification.notifications_list);

  const getFilteredNotifications = () => {
    if (activeTab === 'No Leídas') {
      return notifications.filter(n => n.isNew);
    }
    return notifications;
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <PanelContainer>
      <Header>
        <Title>Alertas</Title>
        <HeaderIcons>
          <IoCheckmarkDoneSharp />
          <IoSettingsOutline />
        </HeaderIcons>
      </Header>
      
      {/* SECCIÓN DE TABS SIMPLIFICADA */}
      <TabsWrapper>
        {tabs.map(tab => (
            <TabButton 
              key={tab}
              $isActive={activeTab === tab} 
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </TabButton>
          ))}
      </TabsWrapper>

      <NotificationList>
        {filteredNotifications.map(notification => {
          const config = alertConfig[notification.alerta_codigo];
          return (
            <NotificationItem key={notification.id} $isNew={notification.is_new}>
              <NotificationIcon color={config.color}>{config.icon}</NotificationIcon>
              <NotificationContent>
                <p>
                  <strong>{notification.unidad_nombre}</strong>{' '}
                  {config.text}
                </p>
                <Metadata>
                  {new Date(notification.fecha).toLocaleDateString()} - {new Date(notification.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Metadata>
                
                {/* --- RENDERIZADO DE DETALLES ADICIONALES --- */}
                <DetailsContainer>
                    {notification.location.x && <span><strong>Ubicación:</strong> {notification.location.x}, {notification.location.y}</span>}
                    {notification.velocidad && <span><strong>Velocidad:</strong> {notification.velocidad} (Límite: {notification.velocidad_limite})</span>}
                    {notification.nivel_combustible && <span><strong>Nivel:</strong> {notification.nivel_combustible} ({notification.nivel_combustible_rango})</span>}
                </DetailsContainer>

              </NotificationContent>
              {notification.is_new && <NewIndicator />}
            </NotificationItem>
          )
        })}
      </NotificationList>

      <Footer>
        <ViewAllButton>Ver todas las alertas</ViewAllButton>
      </Footer>
    </PanelContainer>
  );
};


// --- ESTILOS CON TEMA BLANCO ---

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 420px;
  height: 100vh;
  background-color: #ffffff;
  color: #212529;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  border-left: 1px solid #e9ecef;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  flex-shrink: 0;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
`;

const HeaderIcons = styled.div`
  display: flex;
  gap: 1rem;
  color: #6c757d;
  font-size: 1.25rem;
  cursor: pointer;
`;

const TabsWrapper = styled.div`
  padding: 0.5rem;
  display: flex;
  gap: 8px;
  border-bottom: 1px solid #e9ecef;
  flex-shrink: 0;
`;

const TabButton = styled.button`
  flex: 1;
  background: ${({ $isActive }) => $isActive ? '#e9ecef' : 'transparent'};
  border: 1px solid transparent;
  color: ${({ $isActive }) => $isActive ? '#212529' : '#6c757d'};
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const NotificationList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const NotificationItem = styled.div`
  display: flex;
  gap: 1rem;
  position: relative;
  padding: 1.25rem 1.5rem;
  transition: background-color 0.2s ease-in-out;
  background-color: ${({ $isNew }) => $isNew ? 'rgba(0, 123, 255, 0.05)' : 'transparent'};
  
  &:not(:last-child) {
    border-bottom: 1px solid #f0f2f5;
  }
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const NotificationIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: ${({ color }) => color}1A; // Color con 10% de opacidad
  color: ${({ color }) => color};
  font-size: 18px;
`;

const NotificationContent = styled.div`
  flex: 1;
  p {
    margin: 0;
    font-size: 0.8rem;
    line-height: 1.4;
  }
  strong {
    font-weight: 600;
  }
`;

const Metadata = styled.span`
  font-size: 0.8rem;
  color: #6c757d;
`;

const DetailsContainer = styled.div`
  margin-top: 8px;
  font-size: 0.85rem;
  color: #495057;
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    color: #212529;
  }
`;

const NewIndicator = styled.div`
  width: 8px;
  height: 8px;
  background-color: #007bff;
  border-radius: 50%;
  position: absolute;
  top: 1.25rem;
  right: 1.5rem;
`;

const Footer = styled.div`
  padding: 1rem;
  border-top: 1px solid #e9ecef;
  flex-shrink: 0;
`;

const ViewAllButton = styled.button`
  width: 100%;
  background: none;
  border: 1px solid #e9ecef;
  color: #495057;
  padding: 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: #f8f9fa;
    color: #212529;
  }
`;