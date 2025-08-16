import React from "react";
import styled from "styled-components";
import { FaWhatsapp } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { ContactCard } from "./ContactCard";

const HelpContainer = styled.div`
  background: #242424;
  border-radius: 6px;
  border: 1px solid #373737;
  padding: 20px;
  height: 100%;
  color: #fff;

  h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 13px;
    font-weight: 500;
  }

  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Description = styled.p`
  margin: 0 0 18px 0;
  font-size: 12px;
  line-height: 1.5;
  color: #888b94; /* Gris oscuro profesional */
`;

function HelpContent({ children }) {
  return (
    <HelpContainer>
      <h3>¿Necesitas ayuda?</h3>
      <Description>
        Para obtener otro tipo de soporte, incluidas preguntas sobre nuestras bibliotecas de clientes, asesoramiento o mejores prácticas.
      </Description>
      <ContactCard
        icon={<FaWhatsapp />}
        title="¿Necesitas ayuda?"
        link="https://wa.me/5215555555555"
        linkText="Contáctanos por WhatsApp"
        bg="#232d2e"
        iconColor="#25d366"
        iconBg="#fff"
        linkColor="#25d366"
        linkHoverColor="#1ebc59"
      />
      <ContactCard
        icon={<SiGmail />}
        title="¿Prefieres correo?"
        link="mailto:soporte@tudominio.com"
        linkText="Escríbenos por Gmail"
        bg="#171717"
        iconColor="#d93025"
        iconBg="#fff"
        linkColor="#d93025"
        linkHoverColor="#b3140b"
      />
      {children}
    </HelpContainer>
  );
}

export default HelpContent;