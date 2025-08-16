import { AuthProvider } from './context/AuthContext';
import { createContext, useState, useEffect } from 'react';
import { Login } from './pages/Login';
import { Sidebar } from './components/organismos/sidebar/Sidebar';
import { BottomMenu } from './components/organismos/BottomMenu.jsx';
import { AppRouter } from './routers/AppRouter';
import { Light, Dark } from './utilities/themes';
import styled, { ThemeProvider, keyframes } from 'styled-components';
import { Device } from './utilities/breakpoints';
import { useLocation, useNavigate } from 'react-router-dom';
import { ListCar } from './components/organismos/sidebar/ListCar';
import { useMediaQuery } from 'react-responsive';
import { Navbar } from './components/Navbar.jsx';
import { UbicacionProvider } from './context/UbicacionContexto';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { WebSocketProvider } from './context/WebSocketContext';
import { APIProvider } from '@vis.gl/react-google-maps';
import { useSelector, useDispatch } from 'react-redux';
import { removeNotification } from './store/slices/notificationSlice';
import { useMapaWeb } from './context/MapViewContext';
import { MapaClasicoTemplate } from './components/templates/MapaClasicoTemplate';
import { HomeTemplate } from './components/templates/HomeTemplate.jsx';
import { PWAPrompt } from './components/PWAPrompt';
import { InstallPWA } from './components/InstallPWA';
import { setNavigate } from './services/navigationService';

export const ThemeContext = createContext(null);

function App() {
    const [themeuse, setTheme] = useState('dark');
    const theme = themeuse === 'light' ? 'light' : 'dark';
    const themeStyles = theme === 'light' ? Light : Dark;
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [listCarOpen, setListCarOpen] = useState(false);

    const { pathname } = useLocation();
    const navigate = useNavigate();

    const { showMapMobile, setShowMapMobile, showMapaWebLayer, setShowMapaWebLayer } = useMapaWeb();

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
        if (isMobile) {
            if (showMapaWebLayer) setShowMapaWebLayer(false);
        } else {
            if (showMapMobile) setShowMapMobile(false);
        }
    }, [isMobile]);

    useEffect(() => {
        if (notifications.length > 0) {
            triggerNotification(notifications[0].title + ' - ' + notifications[0].message);
            dispatch(removeNotification(notifications[0].id));
        }
    }, [notifications]);

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
                                        <Navbar />

                                        <Container sidebaropen={sidebarOpen}>

                                            <section className="ContentSidebar">
                                                <Sidebar {...sidebarProps} />
                                            </section>

                                            <section
                                                className="ContentRoutes"
                                                style={{
                                                    display: (!showMapMobile && !showMapaWebLayer) ? 'block' : 'none',
                                                    height: '100%',
                                                }}
                                            >
                                                <AppRouter />
                                            </section>

                                            <section
                                                className="mapaView"
                                                style={{
                                                    display: (showMapaWebLayer && !showMapMobile) ? 'block' : 'none',
                                                    height: '100%',
                                                }}
                                            >
                                                <HomeTemplate />
                                            </section>

                                            <section
                                                className="MobileMapView"
                                                style={{
                                                    display: showMapMobile ? 'block' : 'none',
                                                    height: '100%',
                                                }}
                                            >
                                                <MapaClasicoTemplate />
                                            </section>

                                            {showMapaWebLayer && (
                                                <section className="ListCar">
                                                    <ListCar
                                                        state={listCarOpen}
                                                        setState={() =>
                                                            setListCarOpen(
                                                                !listCarOpen
                                                            )
                                                        }
                                                    />
                                                </section>
                                            )}

                                            <section className="MobileBottomMenu">
                                                <BottomMenu />
                                            </section>
                                            
                                            {/* PWA Components */}
                                            <PWAPrompt />
                                            <InstallPWA />
                                            {alertMessage && (
                                                <AlertContainer key={alertKey}>
                                                    <Stack
                                                        sx={{ width: '100%' }}
                                                        spacing={2}
                                                    >
                                                        <Alert
                                                            variant="filled"
                                                            severity="info"
                                                        >
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

// Animaciones para la alerta
const slideOutLeft = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
`;

const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

// Grid general, 2 filas: Navbar y el resto
const AppGrid = styled.div`
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
    display: grid;
    grid-template-rows: 47px 1fr;  /* 56px es la altura del navbar */
    background: ${({ theme }) => theme.bgtotal};
`;

const AlertContainer = styled.div`
    position: fixed;
    top: 20px;
    right: 70px;
    z-index: 1000;
    width: auto;
    max-width: 300px;
    animation: ${slideInRight} 0.5s ease-in-out,
        ${slideOutLeft} 0.5s ease-in-out 3s;
`;

const Container = styled.main`
    display: grid;
    grid-template-columns: 47px 1fr;
    width: 100%;
    height: 100%;
    min-height: 0;
    background-color: ${({ theme }) => theme.bgtotal};

    .ContentSidebar {
        display: flex;
        flex-direction: column;
        height: 100%; /* Asegura que el sidebar ocupe toda la altura disponible */
        min-height: 0;
        flex: 1 1 auto;
        background: red;
    }


    .MobileBottomMenu,
    .ListCar {
        display: none;
    }

    .ContentMenuambur {
        display: block;
        position: absolute;
        left: 20px;
    }

    @media ${Device.tablet} {
        grid-template-columns: ${(props) => props.sidebaropen ? '220px' : '47px'} 1fr;

        .ContentSidebar {
            display: flex;
        }

        .ListCar {
            display: initial;
        }

        .ContentMenuambur {
            display: none;
        }
    }

    .ContentRoutes,
    .mapaView,
    .MobileMapView {
        grid-column: 2;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        min-height: 0;
    }

    @media (max-width: 765px) {
        display: grid;
        grid-template-rows: 1fr 60px;
        grid-template-columns: 1fr;

        .MobileBottomMenu {
            display: flex;
            position: fixed;
            left: 0; right: 0; bottom: 0;
            z-index: 1000;
            height: 60px;
            background: ${({ theme }) => theme.bgtotal};
        }

        .ContentRoutes,
        .MobileMapView,
        .mapaView {
            grid-row: 2;
            grid-column: 1;
            min-height: 100vh;
            padding-bottom: 60px;
            overflow-y: auto;
        }

        .ContentMenuambur,
        .ContentSidebar,
        .ListCar {
            display: none;
        }
    }
`;

export default App;