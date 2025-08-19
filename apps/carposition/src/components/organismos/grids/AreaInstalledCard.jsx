import React from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- ESTILOS PARA ESTA TARJETA ---
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
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

const YearSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid #374151;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
`;

const LegendAndTotals = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
`;

const LegendItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const LegendInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const Label = styled.span`
  font-size: 14px;
  color: #9CA3AF;
`;

const Value = styled.p`
  margin: 0;
  padding-left: 18px; /* Para alinear con el texto de la leyenda */
  font-size: 16px;
  font-weight: 600;
  color: #F8FAFC;
`;


// --- COMPONENTE PRINCIPAL ---
export function AreaInstalledCard({ title, subtitle, legendData, chartData }) {
  return (
    <>
      <Header>
        <TitleContainer>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </TitleContainer>
        <YearSelector>
          2023
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6L8 10L12 6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </YearSelector>
      </Header>

      <LegendAndTotals>
        {legendData.map(item => (
          <LegendItem key={item.name}>
            <LegendInfo>
              <Dot color={item.color} />
              <Label>{item.name}</Label>
            </LegendInfo>
            <Value>{item.total}</Value>
          </LegendItem>
        ))}
      </LegendAndTotals>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 5, left: -25, bottom: 5 }} // Ajuste para alinear eje Y
          barGap={10}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }}
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151', 
              borderRadius: '8px' 
            }} 
          />
          {/* Ocultamos la leyenda de recharts porque creamos una personalizada */}
          <Legend 
            content={() => null} // Oculta la leyenda de recharts
            wrapperStyle={{ display: 'none' }} // Asegura que no se muestre nada
          />

          {/* Las barras apiladas */}
          <Bar dataKey="asia" stackId="a" fill="#22C55E" barSize={20} />
          <Bar dataKey="europe" stackId="a" fill="#FACC15" barSize={20} />
          <Bar dataKey="americas" stackId="a" fill="#67E8F9" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}