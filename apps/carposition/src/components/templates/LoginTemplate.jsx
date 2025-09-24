import React, { useState } from "react";
import styled from "styled-components";
import { Btnsave } from "../moleculas/Btnsave";
import { v } from "../../utilities/variables";
import { loginService } from "@mi-monorepo/common/services";
import CustomInput from "../organismos/formularios/InputTextCustom";
import { FooterLogin } from "../organismos/FooterLogin";
import { MdOutlineInfo } from "react-icons/md";
import { RegistrarAdmin } from "../organismos/formularios/RegistrarAdmin";
import { Device } from "../../utilities/breakpoints";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch , useSelector} from "react-redux";
import { login } from '@mi-monorepo/common/store/auth'; // Ajusta la ruta según tu estructura
import { useMediaQuery } from 'react-responsive';
import { useLocation } from 'react-router-dom';
import logo from "../../assets/CarLogoModi.png"; // tu icono
import carrito2 from "../../assets/car_modelo_2025.png";
import carrito3 from "../../assets/truck_modelo_2025.png";
import Carousel from "../organismos/Carousel.jsx";

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

  // --- LÓGICA ORIGINAL SIN MODIFICACIONES ---
  async function iniciar(data) {
    setLoginError("");

    const correo = data.correo.trim().replace(/\s+/g, "");
    const pass = data.pass.trim();

    try {
      const data_user = await loginService(correo, pass);

      dispatch(login({ user: data_user.user, token: data_user.user.token }));

      if (!isMobile || location.pathname === "/mapa-mobile") {
        navigate("/");
      } else {
        navigate('/home-mobile');
      }
      
    } catch (error) {
      setLoginError("Usuario o contraseña incorrectos");
    }
  }

  const slides = [
    { image: carrito2, text: "Monitorea y protege tus vehículos en tiempo real con nuestro servicio de rastreo GPS confiable y eficiente." },
    { image: carrito3, text: "Optimiza la seguridad de tu flota con nuestro rastreo GPS preciso y en tiempo real. " },
  ];

  return (
    <Container>
      <div className="contentLogo">
        <img src={logo} alt="Logo" />
        <span>CarPosition</span>
      </div>

      <div className="bannerlateral">
        <Carousel slides={slides} />
      </div>

      <div className="contentCard">
        <div className="card">
          {state && <RegistrarAdmin setState={() => setState(!state)} />}
          <Titulo>Bienvenido</Titulo>

          {/* Mensaje de error con el nuevo estilo visual */}
          {loginError && (
            <TextoStateInicio>
              <MdErrorOutline />
              <span>{loginError}</span>
            </TextoStateInicio>
          )}

          <span className="ayuda">
            Puedes crear una cuenta nueva ó <br />
            solicitar a tu empleador una. <MdOutlineInfo />
          </span>
          <p className="frase">Iniciar sesión en Carposition</p>
          <form onSubmit={handleSubmit(iniciar)}>
            <CustomInput
              label="Usuario"
              label_inside="Ingrese su usuario"
              type="text"
              icon={<v.iconoemail />}
              register={register}
              name="correo"
              errors={errors}
            />
            <CustomInput
              label="Contraseña"
              label_inside="Ingrese su contraseña"
              type="password"
              register={register}
              name="pass"
              errors={errors}
            />
            <ContainerBtn>
              <Btnsave titulo="Iniciar" bgcolor="#DBCD51" />
            </ContainerBtn>
          </form>
        </div>
        <FooterLogin />
      </div>
    </Container>
  );
}

// --- ESTILOS VISUALES MEJORADOS ---

const Container = styled.div`
  /* ✨ Se añade una fuente más profesional. 
     Asegúrate de importarla en tu index.html o con un @import en tu css global. 
     Ej: <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet"> */
  font-family: 'Poppins', sans-serif;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  justify-content: center;
  background-color: #1F1F1F; // Un negro un poco más suave
  
  @media ${Device.tablet} {
    grid-template-columns: 1fr 1fr; // Proporción 1:1 para un look más balanceado
  }
  @media ${Device.laptop} {
    grid-template-columns: 3fr 2fr;
  }

  .contentLogo {
    position: absolute;
    top: 20px;
    left: 25px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #fff;
    font-weight: 500;
    font-size: 1.2rem;
    z-index: 20;
    img {
      width: 40px;
    }
  }

  .bannerlateral {
    // ✨ Degradado más sutil y moderno
    background-image: linear-gradient(135deg, #E6D75A, #B4A942);
    height: 100vh;
    display: none; // Oculto en móvil por defecto
    padding: 2rem;
    
    @media ${Device.tablet} {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .slick-slide img {
      width: 80%;
      margin: auto;
      // ✨ Se añade un filtro sutil para integrar mejor la imagen
      filter: drop-shadow(0 25px 25px rgb(0 0 0 / 0.25));
    }
  }

  .contentCard {
    background-color: #ffffff;
    z-index: 10;
    position: relative;
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    padding: 2.5rem;
    
    // ✨ Sombra más suave y profesional
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
  }

  .card {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px; // Límite para que no se estire demasiado
    text-align: left;
    margin: auto 0;
  }

  .ayuda {
    position: absolute;
    top: 25px;
    right: 25px;
    color: #AAAAAA;
    font-size: 0.8rem;
    font-weight: 400;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .frase {
    color: #757575;
    font-size: 1rem;
    font-weight: 400;
    margin-bottom: 2rem;
  }
`;

const Titulo = styled.h1` // ✨ Usar h1 para semántica
  font-size: 2.2rem;
  font-weight: 700;
  color: #212121;
  margin-bottom: 0.5rem;
`;

const ContainerBtn = styled.div`
  margin-top: 2rem;
  display: flex;
  width: 100%;
  justify-content: center;
`;

const TextoStateInicio = styled.div` // ✨ Estilos mejorados para el contenedor de error
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  background-color: #FFF2F2;
  color: #C02E2E;
  border: 1px solid #FFD6D6;
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  font-weight: 500;

  svg {
    font-size: 1.2rem;
    flex-shrink: 0; // Evita que el ícono se encoja
  }
`;