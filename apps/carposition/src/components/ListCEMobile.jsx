import React from "react";
import styled from "styled-components";
import { FaTrash, FaEdit, FaPaperPlane } from "react-icons/fa";
import { formatLocalDate } from "../utilities/Functions";

// Ahora recibe también onSend
const ListCEMobile = ({
  cuentas = [],
  onEdit = () => {},
  onDelete = () => {},
  onSend = () => {},
}) => {
  return (
    <ListContainer>
      {cuentas.length === 0 ? (
        <Empty>Sin cuentas espejo.</Empty>
      ) : (
        cuentas.map((cuenta) => (
          <Card key={cuenta.codigo}>
            <CardContent>
              <CardRow>
                <Label>Nombre contacto</Label>
                <Value>{cuenta.nombre}</Value>
              </CardRow>
              <CardRow>
                <Label>Código</Label>
                <Value>{cuenta.clave_acceso}</Value>
              </CardRow>
              <CardRow>
                <Label>Unidad</Label>
                <Value>{cuenta.unidades}</Value>
              </CardRow>
              <CardRow>
                <Label>Expiración</Label>
                <Value>
                  {cuenta.libre ? 'Libre Acceso - ' : ''}
                  {cuenta.fecha_expiracion === null ? 'No expira' : `${formatLocalDate(cuenta.fecha_expiracion)}`}
                </Value>
              </CardRow>
            </CardContent>
            <Actions>
              <ActionBtn
                title="Editar"
                onClick={() => onEdit(cuenta)}
                $edit
              >
                <FaEdit />
                <span>Editar</span>
              </ActionBtn>
              <ActionBtn
                title="Enviar"
                onClick={() => onSend(cuenta)}
                $send
              >
                <FaPaperPlane />
                <span>Enviar</span>
              </ActionBtn>
              {/* <ActionBtn
                title="Eliminar"
                onClick={() => onDelete(cuenta)}
                $delete
              >
                <FaTrash />
                <span>Eliminar</span>
              </ActionBtn> */}
            </Actions>
          </Card>
        ))
      )}
    </ListContainer>
  );
};

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  padding: 10px 0;
`;

const Card = styled.div`
  background: #202020;
  border-radius: 8px;
  box-shadow: 0 4px 18px 0 rgba(44,62,80,0.08);
  padding: 0;
  color: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1.5px solid #555;
  position: relative;
  transition: box-shadow .2s, border-color .2s;
  &:hover {
    box-shadow: 0 8px 25px 0 rgba(44,62,80,0.15);
    border-color: #407fff55;
  }
`;

const CardContent = styled.div`
  padding: 16px 16px 10px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  padding-bottom: 2px;
  border-bottom: 1px solid rgba(255,255,255,0.035);
  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  opacity: 0.75;
  font-weight: 500;
  min-width: 110px;
  font-size: 12px;
  color: #bcbcbc;
`;

const Value = styled.span`
  font-weight: 600;
  text-align: right;
  font-size: 11px;
  word-break: break-all;
  max-width: 60%;
  color: #eaeaea;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 13px 14px 12px 14px;
  background: #242424;
  border-top: 1px solid #2d2d2d;
  border-radius: 0 0 8px 8px;
  margin-top: 5px;
`;

const ActionBtn = styled.button`
  flex: 1;
  background: ${({ $edit, $delete, $send }) =>
    $edit
      ? "linear-gradient(90deg,#417dff 0%,#2a5ad9 100%)"
      : $delete
      ? "linear-gradient(90deg,#ff5c5c 0%,#c62828 100%)"
      : $send
      ? "linear-gradient(90deg,#23e3ae 0%,#249686 100%)"
      : "#444"};
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 9px 0;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  transition: background .18s, box-shadow .18s;
  box-shadow: 0 1px 8px 0 rgba(44,62,80,0.05);
  &:hover {
    filter: brightness(1.10) saturate(1.18);
    box-shadow: 0 2px 14px 0 rgba(44,62,80,0.12);
  }
`;

const Empty = styled.div`
  color: #b1bad3;
  text-align: center;
  padding: 38px 0;
  font-size: 17px;
`;

export default ListCEMobile;