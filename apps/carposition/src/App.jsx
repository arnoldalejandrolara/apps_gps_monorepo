import { AuthProvider } from '@mi-monorepo/common/context';
import { createContext, useState, useEffect } from 'react';
import { Login } from './pages/Login';
import { Sidebar } from './components/organismos/sidebar/Sidebar';
import { AppRouter } from '@mi-monorepo/common/routers';
import { Light, Dark } from './utilities/themes';
import styled, { ThemeProvider, keyframes } from 'styled-components';
import { Device } from './utilities/breakpoints';
import { useLocation, useNavigate } from 'react-router-dom';
import { VehicleList } from './components/organismos/listado/VehicleList.jsx';
import { useMediaQuery } from 'react-responsive';
import { UbicacionProvider } from '@mi-monorepo/common/context';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { WebSocketProvider } from '@mi-monorepo/common/context';
import { APIProvider } from '@vis.gl/react-google-maps';
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
import {NotifiConfigComponent} from './components/organismos/ContentModals/NotifiConfig.jsx';
export const ThemeContext = createContext(null);

function App() {
    const [themeuse, setTheme] = useState('dark');
    const theme = themeuse === 'light' ? 'light' : 'dark';
    const themeStyles = theme === 'light' ? Light : Dark;
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [vehicleListOpen, setVehicleListOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null); // Nuevo estado para el contenido

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');

    const { pathname } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setNavigate(navigate);
    }, [navigate]);

    const sidebarProps = {
        state: sidebarOpen,
        setState: () => setSidebarOpen(!sidebarOpen),
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
    const notifications = useSelector((state) => state.notification.notifications);

    useEffect(() => {
        if (notifications.length > 0) {
            triggerNotification(notifications[0].title + ' - ' + notifications[0].message);
            dispatch(removeNotification(notifications[0].id));
        }
    }, [notifications]);


    const handleMenuItemClick = (item) => {
        setModalTitle(item.label);
    
        // Un switch decide qué "foto" poner en el "marco"
        switch (item.to) {
            case '/configuration-user':
                setModalContent(<UserControlComponent />);
                break;
            case '/device-config':
                setModalContent(<DeviceConfigComponent />);
                break;
            case '/notifications-config':
                setModalContent(<NotifiConfigComponent />);
            break;
            // Agrega un 'case' para cada una de tus opciones
            default:
                setModalContent(<p>Contenido para {item.label}</p>);
        }
    
        setIsModalOpen(true); // Abre el modal
    };

    return (
        <AuthProvider>
            <ThemeContext.Provider value={{ theme, setTheme }}>
                <ThemeProvider theme={themeStyles}>
                    <UbicacionProvider>
                        <WebSocketProvider>
                            {pathname === '/login' ? (
                                <Login />
                            ) : (
                                <APIProvider apiKey="AIzaSyBgNmR7s6iIP55wskrCK-735AxUNm1KpU0">
                                    <AppGrid>
                                        <HamburgerButton onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}>
                                            <IoMenu />
                                        </HamburgerButton>

                                        {/* CAMBIO: Se le pasa el estado $isOpen para controlar la animación de desaparición */}
                                        <VehicleListButton 
                                            onClick={() => setVehicleListOpen(!vehicleListOpen)}
                                            $isOpen={vehicleListOpen}
                                        >
                                            <img
                                                src={Car}
                                                alt="Car Icon"
                                                style={{ width: "30px", height: "30px" }}
                                            />
                                        </VehicleListButton>
                                        
                                        {leftSidebarOpen && <Backdrop onClick={() => setLeftSidebarOpen(false)} />}

                                         
                                        {/* CAMBIO: Se usa el nuevo componente LeftSidebar */}
                                        <LeftSidebar
                                            isOpen={leftSidebarOpen}
                                            onClose={() => setLeftSidebarOpen(false)}
                                            onMenuItemClick={handleMenuItemClick}
                                        />

                                        {/* CAMBIO: Se renderiza el modal reutilizable */}
                                        <ReusableModal
                                            isOpen={isModalOpen}
                                            onClose={() => setIsModalOpen(false)}
                                            title={modalTitle}
                                        >
                                            {/* Aquí se renderiza el componente que guardamos en el estado */}
                                            {modalContent}
                                        </ReusableModal>


                                        <VehicleList isOpen={vehicleListOpen} onClose={() => setVehicleListOpen(false)} />

                                        <Container sidebaropen={sidebarOpen}>
                                            <section className="mapaView">
                                                <HomeTemplate />
                                            </section>

                                            <section className="ContentSidebar">
                                                <Sidebar {...sidebarProps} />
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
                                </APIProvider>
                            )}
                        </WebSocketProvider>
                    </UbicacionProvider>
                </ThemeProvider>
            </ThemeContext.Provider>
        </AuthProvider>
    );
}

// --- ESTILOS ---

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

const VehicleListButton = styled.button`
    position: fixed;
    top: 50%;
    left: 0;
    /* CAMBIO: Se combina la transformación vertical con la horizontal para la animación */
    transform: ${(props) => (props.$isOpen ? 'translateY(-50%) translateX(-100%)' : 'translateY(-50%) translateX(0)')};
    opacity: ${(props) => (props.$isOpen ? 0 : 1)};
    pointer-events: ${(props) => (props.$isOpen ? 'none' : 'auto')};
    
    z-index: 1000;
    background: #ffffff;
    color: #333333;
    border: 1px solid #dddddd;
    border-radius: 0 8px 8px 0;
    width: 40px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 22px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    border-left: none;
    
    /* CAMBIO: Se añade la transición para la animación */
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
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

const slideOutLeft = keyframes`from {transform: translateX(0);opacity: 1;} to {transform: translateX(-100%);opacity: 0;}`;
const slideInRight = keyframes`from {transform: translateX(100%);opacity: 0;} to {transform: translateX(0);opacity: 1;}`;

const AppGrid = styled.div`
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
    display: grid;
    grid-template-rows:1fr; 
    background: ${({ theme }) => theme.bgtotal};
`;

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
    min-height: 0;
    background-color: ${({ theme }) => theme.bgtotal};

    .mapaView, .ContentSidebar {
        height: 100%;
        min-height: 0;
    }
    .mapaView {
        grid-column: 1;
        overflow-y: auto;
    }
    .ContentSidebar {
        grid-column: 2;
    }
`;

export default App;