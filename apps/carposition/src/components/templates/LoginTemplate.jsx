import styled from "styled-components";
import { Btnsave } from "../moleculas/Btnsave";
import { v } from "../../utilities/variables";
<<<<<<< HEAD
import { loginService } from "@mi-monorepo/common/services";
=======
import { InputText } from "../organismos/formularios/InputText";
import { loginService } from "../../services/AuthService.js";
>>>>>>> af598aa3 (modificaciones info card vehicle)
import CustomInput from "../organismos/formularios/InputTextCustom";
import Carousel from "../organismos/Carousel.jsx";
import { FooterLogin } from "../organismos/FooterLogin";
import { RegistrarAdmin } from "../organismos/formularios/RegistrarAdmin";
import { Device } from "../../utilities/breakpoints";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
<<<<<<< HEAD
import bannerImg from "../../assets/img_roadmap.png";
import logo from "../../assets/logo_atlasgo.png"; // tu icono
import { FaWhatsapp } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { useDispatch } from "react-redux";
import { login } from '@mi-monorepo/common/store/auth';
=======
import carrito2 from "../../assets/car_modelo_2025.png";
import carrito3 from "../../assets/truck_modelo_2025.png";
import logo from "../../assets/inventarioslogo.png";
import logo2 from "../../assets/icono_car.svg";
import { MdOutlineInfo } from "react-icons/md";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch,useSelector } from "react-redux";
import { login } from '../../store/slices/authSlice'; // Ajusta la ruta según tu estructura
>>>>>>> af598aa3 (modificaciones info card vehicle)
import { useMediaQuery } from 'react-responsive';
import { useLocation } from 'react-router-dom';



export function LoginTemplate() {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const location = useLocation();
  const [state, setState] = useState(false);
  const [loginError, setLoginError] = useState(""); // Estado para el mensaje de error
  const navigate = useNavigate();


  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  async function iniciar(data) {
    setLoginError(""); // Limpia el mensaje de error cada vez que intentas loguear

    const correo = data.correo.trim().replace(/\s+/g, "");
    const pass = data.pass.trim();

    try {
      const data_user = await loginService(correo, pass);

      dispatch(login({ user: data_user.user, token: data_user.user.token }));

      if (!isMobile || location.pathname === "/mapa-mobile") {
        console.log("escritorio");

        navigate("/dashboard");
      }else{
        console.log("mobile");
        navigate('/home-mobile');
      }
      
    } catch (error) {
      setLoginError("Usuario o contraseña incorrectos");
      // Si quieres usar el mensaje real del backend puedes hacer:
      // setLoginError(error?.message || "Usuario o contraseña incorrectos");
    }
  }

  const slides = [
    { image: carrito2, text: "Monitorea y protege tus vehículos en tiempo real con nuestro servicio de rastreo GPS confiable y eficiente." },
    { image: carrito3, text: "Optimiza la seguridad de tu flota con nuestro rastreo GPS preciso y en tiempo real. " },
    // Añade más objetos para más imágenes y textos si quieres
  ];

  return (
    <Container>
      <div className="contentLogo">
        <img src={logo2} alt="Logo" />
        <span>CarPosition</span>
      </div>

      <div className="bannerlateral">
        <Carousel slides={slides} />
      </div>

      <div className="contentCard">
        <div className="card">
          {state && <RegistrarAdmin setState={() => setState(!state)} />}
          <Titulo>Bienvenido</Titulo>
          {/* Mensaje de error */}
          {loginError && (
            <TextoStateInicio>{loginError}</TextoStateInicio>
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
              //icon={<v.iconopass />}
              register={register}
              name="pass"
              errors={errors}
            />
            <ContainerBtn>
              <Btnsave titulo="Iniciar" bgcolor="#DBCD51" />
              {/* <Btnsave
                funcion={() => setState(!state)}
                titulo="Crear cuenta"
                bgcolor="#ffffff"
              /> */}
            </ContainerBtn>
          </form>
        </div>
        <FooterLogin />
      </div>
    </Container>
  );
}

const Container = styled.div`
  background-size: cover;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #262626;
  @media ${Device.tablet} {
    grid-template-columns: 3fr 2fr;
  }
  .contentLogo {
    position: absolute;
    top: 15px;
    font-weight: 700;
    display: flex;
    left: 15px;
    align-items: center;
    color: #fff;

    img {
      width: 50px;
    }
  }
  .cuadros {
    transition: cubic-bezier(0.4, 0, 0.2, 1) 0.6s;
    position: absolute;
    height: 100%;
    width: 100%;
    bottom: 0;
    transition: 0.6s;
  }
  .bannerlateral {
    background-image: linear-gradient(to top, #FFEE57, #91872F);
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    .slick-slide img {
      width: 80%;
      margin: auto;
    }
  }
  .contentCard {
    grid-column: 2;
    background-color: #ffffff;
    background-size: cover;
    z-index: 100;
    position: relative;
    gap: 30px;
    display: flex;
    padding: 20px;
    box-shadow: 8px 5px 18px 3px rgba(0, 0, 0, 0.35);
    justify-content: center;
    width: auto;
    height: 100%;
    width: 100%;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    .card {
      padding-top: 120px;
      width: 100%;
      @media ${Device.laptop} {
        width: 60%;
      }
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
    .frase {
      color: #1D1D1D;
      font-size: 1rem;
      font-weight: 400;
      margin-bottom: 30px;
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
  }
  @keyframes flotar {
    0% {
      transform: translate(0, 0px);
    }
    50% {
      transform: translate(0, 15px);
    }
    100% {
      transform: translate(0, -0px);
    }
  }
`;
const Titulo = styled.span`
  font-size: 32px;
  font-weight: 700;
`;
const ContainerBtn = styled.div`
  margin-top: 15px;
  display: flex;
  width: 100%;
  justify-content: center;
`;
const TextoStateInicio = styled.p`
  color: #fc7575;
`;