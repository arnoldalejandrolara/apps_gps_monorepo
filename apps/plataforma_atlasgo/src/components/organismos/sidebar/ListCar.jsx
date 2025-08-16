import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Skeleton from "@mui/material/Skeleton";
import { SearchWithFilter } from "../formularios/SearchInputFilter";
import { VehicleCard } from "../CardVehicle";
import Car from "../../../assets/Car.svg";
import { v } from "../../../utilities/variables";
import { useWebSocket } from "../../../context/WebSocketContext";
import { getLast5Routes } from "../../../services/DispositivosService";
import { useDispatch, useSelector } from "react-redux";
import { addSelectedVehicle, setVehicleRoute } from "../../../store/slices/vehicleSlice";

export function ListCar({ state, setState }) {
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [vehicleData, setVehicleData] = useState([]); // Datos originales de vehículos
  const [filteredData, setFilteredData] = useState([]); // Datos filtrados
  const [subFilter, setSubFilter] = useState({}); // Estado de subfiltros
  const [messages, setMessages] = useState([]); // Historial de mensajes recibidos
  const dispatch = useDispatch();

  const vehicles = useSelector((state) => state.vehicle?.vehicles || []);
  const selectedVehicles = useSelector((state) => state.vehicle?.selectedVehicles || []);
  const token = useSelector((state) => state.auth?.token || "");
  

  const { addMessageHandler } = useWebSocket();
  // console.log(user, "user");
  // Utiliza el hook useWebSocket para manejar mensajes
  // const sendMessage = useWebSocket((msg) => {
  //   try {
  //     const parsedMsg = JSON.parse(msg);
  //     // console.log(parsedMsg, "parsedMsg");

  useEffect(() => {
    // Registrar el manejador de mensajes
    const cleanup = addMessageHandler((data) => {
      try {
        // if (data.type === "dispositivos") {
        //   setVehicleData(data.dispositivos || []);
        //   setFilteredData(data.dispositivos || []);
        // } else {
        //   setMessages((prev) => [...prev, data]);
        // }
      } catch (error) {
        console.error("Error al procesar el mensaje:", error);
      }
    });

    // Limpiar el manejador cuando el componente se desmonte
    return cleanup;
  }, [addMessageHandler]);

  useEffect(() => {
    if (vehicles.length > 0) {
      //console.log('🔍 Vehículos list car:', vehicles);
      setVehicleData(vehicles);
      setFilteredData(vehicles);
      setIsLoading(false);
    }
  }, [vehicles]);

  useEffect(() => {
    if (state) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800); // Simulación de 800ms de carga
      return () => clearTimeout(timer);
    }
  }, [state]);

  const handleSearchAndFilter = (query, filters) => {
    let filteredVehicles = vehicleData;
    console.log("🚗 Vehículos filtrados:", filteredVehicles);
    // Filtro de búsqueda
    if (query) {
      filteredVehicles = filteredVehicles.filter((vehicle) =>
        (vehicle.info.nombre || "").toLowerCase().includes(query.toLowerCase()) ||
        (vehicle.info.placas || "").toLowerCase().includes(query.toLowerCase()) ||
        (vehicle.info.modelo || "").toLowerCase().includes(query.toLowerCase())
      );
    }
  
    // Filtro por "Actualizado"
    if (filters.includes("Actualizado")) {
      if (subFilter["Actualizado"]?.reciente) {
        filteredVehicles = filteredVehicles.filter(
          (vehicle) =>
            vehicle.posicion_actual?.fecha &&
            new Date(vehicle.posicion_actual.fecha) >= new Date("2025-01-01")
        );
      }
      if (subFilter["Actualizado"]?.antiguo) {
        filteredVehicles = filteredVehicles.filter(
          (vehicle) =>
            vehicle.posicion_actual?.fecha &&
            new Date(vehicle.posicion_actual.fecha) < new Date("2025-01-01")
        );
      }
    }
  
    // Ordenar por "Ascendente" o "Descendente"
    if (filters.includes("Ordenar")) {
      filteredVehicles = [...filteredVehicles].sort((a, b) => {
        if (subFilter["Ordenar"]?.ascendente) {
          return (a.info.nombre || "").localeCompare(b.info.nombre || "");
        }
        if (subFilter["Ordenar"]?.descendente) {
          return (b.info.nombre || "").localeCompare(a.info.nombre || "");
        }
        return 0;
      });
    }
  
    setFilteredData(filteredVehicles);
  };

  const handleCardClick = async (vehicle) => {
    try {
        if (!vehicle || !vehicle.imei) {
            console.error("❌ Datos del vehículo inválidos:", vehicle);
            return;
        }

        // Primero actualizamos la ruta si es necesario
        if(vehicle.route.length <= 1){
            //console.log("🔍 Obteniendo últimas 5 rutas");
            let last5Routes = await getLast5Routes(token, vehicle.imei);

            if(last5Routes.status == 200){
                let coordinates = last5Routes.registros.map(registro => [registro.location.y, registro.location.x]).reverse();
                // Actualizamos la ruta primero
                await dispatch(setVehicleRoute({ id: vehicle.id, route: coordinates }));
                // Esperamos un momento para asegurar que la actualización se complete
                await new Promise(resolve => setTimeout(resolve, 200));
                // Actualizamos el vehículo con la nueva ruta
                vehicle = {
                    ...vehicle,
                    route: coordinates
                };
            } else {
                console.error("❌ Error al obtener las últimas 5 rutas:", last5Routes);
            }
        }

        // Después de asegurarnos de que la ruta está actualizada, seleccionamos el vehículo
        dispatch(addSelectedVehicle(vehicle));
        
    } catch (error) {
        console.error("❌ Error al procesar el vehículo:", error);
    }
  };

  return (
    <Main $isopen={state}>
      <span className="Sidebarbutton"  onClick={() => setState(!state)}>
        {<v.iconoflechaderecha />}
      </span>
      <Container $isopen={state} className={state ? "active" : ""}>
        <span className="label_title_list">
          {state ? (
            isLoading ? (
              <SkeletonWrapper>
                <Skeleton variant="rectangular" width={100} height={20} />
              </SkeletonWrapper>
            ) : (
              "Vehículo"
            )
          ) : (
            <div className="imgcontent" onClick={() => setState(!state)}>
              <img src={Car} alt="Car icon" />
            </div>
          )}
        </span>

        <div className="ContainerSearch">
          {isLoading ? (
            <SkeletonWrapper>
              <Skeleton variant="rectangular" width={280} height={40} />
            </SkeletonWrapper>
          ) : (

            <SearchWithFilter
              onSearch={(query, filters) => handleSearchAndFilter(query, filters)}
              onUpdateSubFilter={(newSubFilter) => setSubFilter(newSubFilter)} // Actualizar subfiltros
            />

          )}
        </div>

        <div className="ContainerListVehicle">
          {isLoading
            ? Array.from(new Array(5)).map((_, index) => (
                <SkeletonWrapper key={index}>
                  <Skeleton variant="rectangular" width={280} height={80} />
                </SkeletonWrapper>
              ))
            : filteredData.length == 0 ? 
            <span style={{ marginTop: "20px", color: "#888", fontSize: "14px" }}>
            No se encontró ninguna unidad.
          </span>
            : filteredData.map((vehicle, index) => (
                <VehicleCard
                  key={index}
                  name={vehicle.info.nombre}
                  status={vehicle.posicion_actual.id_status_motor == 2 ? "Detenido" : "En marcha"}
                  updated={vehicle.posicion_actual.fecha}
                  driver={vehicle.info.chofer}
                  onClick={() => {
                    handleCardClick(vehicle);
                  }}
                />
              ))}
        </div>
      </Container>
    </Main>
  );
}

// Estilos

const Container = styled.div`
  color: ${(props) => props.theme.text};
  background: ${(props) => props.theme.bg};
  position: fixed;
  padding-top: 20px;
  z-index: 1;
  cursor: pointer;
  border-radius: ${({ $isopen }) => ($isopen ? "0 0 0 0" : "10px 0 0 10px")};
  right: 0;
  height: ${({ $isopen }) => ($isopen ? "100%" : "80px")};
  width: 65px;
  transition: height 0.1s ease-in-out, width 0.1s ease-in-out;
  overflow-y: auto;
  overflow-x: hidden;

  &.active {
    width: 310px;
  }

  .label_title_list {
    margin: 0 8%;
    font-size: 13px;
    color: ${(props) => props.theme.colorSubtitle};
    font-weight: 500;
    display: flex;
    justify-content: center;
    text-align: center;
  }

  .ContainerSearch {
    display: ${({ $isopen }) => ($isopen ? "block" : "none")};
  }

  .ContainerListVehicle {
    display: ${({ $isopen }) => ($isopen ? "flex" : "none")};
    flex-direction: column;
    align-items: center;
  }

  .ContainerListVehicle > * {
    margin: 5px 0;
    transition: transform 0.2s;
  }

  .ContainerListVehicle > *:hover {
    transform: scale(1.05);
    cursor: pointer;
  }

  .imgcontent {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    cursor: pointer;
    transition: 0.3s ease;
    transform: ${({ $isopen }) =>
      $isopen ? `scale(0.7)` : `scale(1.5)`} rotate(${({ theme }) =>
      theme.logorotate});
    img {
      width: 100%;
      animation: flotar 1.7s ease-in-out infinite alternate;
    }
  }
`;

const Main = styled.div`
  .Sidebarbutton {
    position: fixed;
    top: 70px;
    right: ${({ $isopen }) => ($isopen ? "155px" : "45px")};
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${(props) => props.theme.bgtgderecha};
    box-shadow: 0 0 4px ${(props) => props.theme.bg3}, 0 0 7px ${(props) => props.theme.bg};
    display: ${({ $isopen }) => ($isopen ? "flex" : "none")};
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    z-index: 2;
    transform: ${({ $isopen }) =>
      $isopen ? `translateX(-140px) rotate(3.142rad)` : `initial`};
    color: ${(props) => props.theme.text};
  }
`;

const SkeletonWrapper = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: center;
`;