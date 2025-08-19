import React, { useState, useMemo } from "react";
import styled, { createGlobalStyle } from "styled-components";
import "react-datepicker/dist/react-datepicker.css";
import { FaColumns } from "react-icons/fa";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  getSortedRowModel,
} from "@tanstack/react-table";
import moment from "moment";
// Asegúrate de que tus importaciones locales sean correctas
// import { registros } from "./data";
import { getOrientation } from "../../../utilities/Functions";


const GlobalStyles = createGlobalStyle`
  .resizer {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background: transparent;
    cursor: col-resize;
    z-index: 1;
    user-select: none;
    touch-action: none;
  }

  .resizer:hover {
    background: #aaa;
  }
`;

const TablaConFiltros = ({
  data,
  onPaginationChange,
  controlledPagination,
  pageCount
}) => {

  const [columnVisibility, setColumnVisibility] = useState({});
  const [paginationState, setPaginationState] = useState({ pageIndex: 0, pageSize: 25 });
  const [sorting, setSorting] = useState([]);


  const handlePaginationChange = (newPagination) => {
    setPaginationState(newPagination);
    if (onPaginationChange) {
      onPaginationChange(newPagination);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Fecha",
        accessorKey: "fecha",
        size: 110,
        minSize: 100,
        maxSize: 140,
        cell: ({ row }) => (
          <StyledCell>
            <div>
              {row.original.fecha
                ? moment(row.original.fecha).format("DD/MM/YYYY HH:mm:ss")
                : "--"}
            </div>
          </StyledCell>
        ),
      },
      {
        header: "Unidad",
        accessorKey: "unidad",
        size: 130,
        minSize: 110,
        maxSize: 160,
        cell: ({ row }) => {
          const status = row.original.status_motor;
          let statusColor = "#aaa";
          if (status === "Encendido") statusColor = "#43a047";
          else if (status === "Apagado") statusColor = "#e53935";

          return (
            <StyledCell>
              <div style={{ fontWeight: "bold", fontSize: 12 }}>{row.original.unidad_nombre}</div>
              <div style={{ color: statusColor }}>
                <strong>Motor:</strong> {status || "Estado desconocido"}
              </div>
            </StyledCell>
          );
        },
      },
      {
        header: "Velocidad",
        accessorKey: "velocidad",
        size: 100,
        minSize: 80,
        maxSize: 120,
        cell: ({ row }) => {
          const { velocidad, odometro, horometro } = row.original;
          return (
            <StyledCell>
              <div><strong>{velocidad ?? "--"}</strong></div>
              <div style={{ fontSize: 12, color: "#666" }}>
                <span><strong>Odo:</strong> {odometro ?? "--"}</span>
                &nbsp;|&nbsp;
                <span><strong>Horo:</strong> {horometro ?? "--"}</span>
              </div>
            </StyledCell>
          );
        },
      },
      {
        header: "Alerta",
        accessorKey: "alerta",
        size: 120,
        minSize: 90,
        maxSize: 160,
        cell: ({ row }) => (
          <StyledCell>
            <div>{row.original.alerta}</div>
          </StyledCell>
        ),
      },
      {
        header: "Coordenadas",
        accessorKey: "coordenadas",
        size: 200,
        minSize: 160,
        maxSize: 300,
        cell: ({ row }) => (
          <StyledCell>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span role="img" aria-label="ubicación">📍</span>
              <strong>Lat:</strong> {row.original.location?.y ?? "N/A"}
              <strong style={{ marginLeft: 8 }}>Lng:</strong> {row.original.location?.x ?? "N/A"}
            </div>
            <div style={{ color: "#90caf9", marginTop: 2 }}>
              <strong>Dirección:</strong> {row.original.location?.address || "No disponible"}
            </div>
            {row.original.orientacion && (
              <div style={{ color: "#ffb300", marginTop: 2 }}>
                <strong>Orientación:</strong> {getOrientation(row.original.orientacion)}
              </div>
            )}
          </StyledCell>
        ),
      },
      {
        header: "Detenido",
        accessorKey: "detenido",
        size: 110,
        minSize: 90,
        maxSize: 140,
        cell: ({ row }) => (
          <StyledCell>
            <div>{row.original.velocidad == 0 ? 'Detenido' : 'En movimiento'}</div>
          </StyledCell>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      pagination: controlledPagination || paginationState,
      columnVisibility,
      sorting,
    },
    onPaginationChange: handlePaginationChange,
    onSortingChange: setSorting, // Habilitamos el handler de sorting
    pageCount: pageCount,
    manualPagination: !!controlledPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <GlobalStyles />
      <TableContainer>
        <TableResponsiveWrapper>
          <StyledTable>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{ // Los anchos se manejan mejor aquí
                        width: header.getSize(),
                        minWidth: header.column.columnDef.minSize,
                        maxWidth: header.column.columnDef.maxSize,
                      }}
                      onClick={header.column.getToggleSortingHandler()}
                      scope="col"
                      className={header.column.getCanSort() ? 'cursor-pointer' : ''}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted()] ?? null}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} data-label={cell.column.columnDef.header}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableResponsiveWrapper>

        <PaginationWrapper>
          <RowsPerPage>
            <span>Filas por página: </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[25, 50, 100, 200].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </RowsPerPage>
          <PaginationControls>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              title="Página anterior"
            >
              &lt;
            </button>
            <span>
              Página{' '}
              <strong>
                {table.getState().pagination.pageIndex + 1} de{' '}
                {table.getPageCount()}
              </strong>
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              title="Página siguiente"
            >
              &gt;
            </button>
          </PaginationControls>
        </PaginationWrapper>
      </TableContainer>
    </>
  );
};

// --- ESTILOS CORREGIDOS ---

const StyledCell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  div {
    line-height: 1.4;
    color: #fff;
  }

  div:first-child {
    font-size: 13px;
    font-weight: bold;
    color: #fff;
  }

  div:last-child {
    font-size: 12px;
    color: #aaaaaa;
  }
`;

// ✅ Contenedor principal que usa Flexbox para distribuir el espacio
const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%; // Ocupa todo el alto de su contenedor padre
`;

// ✅ Este es el wrapper que ahora tendrá el scroll
const TableResponsiveWrapper = styled.div`
  flex: 1; // 👈 Crucial: Hace que este div ocupe todo el espacio vertical disponible
  overflow: auto; // 👈 Crucial: Habilita el scroll (vertical y horizontal)
  background: transparent;
`;

const StyledTable = styled.table`
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;
  background: transparent;
  color: #fff;
  table-layout: fixed;

  th,
  td {
    padding: 12px 16px;
    text-align: center;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  th {
    // 👇 Toda la magia para el header fijo está aquí
    position: sticky; // 👈 Lo hace "pegajoso"
    top: 0;          // 👈 Se pega al inicio del contenedor con scroll
    z-index: 1;      // 👈 Se asegura que esté sobre el contenido del body

    background: #29292d; // Esencial para que no se vea el texto de abajo
    font-weight: bold;
    height: 60px;

    &.cursor-pointer {
      cursor: pointer;
    }
  }

  tbody tr:hover {
    background: #29292d;
  }

  th::after {
    content: '';
    position: absolute;
    top: 25%;
    bottom: 25%;
    right: 0;
    width: 1px;
    background-color: #474747;
  }

  th:last-child::after {
    content: none;
  }

  td {
    border-bottom: 1px dashed #474747;
  }

  tr:last-child td {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    min-width: 100%;
    font-size: 12px;

    // En móvil, el comportamiento de sticky header puede ser menos ideal.
    // Aquí se revierte para que el thead vuelva a ser estático y se use el layout de "tarjetas".
    thead {
      display: none;
    }
    th {
      position: static;
    }
    tbody, tr, td {
      display: block;
      width: 100%;
    }
    tr {
      margin-bottom: 18px;
      background: #232325;
      border-radius: 8px;
      box-shadow: 0 2px 4px #0002;
    }
    td {
      border: none;
      border-bottom: 1px solid #333;
      padding: 8px 12px;
      position: relative;
      text-align: left;
    }
    td:last-child {
      border-bottom: 0;
    }
    td:before {
      content: attr(data-label) ": ";
      font-weight: bold;
      color: #90caf9;
      display: inline-block;
      width: 40%;
      min-width: 90px;
    }
  }
`;

// ✅ La paginación ahora usa padding para separarse y se mantiene fija en la parte inferior
const PaginationWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 15px 0; // Usamos padding en lugar de margin
  gap: 50px;
`;

const RowsPerPage = styled.div`
  display: flex;
  align-items: center;
  color: #fff;

  span {
    margin-right: 8px;
    font-size: 13px;
  }

  select {
    background-color: transparent;
    color: #fff;
    border: none;
    padding: 5px;
    border-radius: 4px;
    cursor: pointer;
    animation: fadeIn 0.3s ease-out;

    &:hover {
      background-color: #444;
    }

    &:focus {
      outline: none;
      animation: slideDown 0.3s ease-out;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  button {
    background-color: transparent;
    color: #fff;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 4px;

    &:hover {
      background-color: #444;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      &:hover {
        background-color: transparent;
      }
    }
  }

  span {
    font-size: 13px;
    color: #fff;
  }
`;

export default TablaConFiltros;