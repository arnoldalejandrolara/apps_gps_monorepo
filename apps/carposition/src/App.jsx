import { AuthProvider } from '@mi-monorepo/common/context';
import { createContext, useState, useEffect } from 'react';
import { Login } from './pages/Login';
import { Loading } from './pages/Loading';
import { Sidebar } from './components/organismos/sidebar/Sidebar';
import { AppRouter } from '@mi-monorepo/common/routers';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import { Light, Dark } from './utilities/themes';
import styled, { ThemeProvider, keyframes } from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { VehicleList } from './components/organismos/listado/VehicleList.jsx';
import { useMediaQuery } from 'react-responsive';
import { UbicacionProvider } from '@mi-monorepo/common/context';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { WebSocketProvider } from '@mi-monorepo/common/context';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Notificaciones } from './components/organismos/sidebar/Notificaciones.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { removeNotification } from '@mi-monorepo/common/store/notification';
import { HomeTemplate } from './components/templates/HomeTemplate.jsx';
import { PWAPrompt } from './components/PWAPrompt';
import { InstallPWA } from './components/InstallPWA';
import { setNavigate } from '@mi-monorepo/common/services';
import { IoMenu,IoClose } from "react-icons/io5";
import { LeftSidebar } from './components/organismos/sidebar/LeftSidebar.jsx';
import { ReusableModal } from './components/organismos/ModalScreen/ReusableModal.jsx';
import { FloatingActionButtons } from './components/organismos/ButtomComands/FloatingActionsButton.jsx';
import { VehicleListButton } from './components/organismos/ButtomComands/VehicleListButton.jsx';
import { VehicleInfoCard } from './components/organismos/VehicleInfoCard.jsx';
import { BottomMenu } from './components/organismos/BottomMenu.jsx';
import { MobileOptionsMenu } from './components/organismos/MobileOptionsMenu.jsx';
import {MobileListUnidades} from './components/organismos/MobileListUnidades.jsx';
import { MobileDetails } from './components/organismos/MobileDetails.jsx';  
import { ActiveContentMobile } from './components/organismos/ActiveContentMobile.jsx';
import { useTokenFromUrl } from './hooks/useTokenFromUrl.jsx';
export const ThemeContext = createContext(null);
export const ModalContext = createContext();

function App() {
    const [themeuse, setTheme] = useState('dark');
    const theme = themeuse === 'light' ? 'light' : 'dark';
    const themeStyles = theme === 'light' ? Light : Dark;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [vehicleListOpen, setVehicleListOpen] = useState(false);
    const [vehicleListMobileOpen, setVehicleListMobileOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [modalSize, setModalSize] = useState('medium'); 
    const [isMobile, setIsMobile] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [activeOverlay, setActiveOverlay] = useState(null);


    const isMobileOrTablet = useMediaQuery({ query: '(max-width: 768px)' });

    const modalValue = {
        openModal: (content, title, size = 'medium',isMobileDevice = false) => {
            setModalContent(content);
            setModalTitle(title);
            setModalSize(size);
            setIsModalOpen(true);
            setIsMobile(isMobileDevice); 
        },
        closeModal: () => {
            setIsModalOpen(false);
            setModalContent(null);
            setModalTitle('');
            setModalSize('medium');
        },
    };

    const { pathname } = useLocation();
    const navigate = useNavigate();

    // Hook para capturar token de URL
    useTokenFromUrl();

    useEffect(() => {
        setNavigate(navigate);
    }, [navigate]);

    const [notifiOpen, setNotifiOpen] = useState(false);

    const sidebarProps = {
        state: sidebarOpen,
        setState: () => setSidebarOpen(!sidebarOpen),
        onToggleNotifications: () => setNotifiOpen(!notifiOpen),
    };

    const [alertMessage, setAlertMessage] = useState('');
    const [alertKey, setAlertKey] = useState(0);

    const triggerNotification = (message) => {
        setAlertMessage(message);
        setAlertKey((prev) => prev + 1);
        setTimeout(() => {
            setAlertMessage('');
        }, 3000);
    };

    const dispatch = useDispatch();
    const notifications = useSelector((state) => state.notification.notifications, (prev, next) => {
        return JSON.stringify(prev) === JSON.stringify(next);
    });

    useEffect(() => {
        if (notifications.length > 0) {
            triggerNotification(notifications[0].title + ' - ' + notifications[0].message);
            dispatch(removeNotification(notifications[0].id));
        }
    }, [dispatch, notifications]);

    const [selectedVehicleId, setSelectedVehicleId] = useState(null);

      // --- CAMBIO 2: La función ahora también cierra la lista móvil ---
      const handleVehicleSelect = (vehicle) => {
        setSelectedVehicleId(vehicle);
        if (isMobileOrTablet) {
            setVehicleListMobileOpen(false); // Cierra la lista al seleccionar en móvil
        }
    };

    // --- CAMBIO 3: Se crea una función para cerrar el panel de detalles en móvil ---
    const handleCloseMobileDetails = () => {
        setSelectedVehicleId(null);
    };

    const selectedVehicles = useSelector((state) => state.vehicle?.selectedVehicles);

    useEffect(() => {
        console.log(selectedVehicleId, "selectedVehicleId");
        if (selectedVehicles.length > 0) {
            setSelectedVehicleId(selectedVehicles[0].id);
        }
    }, [selectedVehicles]);

    return (
        <AuthProvider>
            <ModalContext.Provider value={modalValue}>
            <ThemeContext.Provider value={{ theme, setTheme }}>
                <ThemeProvider theme={themeStyles}>
                    <UbicacionProvider>
                        <WebSocketProvider>
                            {pathname === '/login' ? (
                                <Login />
                            ) : pathname === '/loading' ? (
                                <Loading />
                            ) : (
                                <AppGrid>
                                    {/* 👇 2. OCULTA el HamburgerButton si es móvil/tablet */}
                                    {!isMobileOrTablet && (
                                        <HamburgerButton onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}>
                                            <IoMenu />
                                        </HamburgerButton>
                                    )}

                                    {/* 👇 3. MUESTRA el nuevo menú de 3 puntos SOLO si es móvil/tablet */}
                                    {isMobileOrTablet && <MobileOptionsMenu />}

                                    {!isMobileOrTablet && (
                                    <VehicleListButton 
                                        onClick={() => setVehicleListOpen(!vehicleListOpen)}
                                        isOpen={vehicleListOpen}
                                    />
                                    )}

                                   {/* --- CAMBIO 4: Conectamos MobileDetails al estado correcto --- */}
                                   {isMobileOrTablet && (
                                        <MobileDetails 
                                            isOpen={!!selectedVehicleId} // Se muestra si hay un vehículo seleccionado
                                            onClose={handleCloseMobileDetails} // Le pasamos la función para cerrarse
                                        />
                                    )}
                                    
                                    {/* --- CAMBIO 5: Se corrige el estado que controla MobileListUnidades --- */}
                                    {isMobileOrTablet && 
                                        <MobileListUnidades 
                                            isOpen={vehicleListMobileOpen} 
                                            onClose={() => setVehicleListMobileOpen(false)} 
                                            onVehicleSelect={handleVehicleSelect} 
                                            onOpen={() => setVehicleListMobileOpen(true)}
                                        />
                                    }
 
                                    {leftSidebarOpen && <Backdrop onClick={() => setLeftSidebarOpen(false)} />}
                                    
                                    <LeftSidebar
                                        isOpen={leftSidebarOpen}
                                        onClose={() => setLeftSidebarOpen(false)}
                                        
                                    />

                                    <ReusableModal
                                        isOpen={isModalOpen}
                                        onClose={() => setIsModalOpen(false)}
                                        title={modalTitle}
                                        size={modalSize} 
                                        isMobile={isMobile}
                                    >
                                        {modalContent}
                                    </ReusableModal>

                                    <VehicleList 
                                        isOpen={vehicleListOpen} 
                                        onClose={() => setVehicleListOpen(false)} 
                                        onVehicleSelect={handleVehicleSelect} 
                                    />
                                    
                                    <FloatingActionButtons isVisible={!!selectedVehicleId && !isMobileOrTablet} />

                                    <Container className={`${sidebarOpen ? "sidebar-active" : ""} ${notifiOpen ? "notifi-active" : ""}`}>
                                        
                                        {notifiOpen && <Overlay onClick={() => setNotifiOpen(false)} />}

                                   
                                        <section className="mapaView">
                                            <HomeTemplate />

                                            {/* 👇 4. RENDERIZA LA NUEVA TARJETA */}
                                            <VehicleInfoCard
                                                isVisible={!!selectedVehicleId && !isMobileOrTablet}
                                                vehicle={selectedVehicleId}
                                                onClose={() => setSelectedVehicleId(null)} // Para cerrar la tarjeta
                                            />
 
                                        </section>

                                         {/* --- 4. RENDERIZA CONDICIONALMENTE EL MENÚ --- */}
                                         { isMobileOrTablet ? (
                                            <BottomMenu 
                                                onViewChange={setActiveOverlay}
                                                activeView={activeOverlay}
                                            />
                                        ) : (
                                            <section className="ContentSidebar">
                                                <Sidebar {...sidebarProps} />
                                            </section>
                                        )}
                                        

                                        <section className='ContentNotifi'>
                                            <Notificaciones state={notifiOpen} setState={() => setNotifiOpen(!notifiOpen)} />
                                        </section>
                                        <PWAPrompt />
                                        <InstallPWA />
                                        
                                        {alertMessage && (
                                            <AlertContainer key={alertKey}>
                                                <Stack sx={{ width: '100%' }} spacing={2}>
                                                    <Alert variant="filled" severity="info">
                                                        {alertMessage}
                                                    </Alert>
                                                </Stack>
                                            </AlertContainer>
                                        )}

                                    {activeOverlay && (
                                        <OverlayContainer>
                                            <ActiveContentMobile view={activeOverlay} />
                                        </OverlayContainer>
                                    )}
                                    </Container>

                                 
                                    
                                </AppGrid>
                            )}
                        </WebSocketProvider>
                    </UbicacionProvider>
                </ThemeProvider>
            </ThemeContext.Provider>
            </ModalContext.Provider>
        </AuthProvider>
    );
}

const OverlayContainer = styled.div`
  position: fixed;
  /* La posición y tamaño no cambian, sigue siendo un contenedor casi completo */
  bottom: 60px; 
  left: 0;
  width: 100%;
  height: calc(100vh - 60px); 
  background: #ffffff;
  z-index: 1050;
  /* 👇 2. Se aplica la nueva animación */
  padding: 20px;
  overflow-y: auto;
`;

// --- ESTILOS ---
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1001; 
  background: rgba(0, 0, 0, 0.1);
`;

const AppGrid = styled.div`
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
    display: grid;
    grid-template-rows:1fr; 
    background: ${({ theme }) => theme.bgtotal};
    position: relative;
    overflow: hidden;
`;

const slideInRight = keyframes`from {transform: translateX(100%);opacity: 0;} to {transform: translateX(0);opacity: 1;}`;
const slideOutLeft = keyframes`from {transform: translateX(0);opacity: 1;} to {transform: translateX(-100%);opacity: 0;}`;

const AlertContainer = styled.div`
    position: fixed;
    top: 20px;
    right: 70px;
    z-index: 1000;
    width: auto;
    max-width: 300px;
    animation: ${slideInRight} 0.5s ease-in-out, ${slideOutLeft} 0.5s ease-in-out 3s;
`;

const Container = styled.main`
    display: grid;
    grid-template-columns: 1fr 55px; /* Por defecto, layout para laptop */
    width: 100%;
    height: 100%;
    position: relative;
    padding-bottom: 0;
    transition: transform 0.3s ease-in-out;

    .mapaView {
        height: 100%;
        grid-column: 1;
    }

    .ContentSidebar {
        height: 100%;
        grid-column: 2;
        /* Oculta explícitamente el contenedor de la sidebar en móvil */
    }

    .ContentNotifi {
        position: absolute;
        top: 0;
        right: 0;
        width: ${({ isMobileOrTablet }) => isMobileOrTablet ? '100%' : '420px'};
        height: 100%;
        box-shadow: -10px 0 20px -10px rgba(0,0,0,0.2);
        z-index: 1002; 
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
  }

    .MobileBottomMenu {
        display: none;
    }

  &.notifi-active {
    .ContentNotifi {
      transform: translateX(0);
    }
  }

  /* --- Media Query para Móvil/Tablet --- */
    /* Estos estilos se aplicarán SOLO cuando la pantalla sea de 768px o menos */
    @media (max-width: 768px) {
        grid-template-columns: 1fr; /* Cambia a una sola columna */
        padding-bottom: 60px; /* Añade el espacio para el BottomMenu */

        .ContentNotifi {
            width: 100%; /* El panel de notificaciones ocupa todo el ancho */
        }
    }
`;

const HamburgerButton = styled.button`
    position: fixed;
    top: 15px;
    left: 15px;
    z-index: 1000;
    background: #ffffff;
    color: #333333;
    border: 1px solid #dddddd;
    border-radius: 8px;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const Backdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
`;

export default App;