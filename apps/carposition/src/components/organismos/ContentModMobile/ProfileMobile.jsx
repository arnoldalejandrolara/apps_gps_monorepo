import React, { useState } from 'react';
import styled from 'styled-components';
import { IoMoonOutline, IoSunnyOutline } from 'react-icons/io5';

// --- 1. DATOS FALSOS (MOCK DATA) ---
const mockUser = {
  name: 'Juan Pérez',
  email: 'juan.perez@email.com',
  phone: '+52 833 123 4567',
};

// --- 2. ESTILOS PARA EL COMPONENTE DE PERFIL ---
const ProfileContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa; /* Fondo gris claro */
`;

const Header = styled.div`
  display: flex;
  justify-content: center; /* Título centrado */
  align-items: center;
  padding: 16px;
  background-color: #ffffff;
  color: #1c1c1e;
  font-size: 15px;
  font-weight: 600;
  border-bottom: 1px solid #e0e0e0;
  position: relative;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AvatarCircle = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #2196F3; /* Color de fondo para el avatar */
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 500;
  margin-bottom: 24px;
`;

const InfoSection = styled.div`
  width: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 8px 16px;
  margin-bottom: 16px;
  border: 1px solid #e0e0e0;
`;

const InfoRow = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-size: 12px;
  color: #6c757d; /* Color gris para la etiqueta */
  margin-bottom: 4px;
`;

const InfoValue = styled.span`
  font-size: 13px;
  color: #1c1c1e; /* Texto principal oscuro */
`;

const SettingsSection = styled(InfoSection)``; // Reutilizamos el estilo

const SettingsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`;

const ToggleSwitch = styled.label`
  position: relative; display: inline-block; width: 51px; height: 31px;
  input { opacity: 0; width: 0; height: 0; }
  span {
    position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;
  }
  span:before {
    position: absolute; content: ""; height: 23px; width: 23px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%;
  }
  input:checked + span { background-color: #333; } /* Color oscuro para el modo noche */
  input:checked + span:before { transform: translateX(20px); }
`;

export const ProfileMobile = () => {
  const [user, setUser] = useState(mockUser);
  
  // --- 3. ESTADO LOCAL PARA EL MODO OSCURO ---
  // En una app real, esto vendría de tu ThemeContext
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleThemeChange = () => {
    setIsDarkMode(prevMode => !prevMode);
    // AQUÍ LLAMARÍAS A LA FUNCIÓN DE TU THEME CONTEXT
    // Por ejemplo: setTheme(isDarkMode ? 'light' : 'dark');
    console.log(`Modo oscuro ${!isDarkMode ? 'activado' : 'desactivado'}`);
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <ProfileContainer>
      <Header>
        <span>Perfil</span>
      </Header>
      <Content>
        <AvatarCircle>
          {getInitial(user.name)}
        </AvatarCircle>

        <InfoSection>
          <InfoRow>
            <InfoLabel>Nombre de Usuario</InfoLabel>
            <InfoValue>{user.name}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Correo Electrónico</InfoLabel>
            <InfoValue>{user.email}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Teléfono</InfoLabel>
            <InfoValue>{user.phone}</InfoValue>
          </InfoRow>
        </InfoSection>

        <SettingsSection>
          <SettingsRow>
            <InfoValue style={{ display: 'flex', alignItems: 'center' }}>
              {isDarkMode ? <IoMoonOutline style={{ marginRight: '8px' }} /> : <IoSunnyOutline style={{ marginRight: '8px' }} />}
              Modo Oscuro
            </InfoValue>
            <ToggleSwitch>
              <input type="checkbox" checked={isDarkMode} onChange={handleThemeChange} />
              <span />
            </ToggleSwitch>
          </SettingsRow>
        </SettingsSection>
      </Content>
    </ProfileContainer>
  );
};

export default ProfileMobile;