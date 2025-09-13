import styled, { keyframes } from 'styled-components';
import logo from '../../assets/logo_atlasgo.png';

// Animaciones minimalistas
const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const slideUp = keyframes`
    from { 
        opacity: 0; 
        transform: translateY(20px); 
    }
    to { 
        opacity: 1; 
        transform: translateY(0); 
    }
`;

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

export const LoadingTemplate = () => {
    return (
        <Container>
            <Content>
                <LogoContainer>
                    <Logo src={logo} alt="AtlasGo" />
                </LogoContainer>
                
                <BrandName>atlasgo</BrandName>
                
                <Spinner />
            </Content>
        </Container>
    );
};

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    animation: ${fadeIn} 0.5s ease-in-out;
`;

const LogoContainer = styled.div`
    animation: ${slideUp} 0.4s ease-out 0.1s both;
    margin-bottom: 16px;
`;

const Logo = styled.img`
    width: 60px;
    height: 60px;
    opacity: 0.9;
`;

const BrandName = styled.h1`
    font-size: 1.8rem;
    font-weight: 400;
    color: #2c3e50;
    margin: 0 0 32px 0;
    letter-spacing: 1px;
    animation: ${slideUp} 0.4s ease-out 0.2s both;
`;

const Spinner = styled.div`
    width: 32px;
    height: 32px;
    border: 2px solid #e9ecef;
    border-top: 2px solid #DBCD51;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
    animation-duration: 1.5s;
`;