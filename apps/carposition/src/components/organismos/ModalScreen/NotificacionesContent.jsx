import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper();

const NotificacionesContent = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const [notificationsEnabled2, setNotificationsEnabled2] = useState(false);

  const [selectedOption, setSelectedOption] = useState('');
  const [email, setEmail] = useState('example@example.com');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);

  const handleCheckboxChange = (e) => setNotificationsEnabled(e.target.checked);
  const handleCheckboxChange2 = (e) => setNotificationsEnabled2(e.target.checked);

  const handleSelectChange = (e) => setSelectedOption(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value);

  const data = useMemo(
    () => [
      {
        name: 'Absent Device Recovered',
        plataforma: false,
        email: true,
        app: false,
        whatsapp: true,
        sonido: true,
      },
      {
        name: 'Activacion de Motor Con Exito',
        plataforma: true,
        email: false,
        app: true,
        whatsapp: false,
        sonido: true,
      },
      {
        name: 'Alarma de Movimiento',
        plataforma: true,
        email: false,
        app: true,
        whatsapp: false,
        sonido: true,
      },
      {
        name: 'Alarma de Nivel de Bateria',
        plataforma: true,
        email: false,
        app: true,
        whatsapp: false,
        sonido: true,
      },
      {
        name: 'Alarma de Panico Activada SOS',
        plataforma: true,
        email: false,
        app: true,
        whatsapp: false,
        sonido: true,
      },
      {
        name: 'Alarma de Velocidad Disparada',
        plataforma: true,
        email: false,
        app: true,
        whatsapp: false,
        sonido: true,
      },
      {
        name: 'Cell Phone Network Coverage Lost was detected',
        plataforma: true,
        email: false,
        app: true,
        whatsapp: false,
        sonido: true,
      },
      {
        name: 'Paro de Motor por Violacion de GeoCerca',
        plataforma: true,
        email: false,
        app: true,
        whatsapp: false,
        sonido: true,
      },
    ],
    []
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: () => 'Alarma',
        cell: (info) => (
          <span style={{ fontSize: '13px', fontWeight: 400 }}>
            {info.getValue()}
          </span>
        ),
        enableSorting: true,
      }),
      ...['plataforma', 'email', 'app', 'whatsapp'].map((key) =>
        columnHelper.accessor(key, {
          header: () => key.charAt(0).toUpperCase() + key.slice(1),
          cell: ({ row, column }) => {
            const checked = row.original[column.id];
            return (
              <RoundedCheckbox
                type="checkbox"
                checked={checked}
                onChange={() => {
                  row.original[column.id] = !checked;
                }}
              />
            );
          },
          enableSorting: false,
        })
      ),
      // Sonido con botón en vez de checkbox
      columnHelper.accessor('sonido', {
        header: () => 'Sonido',
        cell: () => (
          <SoundButton>
            🎵
          </SoundButton>
        ),
        enableSorting: false,
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
  });

  return (
    <Container>
      <Section>
        <Title>Mis notificaciones</Title>
        <HorizontalLine />
      </Section>

      <Section>
        <SecurityItem>
          <SecurityLabelContainer>
            <SecurityLabel>Administrar notificaciones de todos los usuarios</SecurityLabel>
            <SecurityValue>
              Gestiona todas las notificaciones de todo tu equipo de trabajo con una sola configuración.
            </SecurityValue>
          </SecurityLabelContainer>
          <SecurityCheckbox type="checkbox" checked={notificationsEnabled} onChange={handleCheckboxChange} />
        </SecurityItem>

        <SecurityItem>
          <SecurityLabelContainer>
            <SecurityLabel>Administrar notificaciones por unidad</SecurityLabel>
            <SecurityValue>Gestiona todas las notificaciones por unidad</SecurityValue>
          </SecurityLabelContainer>
          <SecuritySelect value={selectedOption} onChange={handleSelectChange}>
            <option value="">Buscar usuario</option>
            <option value="option1">Opción 1</option>
            <option value="option2">Opción 2</option>
          </SecuritySelect>
        </SecurityItem>

        <HorizontalLine />

        <SecurityItem>
          <SecurityInput type="email" value={email} onChange={handleEmailChange} placeholder="Correo electrónico" />
          <SecurityInput type="tel" value={phoneNumber} onChange={handlePhoneNumberChange} placeholder="Número telefónico" />
        </SecurityItem>

        <SecurityItem>
          <SecurityLabelContainer>
            <SecurityLabel>Administrar notificaciones para todas las unidades</SecurityLabel>
            <SecurityValue>
              Gestiona todas las notificaciones de todas las unidades con una sola configuración.
            </SecurityValue>
          </SecurityLabelContainer>
          <SecurityCheckbox type="checkbox" checked={notificationsEnabled2} onChange={handleCheckboxChange2} />
        </SecurityItem>

        <SecurityItem>
          <SecurityLabelContainer>
            <SecurityLabel>Administrar notificaciones por unidad</SecurityLabel>
            <SecurityValue>Gestiona según la unidad que escojas.</SecurityValue>
          </SecurityLabelContainer>
          <SecuritySelect value={selectedOption} onChange={handleSelectChange}>
            <option value="">Buscar unidad</option>
            <option value="option1">Unidad 1</option>
            <option value="option2">Unidad 2</option>
          </SecuritySelect>
        </SecurityItem>

        <HorizontalLine />

        <SecurityInput
          type="text"
          placeholder="Buscar alarma..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          style={{ width: '60%', marginBottom: '15px' }}
        />

        <AlarmList>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                 <th
                 key={header.id}
                 onClick={header.column.getToggleSortingHandler()}
                 style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
               >
                 {flexRender(header.column.columnDef.header, header.getContext())}
                 {header.column.getCanSort() && (
                   <span style={{ marginLeft: '4px' }}>
                     {{
                       asc: ' 🔼',
                       desc: ' 🔽',
                     }[header.column.getIsSorted()] ?? ' ↕️'}
                   </span>
                 )}
               </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </AlarmList>
      </Section>
    </Container>
  );
};

// ... (estilos se mantienen igual)

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  color: white;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

const SoundButton = styled.button`
  background-color: transparent;
  border: 1px solid #474747;
  border-radius: 8px;
  padding: 4px 8px;
  color: white;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const Section = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
`;

const HorizontalLine = styled.hr`
  width: 100%;
  border: 1px solid #333;
  margin-bottom: 20px;
`;

const SecurityItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const SecurityLabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 70%;
`;

const SecurityLabel = styled.div`
  font-size: 14px;
  color: white;
`;

const SecurityValue = styled.div`
  font-size: 13px;
  color: grey;
`;

const SecurityCheckbox = styled.input`
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

const SecuritySelect = styled.select`
  font-size: 13px;
  color: white;
  background: transparent;
  border: 1px solid grey;
  border-radius: 8px;
  padding: 8px 10px;
`;

const SecurityInput = styled.input`
  font-size: 13px;
  color: white;
  background: transparent;
  border: 1px solid grey;
  border-radius: 8px;
  padding: 8px 10px;
  width: 48%;
  margin-bottom: 10px;
`;

const AlarmList = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #1e1e2f;
  border-radius: 10px;
  overflow: hidden;

  th,
  td {
    border: 1px solid #444;
    padding: 8px;
    text-align: center;
    color: white;
    font-size: 14px;
  }

  th {
    background-color: #333333;
    color: #fff;
    font-weight: bold;
    text-transform: uppercase;
  }

  tr:nth-child(even) {
    background-color: #2A2A2A;
  }

  tr:nth-child(odd) {
    background-color: #2A2A2A;
  }

  tr:hover {
    background-color: #33334d;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
  }
`;

const RoundedCheckbox = styled.input.attrs({ type: 'checkbox' })`
  width: 20px;
  height: 20px;
  border-radius: 20%;
  cursor: pointer;
  appearance: none;
  background-color: #ddd;
  border: 1px solid #aaa;

  &:checked {
    background-color: #4caf50;
    border-color: #4caf50;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 5px 2px rgba(76, 175, 80, 0.5);
  }
`;

export default NotificacionesContent;