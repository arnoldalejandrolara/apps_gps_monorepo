import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';

// import {OptionsMenu} from '../../moleculas/OptionsMenu.jsx';
import {OptionsMenuCE} from '../../moleculas/OptionsMenuCE.jsx';
import { formatLocalDate } from '../../../utilities/Functions.jsx';

const StyledCell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  div {
    line-height: 1.4;
    color: #fff;
    white-space: normal;
    word-break: break-word;
    text-align: left;
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

const StyledCellStatus = styled.div`
  padding: 5px 10px;
  background-color: #213F36;
  border-radius: 8px;
  color: #76ED8B;
`;

const formatTimeAgo = (minutes) => {
  if (!minutes) return 'Nunca';
  
  if (minutes === 0) return 'hace 0 minutos';

  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;

  const parts = [];
  
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0 || parts.length === 0) parts.push(`${mins}m`);

  return 'hace ' + parts.join(' ');
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return dateString.split('T')[0];
};

const columnsDispositivo = [
  
  {
    header: '',
    accessorKey: 'options',
    cell: ({ row }) => <OptionsMenu row={row} />,
  },
];

export function TablaPuntosInteres({
  type,
  data,
  isLoading,
  onPaginationChange,
  pagination: controlledPagination,
  totalRows,
  pageCount,
  sorting: controlledSorting,
  onSortingChange,
  onEdit,
  onSend
}) {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ 
    pageIndex: 0, 
    pageSize: 5 
  });

  const handlePaginationChange = (newPagination) => {
    setPagination(newPagination);
    onPaginationChange(newPagination);
  };

  let columns = columnsDispositivo;



  const columnsCuentasEspejo = [
    {
      header: ({ table }) => (
        <CheckboxContainer>
          <input
            type="checkbox"
            onChange={(e) => {
              const isChecked = e.target.checked;
              table.getRowModel().rows.forEach((row) => {
                row.getToggleSelectedHandler()(isChecked);
              });
            }}
          />
        </CheckboxContainer>
      ),
      accessorKey: 'checkbox',
      cell: ({ row }) => (
        <CheckboxContainer>
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        </CheckboxContainer>
      ),
    },
    {
      header: 'Codigo',
      accessorKey: 'codigo',
      cell: ({ row }) => (
        <StyledCell>
          <div>{row.original.clave_acceso}</div>
        </StyledCell>
      ),
    },
    {
      header: 'Nombre',
      accessorKey: 'nombre',
      cell: ({ row }) => (
        <StyledCell>
          <div>{row.original.nombre}</div>
        </StyledCell>
      ),
    },
    {
        header: 'Unidades',
        accessorKey: 'unidades',
        cell: ({ row }) => (
          <StyledCell>
            <div>{row.original.unidades}</div>
          </StyledCell>
        ),
      },
      {
        header: 'Expiración',
        accessorKey: 'expiracion',
        cell: ({ row }) => (
          <StyledCell>
            <div>{formatLocalDate(row.original.fecha_expiracion)}</div>
           
          </StyledCell>
        ),
      },
    {
      header: '',
      accessorKey: 'options',
      cell: ({ row }) => <OptionsMenuCE row={row} onEdit={() => onEdit(row.original)} onSend={() => onSend(row.original)} />,
    },
  ];

  

  if(type === 'cuentasespejo') {
    columns = columnsCuentasEspejo;
  } else {
    columns = [];
  } 

  const table = useReactTable({
    data: data || [],
    columns: columns,
    state: { 
      sorting, 
      pagination: controlledPagination || pagination // usa el externo si lo hay, si no, usa el local
    },
    onPaginationChange: onPaginationChange || setPagination, // idem para el handler
    pageCount: pageCount,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // <-- AGREGA ESTA LÍNEA
  });

  if(isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Cargando datos...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <TableWrapper>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: 'pointer' }}
                  className={
                    header.column.columnDef.accessorKey === 'iconos' ||
                    header.column.columnDef.accessorKey === 'checkbox' ||
                    header.column.columnDef.accessorKey === 'options' ||
                    header.column.columnDef.accessorKey === 'id'
                      ? 'icon-column'
                      : ''
                  }
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
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <PaginationWrapper>
        <RowsPerPage>
          <span>Filas por página: </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 25].map((pageSize) => (
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
              {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
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
    </TableWrapper>
  );
}

const TableWrapper = styled.div`
  padding: 0px 0px;
  margin-top: 20px;
  overflow-x: auto;
  overflow-y: auto;
  position: relative;

  /* Ocultar barra de scroll por defecto */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE y Edge */

  &::-webkit-scrollbar {
    display: none; /* Ocultar scrollbar en navegadores basados en Webkit */
  }

  /* Mostrar scroll solo al interactuar */
  &:hover {
    scrollbar-width: thin; /* Firefox */
    &::-webkit-scrollbar {
      display: block; /* Mostrar scrollbar */
      width: 8px;
      background-color: #202020;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #444;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: #555;
    }

    &::-webkit-scrollbar-thumb:active {
      background-color: #fff; /* Estilo para cuando se presiona el scroll */
    }
  }


  table {
    width: 100%;
    border-collapse: collapse;
    background: transparent;
    table-layout: fixed;
    overflow: hidden;
    color: #fff;
  }

  th,
  td {
    padding: 12px 16px;
    font-size: 12px;
    text-align: center;
     white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

   th.icon-column,
  td.icon-column {
    width: 7%;
    padding: 0;
  }

  th {
    background-color: #29292d;
    font-weight: bold;
    height: 60px;
    position: relative;
  }

 th::after {
    content: '';
    position: absolute;
    top: 25%;
    bottom: 25%;
    right: 0;
    width: 1px;
    background-color: #333D47;
  }

  th:last-child::after {
    content: none;
  }

  td {
    border-bottom: 1px dashed #29292d;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover td {
    background-color: #29292d;
  }
`;

const CheckboxContainer = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
    accent-color: #00aaff;
    cursor: pointer;
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
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
  }

  span {
    font-size: 13px;
    color: #fff;
  }
`;

// Agregar después de los imports existentes
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
  background: #1C252E;
  border-radius: 8px;
  padding: 20px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #28323D;
  border-top: 3px solid #00aaff;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #fff;
  margin-left: 15px;
  font-size: 14px;
`;