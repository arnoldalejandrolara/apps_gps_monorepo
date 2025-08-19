import styled from "styled-components";
import { Btnsave } from "../moleculas/Btnsave";
import { v } from "../../utilities/variables";
import { loginService } from "../../services/AuthService.js";
import CustomInput from "../organismos/formularios/InputTextCustom";
import { FooterLogin } from "../organismos/FooterLogin";
import {ContactCard} from "../moleculas/ContactCard";
import { RegistrarAdmin } from "../organismos/formularios/RegistrarAdmin";
import { Device } from "../../utilities/breakpoints";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import bannerImg from "../../assets/img_roadmap.png";
import logo from "../../assets/logo_atlasgo.png"; // tu icono
import { FaWhatsapp } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { useDispatch } from "react-redux";
import { login } from '../../store/slices/authSlice';
import { useMediaQuery } from 'react-responsive';
import { useLocation } from 'react-router-dom';

export function LoginTemplate() {
  const dispatch = useDispatch();
  const isLaptop = useMediaQuery({ minWidth: 1025 }); // 1025 = typical laptop width breakpoint
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const location = useLocation();
  const [state, setState] = useState(false);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  async function iniciar(data) {
    setLoginError("");

    const correo = data.correo.trim().replace(/\s+/g, "");
    const pass = data.pass.trim();

    try {
      const data_user = await loginService(correo, pass);

      dispatch(login({ user: data_user.user, token: data_user.user.token }));

      if (!isMobile || location.pathname === "/mapa-mobile") {
        navigate("/dashboard");
      } else {
        navigate('/home-mobile');
      }
    } catch (error) {
      setLoginError("Usuario o contraseña incorrectos");
    }
  }

  return (
    <Container>
      <div className="contentCard">

        <div className="brand-row">
          <div className="brand">
            <img src={logo} alt="Atlas Go" className="brand-icon" />
            <span className="brand-title">atlasgo</span>
          </div>
        </div>

        <div className="card-container">
          <div className="card">
            {state && <RegistrarAdmin setState={() => setState(!state)} />}
            <Titulo>Bienvenido de nuevo</Titulo>
            {loginError && (
              <TextoStateInicio>{loginError}</TextoStateInicio>
            )}
            <Frase>Inicia sesión en tu cuenta</Frase>
            <form onSubmit={handleSubmit(iniciar)} className="login-form">
              <CustomInput
                label="User"
                label_inside="Ingrese su usuario"
                type="text"
                icon={<v.iconoemail />}
                register={register}
                name="correo"
                errors={errors}
              />
              <CustomInput
                label="Password"
                label_inside="Ingrese su contraseña"
                type="password"
                register={register}
                name="pass"
                errors={errors}
              />
              <ContainerBtn>
                <Btnsave titulo="Iniciar sesión" bgcolor="#DBCD51" />
              </ContainerBtn>
              <Divider />

              
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
                bg="#252525"
                iconColor="#d93025"
                iconBg="#fff"
                linkColor="#d93025"
                linkHoverColor="#b3140b"
              />
              
            </form>
          </div>
        </div>
        <FooterWrapper>
          <FooterLogin />
        </FooterWrapper>
      </div>

      {isLaptop && (
        <div className="bannerlateral">
          <img src={bannerImg} alt="banner" className="banner-img" />
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  background-size: cover;
  height: 100dvh;
  min-height: 0;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #262626;
  position: relative;
  overflow: hidden;

  @media (min-width: 1025px) {
    grid-template-columns: 2fr 3.1fr;
  }

  .contentCard {
    grid-column: 1;
    background-color: #171717 !important;
    background-size: cover;
    z-index: 100;
    position: relative;
    width: 100%;
    min-height: 100dvh;
    color: #fff;
    border-right: 1px solid #373737;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    transition: border-right 0.2s;
    /* Hacer que el contenido pueda hacer scroll si es necesario */
    overflow-y: auto;
    max-height: 100dvh;

    @media (max-width: 1024px) {
      border-right: none;
      grid-column: 1 / -1;
      width: 100vw;
      min-width: 0;
      padding: 0;
    }

    @media (max-width: 768px) {
      align-items: stretch;
      justify-content: flex-start;
      min-height: 100dvh;
      padding: 0;
      overflow-y: auto;
      max-height: 100dvh;
      /* para evitar doble scroll en mobile */
      -webkit-overflow-scrolling: touch;
    }
  }

  .brand-row {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    padding-top: 25px;
    padding-left: 15px;
    padding-bottom: 20px;

    @media (max-width: 768px) {
      margin-bottom: 0px;
      padding-left: 10px;
      padding-right: 10px;
    }
  }
  .brand {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: auto;
    margin-left: 0;
    margin-bottom: 0;
  }
  .brand-icon {
    width: 25px;
    height: 25px;
  }
  .brand-title {
    color: #fff;
    font-size: 1.1rem;
    font-weight: 500;
    margin-left: 5px;
  }

  .card-container {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;

    @media (max-width: 768px) {
      max-width: 100vw;
      padding: 0 12px;
      flex: 1;
      justify-content: center;
      align-items: center;
      min-height: 0;
    }
  }

  .card {
    width: 100%;
    max-width: 400px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin: 35px auto 0 auto;
    padding: 0 8px;

    @media (max-width: 768px) {
      margin-top: 0;
      padding: 0 18px;
      max-width: 98vw;
    }
  }

  .login-form {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }

  .version {
    color: #727272;
    text-align: start;
  }
  .contentImg {
    width: 100%;
    display: flex;
    justify-content: center;
    img {
      width: 40%;
      animation: flotar 1.5s ease-in-out infinite alternate;
    }
  }
  .ayuda {
    position: absolute;
    top: 15px;
    right: 15px;
    color: #8d8d8d;
    font-size: 12px;
    font-weight: 500;
  }
  &:hover {
    .contentsvg {
      top: -100px;
      opacity: 1;
    }
    .cuadros {
      transform: rotate(37deg) rotateX(5deg) rotateY(12deg) rotate(3deg)
        skew(2deg) skewY(1deg) scaleX(1.2) scaleY(1.2);
      color: red;
    }
  }

  .bannerlateral {
    grid-column: 2;
    background-color: #0F0F0F !important;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    background-image: none !important;
    padding: 0;
    margin: 0;

    @media (max-width: 1024px) {
      display: none !important;
    }

    .banner-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      border-radius: 0;
      box-shadow: none;
      display: block;
    }
  }

  @keyframes flotar {
    0% { transform: translate(0, 0px); }
    50% { transform: translate(0, 15px); }
    100% { transform: translate(0, -0px); }
  }
`;

const Titulo = styled.span`
  font-size: 28px;
  font-weight: 400;
  text-align: left;
  display: block;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Frase = styled.p`
  color: #b4b4b4;
  font-size: 0.8rem;
  font-weight: 400;
  text-align: left;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  margin-bottom: 30px;
`;

const ContainerBtn = styled.div`
  margin-top: 15px;
  display: flex;
  width: 100%;
  justify-content: center;
`;

const Divider = styled.hr`
  width: 100%;
  margin: 24px 0 16px 0;
  border: none;
  border-top: 1px solid #373737;
  opacity: 0.7;
`;


const FooterWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 0 12px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

const TextoStateInicio = styled.p`
  color: #fc7575;
`;