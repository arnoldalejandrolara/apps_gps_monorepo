import React, { useState } from "react";
import styled , {keyframes}from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaFilter } from "react-icons/fa";

const Filtros = ({ selectedFilters, setSelectedFilters }) => {
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

  const toggleFilter = (filtro) => {
    // Alterna el filtro "Fecha" solo si se interactúa con el checkbox
    setSelectedFilters((prev) =>
      prev.includes(filtro) ? prev.filter((f) => f !== filtro) : [...prev, filtro]
    );
  };

  const handleDateChange = (key, date) => {
    // Actualiza el rango de fechas sin cambiar los filtros seleccionados
    setDateRange((prev) => ({ ...prev, [key]: date }));
  };

  const handleApplyDateFilter = () => {
    console.log("Aplicar filtro con rango de fechas:", dateRange);
  };

  return (
    <FiltersWrapper>
      <FiltersButton onClick={() => setShowFiltersDropdown((prev) => !prev)}>
        <FaFilter style={{ marginRight: 8 }} />
        Filtros {selectedFilters.length > 0 && `(${selectedFilters.length})`}
      </FiltersButton>

      {showFiltersDropdown && (
        <FiltersDropdown  isVisible={showFiltersDropdown}>

        {["Fecha"].map((filtro) => (
  <div key={filtro} style={{ padding: "6px 0" }}>
    {/* Checkbox y nombre del filtro */}
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={selectedFilters.includes(filtro)}
        onChange={() => toggleFilter(filtro)}
      />
      {filtro}
    </label>

    {/* Contenido expandido solo si está activo el filtro */}
    {filtro === "Fecha" && selectedFilters.includes("Fecha") && (
      <DateRangeContainer>
        <DatePickerWrapper>
          <label >Fecha Inicio:</label>
          <DatePicker
            selected={dateRange.startDate}
            onChange={(date) => handleDateChange("startDate", date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd"
            placeholderText="Inicio"
            className="custom-datepicker"
          />
        </DatePickerWrapper>
        <DatePickerWrapper>
          <label>Fecha Final:</label>
          <DatePicker
            selected={dateRange.endDate}
            onChange={(date) => handleDateChange("endDate", date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd"
            placeholderText="Final"
            className="custom-datepicker"
          />
        </DatePickerWrapper>
        <ApplyButton onClick={handleApplyDateFilter}>Aplicar</ApplyButton>
      </DateRangeContainer>
    )}
  </div>
))}
        </FiltersDropdown>
      )}


      
    </FiltersWrapper>
  );
};


// Animaciones
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
`;


// Estilos
const FiltersWrapper = styled.div`
  position: relative;
  z-index: 3;
  
  user-select: none;
`;

const FiltersButton = styled.button`
  padding: 10px 20px;
  cursor: pointer;
  background: transparent;
  color: #fff;
  border: none;
  border-radius: 8px;
  transition: background 0.3s, transform 0.2s;

  &:hover {
    background: #3d3d3d; /* Cambia el color de fondo */
  }
`;

const FiltersDropdown = styled.div`
  position: absolute;
  top: 110%;
  right: 0;
  background: white;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 10px;
  z-index: 10;
  background: #2d2d2d;
  color: #fff;
  width: 350px; /* Incrementa la anchura del contenedor */
  animation: ${(props) => (props.isVisible ? fadeIn : fadeOut)} 0.2s ease-in-out;
  display: ${(props) => (props.isVisible ? "block" : "none")}; /* Ocultar cuando no esté visible */
`;

const DateRangeContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  background: #1f1f1f;
  padding: 10px;
  border-radius: 6px;
  width: 100%; /* Asegura que el contenedor ocupe todo el ancho */
`;

const DatePickerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%; /* Asegura que los DatePickers se alineen correctamente */

  label {
    color: #fff;
    font-size: 13px;
  }

  .custom-datepicker {
    width: 100%;
    padding: 8px;
    border: 1px solid #444;
    border-radius: 4px;
    background: #2d2d2d;
    color: #fff;
  }
`;

const ApplyButton = styled.button`
  margin-top: 10px;
  padding: 8px 12px;
  background: #444;
  border: none;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  width: 100%; /* Botón ocupa todo el ancho del contenedor */

  &:hover {
    background: #555;
  }
`;

export default Filtros;