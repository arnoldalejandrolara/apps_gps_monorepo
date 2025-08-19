import React, { useState } from 'react';
import styled from 'styled-components';
import expanded from '../../../assets/expand-right.svg';

const AccountContent = () => {
  const [userName, setUserName] = useState('Arnold Alejandro Lara Teran');
  const [email, setEmail] = useState('example@example.com');

  const handleNameChange = (event) => {
    setUserName(event.target.value);
  };

  return (
    <Container>
      <Section>
        <Title>Mi perfil</Title>
        <HorizontalLine />
        <AvatarContainer>
          <UserAvatar>A</UserAvatar>
          <UserInfo>
            <Label>Nombre</Label>
            <UserNameContainer>
              <UserNameInput 
                type="text" 
                value={userName} 
                onChange={handleNameChange} 
              />
            </UserNameContainer>
          </UserInfo>
        </AvatarContainer>
        <CreatePortraitLabel>Crear tu retrato</CreatePortraitLabel>
      </Section>

      <Section>
        <Title>Seguridad de la cuenta</Title>
        <HorizontalLine />
        <SecurityItem>
          <SecurityLabelContainer>
            <SecurityLabel>Correo Electrónico</SecurityLabel>
            <SecurityValue>{email}</SecurityValue>
          </SecurityLabelContainer>
          <SecurityButton>Cambiar correo electrónico</SecurityButton>
        </SecurityItem>
        <SecurityItem>
          <SecurityLabelContainer>
            <SecurityLabel>Contraseña</SecurityLabel>
            <SecurityValue>Establece una contraseña permanente para acceder a tu cuenta.</SecurityValue>
          </SecurityLabelContainer>
          <SecurityButton>Cambiar contraseña</SecurityButton>
        </SecurityItem>
      </Section>

      <Section>
        <Title>Soporte</Title>
        <HorizontalLine />
        <SecurityItem>
          <SecurityLabelContainer>
            <SecurityLabel style={{ color: '#EB5756' }}>Eliminar mi cuenta</SecurityLabel>
            <SecurityValue>Elimina permanentemente la cuenta y quita el acceso a todos los espacios de trabajo.</SecurityValue>
          </SecurityLabelContainer>
          <ExpandIcon><img src={expanded} alt="expand-icon" /></ExpandIcon>
        </SecurityItem>       

      </Section>

      <Section>
        <Title>Dispositivos</Title>
        <HorizontalLine />

        <SecurityItem>
          <SecurityLabelContainer>
            <SecurityLabel>Cerrar sesiones en todos los dispositivos</SecurityLabel>
            <SecurityValue>Se cerrará la sesión en todos los demás dispositivos excepto este.</SecurityValue>
          </SecurityLabelContainer>
          <SecurityButton>Cerrar sesion en todos los dispositivos</SecurityButton>
        </SecurityItem>

        <TableContainer>
          <Table>
            <thead>
              <tr>
                <TableHeader>Nombre del dispositivo</TableHeader>
                <TableHeader>Activo por última vez</TableHeader>
                <TableHeader>Ubicación</TableHeader>
                <TableHeader></TableHeader>
              </tr>
            </thead>
            <tbody>
              <TableRow>
                <TableCell>Dispositivo 1</TableCell>
                <TableCell>2025-04-05 22:56:53</TableCell>
                <TableCell>Ciudad, País</TableCell>
                <TableCell>
                  <SecurityButton>Cerrar sesión</SecurityButton>
                </TableCell>
              </TableRow>
              {/* Add more rows as needed */}
            </tbody>
          </Table>
        </TableContainer>
      </Section>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  color: white;
  width: 100%;
  height: 100%; /* Ensure the container takes full height */
  overflow-y: auto; /* Enable scroll within the container */
`;

const Section = styled.div`
  margin-bottom: 40px; /* Add space between sections */
  width: 100%;
`;

const Title = styled.h1`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
  width: 100%;
  text-align: left;
`;

const HorizontalLine = styled.hr`
  width: 100%;
  border: 1px solid #333333;
  margin-bottom: 10px;
`;

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const UserAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: blue;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 24px;
  margin-right: 10px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px; /* Set the width of UserInfo */
  margin-left: 10px;
`;

const Label = styled.div`
  font-size: 13px;
  color: #6D6D6D;
`;

const UserNameContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 13px;
  line-height: 20px;
  position: relative;
  border-radius: 6px;
  box-shadow: rgba(255, 255, 255, 0.075) 0px 0px 0px 1px inset;
  background: rgba(255, 255, 255, 0.055);
  cursor: text;
  padding: 4px 10px;
`;

const UserNameInput = styled.input`
  font-size: inherit;
  line-height: inherit;
  border: none;
  background: none;
  width: 100%;
  display: block;
  resize: none;
  padding: 0px;
  color: white;
  &:focus {
    outline: none;
  }
`;

const CreatePortraitLabel = styled.div`
  font-size: 13px;
  color: blue; /* Set color to blue */
  margin-top: 5px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const SecurityItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
`;

const SecurityLabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

const SecurityLabel = styled.div`
  font-size: 14px;
  color: white;
`;

const SecurityValue = styled.div`
  font-size: 13px;
  color: grey;
`;

const SecurityButton = styled.button`
  font-size: 13px;
  color: white;
  background: none;
  border: 1px solid grey;
  border-radius: 8px;
  padding: 8px 10px;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ExpandIcon = styled.div`
  font-size: 24px;
  color: #797979;
  cursor: pointer;
`;

const TableContainer = styled.div`
  overflow-x: auto; /* Enable horizontal scroll if needed */
  margin-top: 30px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
`;

const TableHeader = styled.th`
  font-size: 14px;
  color: white;
  text-align: left;
  padding: 10px 0;
  border-bottom: 1px solid #333333;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: rgba(255, 255, 255, 0.055);
  }
`;

const TableCell = styled.td`
  font-size: 13px;
  color: white;
  padding: 10px 0;
  border-bottom: 1px solid #333333;
`;

export default AccountContent;