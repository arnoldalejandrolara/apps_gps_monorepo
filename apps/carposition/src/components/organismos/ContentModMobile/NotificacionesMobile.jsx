import React, { useEffect, useCallback, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { IoFilterCircleOutline } from "react-icons/io5";
import { formatLocalDate } from '../../../utilities/Functions';
import engineIcon from "../../../assets/Engine.svg"; // Asegúrate que la ruta a tu ícono es correcta
import { useSelector } from 'react-redux';


// --- 1. DATOS FALSOS (MOCK DATA) ---
const createMockAlerts = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    alerta: i % 2 === 0 ? `Motor Encendido - Unidad ${100 + i}` : `Motor Apagado - Unidad ${100 + i}`,
    unidad_nombre: `Torton Kenworth ${i + 1}`,
    id_alerta: i % 2 === 0 ? 10 : 11, // 10 para 'green', otro para 'red'
    fecha: new Date(Date.now() - i * 60000 * 15).toISOString(), // Alertas cada 15 mins
    is_new: i < 3, // Las primeras 3 son "nuevas"
  }));
};
const allMockAlerts = createMockAlerts(50); // Creamos 50 alertas de ejemplo
const ALERTS_PER_PAGE = 15; // Cuántas cargar cada vez

// Función de debounce
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => { clearTimeout(timeout); func(...args); };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// --- 2. ESTILOS ADAPTADOS A TEMA CLARO ---
const fadeInSlide = keyframes`
  from { opacity: 0; transform: translateY(-10%); }
  to { opacity: 1; transform: translateY(0); }
`;

const FullScreenContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa; /* Fondo gris muy claro */
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #ffffff;
  color: #1c1c1e; /* Texto oscuro */
  font-size: 15px;
  font-weight: 600;
  border-bottom: 1px solid #e0e0e0; /* Borde sutil */
`;

const FilterIcon = styled(IoFilterCircleOutline)`
  color: #1c1c1e;
  font-size: 23px;
  cursor: pointer;
  transition: opacity 0.2s ease;
  &:hover { opacity: 0.7; }
`;

const AlertList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${props => (props.empty ? 'center' : 'flex-start')};
`;

const AlertItem = styled.div`
  width: 100%;
  padding: 16px;
  background-color: #ffffff;
  position: relative;
  animation: ${fadeInSlide} 0.3s ease-in-out;
  border-bottom: 1px solid #e0e0e0;
`;

const NewIndicator = styled.span`
  position: absolute; top: 10px; right: 10px; font-size: 10px; color: white; background-color: orange; border-radius: 5px; padding: 2px 5px; font-weight: 500;
`;

const Circle = styled.div`
  width: 40px; height: 40px; background-color: ${props => props.status === 'green' ? '#4CAF50' : '#D15954'}; display: flex; align-items: center; justify-content: center; border-radius: 50%; margin-right: 16px;
  img { width: 23px; height: 23px; }
`;

const AlertContent = styled.div`
  flex: 1; display: flex; flex-direction: column;
`;

const AlertMessage = styled.div`
  font-size: 13px; font-weight: 500; color: #1c1c1e; margin-bottom: 4px;
`;

const AlertUnit = styled.div`
  font-size: 12px; color: #6c757d;
`;

const AlertDate = styled.div`
  font-size: 12px; color: #6c757d; margin-top: 4px;
`;

const EmptyMessage = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 16px; text-align: center; color: #333; opacity: 0.7;
  img { width: 50px; margin-bottom: 15px; opacity: 0.5; }
  h4 { margin: 10px 0; font-size: 14px; font-weight: 500; }
  p { font-size: 12px; color: #6c757d; padding: 0 10px; }
`;

const LoadingIndicator = styled.div`
  text-align: center; padding: 20px; color: #6c757d; font-size: 12px; width: 100%;
`;

// --- El componente ahora se llama NotificacionesMobile ---
export const NotificacionesMobile = () => {
  // --- 3. LÓGICA SIMPLIFICADA CON ESTADO LOCAL ---
  const [alerts, setAlerts] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);
  const notifications = useSelector((state) => state.notification.notifications_list);
  
  const loadMoreAlerts = useCallback(() => {
    if (isLoading) return;
    setIsLoading(true);

    // Simula una llamada a la API
    setTimeout(() => {
      const newAlerts = notifications.slice(
        page * ALERTS_PER_PAGE,
        (page + 1) * ALERTS_PER_PAGE
      );

      if (newAlerts.length > 0) {
        setAlerts(prev => [...prev, ...newAlerts]);
        setPage(prev => prev + 1);
      } else {
        setHasMore(false);
      }

      setIsLoading(false);
    }, 800); // Simula un retraso de red
  }, [isLoading, page]);

  // Carga inicial de datos
  useEffect(() => {
    loadMoreAlerts();
  }, []); // Solo se ejecuta una vez al montar el componente

  // Lógica para el scroll infinito
  const debouncedLoadMore = useRef(debounce(loadMoreAlerts, 300)).current;

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (container && hasMore && !isLoading) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop - clientHeight < 200) {
        debouncedLoadMore();
      }
    }
  }, [hasMore, isLoading, debouncedLoadMore]);

  return (
    <FullScreenContainer>
      <Header>
        <span>Notificaciones</span>
        {/* <FilterIcon /> */}
      </Header>

      <AlertList 
        ref={containerRef}
        onScroll={handleScroll}
        empty={alerts.length === 0 && !isLoading}
      >
        {alerts.length > 0 && alerts.map((alert) => (
          <AlertItem key={'notification_mobile_' + alert.id}>
            {alert.is_new && <NewIndicator>Nuevo</NewIndicator>}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Circle status={alert.id_alerta === 10 ? 'green' : 'red'}>
                <img src={engineIcon} alt="engine" />
              </Circle>
              <AlertContent>
                <AlertMessage>{alert.alerta}</AlertMessage>
                <AlertUnit>{alert.unidad_nombre}</AlertUnit>
                <AlertDate>{formatLocalDate(alert.fecha)}</AlertDate>
              </AlertContent>
            </div>
          </AlertItem>
        ))}
        
        {isLoading && (
          <LoadingIndicator>Cargando notificaciones...</LoadingIndicator>
        )}

        {!hasMore && alerts.length > 0 && (
          <LoadingIndicator>No hay más notificaciones</LoadingIndicator>
        )}
        
        {alerts.length === 0 && !isLoading && (
          <EmptyMessage>
            <img src={engineIcon} alt="engine" />
            <h4>Sin notificaciones por el momento</h4>
            <p>Recibirás una notificación aquí cuando tus unidades hagan alguna acción que tú programes.</p>
          </EmptyMessage>
        )}
      </AlertList>
    </FullScreenContainer>
  );
};

export default NotificacionesMobile;