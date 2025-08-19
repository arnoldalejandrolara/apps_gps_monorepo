import styled from "styled-components";
import filterMail from "../../../assets/filter_Mail.svg";
import inbox from "../../../assets/Inbox.svg";
import { v } from "../../../utilities/variables";

export function Eventos({ state, setState }) {
  return (
    <Main $isopen={state.toString()}>
      <Container $isopen={state.toString()} className={state ? "active" : ""}>
        <div className="Header">
          <h4>Eventos</h4>
          <div className="FilterIcon">
            <img src={filterMail} alt="Filter" />
          </div>
        </div>
        {state && (
          <div className="Content">
            <img src={inbox} alt="inbox" />
            <h4>Sin notificaciones por el momento</h4>
            <p>Recibirás una notificación aquí cuando tus unidades hagan alguna acción que tú programes</p>
          </div>
        )}
      </Container>
    </Main>
  );
}

const Container = styled.div`
  color: ${(props) => props.theme.text};
  background: ${(props) => props.theme.bg};
  position: fixed;
  padding-top: 20px;
  z-index: 1;
  height: 100%;
  width: 0px;
  border-left: 1px solid ${(props) => props.theme.bg4};
  transition: 0.1s ease-in-out;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 6px;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.colorScroll};
    border-radius: 10px;
  }

  &.active {
    width: 380px;
  }

  .Header {
    display: flex;
    justify-content: space-between; /* Space between title and icon */
    align-items: center;
    padding: 0 20px;
    h4 {
      margin: 0;
      font-weight: 500;
    }
    .FilterIcon {
      cursor: pointer;
      img {
        width: 24px;
        height: 24px;
      }
    }
  }

  .Content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: calc(100% - 60px); /* Adjust height based on header height */
    text-align: center; /* Center the text */
    img {
      width: 50px;
      margin-bottom: 15px;
    }
    h4 {
      margin: 10px 0;
      font-size: 14px; /* Reduced font size */
      font-weight: 500;
    }
    p {
      font-size: 12px; /* Reduced font size */
      color: ${(props) => props.theme.colorSubtitle};
      padding: 0 10px;
    }
  }

  @media (max-width: 768px) {
    .active {
      width: 300px; /* Adjust width for smaller screens */
    }
    .Content {
      img {
        width: 50px; /* Adjust image size for smaller screens */
      }
      h4 {
        font-size: 14px; /* Further reduced font size for smaller screens */
      }
      p {
        font-size: 10px; /* Further reduced font size for smaller screens */
      }
    }
  }

  @media (max-width: 480px) {
    .active {
      width: 220px; /* Adjust width for smaller screens */
    }
    .Content {
      img {
        width: 40px; /* Adjust image size for smaller screens */
      }
      h4 {
        font-size: 12px; /* Further reduced font size for smaller screens */
      }
      p {
        font-size: 8px; /* Further reduced font size for smaller screens */
      }
    }
  }
`;

const Main = styled.div`
  .Sidebarbutton {
    position: fixed;
    top: 70px;
    left: 42px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${(props) => props.theme.bgtgderecha};
    box-shadow: 0 0 4px ${(props) => props.theme.bg3},
      0 0 7px ${(props) => props.theme.bg};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    z-index: 2;
    transform: ${({ $isopen }) =>
      $isopen==="true" ? `translateX(162px) rotate(3.142rad)` : `initial`};
    color: ${(props) => props.theme.text};
  }
`;