import React, { useState } from 'react';
import styled from 'styled-components';
import {
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from 'recharts';

const chartData = [
  { name: 'Reportando', value: 12 },
  { name: '>2h sin reportar', value: 7 },
  { name: '>6h sin reportar', value: 4 },
  { name: '>1 día sin reportar', value: 2 },
  { name: '>7 días sin reportar', value: 1 },
  { name: 'Sin reportar nunca', value: 3 }
];

const ChartContainer = styled.div`
  width: 100%;
  margin: auto;
  height: 100%;
  background: #1F1F1F;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 12px 12px 12px 12px;
  position: relative;
`;

const Title = styled.h3`
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.02em;
  margin-bottom: 12px;
`;

const CustomInfo = styled.div`
  width: 100%;
  text-align: left;
  color: #3DCF8E;
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 8px;
  min-height: 24px;
  padding: 0;
  background: none;
  border-radius: 0;
  box-shadow: none;
  display: flex;
  align-items: center;
`;

const GraphWrapper = styled.div`
  width: 100%;
  position: relative;
  flex: 1;
  display: flex;
`;

const GridFeatured = () => {
  const [activeBar, setActiveBar] = useState(null);

  const info = activeBar !== null
    ? chartData[activeBar].name
    : 'Selecciona una columna';

  return (
    <ChartContainer>
      <Title>Estado de reporte de unidades</Title>
      <CustomInfo>{info}</CustomInfo>
      <GraphWrapper>
        {/* La gráfica ocupará el resto del espacio disponible */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 12, left: 0, bottom: 18 }}
            barSize={28}
            onMouseLeave={() => setActiveBar(null)}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3DCF8E" />
                <stop offset="100%" stopColor="#1F1F1F" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#232323" />
            {/* Sin XAxis, Sin YAxis */}
            <Tooltip
              wrapperStyle={{ display: 'none' }}
              cursor={{ fill: 'rgba(61, 207, 142, 0.18)' }}
            />
            <Bar
              dataKey="value"
              fill="url(#barGradient)"
              radius={[0, 0, 0, 0]}
              onMouseOver={(_, index) => setActiveBar(index)}
            >
              <LabelList
                dataKey="value"
                position="top"
                fill="#fff"
                fontSize={15}
                fontWeight={700}
                offset={4}
                formatter={val => `${val}`}
                style={{ textShadow: "none" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </GraphWrapper>
    </ChartContainer>
  );
};

export default GridFeatured;