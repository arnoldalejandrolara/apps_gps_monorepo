import React from 'react';
import styled from 'styled-components';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mantén los datos como están
const data = [
  { name: 'Todos', value: 80, color: '#00A66E' },
  { name: 'Activos', value: 90, color: '#FFD600' },
  { name: '+2h sin reportar', value: 88, color: '#FFB300' },
  { name: '+6h sin reportar', value: 79, color: '#FF8000' },
  { name: '+1 día sin reportar', value: 60, color: '#FF4B4B' },
  { name: '+7 días sin reportar', value: 85, color: '#B32424' },
  { name: 'Sin reportar', value: 80, color: '#7B1FA2' }
];

// Modern, minimal container
const Container = styled.div`
  background: linear-gradient(115deg, #1F1F1F 60%, #232323 100%);
  color: #fff;
  border-radius: 14px;
  padding: 20px 10px 20px 10px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
  transition: box-shadow 0.25s;

  &:hover {
    box-shadow: 0 10px 40px rgba(0,0,0,0.22);
  }

  @media (max-width: 700px) {
    padding: 16px 6vw;
    border-radius: 8px;
  }
`;

const Title = styled.h3`
  color: #F7F7F7;
  margin: 0 0 4px 0;
  font-size: 1.08rem;
  font-weight: 700;
  text-align: left;
  letter-spacing: 0.6px;

  @media (max-width: 700px) {
    text-align: center;
    margin-bottom: 6px;
    font-size: 1rem;
  }
`;

const Description = styled.div`
  font-size: 0.83rem;
  color: #A6A6A6;
  margin-bottom: 20px;
  margin-top: 0;
  text-align: left;
  font-weight: 400;
  letter-spacing: 0.2px;

  @media (max-width: 700px) {
    text-align: center;
    margin-bottom: 14px;
    font-size: 0.78rem;
  }
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 240px;
  margin-top: 2px;

  @media (max-width: 1100px) {
    height: 200px;
  }
  @media (max-width: 700px) {
    height: 140px;
  }
`;

// Tooltip minimalista
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "rgba(35,35,35,0.97)",
          color: "#F7F7F7",
          borderRadius: 8,
          padding: "10px 18px",
          border: "1px solid #333",
          fontSize: "0.74em",
          boxShadow: "0 2px 14px rgba(0,0,0,0.12)"
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 2 }}>{label}</div>
        <span style={{ color: "#00A66E", fontWeight: 500 }}>{payload[0].value}</span>
      </div>
    );
  }
  return null;
};

// Paleta moderna para el gradiente de área
const gradientId = "colorAreaGradient";

const GridSinReportar = () => (
  <Container>
    <Title>Unidades sin Reportar</Title>
    <Description>
      Visualiza cuántas unidades no han reportado en distintos rangos de tiempo.
    </Description>
    <ChartWrapper>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 18, left: 0, bottom: 18 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="10%" stopColor="#00A66E" stopOpacity={0.42}/>
              <stop offset="80%" stopColor="#232323" stopOpacity={0.12}/>
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            tick={{ fill: "#C2C2C2", fontSize: 12, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            interval={0}
            angle={-14}
            textAnchor="end"
          />
          <YAxis
            tick={{ fill: "#C2C2C2", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            minTickGap={8}
            allowDecimals={false}
            label={{
              value: "Unidades",
              angle: -90,
              position: "insideLeft",
              fill: "#A6A6A6",
              fontSize: 12,
              dy: -5
            }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "#444", strokeDasharray: "2 2" }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#00A66E"
            strokeWidth={3}
            fill={`url(#${gradientId})`}
            fillOpacity={1}
            activeDot={{ r: 5, fill: "#FFD600", stroke: "#00A66E", strokeWidth: 2 }}
            dot={{ r: 3, fill: "#00A66E" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  </Container>
);

export default GridSinReportar;