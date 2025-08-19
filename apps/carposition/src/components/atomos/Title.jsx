import styled from "styled-components";

export function Title() {
  return <TitleLabel>Carros</TitleLabel>;
}

const TitleLabel = styled.div`
  font-weight: 400;
  font-size: 14px;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
`;