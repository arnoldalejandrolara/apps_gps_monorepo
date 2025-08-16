import React, { useState } from "react";
import styled from "styled-components";
import { FaDownload } from "react-icons/fa";
import Swal from "sweetalert2";

const ExportarModal = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  const handleExport = () => {
    if (selectedFormat) {
      Swal.fire({
        icon: "success",
        title: "Descarga iniciada",
        text: `Se iniciará la descarga en formato: ${selectedFormat}`,
        theme: "dark",
      });
      console.log(`Exportando en formato: ${selectedFormat}`);
      setModalOpen(false); // Cierra el modal después de exportar
      setShowWarning(false); // Oculta la advertencia
    } else {
      setShowWarning(true); // Muestra la advertencia
    }
  };

  const handleCancel = () => {
    // Swal.fire({
    //   icon: "info",
    //   title: "Operación cancelada",
    //   text: "La exportación se ha cancelado.",
    //   theme: "dark",
    // });
    setModalOpen(false);
    setShowWarning(false); // Oculta la advertencia al cancelar
  };

  return (
    <>
      <ExportButton onClick={() => setModalOpen(true)}>
        <FaDownload style={{ marginRight: 8 }} />
        Exportar
      </ExportButton>

      {modalOpen && (
        <ModalOverlay>
          <ModalContent>
            <h4>Seleccione el formato de exportación</h4>
            <Description>
              Según el tiempo seleccionado en el filtro, la descarga puede tardar unos momentos.
            </Description>
            {showWarning && (
              <WarningText>
                Por favor seleccione un tipo de archivo.
              </WarningText>
            )}
            <Select
              value={selectedFormat}
              onChange={(e) => {
                setSelectedFormat(e.target.value);
                setShowWarning(false); // Oculta la advertencia al seleccionar un formato
              }}
            >
              <option value="" disabled>
                Seleccionar formato
              </option>
              <option value="Excel">Excel</option>
              <option value="CSV">CSV</option>
            </Select>
            <ButtonContainer>
              <CancelButton onClick={handleCancel}>
                Cancelar
              </CancelButton>
              <AcceptButton onClick={handleExport}>Descargar</AcceptButton>
            </ButtonContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

// Estilos
const ExportButton = styled.button`
  padding: 10px 20px;
  background: transparent;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
  transition: background 0.3s, transform 0.2s;

  &:hover {
    background: #3d3d3d;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #2c2c2c;
  color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;

  h4 {
    margin-bottom: 20px;
  }
`;

const WarningText = styled.p`
  font-size: 13px;
  color: #FF5530;
  font-weight: 500;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 14px;
  color: #bbb;
  margin-bottom: 20px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #444;
  border-radius: 8px;
  margin-bottom: 20px;
  background: #3d3d3d;
  color: #fff;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background: #444;
  color: #FF5530;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #555;
  }
`;

const AcceptButton = styled.button`
  padding: 10px 20px;
  background: #444;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #555;
  }
`;

export default ExportarModal;