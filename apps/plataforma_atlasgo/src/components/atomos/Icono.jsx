import styled from "styled-components";

export  const Icono = styled.span`
    color : ${({theme}) => theme.text};
    font-size: 20x;

`

export const ArrowUpIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14" />
      <path d="m17 10-5-5-5 5" />
    </svg>
  );
  
  export const ArrowDownIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5" />
      <path d="m5 14 5 5 5-5" />
    </svg>
  );