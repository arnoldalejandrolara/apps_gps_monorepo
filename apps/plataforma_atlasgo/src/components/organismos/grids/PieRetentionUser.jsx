import React from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// --- ESTILOS ---
const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%; 
  color: #E2E8F0;
`;

const Header = styled.div`
  margin-bottom: 24px;
  flex-shrink: 0;
`;

const Title = styled.h2`
  margin: 0;
  font-weight: 600;
  font-size: 18px;
  color: #F8FAFC;
`;

const Subtitle = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  color: #9CA3AF;
`;

const ChartWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const SeparatorLine = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px dashed #374151;
  margin: 16px 0;
  flex-shrink: 0;
`;

const DataLabelsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 0 16px;
  justify-content: center;
  flex-shrink: 0;
`;

const DataLabel = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #9CA3AF;
`;

const ColorIndicator = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
`;

// --- TOOLTIP CORREGIDO Y SIMPLIFICADO ---
const CustomTooltip = ({ active, payload }) => {
  // Solo necesitamos verificar que el tooltip esté activo y tenga datos.
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div style={{
        backgroundColor: '#1F2937',
        border: '1px solid #374151',
        borderRadius: '8px',
        padding: '8px 12px',
        color: '#E2E8F0'
      }}>
        {/* Mostramos el 'name' y el 'value', que son datos fiables. */}
        <p>{`${data.name}: ${data.value}`}</p>
      </div>
    );
  }

  return null;
};


// --- COMPONENTE PRINCIPAL ---
export function PieRetentionUser({ title, subtitle, data }) {
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent }) => {
    const radius = outerRadius * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={600}>
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <CardWrapper>
      <Header>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </Header>
      
      <ChartWrapper>
        <div style={{ width: '280px', height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius="90%"
                dataKey="value"
                stroke="none"
                paddingAngle={1}
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {data.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ChartWrapper>
      
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