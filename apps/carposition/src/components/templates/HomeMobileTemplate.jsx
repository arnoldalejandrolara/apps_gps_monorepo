import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { BsThreeDots } from 'react-icons/bs';
import { RiExpandUpDownLine, RiArrowRightSLine, RiAlertLine } from "react-icons/ri";
import { FaGasPump, FaRoad, FaClock, FaClipboardCheck } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import WelcomeCard from '../organismos/dashboard/GridWelcome';
import GridFeatured from '../organismos/dashboard/GridFeatured';
import { useSelector, useDispatch } from 'react-redux';
import { NotificationManager } from '../NotificationManager';
// Logo a la izquierda:
import logoSrc from '../../assets/logoblanco2.png';
import NotificationTest from '../NotificationTest';
import { useMediaQuery } from 'react-responsive';
import { useNotifications } from '@mi-monorepo/common/hooks';

const FullScreenContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #202020;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;

  @media (max-width: 600px) {
    min-height: 100dvh;
  }
`;

const HeaderContainer = styled.div`
  width: 100%;
  border-bottom: 2px solid #333333;
  padding: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  @media (max-width: 600px) {
    padding: 10px 8px;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  color: white;
  font-size: 12px;
`;

// Logo ahora va primero
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;

  img {
    height: 38px;
    @media (max-width: 600px) {
      height: 40px;
    }
  }
`;

const IconContainer = styled.div`
  font-size: 24px;
  font-weight: 500;
  margin-right: 16px;
  background-color: #333333;
  padding: 4px 12px;
  border-radius: 15%;
  color: #939393;

  @media (max-width: 600px) {
    margin-right: 10px;
    padding: 3px 8px;
    font-size: 20px;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;

  span {
    color: white;
  }

  .lbl_email {
    color: #939393;
    font-size: 11px;
  }

  @media (max-width: 600px) {
    .lbl_email {
      font-size: 10px;
    }
  }
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  color: white;
`;

const WelcomeCardWrapper = styled.div`
  margin: 18px 16px 0 16px;

  @media (max-width: 900px) {
    margin: 14px 6vw 0 6vw;
  }
  @media (max-width: 600px) {
    margin: 10px 4vw 0 4vw;
  }
`;

const GridFeaturedWrapper = styled.div`
  margin: 18px 16px 0 16px;

  @media (max-width: 900px) {
    margin: 12px 6vw 0 6vw;
  }
  @media (max-width: 600px) {
    margin: 8px 4vw 0 4vw;
  }
`;

const Subtitle = styled.h2`
  color: #939393;
  font-size: 13px;
  margin: 18px 16px 8px;
  font-weight: 500;

  @media (max-width: 900px) {
    margin-left: 6vw;
    margin-right: 6vw;
    font-size: 12px;
    margin-top: 14px;
  }
  @media (max-width: 600px) {
    margin-left: 4vw;
    margin-right: 4vw;
    font-size: 11px;
    margin-top: 10px;
  }
`;

const CarouselContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 16px;
  gap: 16px;
  scrollbar-width: thin;
  scrollbar-color: #333333 transparent;
  height: auto;
  overflow-y: visible;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #333333;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  @media (max-width: 900px) {
    padding-left: 6vw;
    padding-right: 6vw;
    gap: 12px;
  }
  @media (max-width: 600px) {
    padding-left: 4vw;
    padding-right: 4vw;
    gap: 10px;
  }
`;

const CarouselItem = styled.div`
  box-sizing: border-box;
  min-width: 100px;
  min-height: 110px;
  background-color: #313131;
  border: 1px solid #3E3E3E;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  color: white;
  flex: 0 0 auto;

  .icon {
    font-size: 25px;
    color: #f0f0f0;
  }

  .label {
    font-size: 11px;
    color: #FFFFFF;
    font-weight: 500;
    display: flex;
    text-align: center;
  }

  @media (max-width: 900px) {
    min-width: 80px;
    min-height: 90px;
    padding: 12px;
    .icon { font-size: 20px; }
    .label { font-size: 10px; }
  }

  @media (max-width: 600px) {
    min-width: 65px;
    min-height: 75px;
    padding: 8px;
    .icon { font-size: 17px; }
    .label { font-size: 9px; }
  }
`;

const NavigationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  width: 100%;

  @media (max-width: 900px) {
    padding-left: 6vw;
    padding-right: 6vw;
  }
  @media (max-width: 600px) {
    padding-left: 4vw;
    padding-right: 4vw;
    padding-top: 8px;
    gap: 6px;
  }
`;

const NavigationItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #252525;
  border-radius: 8px;
  height: 60px;
  width: 100%;
  padding: 0 16px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  position: relative;

  .icon {
    display: flex;
    justify-content: center;
    font-size: 28px;
    color: #939393;
  }

  .label {
    flex: 1;
    text-align: left;
    margin-left: 16px;
  }

  &:hover {
    background: #303030;
    transition: background 0.15s;
  }

  @media (max-width: 900px) {
    height: 52px;
    font-size: 13px;
    padding: 0 12px;
    .icon { font-size: 22px; }
    .label { margin-left: 10px; }
  }
  @media (max-width: 600px) {
    height: 44px;
    font-size: 12px;
    padding: 0 8px;
    .icon { font-size: 18px; }
    .label { margin-left: 7px; }
  }
`;

const GoldenBadge = styled.div`
  position: absolute;
  top: 50%;
  right: 24px;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #FFD700, #FFA500, #FFD700);
  border-radius: 50%;
  box-shadow: 
    0 0 10px #FFD700,
    0 0 20px #FFD700,
    0 0 30px #FFD700,
    inset 0 0 15px rgba(255, 215, 0, 0.3);
  animation: goldenGlow 2s ease-in-out infinite alternate;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    background: radial-gradient(circle, #FFF, #FFD700);
    border-radius: 50%;
    box-shadow: 0 0 8px #FFF;
  }

  @keyframes goldenGlow {
    0% {
      box-shadow: 
        0 0 10px #FFD700,
        0 0 20px #FFD700,
        0 0 30px #FFD700,
        inset 0 0 15px rgba(255, 215, 0, 0.3);
    }
    100% {
      box-shadow: 
        0 0 15px #FFD700,
        0 0 25px #FFD700,
        0 0 35px #FFD700,
        inset 0 0 20px rgba(255, 215, 0, 0.5);
    }
  }

  @media (max-width: 900px) {
    right: 23px;
    width: 10px;
    height: 10px;
    &::before {
      width: 5px;
      height: 5px;
    }
  }
  @media (max-width: 600px) {
    right: 22px;
    width: 8px;
    height: 8px;
    &::before {
      width: 4px;
      height: 4px;
    }
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 900px) {
    padding-bottom: 10px;
  }
  @media (max-width: 600px) {
    padding-bottom: 5px;
  }
`;

const NotificationWrapper = styled.div`
  margin: 18px 16px 0 16px;

  @media (max-width: 900px) {
    margin: 14px 6vw 0 6vw;
  }
  @media (max-width: 600px) {
    margin: 10px 4vw 0 4vw;
  }
`;

const SpecialLabel = styled.div`
  color: #FFB300;
  font-weight: 700;
  font-size: 1.08em;
  text-shadow: 0 2px 8px #FFB300, 0 0 8px #fff4, 0 1px 4px #332800;
  display: flex;
  align-items: center;
  animation: goldPulse 1.8s infinite alternate;

  @keyframes goldPulse {
    0% { text-shadow: 0 2px 8px #FFB300, 0 0 8px #fff4, 0 1px 4px #332800; }
    100% { text-shadow: 0 4px 16px #FFD700, 0 0 16px #fff7, 0 2px 8px #332800; }
  }

  .icon {
    color: #FFB300;
    margin-right: 10px;
    filter: drop-shadow(0 0 8px #FFD700) drop-shadow(0 0 2px #332800);
    font-size: 1.3em;
    animation: goldPulse 1.8s infinite alternate;
  }
`;

const HomeMobileTemplate = ({ children }) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Hook de notificaciones
  const {
    isSupported,
    permission,
    subscription,
    requestPermission,
    subscribeToNotifications,
    hasAttemptedAutoSubscribe,
    pushEndpoint
  } = useNotifications();

  useEffect(() => {
    if (!isMobile && location.pathname === "/home-mobile") {
      navigate("/dashboard");
    }
  }, [isMobile, location.pathname, navigate]);

  // Función para manejar la activación de notificaciones
  const handleActivateNotifications = async () => {
    setIsLoadingNotifications(true);
    setNotificationMessage('');

    try {
      // Si no hay permisos, solicitarlos primero
      let granted = false;
      if (permission !== 'granted') {
        granted = await requestPermission();
        if (!granted) {
          setNotificationMessage('Permisos denegados');
          setIsLoadingNotifications(false);
          return;
        } else {
          console.log(granted, "granted handleActivateNotifications");
        }
      }

      // Si ya hay suscripción, no hacer nada
      if (subscription) {
        setNotificationMessage('Notificaciones ya activadas');
        setIsLoadingNotifications(false);
        return;
      }

      // Suscribirse a notificaciones
      const result = await subscribeToNotifications(granted);
      if (result) {
        setNotificationMessage('Notificaciones activadas correctamente');
      } else {
        setNotificationMessage('Error al activar notificaciones');
      }
    } catch (error) {
      console.error('Error activando notificaciones:', error);
      setNotificationMessage('Error al activar notificaciones');
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  // Determinar si mostrar el botón de activar notificaciones
  const shouldShowActivateButton = isSupported && ((!permission && hasAttemptedAutoSubscribe) || (permission === 'default' && hasAttemptedAutoSubscribe) || (permission === 'granted' && !pushEndpoint && hasAttemptedAutoSubscribe));

  const carouselItems = [
    { icon: <FaGasPump />, label: "Combustible" },
    { icon: <FaRoad />, label: "Kilometraje" },
    { icon: <FaClock />, label: "Horas Trabajadas" },
    { icon: <FaClipboardCheck />, label: "PDI" },
  ];

  const navigationItems = [
    { icon: <RiArrowRightSLine />, label: "Dashboard", route: "/dashboard" },
    ...(shouldShowActivateButton ? [{ icon: <RiArrowRightSLine />, label: "Activar Notificaciones", route: null }] : []),
    { icon: <RiArrowRightSLine />, label: "Reportes", route: "/reportes" },
    { icon: <RiArrowRightSLine />, label: "Cuentas espejo", route: "/cuentas-espejo" },
    { icon: <CiLogout />, label: "Salir", route: "/login" },
  ];

  // AGREGADO: obtener usuario
  const user = useSelector((state) => state.auth?.user || "");
  const userInitial = user.nickname?.charAt(0)?.toUpperCase() || "?";

  return (
    <FullScreenContainer>
      <HeaderContainer>
        <LeftContainer>
          {/* Logo primero */}
          <LogoContainer>
            <img src={logoSrc} alt="Logo" />
          </LogoContainer>
          <IconContainer>{userInitial}</IconContainer>
          <TextContainer>
            <span>
            {user.nickname || 'Usuario'}<RiExpandUpDownLine title="Expandir/Contraer" />
            </span>
            <span className="lbl_email">usuario@example.com</span>
          </TextContainer>
        </LeftContainer>
        <RightContainer>
          <BsThreeDots size={24} title="Opciones" />
        </RightContainer>
      </HeaderContainer>

      <MainContent>
        <WelcomeCardWrapper>
          <WelcomeCard userName={user.nickname}/>
        </WelcomeCardWrapper>

        <GridFeaturedWrapper>
          <GridFeatured />
        </GridFeaturedWrapper>

        {/* <Subtitle>Reportes más usados</Subtitle>
        <CarouselContainer>
          {carouselItems.map((item, index) => (
            <CarouselItem key={index}>
              <div className="icon">{item.icon}</div>
              <div className="label">{item.label}</div>
            </CarouselItem>
          ))}
        </CarouselContainer> */}

        {/* <NotificationWrapper>
          <NotificationManager/>
        </NotificationWrapper> */}
        {/* <NotificationTest/> */}
        <Subtitle>Navegación</Subtitle>
        <NavigationContainer>
          {navigationItems.map((item, index) => (
            <NavigationItem
              key={index}
              onClick={() => {
                if (item.route) {
                  navigate(item.route);
                } else if (item.label === "Activar Notificaciones") {
                  handleActivateNotifications();
                }
              }}
              title={item.label}
              style={{
                opacity: isLoadingNotifications && item.label === "Activar Notificaciones" ? 0.7 : 1,
                cursor: isLoadingNotifications && item.label === "Activar Notificaciones" ? 'not-allowed' : 'pointer'
              }}
            >
              {item.label === "Activar Notificaciones" ? (
                <SpecialLabel>
                  <span className="icon">{item.icon}</span>
                  {isLoadingNotifications ? "Activando..." : item.label}
                </SpecialLabel>
              ) : (
                <>
                  <div className="icon">{item.icon}</div>
                  <div className="label">{item.label}</div>
                </>
              )}
              {item.label === "Activar Notificaciones" && <GoldenBadge />}
            </NavigationItem>
          ))}
        </NavigationContainer>

        {/* Mostrar mensaje de notificación si existe */}
        {/* {notificationMessage && (
          <div style={{
            margin: '10px 16px',
            padding: '8px 12px',
            backgroundColor: notificationMessage.includes('Error') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            border: `1px solid ${notificationMessage.includes('Error') ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
            borderRadius: '8px',
            color: notificationMessage.includes('Error') ? '#fca5a5' : '#86efac',
            fontSize: '12px',
            textAlign: 'center'
          }}>
            {notificationMessage}
          </div>
        )} */}

        <ContentContainer>{children}</ContentContainer>
      </MainContent>
    </FullScreenContainer>
  );
};

export default HomeMobileTemplate;