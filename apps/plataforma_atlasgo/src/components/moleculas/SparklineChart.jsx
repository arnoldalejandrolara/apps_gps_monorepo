import React from 'react';
import styled from 'styled-components';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

const SparklineContainer = styled.div`
  width: 80px;
  height: 40px;
`;

export function SparklineChart({ data, color }) {
  return (
    <SparklineContainer>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <Bar dataKey="value" fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </SparklineContainer>
  );
}