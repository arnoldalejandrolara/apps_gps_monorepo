import React from 'react';
import styled from 'styled-components';
import welcomeIcon from '../../../assets/welcomeIcon.png';
import backgroundWelcome from '../../../assets/icon_pin.png';

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: url(${backgroundWelcome});
  background-size: cover;
  background-position: center;
  border-radius: 6px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  width: 100%;
  height: 100%;
  gap: 25px;
  padding: 30px;
  overflow: hidden;

  /* Capa oscura degradada sobre toda la imagen */
  &::before {
    content: '';
    position: absolute;
    left: 0; top: 0; right: 0; bottom: 0;
    border-radius: 8px;
    background: linear-gradient(to right, rgba(25,25,25,0.6) 10%, rgba(25,25,25,1) 75%);
    z-index: 1;
  }

  @media (max-width: 765px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 18px;
    padding: 20px 12px;
    text-align: center;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  margin-right: 32px;
  text-align: left;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 765px) {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
    align-items: center;
    text-align: center;
  }
`;

const WelcomeTitle = styled.h2`
  margin: 0 0 12px 0;
  font-size: 24px;
  color: #fff;
  text-align: left;

  @media (max-width: 765px) {
    text-align: center;
    font-size: 18px;
  }
`;

const Description = styled.p`
  margin: 0 0 24px 0;
  color: #CCCCCC;
  font-size: 14px;
  text-align: left;
  line-height: 1.6;

  @media (max-width: 765px) {
    text-align: center;
    font-size: 11px;
  }
`;

const ExploreButton = styled.button`
  background-color: #00A66E;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 12px 15px;
  font-size: 12px;
  width: 100px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: background 0.2s, box-shadow 0.2s;
  align-self: flex-start;

  &:hover {
    background-color: #008c5c;
    box-shadow: 0 4px 16px rgba(0,0,0,0.14);
    outline: none;
  }

  @media (max-width: 765px) {
    align-self: center;
    width: 70px;
    display: flex;
    justify-content: center;
  }
`;

const RightSection = styled.div`
  flex-shrink: 0; 
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;

  @media (max-width: 765px) {
    width: 100%;
    justify-content: center;
  }
`;

const UserImageWrapper = styled.div`
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border-radius: 50%;

  @media (max-width: 765px) {
  display: none;
    // width: 80px;
    // height: 80px;

  }
`;

const UserImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const WelcomeCard = ({ userName, description, imageUrl }) => (
  <CardContainer>
    <LeftSection>
      <WelcomeTitle>
        Bienvenido , {userName}👋
      </WelcomeTitle>
      <Description>
        Supervisa y gestiona tus activos en tiempo real desde cualquier lugar.<br />
        Disfruta de una experiencia segura, precisa y eficiente.
      </Description>
      <ExploreButton>Explorar</ExploreButton>
    </LeftSection>

    <RightSection>
      <UserImageWrapper>
        <UserImage src={welcomeIcon} alt="icon"/>
      </UserImageWrapper>
    </RightSection>
    
  </CardContainer>
);

export default WelcomeCard;