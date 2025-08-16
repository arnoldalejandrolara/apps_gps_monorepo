import React from 'react';
import styled from 'styled-components';

const Content = ({ children }) => {
  return <ContentContainer>{children}</ContentContainer>;
};

const ContentContainer = styled.div`
  padding: 10px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Content;