import React, { useEffect, useCallback, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { IoFilterCircleOutline } from "react-icons/io5";
import { useMediaQuery } from 'react-responsive';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import engineIcon from "../../assets/Engine.svg";
import { formatLocalDate } from "../../utilities/Functions";
import { ModalFilters } from '../organismos/ModelScreenConfig/ModalFilter';
import { getAlertasList } from "@mi-monorepo/common/services";
import { addNotificationList } from "@mi-monorepo/common/store/notification";

// Función de debounce
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Animación para las notificaciones
const fadeInSlide = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const FullScreenContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.bg};
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: transparent;
  color: ${props => props.theme.text};
  font-size: 15px;
  font-weight: 500;
  border-bottom: 1px solid ${props => props.theme.bg4};
`;

const FilterIcon = styled(IoFilterCircleOutline)`
  color: ${props => props.theme.text};
  font-size: 23px;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const AlertList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${props => (props.empty ? 'center' : 'flex-start')};
`;

const AlertItem = styled.div`
  width: 100%;
  padding: 16px;
  position: relative;
  animation: ${fadeInSlide} 0.3s ease-in-out;
  border-bottom: 1px solid ${props => props.theme.bg4};
`;

const NewIndicator = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 10px;
  color: white;
  background-color: orange;
  border-radius: 5px;
  padding: 2px 5px;
  font-weight: 500;
`;

const Circle = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${props => props.status === 'green' ? 'green' : '#D15954'};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 16px;

  img {
    width: 23px;
    height: 23px;
  }
`;

const AlertContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const AlertMessage = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.text};
  margin-bottom: 4px;
`;

const AlertUnit = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colorSubtitle};
`;

const AlertDate = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colorSubtitle};
  margin-top: 4px;
`;

const EmptyMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  text-align: center;
  color: ${props => props.theme.text};
  opacity: 0.7;

  img {
    width: 50px;
    margin-bottom: 15px;
    opacity: 0.5;
  }

  h4 {
    margin: 10px 0;
    font-size: 14px;
    font-weight: 500;
  }

  p {
    font-size: 12px;
    color: ${props => props.theme.colorSubtitle};
    padding: 0 10px;
  }
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 10px;
  color: ${props => props.theme.colorSubtitle};
  font-size: 12px;
  width: 100%;
`;

const NotiMobileTemplate = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notification.notifications_list);
  const token = useSelector((state) => state.auth?.token || "");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);
  const debouncedLoadMoreRef = useRef(null);
  
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    content: "",
    position: { top: 0, left: 0 },
  });

  useEffect(() => {
    if (!isMobile && location.pathname === "/notificaciones-mobile") {
      navigate("/home-mobile");
    }
  }, [isMobile, location.pathname, navigate]);

  const loadMoreNotifications = useCallback(async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      const currentNotifications = notifications;
      
      if (currentNotifications.length === 0) return;

      const lastNotificationId = currentNotifications[currentNotifications.length - 1].id;
      const data = await getAlertasList(token, lastNotificationId);
      await dispatch(addNotificationList(data.alertas));
      setHasMore(data.has_more);
    } catch (error) {
      console.error('Error loading more notifications:', error);
    } finally {
      setIsLoading(false);
      setIsDebouncing(false);
    }
  }, [isLoading, hasMore, notifications, token, dispatch]);

  // Creamos la versión debounced de loadMoreNotifications
  useEffect(() => {
    debouncedLoadMoreRef.current = debounce((...args) => {
      setIsDebouncing(false);
      loadMoreNotifications(...args);
    }, 500);
    return () => {
      if (debouncedLoadMoreRef.current) {
        debouncedLoadMoreRef.current.cancel?.();
      }
    };
  }, [loadMoreNotifications]);

  const handleScroll = useCallback((e) => {
    if (!containerRef.current || isLoading || !hasMore || isDebouncing) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    
    if (distanceFromBottom < 100) {
      setIsDebouncing(true);
      debouncedLoadMoreRef.current?.();
    }
  }, [isLoading, hasMore, isDebouncing]);

  // Agregar y remover el event listener de scroll
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const handleButtonClick = (content, event) => {
    const buttonRect = event.target.getBoundingClientRect();
    setModalConfig({
      visible: true,
      content,
      position: {
        top: buttonRect.top + window.scrollY,
        left: buttonRect.right + 2,
      },
    });
  };

  const closeModal = () => {
    setModalConfig({ visible: false, content: "", position: { top: 0, left: 0 } });
  };

  return (
    <FullScreenContainer>
      <Header>
        <span>Notificaciones</span>
        {/* <FilterIcon onClick={(e) => handleButtonClick("Filtros", e)} /> */}
      </Header>

      <AlertList 
        ref={containerRef}
        empty={notifications.length === 0}
      >
        {notifications.length === 0 ? (
          <EmptyMessage>
            <img src={engineIcon} alt="engine" />
            <h4>Sin notificaciones por el momento</h4>
            <p>
              Recibirás una notificación aquí cuando tus unidades hagan alguna
              acción que tú programes
            </p>
          </EmptyMessage>
        ) : (
          <>
            {notifications.map((notification) => (
              <AlertItem key={'notification_mobile_' + notification.id}>
                {notification.is_new && <NewIndicator>Nuevo</NewIndicator>}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Circle status={notification.id_alerta == 10 ? 'green' : 'red'}>
                    <img src={engineIcon} alt="engine" />
                  </Circle>
                  <AlertContent>
                    <AlertMessage>{notification.alerta}</AlertMessage>
                    <AlertUnit>{notification.unidad_nombre}</AlertUnit>
                    <AlertDate>{formatLocalDate(notification.fecha)}</AlertDate>
                  </AlertContent>
                </div>
              </AlertItem>
            ))}
            {(isLoading || isDebouncing) && (
              <LoadingIndicator>
                Cargando más notificaciones...
              </LoadingIndicator>
            )}
            {!hasMore && notifications.length > 0 && (
              <LoadingIndicator>
                No hay más notificaciones
              </LoadingIndicator>
            )}
          </>
        )}
      </AlertList>

      {modalConfig.visible && (
        <ModalFilters
          content={modalConfig.content}
          position={modalConfig.position}
          onClose={closeModal}
        />
      )}
    </FullScreenContainer>
  );
};

export default NotiMobileTemplate;