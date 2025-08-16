import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';

// Datos
const data = [
  { name: 'Todos', value: 350, color: '#00A66E' },
  { name: 'Activos', value: 250, color: '#FFD600' },
  { name: 'Suspendidos', value: 50, color: '#FF4B4B' },
  { name: 'Bloqueado', value: 50, color: '#FF5530' }
];

const totalUnits = data.reduce((acc, item) => acc + item.value, 0);

const Container = styled.div`
  background: #1F1F1F;
  color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.10);
  padding: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  text-align: left;
  margin-bottom: 12px;

  @media (max-width: 765px) {
    text-align: center;
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
`;

const Description = styled.p`
  margin: 4px 0 0;
  font-size: 0.85rem;
  color: #bbb;
`;

const ContentRow = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  gap: 12px;

  @media (max-width: 765px) {
    flex-direction: column;
    align-items: center;
  }
`;

const LeftCol = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 765px) {
    align-items: center;
    border-bottom: 1px dashed #292929;
    padding-bottom: 10px;
  }
`;

const LegendList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LegendItem = styled.li`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LegendColor = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: ${props => props.color};
`;

const LegendLabel = styled.span`
  font-size: 0.88rem;
  color: #eee;
`;

const LegendValue = styled.span`
  font-size: 0.78rem;
  color: #aaa;
`;

const RightCol = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100%;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  max-width: 280px;
  max-height: 280px;

  @media (max-width: 765px) {
    max-width: 220px;
    max-height: 220px;
  }
`;

const scaleAnimation = css`
  animation: ${keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.08); }
    100% { transform: scale(1); }
  `} 0.3s ease;
`;

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
        css={scaleAnimation}
      />
    </g>
  );
};

// Label dinámico en el centro
const renderCenterLabel = ({ cx, cy, activeIndex }) => {
  const current = activeIndex !== null ? data[activeIndex] : { value: totalUnits, name: 'Total' };
  return (
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      dominantBaseline="middle"
      fill="#00e38c"
      fontSize="1.8rem"
      fontWeight="700"
    >
      {current.value}
      <tspan
        x={cx}
        y={cy + 22}
        fontSize="0.9rem"
        fill="#ccc"
        fontWeight="400"
      >
        {current.name}
      </tspan>
    </text>
  );
};

const GridStatusCar = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const onPieEnter = (_, index) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(null);

  return (
    <Container>
      <Header>
        <Title>Estado de Vehículos</Title>
        <Description>
          Consulta cuántos están activos, suspendidos o bloqueados en tiempo real.
        </Description>
      </Header>

      <ContentRow>
        {/* Se invierte el orden: primero la gráfica, luego el listado */}
        <RightCol>
          <ChartWrapper>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius="90%"
                  innerRadius="60%"
                  dataKey="value"
                  stroke="none"
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  labelLine={false}
                  label={(props) => renderCenterLabel({ ...props, activeIndex })}
                >
                  {data.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </RightCol>

        <LeftCol>
          <LegendList>
            {data.map((item, idx) => (
              <LegendItem key={item.name}>
                <LegendColor color={item.color} />
                <LegendLabel>{item.name}</LegendLabel>
                <LegendValue>{item.value}</LegendValue>
              </LegendItem>
            ))}
          </LegendList>
        </LeftCol>
      </ContentRow>
    </Container>
  );
};

export default GridStatusCar;