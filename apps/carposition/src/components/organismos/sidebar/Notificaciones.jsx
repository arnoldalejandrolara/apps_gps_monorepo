import styled, { keyframes } from "styled-components";
import filterMail from "../../../assets/filter_mail.svg";
import inbox from "../../../assets/Inbox.svg";
import engineIcon from "../../../assets/Engine.svg"; // Agrega tu icono aquí
import { useState, useCallback, useEffect, useRef } from "react";
import { ModalFilters } from "../ModelScreenConfig/ModalFilter";
import { useSelector, useDispatch } from "react-redux";
import { formatLocalDate } from "../../../utilities/Functions";
import { getAlertasList } from "../../../services/AlertasService";
import { addNotificationList } from "../../../store/slices/notificationSlice";

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

export function Notificaciones({ state, setState, triggerGlobalNotification }) {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notification.notifications_list);
  const [isLoading, setIsLoading] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);
  const token = useSelector((state) => state.auth?.token || "");
  const debouncedLoadMoreRef = useRef(null);

  // Log cuando el componente se monta
  useEffect(() => {
    if (containerRef.current) {
      const { scrollHeight, clientHeight } = containerRef.current;
    }
  }, []);

  // Log cuando cambian las notificaciones
  useEffect(() => {
    if (containerRef.current) {
      const { scrollHeight, clientHeight } = containerRef.current;
    }
  }, [notifications]);

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

  const simulateNotification = () => {
    const newNotification = {
      id: notifications.length + 1,
      alertName: `Alerta ${notifications.length + 1}`,
      unitName: `Unidad ${notifications.length + 1}`,
      dateTime: new Date().toLocaleString(),
      isNew: true, // Indicador de "nuevo"
      status: notifications.length % 2 === 0 ? "green" : "red", // Alternar entre verde y rojo
    };
    setNotifications((prev) => [...prev, newNotification]);

    // Disparar la notificación global
    triggerGlobalNotification(`Nueva notificación: ${newNotification.alertName}`);
  };

  const [modalConfig, setModalConfig] = useState({
    visible: false,
    content: "",
    position: { top: 0, left: 0 },
  });


  const handleButtonClick = (content, event) => {
    console.log(content);

    const buttonRect = event.target.getBoundingClientRect();
    setModalConfig({
      visible: true,
      content,
      position: {
        top: buttonRect.top + window.scrollY, // Ajuste vertical
        left: buttonRect.right + 2, // Ajuste horizontal al lado derecho del botón
      },
    });
  };

  const closeModal = () => {
    setModalConfig({ visible: false, content: "", position: { top: 0, left: 0 } });
  };

  return (
    <Main $isopen={state.toString()}>
      <Container 
        ref={containerRef}
        $isopen={state.toString()} 
        className={state ? "active" : ""}
      >
        <div className="Header">
          <h4>Notificaciones</h4>
          <FilterContainer>
            <button className="FilterButton"   onClick={(e) => handleButtonClick("Filtros", e)}>
              <img src={filterMail} alt="Filtrar" />
            </button>
            {/* <span className="Tooltip">Filtrar notificaciones</span> */}
          </FilterContainer>
        </div>
        <div 
          className="Content" 
          ref={containerRef}
          onScroll={handleScroll}
        >
          {/* Botón para simular una notificación */}
          {/* <button className="SimulateButton" onClick={simulateNotification}>
            Simular Notificación
          </button> */}

          {notifications.length > 0 ? (
            <>
              {notifications.map((notification) => (
                <Notification key={'notification_' + notification.id}>
                  {notification.is_new && <span className="NewIndicator">Nuevo</span>}
                  <div className="NotificationRow">
                    <div
                      className={`StatusCircle ${notification.id_alerta == 10 ? 'green' : 'red'}`}
                    >
                      <img src={engineIcon} alt="engine" />
                    </div>
                    <div className="NotificationDetails">
                      <h4>{notification.alerta}</h4>
                      <p>{notification.unidad_nombre}</p>
                      <time>{formatLocalDate(notification.fecha)}</time>
                    </div>
                  </div>
                </Notification>
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
          ) : (
            <div className="EmptyState">
              <img src={inbox} alt="inbox" />
              <h4>Sin notificaciones por el momento</h4>
              <p>
                Recibirás una notificación aquí cuando tus unidades hagan alguna
                acción que tú programes
              </p>
            </div>
          )}
        </div>
      </Container>

        {/* Modal */}
        {modalConfig.visible && (
        <ModalFilters
          content={modalConfig.content}
          position={modalConfig.position}
          onClose={closeModal}
        />
      )}

    </Main>
  );
}

// Animación para desvanecer y deslizar hacia abajo
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

const Notification = styled.div`
  position: relative;
  margin-bottom: 10px;
  padding: 8px 10px;
  width: 100%;
  background-color: transparent;
  border-radius: 10px;
  border: 1px solid #333333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: ${fadeInSlide} 0.3s ease-in-out;

  .NewIndicator {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 10px;
    color: white;
    background-color: orange;
    border-radius: 5px;
    padding: 2px 5px;
    font-weight: 500;
  }

  .NotificationRow {
    display: flex;
    align-items: center;

    .StatusCircle {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 12px;

      &.green {
        background-color: green;
      }

      &.red {
        background-color: red;
      }

      img {
        width: 23px;
        height: 23px;
      }
    }

    .NotificationDetails {
      display: flex;
      flex-direction: column;
      flex: 1;

      h4 {
        margin: 3px 0;
        font-size: 12px;
        font-weight: 500;
      }

      p {
        margin: 0;
        font-size: 12px;
        color: ${(props) => props.theme.colorSubtitle};
      }

      time {
        font-size: 12px;
        color: ${(props) => props.theme.colorSubtitle};
      }
    }
  }
`;

const FilterContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  border-radius: 5px;
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: rgba(255,255,255,0.055); /* Color gris claro */
  }

  .FilterButton {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 22px;
      height: 22px;
      transition: all 0.2s ease-in-out;

      // &:hover {
      //   filter: brightness(0.7); /* Cambia a un gris más oscuro al pasar el mouse */
      // }
    }
  }

  .Tooltip {
    visibility: hidden;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 5px;
    padding: 5px;
    position: absolute;
    top: 40px;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    font-size: 12px;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;

    /* Asegura que el tooltip esté enfrente de todo */
  }

  &:hover .Tooltip {
    visibility: visible;
    opacity: 1;
  }
`;

const Container = styled.div`
  color: ${(props) => props.theme.text};
  background: ${(props) => props.theme.bg};
  position: fixed;
  padding-top: 20px;
  z-index: 3;
  height: 100%;
  width: 0px;
  border-left: 1px solid ${(props) => props.theme.bg4};
  transition: 0.1s ease-in-out;
  overflow: hidden; // Cambiado a hidden para que el scroll esté solo en Content

  &.active {
    width: 340px;
  }

  .Header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;

    h4 {
      margin: 0;
      font-weight: 500;
      font-size: 14px;
    }

    .FilterIcon {
      position: relative;
      cursor: pointer;
      display: inline-block;

      img {
        width: 24px;
        height: 24px;
        transition: all 0.2s ease-in-out;

        &:hover {
          filter: brightness(0.7); /* Cambia a un gris claro */
        }
      }

      .Tooltip {
        visibility: hidden;
        background-color: #333;
        color: #fff;
        text-align: center;
        border-radius: 5px;
        padding: 5px;
        position: absolute;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
        font-size: 12px;
        // z-index: 1000;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
        z-index: 9999;
      }

      &:hover .Tooltip {
        visibility: visible;
        opacity: 1;
      }
    }
  }

  .Content {
    height: calc(100vh - 60px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;

    .SimulateButton {
      margin-bottom: 20px;
      padding: 10px 20px;
      background-color: ${(props) => props.theme.bg3};
      color: ${(props) => props.theme.text};
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;

      &:hover {
        background-color: ${(props) => props.theme.bg4};
      }
    }

    .EmptyState {
      text-align: center;

      img {
        width: 50px;
        margin-bottom: 15px;
      }

      h4 {
        margin: 10px 0;
        font-size: 14px;
        font-weight: 500;
      }

      p {
        font-size: 12px;
        color: ${(props) => props.theme.colorSubtitle};
        padding: 0 10px;
      }
    }
  }
`;

const Main = styled.div`
  .Sidebarbutton {
    position: fixed;
    top: 70px;
    left: 42px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${(props) => props.theme.bgtgderecha};
    box-shadow: 0 0 4px ${(props) => props.theme.bg3},
      0 0 7px ${(props) => props.theme.bg};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    z-index: 2;
    transform: ${({ $isopen }) =>
      $isopen === "true" ? `translateX(162px) rotate(3.142rad)` : `initial`};
    color: ${(props) => props.theme.text};
  }
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 10px;
  color: ${props => props.theme.colorSubtitle};
  font-size: 12px;
`;

export default Notificaciones;