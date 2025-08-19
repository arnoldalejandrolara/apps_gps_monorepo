import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import iconmap from '../../../assets/map_pin.svg';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { OptionsMenu } from '../../moleculas/OptionsMenu';

const data = [
  { id: 1, nombre: 'Parque Central', categoria: 'Parque', ciudad: 'Madrid', iconos: true },
  { id: 2, nombre: 'Museo de Arte', categoria: 'Cultura', ciudad: 'Barcelona', iconos: true },
  { id: 3, nombre: 'Playa Dorada', categoria: 'Playa', ciudad: 'Valencia', iconos: true },
];

const columns = [
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
  { header: 'ID', accessorKey: 'id' },
  { header: 'Nombre', accessorKey: 'nombre' },
  { header: 'Fecha Creacion', accessorKey: 'fecha_creacion' },
  { header: 'Ultima Modificacion', accessorKey: 'ultima_modificacion' },
  {
    header: 'Iconos',
    accessorKey: 'iconos',
    cell: () => (
      <IconContainer>
        <img src={iconmap} alt="pin" className="map-icon" />
      </IconContainer>
    ),
  },
  {
    header: '',
    accessorKey: 'options',
    cell: ({ row }) => <OptionsMenu row={row} />,
  },
];

// function OptionsMenu({ row }) {
//   const [isMenuOpen, setMenuOpen] = useState(false);
//   const buttonRef = useRef(null);

//   const toggleMenu = () => {
//     setMenuOpen(!isMenuOpen);
//   };

//   return (
//     <OptionsWrapper>
//       <ThreeDots ref={buttonRef} onClick={toggleMenu}>⋮</ThreeDots>
//       {isMenuOpen && (
//         <FloatingMenu>
//           <ul>
//             <li>Editar</li>
//             <li>Eliminar</li>
//             <li>Detalles</li>
//           </ul>
//         </FloatingMenu>
//       )}
//     </OptionsWrapper>
//   );
// }

export function TablaPuntosInteres() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <TableWrapper>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={
                    header.column.columnDef.accessorKey === 'iconos' ||
                    header.column.columnDef.accessorKey === 'checkbox' ||
                    header.column.columnDef.accessorKey === 'options' ||
                    header.column.columnDef.accessorKey === 'id'
                      ? 'icon-column'
                      : ''
                  }
                >
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
                <td
                  key={cell.id}
                  className={
                    cell.column.columnDef.accessorKey === 'iconos'
                      ? 'icon-column'
                      : ''
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
}

const TableWrapper = styled.div`
  padding: 10px 60px;
  margin-top: 20px;
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    background: #2a2a2a;
    table-layout: fixed;
    border-radius: 8px;
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
    width: 10%;
    padding: 0;
  }

  th {
    background-color: #202020;
    font-weight: bold;
    height: 50px;
    position: relative;
  }

  th::after {
    content: '';
    position: absolute;
    top: 25%;
    bottom: 25%;
    right: 0;
    width: 1px;
    background-color: #444;
  }

  th:last-child::after {
    content: none;
  }

  td {
    border-bottom: 1px dashed #444;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover td {
    background-color: #333;
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

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px;

  img {
    width: 65px;
    height: 55px;
  }
`;

const OptionsWrapper = styled.div`
  position: relative;
  cursor: pointer;
  display: inline-block;
  // background: red;
  padding: 0px 15px;
  border-radius: 50%;

  &:hover {
    background: #444;
  }
`;

const ThreeDots = styled.div`
  cursor: pointer;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FloatingMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: #2a2a2a;
  color: #fff;
  border: 1px solid #444;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
  padding: 10px;
  z-index: 100;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      padding: 8px 12px;
      cursor: pointer;

      &:hover {
        background: #444;
      }
    }
  }
`;