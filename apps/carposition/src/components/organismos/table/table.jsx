import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle, css } from 'styled-components';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { MdModeEditOutline, MdDelete ,MdSecurity} from 'react-icons/md';
import { FaCheckCircle, FaTrash, FaMapMarkerAlt, FaDrawPolygon } from "react-icons/fa";
import { FaInfo } from 'react-icons/fa';
import { HiPhone } from 'react-icons/hi';
import { OptionsMenu } from '../../moleculas/OptionsMenu.jsx';
import { getOrientation } from '../../../utilities/Functions';
import moment from 'moment';

const SelectedBanner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  background-color: #e6f7e9;
  color: #389e0d;
  font-weight: 500;
  font-size: 14px;
  border-radius: 8px 8px 0 0;
  border-bottom: 2px solid #b7eb8f;
  
  // Posicionamiento para que flote encima
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2; // Asegura que esté encima del encabezado de la tabla
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const BannerContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TrashIcon = styled(FaTrash)`
  font-size: 16px;
  color: #647381;
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: #f44336;
  }
`;

// Global styles for the resizer (if needed)
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
    background: #ccc;
  }
`;

// Helper function to format time
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

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    return dateString;
  }
};

export function TablaPuntosInteres({
  type,
  data,
  isLoading,
  onPaginationChange,
  pagination: controlledPagination,
  pageCount,
  onEdit,
  onPermisos
}) {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState(controlledPagination || { pageIndex: 0, pageSize: 5 });

  const handlePaginationChange = (newPagination) => {
    setPagination(newPagination);
    if (onPaginationChange) {
      onPaginationChange(newPagination);
    }
  };

  const columnsCuentasEspejo = [
    {
      header: ({ table }) => (
        <CheckboxContainer>
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected() || table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        </CheckboxContainer>
      ),
      accessorKey: 'checkbox',
      size: 90,    
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
      header: 'Nombre',
      accessorKey: 'nombre',
      cell: ({ row }) => (
        <StyledTextCell>
          <div>{row.original.nombre}</div>
          <StyledSubtext>{row.original.email}</StyledSubtext>
        </StyledTextCell>
      ),
    },
    {
      header: 'Fecha de expiración',
      accessorKey: 'fecha_expiracion',
      cell: ({ row }) => (
        <StyledTextCell>
          <div>{row.original.fecha_expiracion ? new Date(row.original.fecha_expiracion).toLocaleDateString() : ''}</div>
        </StyledTextCell>
      ),
    },
    {
      header: 'Empresa',
      accessorKey: 'empresa',
      cell: ({ row }) => (
        <StyledTextCell>
          <div>{row.original.cliente}</div>
        </StyledTextCell>
      ),
    },
    {
      header: 'Unidades',
      accessorKey: 'unidades',
      cell: ({ row }) => (
        <StyledTextCell>
          <div>{row.original.unidades}</div>
        </StyledTextCell>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <StyledStatusCell status={row.original.libre ? 'Active' : ''}>
          {row.original.libre ? 'Acceso Libre' : ''}
        </StyledStatusCell>
      ),
    },
    {
      header: '',
      accessorKey: 'options',
      size: 90,    
      cell: ({ row }) => {
        const actions = [
          {
            label: 'Editar',
            icon: <MdModeEditOutline />,
            onClick: () => onEdit(row.original),
          },
          {
            label: 'Eliminar',
            icon: <MdDelete />,
            className: 'delete',
            onClick: () => handleDelete(row),
          },
        ];
        return (
          <CenteredCell>
            <OptionsMenu actions={actions} />
          </CenteredCell>
        );
      },
    },
  ];

  const columnsHistory = [
    {
      header: 'Fecha',
      accessorKey: 'fecha',
      cell: ({ row }) => (
        <StyledCell>
          <div>{row.original.fecha ? moment(row.original.fecha).format("DD/MM/YYYY HH:mm:ss") : "--"}</div>
        </StyledCell>
      ),
    },
    {
      header: 'Unidad',
      accessorKey: 'unidad',
      cell: ({ row }) => {
        const status = row.original.status_motor;
        let statusColor = "#aaa";
        if (status === "Encendido") statusColor = "#43a047";
        else if (status === "Apagado") statusColor = "#e53935";
        return (
          <StyledCell>
            <div>{row.original.unidad_nombre}</div>
            <div style={{ color: statusColor }}>
              <strong>Motor:</strong> {status || "Estado desconocido"}
            </div>
          </StyledCell>
        );
      }
    },
    {
      header: 'Velocidad',
      accessorKey: 'velocidad',
      cell: ({ row }) => {
        const { velocidad, odometro, horometro } = row.original;
        return (
          <StyledCell>
                <div><strong>{velocidad ? velocidad + " km/h" : "--"}</strong></div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  <span><strong>Odo:</strong> {odometro ?? "--"}</span>
                  &nbsp;|&nbsp;
                  <span><strong>Horo:</strong> {horometro ?? "--"}</span>
                </div>
          </StyledCell>
        );
      }
    },
    {
      header: 'Alerta',
      accessorKey: 'alerta',
      cell: ({ row }) => (
        <StyledTextCell>
          <div>{row.original.alerta}</div>
        </StyledTextCell>
      ),
    },
    {
      header: 'Coordenadas',
      accessorKey: 'coordenadas',
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
      header: 'Detenido',
      accessorKey: 'detenido',
      cell: ({ row }) => (
        <StyledTextCell>
          <div>{row.original.velocidad == 0 ? 'Detenido' : 'En movimiento'}</div>
        </StyledTextCell>
      ),
    },
  ];

  const columnsPDI = [
    {
      header: 'Nombre',
      accessorKey: 'nombre',
      cell: ({ row }) => (
        <StyledTextCell>
          <div>{row.original.nombre}</div>
        </StyledTextCell>
      ),
    },
    {
      header: 'Categoría',
      accessorKey: 'categoria',
      cell: ({ row }) => (
        <StyledTextCell>
          <div>{row.original.categoria}</div>
        </StyledTextCell>
      ),
    },
    {
      header: 'Icono',
      accessorKey: 'icono',
      cell: ({ row }) => (
        <StyledIconCell>
          <FaMapMarkerAlt style={{ color: '#' + row.original.icono_hex_color || '#666', fontSize: 18 }} />
          <span>{row.original.icono}</span>
        </StyledIconCell>
      ),
    },
    {
      header: 'Coordenadas',
      accessorKey: 'coordenadas',
      cell: ({ row }) => (
        <StyledTextCell>
          <div>{row.original.coordenadas.x}, {row.original.coordenadas.y}</div>
        </StyledTextCell>
      ),
    },
    {
      header: 'Radio',
      accessorKey: 'radio',
      cell: ({ row }) => (
        <StyledTextCell>
          <div>{row.original.radio} m</div>
        </StyledTextCell>
      ),
    },
    {
      header: 'Comentarios',
      accessorKey: 'comentarios',
      cell: ({ row }) => (
        <StyledTextCell>
          <div>{row.original.comentarios}</div>
        </StyledTextCell>
      ),
    },
    {
      header: '',
      accessorKey: 'options',
      size: 90,    
      cell: ({ row }) => {
        const actions = [
          {
            label: 'Editar',
            icon: <MdModeEditOutline />,
            onClick: () => onEdit(row.original),
          },
          {
            label: 'Eliminar',
            icon: <MdDelete />,
            className: 'delete',
            onClick: () => handleDelete(row),
          },
        ];
        return (
          <CenteredCell>
            <OptionsMenu actions={actions} />
          </CenteredCell>
        );
      },
    },
  ];

  const columnsGeocercas = [
    {
      header: 'Nombre',
      accessorKey: 'nombre',
      cell: ({ row }) => (
        <StyledTextCell>
          <div>{row.original.nombre}</div>
        </StyledTextCell>
      ),
    },
    {
      header: 'Icono',
      accessorKey: 'icono',
      cell: ({ row }) => (
        <StyledIconCell>
          <FaDrawPolygon style={{ color: row.original.hex_color ? `#${row.original.hex_color}` : '#3388ff' }} />
          <span>{row.original.icono}</span>
        </StyledIconCell>
      ),
    },
    {
      header: 'Comentarios',
      accessorKey: 'comentarios',
      cell: ({ row }) => (
        <StyledTextCell>
          <div>{row.original.comentarios}</div>
        </StyledTextCell>
      ),
    },
    {
      header: '',
      accessorKey: 'options',
      size: 90,    
      cell: ({ row }) => {
        const actions = [
          {
            label: 'Editar',
            icon: <MdModeEditOutline />,
            onClick: () => onEdit(row.original),
          },
        ];
        return (
          <CenteredCell>
            <OptionsMenu actions={actions} />
          </CenteredCell>
        );
      },
    },
  ];

  const columnsUsers = [
    {
      header: 'Nickname',
      accessorKey: 'nickname',
      cell: ({ row }) => (
        <StyledTextCell>
          <div>{row.original.nickname}</div>
        </StyledTextCell>
      ),
    },
    {
      header: 'Email',
      accessorKey: 'email',
      cell: ({ row }) => (
        <StyledTextCell>
          <div>{row.original.correo}</div>
        </StyledTextCell>
      ),
    },
    {
      header: 'Teléfono',
      accessorKey: 'telefono',
      cell: ({ row }) => (
        <StyledTextCell>
          <div>{row.original.telefono}</div>
        </StyledTextCell>
      ),
    },
    {
      header: 'Rol',
      accessorKey: 'rol',
      cell: ({ row }) => (
        <StyledTextCell>
          <div>{row.original.tipo}</div>
        </StyledTextCell>
      ),
    },
    {
      header: 'Unidades',
      accessorKey: 'unidades',
      cell: ({ row }) => (
        <StyledTextCell>
          <div>{row.original.cant_unidades} unidades</div>
        </StyledTextCell>
      ),
    },
    {
      header: '',
      accessorKey: 'options',
      size: 90,    
      cell: ({ row }) => {
        const actions = [
          {
            label: 'Editar',
            icon: <MdModeEditOutline />,
            onClick: () => onEdit(row.original),
          },
          {
            label: 'Permisos',
            icon: <MdSecurity />,
            onClick: () => onPermisos(row.original),
          },
        ];
        return (
          <CenteredCell>
            <OptionsMenu actions={actions} />
          </CenteredCell>
        );
      },
    },
  ];

  let columns;
  switch (type) {
    case 'dispositivo':
      columns = null;
      break;
    case 'cuentas-espejo':
      columns = columnsCuentasEspejo;
      break;
    case 'history':
      columns = columnsHistory;
      break;
    case 'pdi':
      columns = columnsPDI;
      break;
    case 'geocercas':
      columns = columnsGeocercas;
      break;
    case 'users':
      columns = columnsUsers;
      break;
    default:
      console.error('Tipo de tabla no reconocido:', type);
      return null;
  }

  const [rowSelection, setRowSelection] = useState({});

  
  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      pagination,
      rowSelection, 
    },
    onPaginationChange: handlePaginationChange,
    onRowSelectionChange: setRowSelection,
    pageCount,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Cargando datos...</LoadingText>
      </LoadingContainer>
    );
  }

  const selectedCount = Object.keys(table.getState().rowSelection).length;
  
  const handleClearSelection = () => {
    table.resetRowSelection();
  };

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
                    <th key={header.id}
                        style={{ width: header.column.getSize() }}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableResponsiveWrapper>
        {selectedCount > 0 && (
          <SelectedBanner>
            <BannerContent>
              <CheckboxContainer>
                <input
                  type="checkbox"
                  checked={true} // Siempre marcado cuando hay selección
                  onChange={handleClearSelection} // Al hacer clic, deselecciona todo
                />
              </CheckboxContainer>
              {selectedCount} registro{selectedCount > 1 ? 's' : ''} seleccionado{selectedCount > 1 ? 's' : ''}
            </BannerContent>
            <TrashIcon />
          </SelectedBanner>
        )}
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
                {table.getState().pagination.pageIndex + 1} de {pageCount}
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
}

const StyledCell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  div {
    line-height: 1.4;
    color:rgb(37, 36, 36);
  }

  div:first-child {
    font-size: 13px;
    font-weight: bold;
    color: rgb(37, 36, 36);
  }

  div:last-child {
    font-size: 12px;
    color: #aaaaaa;
  }
`;

const StyledSubtext = styled.div`
  font-size: 12px;
  color: #888;
`;

// Styled components with white theme
const StyledTable = styled.table`
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;
  background: #fff;
  color: #333;
  table-layout: fixed;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border-radius: 8px;

  th, td {
    padding: 12px 16px;
    text-align: left;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  th {
    position: sticky;
    top: 0;
    z-index: 1;
    color: #647381;
    background: #f8f9fa;
    font-weight: 600;
    font-size: 12px;
    height: 57px;
    border-bottom: 2px solid #e9ecef;
  }

  td {
    height: 75px;
    border-bottom: 1px solid #e9ecef;
  }

  tbody tr:hover {
    background: #f1f3f5;
  }

  tr:last-child td {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    min-width: 100%;
    font-size: 12px;
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
      margin-bottom: 12px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    td {
      border: none;
      padding: 10px 16px;
      text-align: left;
    }
    td:last-child {
      border-bottom: 0;
    }
    td:before {
      content: attr(data-label) ": ";
      font-weight: bold;
      color: #adb5bd;
      display: inline-block;
      width: 40%;
      min-width: 90px;
    }
  }
`;

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  position: relative; // Contenedor para la barra flotante
`;

const TableResponsiveWrapper = styled.div`
  flex: 1;
  overflow: auto;
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

const StyledTextCell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: #333;
  div {
    line-height: 1.4;
  }
  div:first-child {
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }
  div:last-child {
    font-size: 12px;
    color: #6c757d;
  }
`;

const StyledStatusCell = styled.div`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 12px;

  ${props => props.status === 'Active' && css`
    background-color: #e6f7e9;
    color: #389e0d;
    // border: 1px solid #b7eb8f;
  `}

  ${props => props.status === 'Banned' && css`
    background-color: #ffebee;
    color: #f44336;
    // border: 1px solid #f44336;
  `}

  ${props => props.status === 'Pending' && css`
    background-color: #fff8e1;
    color: #f57c00;
    // border: 1px solid #ffecb3;
  `}

  ${props => props.status === 'Suspended' && css`
    background-color: #f5f5f5;
    color: #757575;
    // border: 1px solid #e0e0e0;
  `}

  /* Puedes añadir más estilos para otros estados si es necesario */
`;

const StyledIconCell = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #333;
  font-size: 14px;
  font-weight: 600;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-top: 1px solid #e9ecef;
  background-color: #f8f9fa;
  gap: 50px;
`;

const RowsPerPage = styled.div`
  display: flex;
  align-items: center;
  color: #6c757d;
  span {
    margin-right: 8px;
    font-size: 14px;
  }
  select {
    background-color: #fff;
    color: #333;
    border: 1px solid #ced4da;
    padding: 6px 10px;
    border-radius: 4px;
    cursor: pointer;
    &:focus {
      outline: none;
      border-color: #00aaff;
      box-shadow: 0 0 0 2px rgba(0, 170, 255, 0.25);
    }
  }
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  button {
    background-color: #fff;
    color: #6c757d;
    border: 1px solid #ced4da;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 44px;
    transition: all 0.2s ease-in-out;
    &:hover:not(:disabled) {
      background-color: #e9ecef;
      color: #333;
    }
    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
  span {
    font-size: 14px;
    color: #6c757d;
    white-space: nowrap;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  color: #333;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #00aaff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #333;
  margin-left: 15px;
  font-size: 14px;
`;

// New styled component to center the options menu
const CenteredCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;