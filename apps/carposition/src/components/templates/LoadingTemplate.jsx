import styled, { keyframes } from 'styled-components';
import logo from '../../assets/CarLogoModi.png';

// --- ANIMACIONES MINIMALISTAS ---

// ✨ Animación principal: un anillo que gira de forma suave y continua
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// ✨ Una aparición sutil para todo el conjunto
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// ✨ Un ligero deslizamiento hacia arriba para una entrada elegante
const slideUp = keyframes`
  from {
    transform: translateY(15px);
  }
  to {
    transform: translateY(0);
  }
`;


export const LoadingTemplate = () => {
    return (
        <Container>
            <ContentWrapper>
                {/* El logo ahora está dentro del spinner */}
                <Spinner>
                    <Logo src={logo} alt="CarPosition Logo" />
                </Spinner>
                <BrandName>CARPOSITION</BrandName>
            </ContentWrapper>
        </Container>
    );
};


// --- COMPONENTES ESTILIZADOS ---

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;

    // ✨ Fondo ultra limpio. Un gris muy claro, casi blanco.
    background-color: #F9F9F9;
    animation: ${fadeIn} 0.5s ease-out;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: ${slideUp} 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
`;

const Spinner = styled.div`
    position: relative;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 25px;

    // ✨ El anillo se crea con un borde. Es un truco de CSS muy moderno.
    &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        
        // El anillo está compuesto por dos colores para dar un punto de inicio
        border: 3px solid #E9ECEF; // El color base del círculo (muy claro)
        border-top-color: #DBCD51; // El color de tu marca que indica el progreso
        
        // La animación que lo hace girar
        animation: ${rotate} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    }
`;

const Logo = styled.img`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    // ✨ Una sombra muy sutil solo para definir el borde del logo
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
`;

const BrandName = styled.h1`
    font-size: 1.5rem; // Tamaño reducido para un look más refinado
    // ✨ Un peso de fuente más ligero es clave en el minimalismo moderno
    font-weight: 500; 
    color: #4A4A4A; // Un gris oscuro en lugar de negro puro
    
    // ✨ El espaciado entre letras (tracking) es fundamental
    letter-spacing: 4px; 
    text-transform: uppercase;
    margin: 0;
`;