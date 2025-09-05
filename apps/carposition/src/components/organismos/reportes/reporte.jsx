import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaChartBar, FaTable, FaChevronDown } from 'react-icons/fa';
import { CiViewTable } from "react-icons/ci";
import TablaConFiltros from './TablaConBotones';
import { Device } from '../../../utilities/breakpoints';
import { useSelector } from 'react-redux';
// import { getHistorialTable } from '../../../services/ReportesService';
import { DateRangePickerCustom } from '../../moleculas/DateRangePickerCustom.jsx';
import MobileDateRangePickerCustom from '../../moleculas/MobileDatePickerCustom.jsx';
import { useMediaQuery } from 'react-responsive';

export function Reporte() {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [activeTab, setActiveTab] = useState('tabla');
  const [selectedUnitName, setSelectedUnitName] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [unidades, setUnidades] = useState([]);
  const vehicles = useSelector((state) => state.vehicle.vehicles);
  const token = useSelector((state) => state.auth.token);
  const [selectedImei, setSelectedImei] = useState(null);
  const [loading, setLoading] = useState(false);


  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25
  });

  const [pageCount, setPageCount] = useState(0);

  const handlePaginationChange = async (updater) => {
    const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
    setPagination(newPagination);
    await fetchData(newPagination);
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    setUnidades(vehicles.map((vehicle) => ({
      nombre: vehicle.info.nombre,
      imei: vehicle.imei
    })));
  }, [vehicles]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInputValue(value);
    setSearchTerm(value);
  };

  const handleUnidadSelect = (unidad) => {
    setLoading(true);      // Ponemos loading antes de cambiar el IMEI
    setData([]);           // Limpiamos los datos para evitar parpadeo de la tabla anterior
    setSelectedImei(unidad.imei);
    setDropdownOpen(false);
    setSelectedUnitName(unidad.nombre);
    setSearchInputValue('');
    setSearchTerm('');
  };

  const toggleDropdown = () => {
    const newDropdownState = !isDropdownOpen;
    setDropdownOpen(newDropdownState);

    if (newDropdownState) {
      setSearchInputValue('');
      setSearchTerm('');
    }
  };

  const filteredUnidades = isDropdownOpen
    ? unidades.filter((unidad) =>
        unidad.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : unidades;

  const fetchData = async (paginationData = pagination) => {
    setLoading(true);
    try {
      // let fecha_inicio = '2025-06-05 00:00:00';
      // let fecha_fin = '2025-06-05 23:59:59';
    // Formatear fecha de inicio: YYYY-MM-DD 00:00:00
    const formatStartDate = (date) => {
      if (!date) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day} 00:00:00`;
    };

    // Formatear fecha de fin: YYYY-MM-DD 23:59:59
    const formatEndDate = (date) => {
      if (!date) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day} 23:59:59`;
    };

    let fecha_inicio = startDate ? formatStartDate(startDate) : '2025-06-05 00:00:00';
    let fecha_fin = endDate ? formatEndDate(endDate) : '2025-06-05 23:59:59';

    console.log(fecha_inicio, fecha_fin);

      const data = await getHistorialTable(
        paginationData.pageIndex * paginationData.pageSize,
        paginationData.pageSize,
        0,
        [],
        '',
        token,
        fecha_inicio,
        fecha_fin,
        selectedImei
      );
      setData(data.historial.data);
      setPageCount(Math.ceil(data.historial.recordsTotal / paginationData.pageSize));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedImei) {
      fetchData(pagination);
    }
  }, [selectedImei, token,startDate, endDate]);

 

  return (
    <Container>
      <Header isMobile={isMobile}>
          <ColumnHeader>
            <SelectContainer>
              <Dropdown>
                <DropdownToggle onClick={toggleDropdown}>
                  <span>{selectedUnitName || 'Buscar unidad'}</span>
                  <FaChevronDown />
                </DropdownToggle>
                <DropdownContent isOpen={isDropdownOpen}>
                  <SearchInput
                    type="text"
                    placeholder="Buscar unidad..."
                    value={searchInputValue}
                    onChange={handleSearchChange}
                  />
                  {filteredUnidades.map((unidad, index) => (
                    <MenuItem
                      key={unidad.imei}
                      onClick={() => handleUnidadSelect(unidad)}
                    >
                      {unidad.nombre}
                    </MenuItem>
                  ))}
                </DropdownContent>
              </Dropdown>
            </SelectContainer>

            <RowDatePickersMobile>
              <MobileDateRangePickerCustom
                startDate={startDate}
                endDate={endDate}
                onStartChange={setStartDate}
                onEndChange={setEndDate}
              />
            </RowDatePickersMobile>

          </ColumnHeader>
        
      </Header>

      <Content>
        {activeTab === 'grafica' ? (
          <p>Aquí se mostrará una gráfica</p>
        ) : (
          selectedImei ? (
            loading ? (
              <LoadingContainer>
                <Spinner />
                <LoadingText>Cargando información...</LoadingText>
              </LoadingContainer>
            ) : (
              <TablaConFiltros
                data={data}
                onPaginationChange={handlePaginationChange}
                controlledPagination={pagination}
                pageCount={pageCount}
              />
            )
          ) : (
            <EmptyState>
              <CiViewTable size={40} color="#adb5bd" />
              <EmptyText>Selecciona una unidad para ver la informacion</EmptyText>
            </EmptyState>
          )
        )}
      </Content>
    </Container>
  );
}

// --- Animaciones ---
const slideDown = keyframes`
  from {
    transform: scaleY(0);
    opacity: 0;
  }
  to {
    transform: scaleY(1);
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: scaleY(1);
    opacity: 1;
  }
  to {
    transform: scaleY(0);
    opacity: 0;
  }
`;

// --- Contenedores y estilos con Tema Claro ---
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-height: 0;
  min-width: 0;
  box-sizing: border-box;
  background-color: #f8f9fa; /* Color de fondo claro */
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 2px;
  padding: 15px; /* Padding para separar del borde */
  background-color: #ffffff; /* Fondo blanco para el header */
  border-bottom: 1px solid #dee2e6; /* Borde sutil */

  @media ${Device.mobile} {
    flex-direction: row;
  }
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const ColumnHeader = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
`;

const RowDatePickersMobile = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 100%;
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const SelectContainer = styled.div`
  flex: 0;
  margin-right: auto;
  position: relative;
  user-select: none;

  @media (max-width: 576px) {
    margin-right: 0;
    margin-left: 0;
    display: flex;
    justify-content: center;
    width: 100%;
  }
`;

const Dropdown = styled.div`
  position: relative;
  width: 300px;

  @media (max-width: 576px) {
    width: 100%;
  }
`;

const DropdownToggle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  height: 40px; /* Altura ajustada */
  font-size: 13px;
  border: 1px solid #ced4da; /* Borde claro */
  border-radius: 8px;
  background: #ffffff; /* Fondo blanco */
  color: #212529; /* Texto oscuro */
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #80bdff; /* Borde azul al pasar el mouse */
  }

  svg {
    font-size: 14px;
    margin-left: 10px;
  }
`;

const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #ffffff; /* Fondo blanco */
  border: 1px solid #dee2e6; /* Borde claro */
  border-radius: 8px;
  margin-top: 5px;
  z-index: 2100;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Sombra sutil */
  padding: 10px;
  transform-origin: top;
  animation: ${({ isOpen }) => (isOpen ? slideDown : slideUp)} 0.3s ease-in-out;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ced4da; /* Borde claro */
  border-radius: 8px;
  background: #f8f9fa; /* Fondo gris claro */
  color: #212529; /* Texto oscuro */
  outline: none;

  &::placeholder {
    color: #adb5bd; /* Placeholder claro */
  }
`;

const MenuItem = styled.div`
  margin: 6px 0;
  padding: 10px;
  font-size: 14px;
  color: #212529; /* Texto oscuro */
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #f1f3f5; /* Hover claro */
  }
`;

const Content = styled.div`
  flex: 1 1 0%;
  min-height: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px; /* Padding para separar del header */
`;

const EmptyState = styled.div`
  flex: 1 1 0%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6c757d; /* Texto secundario claro */
  opacity: 0.7;
  gap: 10px;
  background: #ffffff; /* Fondo blanco */
  border-radius: 12px;
  border: 1px dashed #dee2e6;
`;

const EmptyText = styled.div`
  font-size: 15px;
  margin-top: 10px;
  color: #6c757d; /* Texto secundario claro */
`;

const LoadingContainer = styled.div`
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const Spinner = styled.div`
  border: 4px solid #f1f3f5; /* Borde de spinner claro */
  border-top: 4px solid #007bff; /* Color primario para la animación */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  color: #6c757d; /* Texto secundario claro */
  font-size: 16px;
`;