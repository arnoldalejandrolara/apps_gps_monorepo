import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { filterIcons } from "../../../utilities/dataEstatica";

export function SearchWithFilter({ onSearch, onUpdateSubFilter }) {
  const [filters, setFilters] = useState([]);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilterModal, setActiveFilterModal] = useState(null);
  const [subFilter, setSubFilter] = useState({});
  const containerRef = useRef(null);
  const modalDropdownRef = useRef(null);
  const submodalRef = useRef(null);
  const availableFilters = ["Ordenar", "Actualizado"];

  // Cerrar ambos modales al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      // Cierra el modal principal de filtros
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        isModalOpen
      ) {
        setIsModalOpen(false);
      }
      // Cierra el submodal de filtros activos
      if (
        submodalRef.current &&
        !submodalRef.current.contains(event.target) &&
        activeFilterModal !== null
      ) {
        setActiveFilterModal(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen, activeFilterModal]);

  const toggleSubFilter = (filter, option) => {
    const updatedSubFilter = {
      ...subFilter,
      [filter]: {
        ...subFilter[filter],
        [option]: !subFilter[filter]?.[option],
      },
    };
    setSubFilter(updatedSubFilter);
    onUpdateSubFilter(updatedSubFilter);
    onSearch(query, filters);
  };

  const handleFilterChange = (filter) => {
    const updatedFilters = filters.includes(filter)
      ? filters.filter((f) => f !== filter)
      : [...filters, filter];
    setFilters(updatedFilters);
    onSearch(query, updatedFilters);
  };

  // Aquí está la lógica importante del badge:
  // Si el submodal está abierto y das click, se cierra.
  // Si está cerrado, se abre el correspondiente.
  const handleBadgeClick = (filter) => {
    setActiveFilterModal((prev) => (prev === filter ? null : filter));
  };

  return (
    <Container ref={containerRef}>
      <SearchBox>
        <IconLeft viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
          <line x1="16" y1="16" x2="22" y2="22" stroke="currentColor" strokeWidth="2" />
        </IconLeft>
        <Input
          placeholder="Buscar..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch(e.target.value, filters);
          }}
        />
        {/* <IconButton onClick={() => setIsModalOpen((open) => !open)}>
          <IconRight viewBox="0 0 24 24">
            <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" />
            <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" />
            <line x1="10" y1="18" x2="14" y2="18" stroke="currentColor" strokeWidth="2" />
          </IconRight>
        </IconButton> */}
      </SearchBox>

      {isModalOpen && (
        <ModalDropdown ref={modalDropdownRef}>
          {availableFilters.map((filter) => (
            <FilterOption key={filter}>
              <input
                type="checkbox"
                checked={filters.includes(filter)}
                onChange={() => handleFilterChange(filter)}
              />
              {filterIcons[filter]}
              {filter}
            </FilterOption>
          ))}
        </ModalDropdown>
      )}

      <FilterList>
        {filters.map((filter, index) => (
          <div key={index} style={{ position: "relative" }}>
            <Badge
              onClick={() => handleBadgeClick(filter)}
            >
              {filterIcons[filter]}
              {filter}
              <ExpandIcon viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" fill="none" />
              </ExpandIcon>
            </Badge>

            {activeFilterModal === filter && (
              <SubOptionsContainer ref={submodalRef}>
                {filter === "Ordenar" && (
                  <>
                    <SubOption onClick={() => toggleSubFilter(filter, "ascendente")}>
                      <input
                        type="checkbox"
                        checked={subFilter[filter]?.ascendente || false}
                        onChange={() => {}}
                      />
                      Ascendente
                    </SubOption>
                    <SubOption onClick={() => toggleSubFilter(filter, "descendente")}>
                      <input
                        type="checkbox"
                        checked={subFilter[filter]?.descendente || false}
                        onChange={() => {}}
                      />
                      Descendente
                    </SubOption>
                  </>
                )}
                {filter === "Actualizado" && (
                  <>
                    <SubOption onClick={() => toggleSubFilter(filter, "reciente")}>
                      <input
                        type="checkbox"
                        checked={subFilter[filter]?.reciente || false}
                        onChange={() => {}}
                      />
                      Reciente
                    </SubOption>
                    <SubOption onClick={() => toggleSubFilter(filter, "antiguo")}>
                      <input
                        type="checkbox"
                        checked={subFilter[filter]?.antiguo || false}
                        onChange={() => {}}
                      />
                      Antiguo
                    </SubOption>
                  </>
                )}
              </SubOptionsContainer>
            )}
          </div>
        ))}
      </FilterList>
    </Container>
  );
}

// ...los estilos igual que antes...
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 20px 25px;
  max-width: 400px;
  position: relative;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: #272727;
  border: 1px solid #272727;
  border-radius: 8px;
  padding: 8px;
  gap: 8px;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: #fff;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 3px;
  border-radius: 8px;
  &:hover {
    background: #3d3d3d;
  }
`;

const IconLeft = styled.svg`
  width: 20px;
  height: 20px;
  color: #888;
`;

const IconRight = styled.svg`
  width: 20px;
  height: 20px;
  color: #888;
`;

const ModalDropdown = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  background: #2d2d2d;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  width: 180px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const FilterOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  padding: 8px;
  font-size: 14px;
  cursor: pointer;
  color: white;
  user-select: none;
  &:hover {
    background: #4d4c4c;
  }
`;

const FilterList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const Badge = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  background: #313131;
  color: white;
  padding: 4px 10px;
  border-radius: 8px;
  border: 1px solid #696969;
  font-size: 11px;
  cursor: pointer;
  position: relative;
  z-index: 1;
  user-select: none;
`;

const ExpandIcon = styled.svg`
  width: 16px;
  height: 16px;
  color: white;
`;

const SubOptionsContainer = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  background: #313131;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  padding: 10px;
  width: 150px;
  z-index: 10;
`;

const SubOption = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  user-select: none;

  &:hover {
    background: #3d3d3d;
  }
`;