import React, { useState, useRef } from "react";
import styled from "styled-components";
import { FiHelpCircle } from "react-icons/fi";
import { GrCubes } from "react-icons/gr";
import logo from "../assets/logo_atlasgo.png";
import { GoInbox } from "react-icons/go";
import { FiDownload } from "react-icons/fi";
import FloatingModal from "./organismos/ModelScreenConfig/FloatingModal";
import Tooltip from '@mui/material/Tooltip';
import { AiOutlinePushpin } from "react-icons/ai";
import { IoShapesOutline } from "react-icons/io5";

export function Navbar() {
  const username = "Arnold";
  const initial = username.charAt(0).toUpperCase();
  const userRole = "admin";

  const [helpModal, setHelpModal] = useState({ open: false, position: null });
  const [inboxModal, setInboxModal] = useState({ open: false, position: null });

  const [geofencesActive, setGeofencesActive] = useState(false);
  const [pdiActive, setPdiActive] = useState(false);

  const helpBtnRef = useRef(null);
  const inboxBtnRef = useRef(null);
  const downloadBtnRef = useRef(null);

  const toggleHelpModal = () => {
    if (helpModal.open) {
      setHelpModal({ open: false, position: null });
    } else {
      const rect = helpBtnRef.current.getBoundingClientRect();
      setHelpModal({
        open: true,
        position: {
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height
        }
      });
      setInboxModal({ open: false, position: null });
    }
  };

  const toggleInboxModal = () => {
    if (inboxModal.open) {
      setInboxModal({ open: false, position: null });
    } else {
      const rect = inboxBtnRef.current.getBoundingClientRect();
      setInboxModal({
        open: true,
        position: {
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height
        }
      });
      setHelpModal({ open: false, position: null });
    }
  };

  // Acción de descargar
  const handleDownloadClick = () => {
    // Aquí puedes poner la lógica de descarga
    // window.open(url, "_blank");
    alert("Descargando...");
  };

   // 3. AÑADIR FUNCIONES PARA LOS NUEVOS BOTONES
   const toggleGeofences = () => {
    setGeofencesActive(!geofencesActive);
    // Aquí iría la lógica para mostrar/ocultar geocercas en el mapa
  };

  const togglePdi = () => {
    setPdiActive(!pdiActive);
    // Aquí iría la lógica para mostrar/ocultar PDI en el mapa
  };

  return (
    <>
      <NavbarContainer>
        <div className="navbar-content">
          <div className="brand">
            <span className="logo">
              <img src={logo} alt="Atlas Go" className="brand-icon" />
            </span>
            <span className="brand-slash">/</span>
            <span className="brand-cubes">
              <GrCubes className="brand-cubes-icon" />
            </span>
            <span className="username">{username}</span>
            <span className={`user-role ${userRole === "admin" ? "admin" : "normal"}`}>
              {userRole === "admin" ? "Administrador" : "Usuario"}
            </span>
          </div>

          <div className="actions">

          <div className="actions-group map-tools-group">
              <Tooltip title="Geocercas" arrow placement="bottom">
                <div
                  className={`action-btn ${geofencesActive ? "selected" : ""}`}
                  onClick={toggleGeofences}
                >
                  <IoShapesOutline className="icon" />
                </div>
              </Tooltip>
              <Tooltip title="Puntos de Interés" arrow placement="bottom">
                <div
                  className={`action-btn ${pdiActive ? "selected" : ""}`}
                  onClick={togglePdi}
                >
                  <AiOutlinePushpin className="icon" />
                </div>
              </Tooltip>
            </div>

            <div className="actions-group">
              <Tooltip title="Ayuda" arrow placement="bottom">
                <div
                  className={`action-btn ${helpModal.open ? "selected" : ""}`}
                  ref={helpBtnRef}
                  onClick={toggleHelpModal}
                >
                  <FiHelpCircle className="icon" />
                </div>
              </Tooltip>

              <Tooltip title="Descargar app" arrow placement="bottom">
              <div
                className="action-btn"
                ref={downloadBtnRef}
                onClick={handleDownloadClick}
              >
                <FiDownload className="icon" />
              </div>
              </Tooltip>

              <Tooltip title="Bandeja" arrow placement="bottom">
                <div
                  className={`action-btn ${inboxModal.open ? "selected" : ""}`}
                  ref={inboxBtnRef}
                  onClick={toggleInboxModal}
                >
                  <GoInbox className="icon" />
                </div>
              </Tooltip>
              
            </div>
            <span className="user-circle">{initial}</span>
          </div>
        </div>
      </NavbarContainer>

      {/* MODAL DE AYUDA */}
      <FloatingModal
        open={helpModal.open}
        onClose={() => setHelpModal({ open: false, position: null })}
        anchorPosition={helpModal.position}
        direction="left"
        variant="help"
      />

      <FloatingModal
        open={inboxModal.open}
        onClose={() => setInboxModal({ open: false, position: null })}
        anchorPosition={inboxModal.position}
        direction="left"
        variant="inbox"
      />
    </>
  );
}

// Estilos actualizados
const iconColor = "#b4b4b4";
const hoverBg = "#323232";
const selectedBg = "#2a2a5a";
const selectedPillBg = "#2070ff";

const NavbarContainer = styled.nav`
  width: 100%;
  min-height: 47px;
  background: #171717;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-bottom: 1px solid #373737;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 999;

  .navbar-content {
    width: 100%;
    max-width: 1440px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.18rem;
    font-weight: 600;
    letter-spacing: 1px;
  }

  .logo .brand-icon {
    height: 25px;
    width: 25px;
    object-fit: contain;
    margin-right: 2px;
  }

  .brand-slash {
    color: #4a4a4a;
    font-size: 14px;
    font-weight: 200;
    margin: 0 3px;
    user-select: none;
  }

  .brand-cubes .brand-cubes-icon {
    width: 14px;
    height: 14px;
    font-size: 18px;
    color: ${iconColor};
  }

  .username {
    font-size: 14px;
    font-weight: 500;
    color: #e1e1e1;
  }

  .user-role {
    font-size: 10px;
    font-weight: 500;
    margin-left: 8px;
    padding: 2px 9px;
    border-radius: 8px;
    background: #222;
    color: #b3e1ff;
    border: 1px solid #174b70;

    &.admin {
      background: #2A2319;
      color: #DB8D01;
      border-color: #6E3B08;
    }
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .actions-group {
    display: flex;
    align-items: center;
    border: 1px solid #373737;
    border-radius: 16px;
    overflow: hidden;
  }

  .map-tools-group {
    border: none; /* Quitamos el borde contenedor */
    gap: 8px; /* Espacio entre los botones individuales */
    overflow: visible;
  }

  .map-tools-group .action-btn {
    border: 1px solid #373737; /* Cada botón tiene su propio borde */
    border-radius: 16px; /* Y su propio borde redondeado */

    &.selected {
      background: ${selectedPillBg}; /* Color de fondo sólido al seleccionar */
      border-color: ${selectedPillBg}; /* El borde toma el mismo color */

      .icon {
        color: #fff; /* El ícono se vuelve blanco para mayor contraste */
      }
    }
  }

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 30px;
    cursor: pointer;
    transition: background 0.14s;

    &:hover {
      background: ${hoverBg};
    }

    &.selected {
      background: ${hoverBg};
    }
  }

  .icon {
    width: 18px;
    height: 18px;
    color: ${iconColor};
  }

  .user-circle {
    background: #2070ff;
    color: #fff;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 1rem;
    margin-left: 12px;
  }
`;
