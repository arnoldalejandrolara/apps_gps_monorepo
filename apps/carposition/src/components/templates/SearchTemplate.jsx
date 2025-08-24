import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { VehicleCard } from '../organismos/CardVehicle';
import Skeleton from '@mui/material/Skeleton';
import { useMediaQuery } from 'react-responsive';
import LinearProgress from '@mui/material/LinearProgress';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { addSelectedVehicleMobile, setVehicleRoute } from "@mi-monorepo/common/store/vehicle";
import { getLast5Routes } from "@mi-monorepo/common/services";
import { useMapView } from '@mi-monorepo/common/context';

const FullScreenContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #202020;
  overflow: hidden;
`;

const SearchBarWrapper = styled.div`
  padding: 15px;
  background-color: #202020;
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 50px;
  margin: 0 20px;
  padding: 10px 14px;
  border-radius: 8px;
  background-color: transparent;
  border: 1px solid #333333;
  font-size: 14px;
  color: white;

  &:focus {
    outline: none;
    border-color: #555555;
  }

  &::placeholder {
    color: #aaaaaa;
  }
`;

// Nuevo contenedor con fondo claro para la leyenda
const InfoLegendContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 8px;
  margin-bottom: 2px;
  padding: 0 30px;
`;

const InfoLegend = styled.div`
  background: #333333;
  color: #CCCCCC;
  font-size: 12px;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.01);
  padding: 10px 18px;
  text-align: center;
  max-width: 430px;
  width: 100%;
`;

const ContainerListVehicle = styled.div`
  flex: 1;
  overflow-y: auto;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SkeletonWrapper = styled.div`
  margin: 0px;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #202020;
`;

const SearchTemplate = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { setShowMapMobile } = useMapView();
  const dispatch = useDispatch();

  const vehicles = useSelector((state) => state.vehicle?.vehicles || []);
  const token = useSelector((state) => state.auth?.token || "");

  useEffect(() => {
    if (vehicles.length > 0) {
      setAllData(vehicles);
      setFilteredData(vehicles);
      setIsLoading(false);
    }
  }, [vehicles]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isMobile && location.pathname === "/buscar-mobile") {
      navigate("/dashboard");
    }
  }, [isMobile, location.pathname, navigate]);

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = allData.filter(vehicle =>
      vehicle.unidad_nombre.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const handleCardClick = async (vehicle) => {
    try {
      setIsTransitioning(true); // Mostrar la barra de carga

      if (!vehicle || !vehicle.imei) {
        console.error("❌ Datos del vehículo inválidos:", vehicle);
        setIsTransitioning(false);
        return;
      }

      if(vehicle.route.length <= 1) {
        let last5Routes = await getLast5Routes(token, vehicle.imei);

        if(last5Routes.status === 200) {
          let coordinates = last5Routes.registros.map(registro => [registro.location.y, registro.location.x]).reverse();
          
          await dispatch(setVehicleRoute({ id: vehicle.id, route: coordinates }));
        } else {
          console.error("❌ Error al obtener las últimas 5 rutas:", last5Routes);
        }
      }

      await dispatch(addSelectedVehicleMobile(vehicle));

      // Espera un poco para que el loader se muestre visualmente
      await new Promise(resolve => setTimeout(resolve, 100));

      // NO ocultes el loader aquí, navega directamente
      // navigate("/mapa-mobile");
      setIsTransitioning(false);
      setShowMapMobile(true);
    } catch (error) {
      console.error("❌ Error al procesar el vehículo:", error);
      setIsTransitioning(false);
    }
  };

  if (isTransitioning) {
    return (
      <LoadingOverlay>
        <LinearProgress 
          sx={{
            width: '50%',
            backgroundColor: '#333',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#aaa',
            },
          }}
        />
      </LoadingOverlay>
    );
  }

  return (
    <FullScreenContainer>
      <SearchBarWrapper>
        <SearchInput
          type="text"
          placeholder="Buscar unidad..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </SearchBarWrapper>
      <InfoLegendContainer>
        <InfoLegend>
          Al presionar alguna unidad en el listado te llevará al mapa para poder visualizarla.
        </InfoLegend>
      </InfoLegendContainer>
      <ContainerListVehicle>
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <SkeletonWrapper key={index}>
                <Skeleton variant="rectangular" width={280} height={80} />
              </SkeletonWrapper>
            ))
          : filteredData.length === 0 ? (
              <span style={{ marginTop: '20px', color: '#888', fontSize: '14px' }}>
                No se encontró ninguna unidad.
              </span>
            ) : (
              filteredData.map((vehicle, index) => (
                <VehicleCard
                  key={index}
                  name={vehicle.info.nombre}
                  status={vehicle.posicion_actual.id_status_motor == 1 ? "En movimiento" : "Detenido"}
                  updated={vehicle.posicion_actual.fecha}
                  driver={vehicle.info.chofer}
                  onClick={() => handleCardClick(vehicle)}
                />
              ))
            )}
      </ContainerListVehicle>
    </FullScreenContainer>
  );
};

export default SearchTemplate;