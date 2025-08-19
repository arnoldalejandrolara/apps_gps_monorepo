import styled from "styled-components";


import { VehicleCard } from "../CardVehicle.jsx";

export function VehicleListContainer({ vehicles, handleCardClick }) {
  return (
    <VehicleListStyled>
      {vehicles.length === 0 ? (
        <EmptyText>No hay carros</EmptyText>
      ) : (
        vehicles.map((vehicle, index) => (
          <VehicleCard
            key={index}
            name={vehicle.info?.nombre}
            status={
              vehicle.posicion_actual?.id_status_motor === 2
                ? "Detenido"
                : "En marcha"
            }
            updated={vehicle.posicion_actual?.fecha}
            driver={vehicle.info?.chofer}
            onClick={() => {
              handleCardClick(vehicle);
            }}
          />
        ))
      )}
    </VehicleListStyled>
  );
}

const VehicleListStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
`;

const EmptyText = styled.div`
  color: #bbb;
  font-size: 13px;
  margin-top: 16px;
`;