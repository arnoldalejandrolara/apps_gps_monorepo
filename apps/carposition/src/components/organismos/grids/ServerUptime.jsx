import React from 'react';
import styled from 'styled-components';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- ESTILOS (Sin cambios, solo se renombra YearSelector) ---
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

const TimeRangeLabel = styled.div`
  padding: 6px 12px;
  font-size: 14px;
  color: #9CA3AF;
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
  padding-left: 18px;
  font-size: 16px;
  font-weight: 600;
  color: #F8FAFC;
`;


// --- COMPONENTE PRINCIPAL (Actualizado para Server Uptime) ---
export function ServerUptime({ title, subtitle, legendData, chartData }) {
  // Formateador para añadir '%' al tooltip
  const tooltipFormatter = (value, name, props) => {
    return [`${value}%`, name];
  }

  return (
    <>
      <Header>
        <TitleContainer>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </TitleContainer>
        <TimeRangeLabel>Last 30 days</TimeRangeLabel>
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
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 10, left: -15, bottom: 5 }}
        >
          {/* Definición de los gradientes con los colores correctos */}
          <defs>
            <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorBackup" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34D399" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#34D399" stopOpacity={0}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis 
            stroke="#9CA3AF" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            domain={['dataMin - 1', 100]} // Dominio para hacer zoom en el rango 98-100%
            tickFormatter={(value) => `${value}%`} // Añade el símbolo de % al eje
          />
          <Tooltip 
            formatter={tooltipFormatter} // Usa el formateador personalizado
            cursor={{ stroke: '#9CA3AF', strokeWidth: 1.5, strokeDasharray: '4 4' }}
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151', 
              borderRadius: '8px' 
            }} 
          />

          {/* Área para el Servidor Primario */}
          <Area 
            type="monotone" 
            dataKey="primary"
            stroke="#60A5FA" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrimary)" 
          />
          {/* Área para el Servidor de Respaldo */}
          <Area 
            type="monotone" 
            dataKey="backup"
            stroke="#34D399"
            strokeWidth={2} 
            fillOpacity={1} 
            fill="url(#colorBackup)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
}