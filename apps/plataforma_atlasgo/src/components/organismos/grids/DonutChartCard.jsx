import React, { useState } from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// --- ESTILOS PARA LA TARJETA ---
const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%; 
  color: #E2E8F0;
`;

const Header = styled.div`
  margin-bottom: 24px;
  flex-shrink: 0; /* Evita que el header se encoja */
`;

const Title = styled.h2`
  margin: 0;
  font-weight: 400;
  font-size: 16px;
  color: #F8FAFC;
`;

const Subtitle = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  color: #9CA3AF;
`;

// 1. SE MODIFICA EL CONTENEDOR DE LA GRÁFICA
const ChartWrapper = styled.div`
  flex-grow: 1; /* Hace que este contenedor ocupe el espacio sobrante */
  display: flex; /* Lo convierte en un contenedor flex */
  align-items: center; /* Centra su contenido verticalmente */
  justify-content: center; /* Centra su contenido horizontalmente */
  position: relative; /* Mantiene la posición relativa para el texto absoluto */
`;

const CenterText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
`;

const TotalValue = styled.p`
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #F8FAFC;
`;

const TotalLabel = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  color: #9CA3AF;
`;

const SeparatorLine = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px dashed #374151;
  margin: 16px 0;
  flex-shrink: 0; /* Evita que la línea se encoja */
`;

const DataLabelsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 0 16px;
  justify-content: center;
  flex-shrink: 0; /* Evita que las etiquetas se encojan */
`;

const DataLabel = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #9CA3AF;
`;

const ColorIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
`;

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: '#1F2937',
        border: '1px solid #374151',
        borderRadius: '8px',
        padding: '8px 12px',
        color: '#E2E8F0'
      }}>
        <p>{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};


// --- COMPONENTE PRINCIPAL ---
export function DonutChartCard({ title, subtitle, data, totalValue }) {
  const [activeEntry, setActiveEntry] = useState(null);

  const handleMouseEnter = (data, index) => {
    setActiveEntry(data);
  };

  const handleMouseLeave = () => {
    setActiveEntry(null);
  };

  return (
    <CardWrapper>
      {/* 1. SECCIÓN SUPERIOR */}
      <Header>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
      </Header>

      {/* 2. SECCIÓN DE EN MEDIO (CENTRADA) */}
      <ChartWrapper>
        {/* Este nuevo div tiene el tamaño fijo para la gráfica */}
        <div style={{ width: '220px', height: '220px', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart onMouseLeave={handleMouseLeave}>
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'transparent' }}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="75%"
                outerRadius="100%"
                dataKey="value"
                stroke="none"
                paddingAngle={2}
                onMouseEnter={handleMouseEnter}
              >
                {data.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <CenterText>
            {activeEntry ? (
              <>
                <TotalLabel>{activeEntry.name}</TotalLabel>
                <TotalValue>{activeEntry.value}</TotalValue>
              </>
            ) : (
              <>
                <TotalLabel>Total</TotalLabel>
                <TotalValue>{totalValue}</TotalValue>
              </>
            )}
          </CenterText>
        </div>
      </ChartWrapper>
      
      {/* 3. SECCIÓN INFERIOR */}
      <SeparatorLine />
      <DataLabelsWrapper>
        {data.map((item) => (
          <DataLabel key={item.name}>
            <ColorIndicator style={{ backgroundColor: item.color }} />
            {item.name}
          </DataLabel>
        ))}
      </DataLabelsWrapper>
    </CardWrapper>
  );
}