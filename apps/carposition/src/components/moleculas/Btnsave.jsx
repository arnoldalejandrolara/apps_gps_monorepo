import styled from "styled-components";
import {Icono} from "../atomos/Icono.jsx";
export function Btnsave({ funcion, titulo, bgcolor, icono, url }) {
  return (
    <Container type="submit" $bgcolor={bgcolor}>
      <Icono>{icono}</Icono>
      <span className="btn" onClick={funcion}>
        <a href={url} target="_blank">
          {titulo}
        </a>
      </span>
    </Container>
  );
}

const Container = styled.button`
  display: flex;
  width: 100%;
  margin-top: 20px;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  border: none;
  background-color: initial;
  z-index: 2;
  .btn {
    width: 100%;
    background: #00311D;
    padding: 0.6em 1.3em;
    font-weight: 300;
    font-size: 16px;
    border: 1px solid #006328; /* verde oscuro, fuerte pero no brilloso */
    border-radius: 8px;
    transition: 0.2s;
    white-space: 1px;
    color: #000;
    a {
      text-decoration: none;
      color: #FFFFFF;
      font-size: 15px;
    }
    cursor: pointer;
    &:hover {
      background: #2F7352; /* tu color hover */
      // transform: translate(-0.05em, -0.05em);
      // box-shadow: 0.15em 0.15em #000;
    }
    &:active {
      transform: translate(0.05em, 0.05em);
      box-shadow: 0.05em 0.05em #000;
    }
  }
`;