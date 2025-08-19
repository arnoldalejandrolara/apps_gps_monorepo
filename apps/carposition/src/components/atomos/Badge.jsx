import React from 'react';
import styled from 'styled-components';

const StyledBadge = styled.span`
  background-color: #333;
  color: #A0A0A0;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  margin-right: 10px;
  font-weight: 500;
`;

export const Badge = (props) => {
    return <StyledBadge {...props} />;
};