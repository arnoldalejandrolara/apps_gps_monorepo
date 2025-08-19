import React from 'react';
import styled from 'styled-components';

import { ArrowDownIcon , ArrowUpIcon } from '../../atomos/Icono';
import { SparklineChart } from '../../moleculas/SparklineChart';

// Estilos específicos de la tarjeta
const CardContainer = styled.div`
  background: #1F1F1F;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: #E2E8F0;
  grid-column: span 1;
  height: 165px;
  box-sizing: border-box;
`;
const CardTitle = styled.p`margin: 0; font-size: 13px; font-weight: 500; color: white;`;
const CardBody = styled.div`display: flex; justify-content: space-between; align-items: center;`;
const CardValue = styled.h2`margin: 0; font-size: 30px; font-weight: 500; color: #F8FAFC;`;
const CardFooter = styled.div`display: flex; align-items: center; gap: 6px;`;
const PercentageChange = styled.span`font-size: 14px; font-weight: 600; color: ${props => (props.isPositive ? '#34D399' : '#F87171')};`;
const FooterText = styled.span`font-size: 14px; color: #94A3B8;`;

export function StatCard({ title, value, change, chartData, chartColor }) {
  const isPositive = change >= 0;
  return (
    <CardContainer>
      <CardTitle>{title}</CardTitle>
      <CardBody>
        <CardValue>{new Intl.NumberFormat('en-US').format(value)}</CardValue>
        <SparklineChart data={chartData} color={chartColor} />
      </CardBody>
      <CardFooter>
        {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
        <PercentageChange isPositive={isPositive}>{Math.abs(change)}%</PercentageChange>
        <FooterText>last 7 days</FooterText>
      </CardFooter>
    </CardContainer>
  );
}