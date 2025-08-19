import styled from "styled-components";
import { FaSearch } from 'react-icons/fa';

export function InputSearch() {
  return (
    <SearchContainerStyled>
      <SearchIcon />
      <SearchInput
        placeholder="Buscar..."
        value={''}
        onChange={() => {}}
      />
    </SearchContainerStyled>
  );
}

const SearchContainerStyled = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
  position: relative;
  margin-bottom: 2%;
  @media (max-width: 765px) {
    width: 100%;
    margin-bottom: 8px;
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 10px;
  color: #888888;
  font-size: 16px;
  @media (max-width: 765px) {
    left: 7px;
    font-size: 14px;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  height: 40px;
  padding: 8px 12px 8px 32px;
  font-size: 13px;
  border: 1px solid #333333;
  border-radius: 6px;
  background: #1D1D1D;
  color: white;
  &:hover {
    border-color: #ffffff;
  }
  @media (max-width: 765px) {
    height: 36px;
    font-size: 12px;
    padding-left: 28px;
  }
`;