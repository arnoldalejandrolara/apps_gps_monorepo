import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { BsThreeDots } from 'react-icons/bs';
import { RiExpandUpDownLine, RiArrowRightSLine } from "react-icons/ri";
import { FaGasPump, FaRoad, FaClock, FaClipboardCheck } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import WelcomeCard from '../organismos/dashboard/GridWelcome';
import GridFeatured from '../organismos/dashboard/GridFeatured';
import { useSelector, useDispatch } from 'react-redux';
import { NotificationManager } from '../NotificationManager';
import { logout } from '../../store/thunks/authThunks';
// Logo a la izquierda:
import logoSrc from '../../assets/logoblanco2.png';
import NotificationTest from '../NotificationTest';

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

const FullScreenComponent = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const carouselItems = [
    { icon: <FaGasPump />, label: "Combustible" },
    { icon: <FaRoad />, label: "Kilometraje" },
    { icon: <FaClock />, label: "Horas Trabajadas" },
    { icon: <FaClipboardCheck />, label: "PDI" },
  ];

  const navigationItems = [
    { icon: <RiArrowRightSLine />, label: "Dashboard", route: "/dashboard" },
    { icon: <RiArrowRightSLine />, label: "Reportes", route: "/reportes" },
    { icon: <RiArrowRightSLine />, label: "Cuentas espejo", route: "/cuentas-espejo" },
    { icon: <CiLogout />, label: "Salir", route: "/login" },
    // 
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

        <NotificationManager/>
        <NotificationTest />
        <Subtitle>Navegación</Subtitle>
        <NavigationContainer>
          {navigationItems.map((item, index) => (
            <NavigationItem
              key={index}
              onClick={() => {
                if(item.route === '/login'){
                  dispatch(logout());
                  navigate('/login');
                } else {
                  navigate(item.route);
                }
              }}
              title={item.label}
            >
              <div className="icon">{item.icon}</div>
              <div className="label">{item.label}</div>
            </NavigationItem>
          ))}
        </NavigationContainer>

        <ContentContainer>{children}</ContentContainer>
      </MainContent>
    </FullScreenContainer>
  );
};

export default FullScreenComponent;