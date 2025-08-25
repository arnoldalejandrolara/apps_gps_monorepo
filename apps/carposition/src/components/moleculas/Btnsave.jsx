import styled from "styled-components";
import {Icono} from "../atomos/Icono.jsx";
export function Btnsave({ funcion, titulo, bgcolor, icono,url }) {
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
  // gap: 10px;
  background-color:initial;
  z-index:2;
  .btn{
    width: 100%;
    background: ${(props)=>props.$bgcolor};
    padding: 0.6em 1.3em;
    font-weight: 300;
    font-size: 16px;
    // border: 3px solid black;
    border-radius: 0.4em;
    // box-shadow: 0.1em 0.1em #000;
    transition: 0.2s;
    white-space: 1px;
    color: #000;
    a{
      text-decoration:none;
      color: #FFFFFF;
    }
    cursor: pointer;
    &:hover{
      transform: translate(-0.05em, -0.05em);
      box-shadow: 0.15em 0.15em #000;
    }
    &:active{
      transform: translate(0.05em, 0.05em);
      box-shadow: 0.05em 0.05em #000;
    }
  }
  
`;