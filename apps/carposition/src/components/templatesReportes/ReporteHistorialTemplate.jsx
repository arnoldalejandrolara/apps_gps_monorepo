import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs'; // CORRECCIÓN 1: Se añade la importación de dayjs

// === IMPORTACIONES DE ICONOS ===
import { IoMdRefresh, IoMdTime, IoMdArrowDropdown, IoMdAdd } from 'react-icons/io';
import { FiExternalLink } from 'react-icons/fi';
import { BsGraphUp } from 'react-icons/bs';
import { ResponsiveContainer, BarChart, Bar, Tooltip } from 'recharts';
// === IMPORTACIONES DE COMPONENTES REUTILIZABLES ===
import { Badge } from '../atomos/Badge.jsx';
import { Button, IconButton } from '../atomos/Button.jsx';
import { Card } from '../moleculas/Card.jsx';
import TablaConFiltros from '../organismos/reportes/TablaConBotones.jsx';
import FilterModal from '../organismos/ModelScreenConfig/FilterModal.jsx';
// CORRECCIÓN 3: Se corrige el nombre del archivo en la ruta de importación

import { DateRangeModal } from '../organismos/ModelScreenConfig/DataRangeModal.jsx';
// --- Datos Ficticios (Mock Data) ---
const memoryUsageData = [ 35, 36, 35, 34, 35, 68, 36, 35, 37, 36, 35, 34, 36, 35, 34, 35, 33, 35, 36, 35, 34, 35, 36, 35, 34, 35, 36, 35, 34, 35, 65, 36, 35, 37, 36, 35, 34, 36, 35, 34, 35, 33, 35, 36, 35 ];
const rechartsMemoryData = memoryUsageData.map((value, index) => ({ name: `time${index}`, usage: value }));

export function ReporteHistorialTemplate() {
    const [isScrolled, setIsScrolled] = useState(false);
    const scrollRef = useRef(null);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const handlePaginationChange = (updater) => setPagination(typeof updater === 'function' ? updater(pagination) : updater);
    const data = React.useMemo(() => Array.from({ length: 100 }, (_, i) => ({ id: i + 1, evento: `Evento de prueba ${i + 1}`, usuario: `usuario${i + 1}@correo.com`, fecha: new Date(Date.now() - Math.random() * 1e10).toLocaleDateString() })), []);
    const pageCount = Math.ceil(data.length / pagination.pageSize);

    const [filterModal , setFilterModal] = useState({ open: false, position: null });
    const filterBtnRef = useRef(null);

    const [dateRange, setDateRange] = useState({ start: null, end: null });
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);

    const handleApplyDateRange = (newRange) => {
        setDateRange(newRange);
        setIsDateModalOpen(false);
    };

    const dateRangeText = React.useMemo(() => {
        if (dateRange.start && dateRange.end) {
            const start = dayjs(dateRange.start).format('DD/MM/YY');
            const end = dayjs(dateRange.end).format('DD/MM/YY');
            return `${start} - ${end}`;
        }
        return 'Last 60 minutes';
    }, [dateRange]);

    const toggleFilterModal = () => {
      if (filterModal.open) {
        setFilterModal({ open: false, position: null });
      } else {
        const rect = filterBtnRef.current.getBoundingClientRect();
        setFilterModal({
          open: true,
          position: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          }
        });
      }
    };

    useEffect(() => {
      const scrollableElement = scrollRef.current;
      let ticking = false;

      const handleScroll = () => {
          if (!ticking) {
              window.requestAnimationFrame(() => {
                  if (scrollableElement) {
                      setIsScrolled(scrollableElement.scrollTop > 10);
                      if (filterModal.open && filterBtnRef.current) {
                          const rect = filterBtnRef.current.getBoundingClientRect();
                          setFilterModal(prev => ({
                              ...prev,
                              position: {
                                  top: rect.top,
                                  left: rect.left,
                                  width: rect.width,
                                  height: rect.height
                              }
                          }));
                      }
                  }
                  ticking = false;
              });
              ticking = true;
          }
      };

      scrollableElement?.addEventListener('scroll', handleScroll, { passive: true });
      return () => scrollableElement?.removeEventListener('scroll', handleScroll);
    }, [filterModal.open]);

    return (
      <Container>
        <Header>
          <Title $isScrolled={isScrolled}>
            <Badge>Reporte</Badge>
            Historial
          </Title>
          <Controls>
            <IconButton small><IoMdRefresh size={18} /></IconButton>
            <Button small onClick={() => setIsDateModalOpen(true)}>
                <IoMdTime size={14} /> {dateRangeText} <IoMdArrowDropdown />
            </Button>
            <Button small>All Requests <IoMdArrowDropdown /></Button>
            <Button
              className={`action-btn ${filterModal.open ? "selected" : ""}`}
              ref={filterBtnRef}
              onClick={toggleFilterModal}
              primary small><IoMdAdd size={14} />Filtros</Button>
          </Controls>
        </Header>

        <ScrollableContent ref={scrollRef}>
          { /* Tu contenido de tarjetas aquí... */ }
          <Card
            title="Grafica"
            headerActions={
              <HeaderInfo>
                <PercentageDisplay>40%</PercentageDisplay>
                <IconButton small><BsGraphUp size={14}/></IconButton>
              </HeaderInfo>
            }
          >
            <ResponsiveContainer width="100%" height={80}>
                <BarChart data={rechartsMemoryData} barGap={2}>
                    <Tooltip
                        cursor={{fill: 'rgba(255, 255, 255, 0.1)'}}
                        contentStyle={{ background: '#2E2E2E', border: '1px solid #444', borderRadius: '6px' }}
                        labelStyle={{color: '#fff'}}
                    />
                    <Bar dataKey="usage" fill="#6EE7B7" radius={[2, 2, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
            <AxisLabels style={{borderTop: 0, marginTop: '12px'}}>
                <span>Aug 8, 2025, 11:32pm</span>
                <span>Aug 9, 2025, 12:32am</span>
            </AxisLabels>
          </Card>

          <Card
            title="Tabla"
            headerActions={<FiExternalLink color="#888" />}
            footerContent="Open in Logs Explorer"
          >
            <TablaWrapper>
                <TablaConFiltros
                    data={data}
                    onPaginationChange={handlePaginationChange}
                    controlledPagination={pagination}
                    pageCount={pageCount}
                />
            </TablaWrapper>
          </Card>
        </ScrollableContent>

        {/* El modal de filtros que ya tenías */}
        <FilterModal
          open={filterModal.open}
          onClose={() => setFilterModal({ open: false, position: null })}
          anchorPosition={filterModal.position}
          direction="left"
          // La prop 'variant' ya no es necesaria si usas la versión especializada
        />

        {/* CORRECCIÓN 2: Se añade el componente del modal de fechas para que se renderice */}
        <DateRangeModal
            open={isDateModalOpen}
            onClose={() => setIsDateModalOpen(false)}
            onApply={handleApplyDateRange}
            initialRange={dateRange}
        />
      </Container>
    );
}

// ... Tus componentes estilizados ...
const TablaWrapper = styled.div`
    height: 500px;
    overflow-y: hidden;
`;

const Container = styled.div`
  background-color: #171717;
  color: #E0E0E0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

const ScrollableContent = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 0 24px;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid #2E2E2E;
  transition: padding 0.3s ease-out;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 400;
  color: #fff;
  display: flex;
  align-items: center;
  margin: 0;
  overflow: hidden;
  opacity: 1;
  max-height: 30px;
  transition: max-height 0.3s ease-out, opacity 0.2s ease-out, margin 0.3s ease-out;

  ${props => props.$isScrolled && `
    max-height: 0;
    opacity: 0;
    margin: 0;
  `}
`;

const Controls = styled.div`
  display: flex;
  gap: 12px;
`;

const AxisLabels = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #888;
    margin-top: 8px;
    border-top: 1px solid #2E2E2E;
    padding-top: 8px;
`;

const HeaderInfo = styled.div`
    display: flex;
    align-items: center; /* Alineado para que se vea mejor */
    gap: 16px; /* Aumenté el espacio */
`;

const PercentageDisplay = styled.p`
    font-size: 20px;
    font-weight: 500;
    color: #fff;
    margin: 0;
`;

export default ReporteHistorialTemplate;