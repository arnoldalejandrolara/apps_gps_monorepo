import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: #232323;
  border-radius: 7px;
  border: 1px solid #373737;
  padding: 10px;
  color: #ffeeb3;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  flex-shrink: 0; /* Evita que se encoja */
`;

const Title = styled.h3`
  margin: 0;
  margin-right: 15px;
  text-align: left;
  flex: none;
  color: #fff;
`;

const SubTitle = styled.span`
  font-weight: 400;
  font-size: 13px;
  text-align: left;
  color: #fff;
`;

const EmptyBox = styled.div`
  background: #121212;
  border-radius: 5px;
  padding: 20px;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1; /* Ocupa todo el espacio disponible */
`;

const EmptyIcon = styled.div`
  font-size: 2.5em;
  margin-bottom: 12px;
`;

const EmptyTitle = styled.div`
  font-size: 1em;
  margin-bottom: 8px;
  color: #B4B4B4;
`;

const EmptyDescription = styled.div`
  opacity: 0.8;
  font-size: 12px;
  color: #898989;
`;

const NotificationsBox = styled.div`
  background: #121212;
  border-radius: 5px;
  padding: 8px;  
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Ocupa todo el espacio disponible */
  overflow-y: auto; /* Añade scroll si es necesario */
  max-height: calc(100% - 15px); /* Ajuste para el header */
`;

function InboxContent({ children }) {
  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  return (
    <Container>
      <Header>
        <SubTitle>Notificaciones</SubTitle>
      </Header>
      {isEmpty ? (
        <EmptyBox>
          <EmptyIcon>📭</EmptyIcon>
          <EmptyTitle>No hay notificaciones</EmptyTitle>
          <EmptyDescription>
            Aquí aparecerán tus notificaciones cuando las recibas
          </EmptyDescription>
        </EmptyBox>
      ) : (
        <NotificationsBox>
          {children}
        </NotificationsBox>
      )}
    </Container>
  );
}

export default InboxContent;