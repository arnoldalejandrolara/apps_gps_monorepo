import { AuthProvider } from '@mi-monorepo/common/context';
import { createContext, useState, useEffect } from 'react';
import { Login } from './pages/Login';
import { Sidebar } from './components/organismos/sidebar/Sidebar';
import { AppRouter } from '@mi-monorepo/common/routers';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import Map from 'react-map-gl/mapbox';

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
import Car from "./assets/Car.svg";
import { LeftSidebar } from './components/organismos/sidebar/LeftSidebar.jsx';
import { ReusableModal } from './components/organismos/ModalScreen/ReusableModal.jsx';
import { UserControlComponent } from './components/organismos/ContentModals/UserControl.jsx';
import { DeviceConfigComponent } from './components/organismos/ContentModals/DeviceConfig.jsx';
import { NotifiConfigComponent } from './components/organismos/ContentModals/NotifiConfig.jsx';
import { ReportsComponent } from './components/organismos/ContentModals/ReportsControl.jsx';
import { PuntosInteresControl } from './components/organismos/ContentModals/PuntosInteresControl.jsx';
import { GeoCercasControl } from './components/organismos/ContentModals/GeoCercasControl.jsx';
import { CuentasEspejoControl } from './components/organismos/ContentModals/CuentasEspejoControl.jsx';
// --- 1. IMPORTA EL NUEVO COMPONENTE ---
import { FloatingActionButtons } from './components/organismos/ButtomComands/FloatingActionsButton.jsx';
import { VehicleListButton } from './components/organismos/ButtomComands/VehicleListButton.jsx';
import { VehicleInfoCard } from './components/organismos/VehicleInfoCard.jsx';

export const ThemeContext = createContext(null);
export const ModalContext = createContext();


// 👇 2. DATOS DE EJEMPLO CON MÁS INFORMACIÓN
const dummyVehicles = [
    { 
      id: 1, 
      name: 'Torton Kenworth', 
      driver: 'Juan Pérez', 
      status: 'En movimiento', 
      date: '24/08/2025 20:15',
      ignition: true,
      timeOn: '3h 45m',
      speed: '65 km/h', 
      address: 'Av. Hidalgo, Centro, Tampico',
      orientation: 'Noroeste', // 👈 AÑADE ESTE CAMPO
      fuel1: 85, // Porcentaje
      fuel2: 92,
      fuel3: 40,
      coords: '22.216, -97.857',
      voltage: 75 // Porcentaje para la barra
    },
    { 
      id: 2, 
      name: 'Nissan NP300', 
      driver: 'Ana García', 
      status: 'Detenido', 
      date: '24/08/2025 19:58',
      ignition: false,
      timeOn: '8h 12m',
      speed: '0 km/h', 
      address: 'Blvd. Adolfo López Mateos, Cd. Madero',
      orientation: 'Sur', // 👈 AÑADE ESTE CAMPO
      fuel1: 70,
      fuel2: 70,
      fuel3: 0, // No tiene tercer tanque
      coords: '22.245, -97.839',
      voltage: 60
    },
    // ... puedes agregar más vehículos ...
];

function App() {
    const [themeuse, setTheme] = useState('dark');
    const theme = themeuse === 'light' ? 'light' : 'dark';
    const themeStyles = theme === 'light' ? Light : Dark;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [vehicleListOpen, setVehicleListOpen] = useState(true);
    const [modalContent, setModalContent] = useState(null);
    const [modalSize, setModalSize] = useState('medium'); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');

    const [viewState, setViewState] = useState({
        longitude: -99.1332,
        latitude: 19.4326,
        zoom: 10,
        pitch: 30,
        bearing: -17.6
    });

    const modalValue = {
        openModal: (content, title, size = 'medium') => {
            setModalContent(content);
            setModalTitle(title);
            setModalSize(size);
            setIsModalOpen(true);
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

    const handleMenuItemClick = (item) => {
        setModalTitle(item.label);
        switch (item.to) {
            case '/configuration-user': setModalContent(<UserControlComponent />); setModalSize('large'); break;
            case '/device-config': setModalContent(<DeviceConfigComponent />); setModalSize('large'); break;
            case '/notifications-config': setModalContent(<NotifiConfigComponent />); setModalSize('large'); break;
            case '/reports': setModalContent(<ReportsComponent />); setModalSize('large'); break;
            case '/pdi': setModalContent(<PuntosInteresControl />); setModalSize('large'); break;
            case '/geocercas': setModalContent(<GeoCercasControl />); setModalSize('large'); break;
            case '/mirror-accounts': setModalContent(<CuentasEspejoControl />); setModalSize('extraMedium'); break;
            default: setModalContent(<p>Contenido para {item.label}</p>); setModalSize('small');
        }
        setIsModalOpen(true);
    };

    const [selectedVehicleId, setSelectedVehicleId] = useState(null);

    const handleVehicleSelect = (vehicleId) => {
        setSelectedVehicleId(selectedVehicleId === vehicleId ? null : vehicleId);
    };

      // 👇 3. ENCUENTRA LOS DATOS DEL VEHÍCULO SELECCIONADO
      const selectedVehicleData = dummyVehicles.find(
        (vehicle) => vehicle.id === selectedVehicleId
    );

    return (
        <AuthProvider>
            <ModalContext.Provider value={modalValue}>
            <ThemeContext.Provider value={{ theme, setTheme }}>
                <ThemeProvider theme={themeStyles}>
                    <UbicacionProvider>
                        <WebSocketProvider>
                            {pathname === '/login' ? (
                                <Login />
                            ) : (
                                <AppGrid>
                                    <HamburgerButton onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}>
                                        <IoMenu />
                                    </HamburgerButton>

                                    {/* --- 3. RENDERIZA EL NUEVO COMPONENTE --- */}
                                    <VehicleListButton 
                                        onClick={() => setVehicleListOpen(!vehicleListOpen)}
                                        isOpen={vehicleListOpen}
                                    />
                                    
                                    {leftSidebarOpen && <Backdrop onClick={() => setLeftSidebarOpen(false)} />}
                                    
                                    <LeftSidebar
                                        isOpen={leftSidebarOpen}
                                        onClose={() => setLeftSidebarOpen(false)}
                                        onMenuItemClick={handleMenuItemClick}
                                    />
                                    <ReusableModal
                                        isOpen={isModalOpen}
                                        onClose={() => setIsModalOpen(false)}
                                        title={modalTitle}
                                        size={modalSize} 
                                    >
                                        {modalContent}
                                    </ReusableModal>
                                    <VehicleList 
                                        isOpen={vehicleListOpen} 
                                        onClose={() => setVehicleListOpen(false)} 
                                        onVehicleSelect={handleVehicleSelect} 
                                    />

                                      {/* 👇 4. RENDERIZA LA NUEVA TARJETA */}
                                    <VehicleInfoCard
                                        isVisible={!!selectedVehicleId}
                                        vehicle={selectedVehicleData}
                                        onClose={() => setSelectedVehicleId(null)} // Para cerrar la tarjeta
                                    />
                                    
                                    <FloatingActionButtons isVisible={!!selectedVehicleId} />

                                    <Container className={`${sidebarOpen ? "sidebar-active" : ""} ${notifiOpen ? "notifi-active" : ""}`}>
                                        
                                        {notifiOpen && <Overlay onClick={() => setNotifiOpen(false)} />}

                                        <section className="mapaView">
                                            <HomeTemplate />
                                        </section>
                                        <section className="ContentSidebar">
                                            <Sidebar {...sidebarProps} />
                                        </section>
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
    grid-template-columns: 1fr 55px;
    width: 100%;
    height: 100%;
    position: relative;
    transition: transform 0.3s ease-in-out;

    .mapaView, .ContentSidebar {
        height: 100%;
    }
    .mapaView {
        grid-column: 1;
    }
    .ContentSidebar {
        grid-column: 2;
    }

    .ContentNotifi {
        position: absolute;
        top: 0;
        right: 0;
        width: 420px;
        height: 100%;
        box-shadow: -10px 0 20px -10px rgba(0,0,0,0.2);
        z-index: 1002; 
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
  }

  &.notifi-active {
    .ContentNotifi {
      transform: translateX(0);
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