import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { CiViewTable } from "react-icons/ci";
import { CustomSelect } from '../formularios/CustomSelect.jsx';
import {Reporte} from '../../organismos/reportes/reporte.jsx';

export function ReportsMobile() {
  const [selectedReport, setSelectedReport] = useState('');

  const [reports] = useState({
    'Reportes': ['Historial'],
  });

  // Transforma los datos para que sean compatibles con CustomSelect
  const reportOptions = Object.values(reports).flat().map(report => ({
    id: report.toLowerCase().replace(/\s+/g, '-'),
    value: report,
    label: report,
    name: report,
  }));

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const navigate = useNavigate();

  // Mapa de componentes (reemplaza el string con tu componente real)
  const reportComponents = {
    'historial': <Reporte />,
  };

  // Maneja el cambio de selección en el CustomSelect
  const handleReportChange = (reportValue) => {
    console.log('Reporte seleccionado:', reportValue);
    setSelectedReport(reportValue);
  };

  return (
    <Container>
      <HeaderContainer>
        <ReportSelectorContainer>
          <CustomSelect
            showSearch={false}
            label="" // El placeholder del select
            options={reportOptions}
            value={selectedReport}
            onChange={handleReportChange}
          />
        </ReportSelectorContainer>
      </HeaderContainer>

      <HorizontalLine />

      <Content>
        {selectedReport ? (
          reportComponents[selectedReport] || (
            <p>El componente para "{selectedReport}" no está disponible.</p>
          )
        ) : (
          <EmptyState>
            <CiViewTable size={40} color="#adb5bd" />
            <EmptyText>Selecciona un reporte para ver la información</EmptyText>
          </EmptyState>
        )}
      </Content>
    </Container>
  );
}

// --- Estilos ---

const EmptyState = styled.div`
  flex: 1 1 0%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  gap: 10px;
  background: #ffffff; /* --- TEMA CLARO --- */
  border-radius: 12px;
  border: 1px dashed #dee2e6; /* Borde sutil para el estado vacío */
`;

const EmptyText = styled.div`
  font-size: 15px;
  margin-top: 10px;
  color: #6c757d; /* --- TEMA CLARO --- */
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  min-height: 0;
  min-width: 0;
  padding: 5px 15px;
  box-sizing: border-box;
  background: #f8f9fa; /* --- TEMA CLARO --- */
  overflow: hidden;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  margin: 5px 0;
  padding: 10px 0px;
`;

const ReportSelectorContainer = styled.div`
  width: 300px;
  z-index: 10;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const HorizontalLine = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid #dee2e6; /* --- TEMA CLARO --- */
  margin: 0 0 12px 0;
`;

const Content = styled.div`
  flex: 1;
  font-size: 14px;
  color: #212529; /* --- TEMA CLARO --- */
  display: flex;
  flex-direction: column;
  text-align: center;
  min-height: 0;
  overflow: hidden;
  justify-content: center;
`;