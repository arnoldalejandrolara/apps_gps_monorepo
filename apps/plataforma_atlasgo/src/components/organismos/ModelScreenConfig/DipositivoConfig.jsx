import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
// import VerticalMenu from './ModalScreen/VerticalMenu';
// import Content from './ModalScreen/Content';
// import AccountContent from './ModalScreen/AccountContent';
// import PreferencesContent from './ModalScreen/PreferencesContent';
// import DevicesContent from './ModalScreen/DevicesContent';
// import UsersContent from './ModalScreen/UsersContent';
// import SettingsContent from './ModalScreen/SettingsContent';
// import NotificacionesContent from './ModalScreen/NotificacionesContent';

export function DispositivoConfig({ closeFullScreen }) {

//   const [selectedMenu, setSelectedMenu] = useState('Mi cuenta');


//   const renderContent = () => {
//     switch (selectedMenu) {
//       case 'Mi cuenta':
//         return <AccountContent />;
//       case 'Mis preferencias':
//         return <PreferencesContent />;
//       case 'Mis dispositivos':
//         return <DevicesContent />;
//       case 'Mis notificaciones':
//         return <NotificacionesContent />;
//       case 'Usuarios':
//         return <UsersContent />;
//       case 'Configuracion':
//         return <SettingsContent />;
//       default:
//         return <p>Seleccione un elemento del menú</p>;
//     }
//   };

  return (
    <FullScreenContainer onClick={closeFullScreen}>
      <FullScreenContent onClick={(e) => e.stopPropagation()}>
        {/* <VerticalMenu selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
        <ContentArea>{renderContent()}</ContentArea> */}
      </FullScreenContent>
    </FullScreenContainer>
  );
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const FullScreenContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const FullScreenContent = styled.div`
  background-color: #202020;
  border-radius: 10px;
  width: 90%;
  max-width: 1200px;
  height: 85%;
  max-height: 800px;
  margin: 20px;
  display: grid;
  grid-template-columns: 240px 1fr;
  animation: ${fadeIn} 0.2s ease-out;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    height: 100%;
    width: 100%;
    margin: 0;
  }
`;

const ContentArea = styled.div`
  padding: 20px;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export default DispositivoConfig;