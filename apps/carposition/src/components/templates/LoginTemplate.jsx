import styled from "styled-components";
import { Btnsave } from "../moleculas/Btnsave";
import { v } from "../../utilities/variables";
import { loginService } from "@mi-monorepo/common/services";
import CustomInput from "../organismos/formularios/InputTextCustom";
import { FooterLogin } from "../organismos/FooterLogin";
import { ContactCard } from "../moleculas/ContactCard";
import { RegistrarAdmin } from "../organismos/formularios/RegistrarAdmin";
import { Device } from "../../utilities/breakpoints";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaWhatsapp } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { useDispatch , useSelector} from "react-redux";
import { login } from '@mi-monorepo/common/store/auth'; // Ajusta la ruta según tu estructura
import { useMediaQuery } from 'react-responsive';
import { useLocation } from 'react-router-dom';

import logo from "../../assets/logo_atlasgo.png"; // tu icono

export function LoginTemplate() {
  const dispatch = useDispatch();
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
      console.log(data_user , "data user");
      dispatch(login({ user: data_user.user, token: data_user.user.token }));
      navigate("/");
    } catch (error) {
      setLoginError("Usuario o contraseña incorrectos");
    }
  }

  return (
    <Container>
      <div className="brand-row">
        <div className="brand">
          {logo && <img src={logo} alt="Atlas Go" className="brand-icon" />}
          <span className="brand-title">atlasgo</span>
        </div>
      </div>
      
      <div className="contentCard">
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
            bg="#f0f2f5"
            iconColor="#25d366"
            iconBg="#e8f5e9"
            linkColor="#25d366"
            linkHoverColor="#1ebc59"
          />
          <ContactCard
            icon={<SiGmail />}
            title="¿Prefieres correo?"
            link="mailto:soporte@tudominio.com"
            linkText="Escríbenos por Gmail"
            bg="#f0f2f5"
            iconColor="#d93025"
            iconBg="#fbe8e8"
            linkColor="#d93025"
            linkHoverColor="#b3140b"
          />
        </form>
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
  position: relative;
  overflow: hidden;
  padding: 20px;

  /* CAMBIO: Se anula el padding y el centrado en móvil */
  @media (max-width: 768px) {
    padding: 0;
    display: block; /* O display: flex; align-items: stretch; */
  }

  .contentCard {
    width: 100%;
    max-width: 450px;
    padding: 40px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    color: #333333;
    z-index: 1;
    display: flex; /* Se añade flex para centrar el contenido interno */
    flex-direction: column;
    justify-content: center; /* Centra el formulario verticalmente */

    /* CAMBIO: Se asegura que ocupe toda la pantalla en móvil */
    @media (max-width: 768px) {
      padding: 30px 25px;
      box-shadow: none;
      height: 100vh; /* Ocupa todo el alto */
      width: 100vw; /* Ocupa todo el ancho */
      max-width: none; /* Anula el max-width */
      border-radius: 0;
      overflow-y: auto; /* Permite scroll si el contenido es largo */
    }
  }

  .brand-row {
    position: absolute;
    top: 25px;
    left: 25px;
    z-index: 2;

    @media (max-width: 768px) {
      top: 20px;
      left: 20px;
    }
  }

  .brand {
    display: flex;
    align-items: center;
  }

  .brand-icon {
    width: 25px;
    height: 25px;
  }

  .brand-title {
    color: #333333;
    font-size: 1.1rem;
    font-weight: 500;
    margin-left: 5px;
  }

  .login-form {
    width: 100%;
  }
`;

const Titulo = styled.span`
  font-size: 28px;
  font-weight: 400;
  text-align: left;
  display: block;
  width: 100%;
  margin-bottom: 10px;
  color: #2c3e50;

  @media (max-width: 768px) {
    text-align: center;
    font-size: 24px;
  }
`;

const Frase = styled.p`
  color: #7f8c8d;
  font-size: 0.9rem;
  font-weight: 400;
  text-align: left;
  width: 100%;
  margin: 0 auto;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    text-align: center;
  }
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
  border-top: 1px solid #dcdcdc;
`;

const TextoStateInicio = styled.p`
  color: #e74c3c;
  text-align: left;
  font-size: 0.9rem;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    text-align: center;
  }
`;