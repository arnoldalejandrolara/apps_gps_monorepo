import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import expandIcon from '../../assets/expand-right.svg';
import { FaSearch, FaChevronLeft } from 'react-icons/fa'; // Añadido FaChevronLeft para el label "Regresar"
import { IoIosAdd } from "react-icons/io";
import ExportarModal from '../organismos/reportes/ExportarBtn.jsx';
import { TablaPuntosInteres } from '../organismos/table/tableCuentasEspejo.jsx';
import { rowCuentasEspejo } from '../organismos/reportes/data.js';
import ModalFormulario from '../organismos/ModelScreenConfig/ModalCuentaEspe.jsx';
import { useMediaQuery } from 'react-responsive';
import ListCEMobile from '../ListCEMobile.jsx';
import { useNavigate } from 'react-router-dom';
import { getCuentasEspejoTable } from '../../services/CuentasEspejoService.js';
import { useSelector } from 'react-redux';

export function CuentasEspejoTemplate() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState('Listado');
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 900,
  });

  const token = useSelector((state) => state.auth?.token);
  const [sorting, setSorting] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [cuentaEdit, setCuentaEdit] = useState(null); // <- Agrega esto
  const [data, setData] = useState([]);
  const [modalMode, setModalMode] = useState('nuevo');

  const handlePaginationChange = async (updater) => {
    const newPagination =
      typeof updater === 'function' ? updater(pagination) : updater;
    setPagination(newPagination);
    // await fetchData(newPagination, sorting, selectedTab);
  };

  const handleSortingChange = async (newSorting) => {
    setSorting(newSorting);
    // await fetchData(pagination, newSorting, selectedTab);
  };

  const fetchData = async () => {
    const data = await getCuentasEspejoTable(token, pagination.pageIndex, pagination.pageSize, sorting, null, '');
    setTotalRows(data.recordsTotal);
    setPageCount(data.recordsFiltered);
    setData(data.table.data);
  };

  useEffect(() => {
    if(token){
      fetchData();
    }
  }, [token]);

  return (
    <Container>
      <HeaderContainer>

        <MobileHeaderRow>
          {isMobile && (
            <>
              <BackLabel onClick={() => navigate('/home-mobile')}>
                <FaChevronLeft style={{ marginRight: 4 }} />
                Regresar
              </BackLabel>
            </>
          )}
        </MobileHeaderRow>
        
        <BreadcrumbContainer>
          <Breadcrumb>
            Cuenta Espejo
            <Icon src={expandIcon} alt="Expand icon" />
            <CurrentReport>{selectedReport}</CurrentReport>
          </Breadcrumb>
        </BreadcrumbContainer>
      </HeaderContainer>

      {/* <HorizontalLine /> */}
      
      <ContentContainer>
        <ActionsContainer>
          
          <SearchContainer>
            <SearchIcon />
            <SearchInput
              placeholder="Buscar..."
              value={''}
              onChange={() => {}}
            />
          </SearchContainer>

          <ButtonsContainer>
            <ExportarModal />
            <BtnCreate onClick={() => {
                setCuentaEdit(null);    // <- Limpiar para modo nuevo
                setModalVisible(true);
                setModalMode('nuevo');
            }}>
              <IoIosAdd style={{fontSize : '20px' ,marginRight: '4px' }} />
              Nuevo
            </BtnCreate>
          </ButtonsContainer>
        </ActionsContainer>

        <ModalFormulario
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setCuentaEdit(null);
            fetchData();
          }}
          onSubmit={() => setModalVisible(false)}
          cuentaEdit={cuentaEdit}            // <- Pásale los datos (o null)
          modo={modalMode} // <- O una prop booleana: isEdit={!!cuentaEdit}
        />

        {
          isMobile ?
            <ListCEMobile
              // cuentas={[
              //   {
              //     nombreContacto: "Juan Pérez",
              //     codigo: "CE123",
              //     unidad: "1",
              //     fechaCaducidad: "2025-12-10",
              //   },
              //   // ...
              // ]}
              cuentas={data}
              onEdit={cuenta => {
                setCuentaEdit(cuenta);   // <- Setea la cuenta a editar
                setModalMode('editar');
                setModalVisible(true);
              }}
              onDelete={cuenta => { /* tu lógica */ }}
              onSend={cuenta => { 
                console.log('Enviar cuenta', cuenta);
                setCuentaEdit(cuenta);
                setModalVisible(true);
                setModalMode('enviar');
              }}
            />
            :

            <TablaPuntosInteres
              type="cuentasespejo"
              data={data}
              isLoading={isLoading}
              pagination={pagination}
              onPaginationChange={handlePaginationChange}
              sorting={sorting}
              onSortingChange={handleSortingChange}
              totalRows={totalRows}
              pageCount={pageCount}
              onEdit={cuenta => {
                setCuentaEdit(cuenta);
                setModalVisible(true);
                setModalMode('editar');
              }}
              onSend={cuenta => {
                console.log('Enviar cuenta', cuenta);
                setCuentaEdit(cuenta);
                setModalVisible(true);
                setModalMode('enviar');
              }}
            />

        }
      </ContentContainer>
    </Container>
  );
}

// ----------- MOBILE FRIENDLY STYLES (max-width: 765px) ------------

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 10px 20px;
  width: 100%;
  background: #171717;
  @media (max-width: 765px) {
    padding: 6px;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  width: 100%;
  margin: 5px 0;
  padding: 15px 10px;
  @media (max-width: 765px) {
    margin: 2px 0;
    padding: 7px 0px;
  }
`;

const MobileHeaderRow = styled.div`
  display: none;
  @media (max-width: 765px) {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 32px;
  }
`;

const BackLabel = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  &:active {
    opacity: 0.8;
  }
`;



const BreadcrumbContainer = styled.div`
  flex: 1;
  justify-content: flex-start;
  display: none;
  @media (min-width: 768px) {
    display: flex;
  }
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  color: white;
  @media (max-width: 765px) {
    font-size: 12px;
  }
`;

const Icon = styled.img`
  width: 12px;
  height: 12px;
  margin: 0 8px;
`;

const CurrentReport = styled.span`
  font-weight: bold;
  color: white;
`;

const SearchInput = styled.input`
  flex: 1;
  height: 45px;
  padding: 8px 12px 8px 32px;
  font-size: 13px;
  border: 1px solid #333D47;
  border-radius: 8px;
  background: transparent;
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

const HorizontalLine = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid #333333;
  margin: 12px 0;
  @media (max-width: 765px) {
    margin: 6px 0;
  }
`;

const ContentContainer = styled.div`
  background: #1E1E1E;
  padding: 20px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
  @media (max-width: 765px) {
    padding: 6px;
    border-radius: 8px;
  }
`;

const BtnCreate = styled.button`
  background: white;
  display: flex;
  padding: 10px 10px;
  border-radius: 8px;
  border: none;
  align-items: center;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  font-size: 14px;
  @media (max-width: 765px) {
    width: 100%;
    justify-content: center;
  }
  &:hover {
    background: #bfbfbf;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  @media (max-width: 765px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 290px;
  gap: 10px;
  position: relative;
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

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  @media (max-width: 765px) {
    width: 100%;
    gap: 8px;
    flex-direction: column;
  }
`;

const spinnerAnim = keyframes`
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
`;

export default CuentasEspejoTemplate;