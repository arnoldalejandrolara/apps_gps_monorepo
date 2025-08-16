import styled from "styled-components";

export function FooterLogin() {
  return (
    <Container>
      <section className="lock">
        <span>
          Al continuar, acepta los{" "}
          <a href="/terminos" target="_blank" rel="noopener noreferrer">
            Términos de servicio
          </a>{" "}
          y la{" "}
          <a href="/privacidad" target="_blank" rel="noopener noreferrer">
            Política de privacidad
          </a>
          <br className="salto-desktop" />
          de <b>Supabase</b> y recibir correos electrónicos periódicos con
          <br className="salto-desktop" />
          actualizaciones.
        </span>
      </section>
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0 12px 0;
  
  .lock {
    width: 100%;
    max-width: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 18px;
    span {
      text-align: center;
      width: 100%;
      font-size: 11px;
      color: #91a4b7;
      line-height: 1.6;
      word-break: break-word;
      a {
        color: #91a4b7;
        text-decoration: underline;
        transition: color 0.2s;
        &:hover {
          color: #2f7352;
        }
      }
      b {
        color: #b4b4b4;
        font-weight: 600;
      }
      .salto-desktop {
        display: inline;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 0 0 10px 0;
    .lock {
      max-width: 98vw;
      padding: 0 6px;
      span {
        font-size: 10px;
        text-align: justify;
        .salto-desktop {
          display: none;
        }
      }
    }
  }

  @media (max-width: 480px) {
    .lock {
      max-width: 100vw;
      padding: 0 2px;
      span {
        font-size: 9.5px;
      }
    }
  }
`;