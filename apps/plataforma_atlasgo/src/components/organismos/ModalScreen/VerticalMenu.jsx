import React from 'react';
import styled from 'styled-components';

import icon_cuenta from '../../../assets/Male_User.svg';
import icon_adjust from '../../../assets/Adjust.svg';
import icon_car from '../../../assets/Car_icon.svg';
import icon_people from '../../../assets/People.svg';
import icon_setting from '../../../assets/Settings.svg';
import icon_notification from '../../../assets/Notification.svg';

const VerticalMenu = ({ selectedMenu, setSelectedMenu }) => {
  return (
    <VerticalMenuContainer>
      <AccountSection>
        <LabelCuenta>Cuenta</LabelCuenta>
        <UserInfo>
          <UserAvatar>A</UserAvatar>
          <UserDetails>
            <UserName>Example user</UserName>
            <UserEmail>user@example.com</UserEmail>
          </UserDetails>
        </UserInfo>
      </AccountSection>
      {/* <MenuItem 
        isSelected={selectedMenu === 'Mi cuenta'} 
        onClick={() => setSelectedMenu('Mi cuenta')}
      >
        <img src={icon_cuenta} alt="cuenta" />
        <Label>Mi cuenta</Label>
      </MenuItem> */}
      <MenuItem 
        isSelected={selectedMenu === 'Mis preferencias'} 
        onClick={() => setSelectedMenu('Mis preferencias')}
      >
        <img src={icon_adjust} alt="adjust" />
        <Label>Mis preferencias</Label>
      </MenuItem>

      {/* <MenuItem 
        isSelected={selectedMenu === 'Mis dispositivos'} 
        onClick={() => setSelectedMenu('Mis dispositivos')}
      >
        <img src={icon_car} alt="car" />
        <Label>Mis dispositivos</Label>
      </MenuItem>

      <MenuItem 
        isSelected={selectedMenu === 'Mis notificaciones'} 
        onClick={() => setSelectedMenu('Mis notificaciones')}
      >
        <img src={icon_notification} alt="noti" />
        <Label>Notificaciones</Label>
      </MenuItem> */}

      {/* <LabelSubtitle>Espacio de trabajo</LabelSubtitle>

      <MenuItem 
        isSelected={selectedMenu === 'Usuarios'} 
        onClick={() => setSelectedMenu('Usuarios')}
      >
        <img src={icon_people} alt="people" />
        <Label>Usuarios</Label>
      </MenuItem>
      <MenuItem 
        isSelected={selectedMenu === 'Configuracion'} 
        onClick={() => setSelectedMenu('Configuracion')}
      >
        <img src={icon_setting} alt="setting" />
        <Label>Configuracion</Label>
      </MenuItem> */}
    </VerticalMenuContainer>
  );
};

const VerticalMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 15px 10px;
  background-color: #171717;
  border-radius: 10px 0 0 10px;
  /* Línea a la derecha */
  border-right: 2px solid #242424;
`;

const AccountSection = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const LabelCuenta = styled.div`
  color: #6D6D6D;
  font-weight: 500;
  margin-bottom: 10px;
  font-size: 12px;
`;

const Label = styled.div`
  color: white;
  font-weight: 500;
  font-size: 12px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const LabelSubtitle = styled.div`
  font-size: 12px;
  color: #6D6D6D;
  padding: 5px 5px;
`;

const UserAvatar = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: blue;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  color: white;
  font-weight: 500;
  font-size: 13px;
`;

const UserEmail = styled.div`
  color: #6D6D6D;
  font-size: 12px;
`;

const MenuItem = styled(({ isSelected, ...rest }) => <div {...rest} />)`
  display: flex;
  border-radius: 10px;
  align-items: center;
  width: 100%;
  color: ${({ isSelected }) => (isSelected ? 'white' : '#aaa')};
  background-color: ${({ isSelected }) => (isSelected ? '#555' : 'transparent')};
  padding: 5px 5px;
  cursor: pointer;
  justify-content: flex-start;
  margin-bottom: 5px;
  &:hover {
    background-color: ${({ isSelected }) => (isSelected ? '#555' : 'rgba(255, 255, 255, 0.055)')};
  }
  img {
    margin-right: 10px;
  }
`;

export default VerticalMenu;