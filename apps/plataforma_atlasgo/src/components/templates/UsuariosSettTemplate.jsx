import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
// Iconos
import { FaSearch, FaUserPlus, FaEllipsisV, FaUserShield, FaUserEdit, FaUserSlash } from 'react-icons/fa';

// --- DATOS DE EJEMPLO ---
// En una aplicación real, esto vendría de una API.
const usersData = [
  { id: 1, name: 'Ana García', email: 'ana.garcia@example.com', role: 'Administrador', status: 'Activo', avatar: 'https://i.pravatar.cc/150?u=ana' },
  { id: 2, name: 'Carlos Reyes', email: 'carlos.reyes@example.com', role: 'Operador', status: 'Activo', avatar: 'https://i.pravatar.cc/150?u=carlos' },
  { id: 3, name: 'Lucía Morales', email: 'lucia.m@example.com', role: 'Supervisor', status: 'Activo', avatar: 'https://i.pravatar.cc/150?u=lucia' },
  { id: 4, name: 'david.perez@example.com', email: 'david.perez@example.com', role: 'Operador', status: 'Invitado', avatar: null },
  { id: 5, name: 'Sofia Castillo', email: 'sofia.c@example.com', role: 'Supervisor', status: 'Activo', avatar: 'https://i.pravatar.cc/150?u=sofia' },
];

// --- Componente Principal de la Plantilla de Usuarios ---
export function UsuarioSettTemplate() {
  // --- ESTADOS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('todos');
  const [activeActionsMenu, setActiveActionsMenu] = useState(null); // Para controlar qué menú de acciones está abierto

  // --- LÓGICA DE FILTRADO ---
  const filteredUsers = useMemo(() => {
    return usersData
      .filter(user => {
        // Filtro por Rol
        if (roleFilter === 'todos') return true;
        return user.role.toLowerCase() === roleFilter;
      })
      .filter(user => {
        // Filtro por Búsqueda
        const term = searchTerm.toLowerCase();
        return user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term);
      });
  }, [searchTerm, roleFilter]);

  // Manejar el clic fuera del menú de acciones para cerrarlo
  React.useEffect(() => {
    const handleClickOutside = () => setActiveActionsMenu(null);
    if (activeActionsMenu !== null) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [activeActionsMenu]);


  return (
    <PageContainer>
      {/* Encabezado y Botón de Acción */}
      <HeaderContainer>
        <div>
          <PageTitle>Usuarios y Permisos</PageTitle>
          <PageSubtitle>Gestiona quién tiene acceso y qué puede hacer en la plataforma.</PageSubtitle>
        </div>
        <AddUserButton>
          <FaUserPlus />
          Añadir Usuario
        </AddUserButton>
      </HeaderContainer>

      {/* Barra de Herramientas: Búsqueda y Filtros */}
      <Toolbar>
        <SearchContainer>
          <SearchIcon><FaSearch /></SearchIcon>
          <SearchInput
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        <FilterSelect value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="todos">Todos los Roles</option>
          <option value="administrador">Administrador</option>
          <option value="supervisor">Supervisor</option>
          <option value="operador">Operador</option>
        </FilterSelect>
      </Toolbar>

      {/* Tabla de Usuarios */}
      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <UserCell>
                    <Avatar src={user.avatar}>
                      {!user.avatar && user.name.charAt(0)}
                    </Avatar>
                    <div>
                      <UserName>{user.name}</UserName>
                      <UserEmail>{user.email}</UserEmail>
                    </div>
                  </UserCell>
                </td>
                <td>
                  <RoleBadge role={user.role}>{user.role}</RoleBadge>
                </td>
                <td>
                  <StatusBadge status={user.status}>{user.status}</StatusBadge>
                </td>
                <td>
                  <ActionsCell>
                    <KebabMenuButton onClick={(e) => { e.stopPropagation(); setActiveActionsMenu(user.id === activeActionsMenu ? null : user.id)}}>
                      <FaEllipsisV />
                    </KebabMenuButton>
                    {activeActionsMenu === user.id && (
                       <ActionsMenu>
                        <li><FaUserEdit /> Editar</li>
                        <li className="delete"><FaUserSlash /> Eliminar</li>
                      </ActionsMenu>
                    )}
                  </ActionsCell>
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
        {filteredUsers.length === 0 && (
          <NoResults>No se encontraron usuarios con los filtros actuales.</NoResults>
        )}
      </TableWrapper>
    </PageContainer>
  );
}

// #region --- ESTILOS CON STYLED-COMPONENTS ---

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: #171717;
  color: #FFFFFF;
  padding: 2rem 3rem;
  overflow: hidden;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 1.5rem;
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const PageSubtitle = styled.p`
  font-size: 0.9rem;
  color: #A0A0A0;
  margin-top: 0.5rem;
`;

const AddUserButton = styled.button`
  background-color: #0A84FF;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0077F7;
  }
`;

const Toolbar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const SearchContainer = styled.div`
  position: relative;
  flex-grow: 1;
`;

const SearchInput = styled.input`
  width: 100%;
  background-color: #2C2C2E;
  border: 1px solid #3A3A3C;
  border-radius: 8px;
  color: #FFFFFF;
  font-size: 0.9rem;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  outline: none;
  transition: border-color 0.2s;
  &::placeholder { color: #888888; }
  &:focus { border-color: #0A84FF; }
`;

const SearchIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: #888888;
`;

const FilterSelect = styled.select`
  background-color: #2C2C2E;
  border: 1px solid #3A3A3C;
  border-radius: 8px;
  color: #FFFFFF;
  font-size: 0.9rem;
  padding: 0.75rem 1rem;
  outline: none;
  cursor: pointer;
`;

const TableWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-track { background: #171717; }
  &::-webkit-scrollbar-thumb { background-color: #3A3A3C; border-radius: 10px; }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 0.75rem 1rem;
    color: #A0A0A0;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #3A3A3C;
  }

  td {
    padding: 1rem 1rem;
    border-bottom: 1px solid #2C2C2E;
  }
`;

const UserCell = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #3A3A3C;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #FFFFFF;
`;

const UserName = styled.span`
  font-weight: 500;
  color: #F5F5F5;
`;

const UserEmail = styled.span`
  font-size: 0.8rem;
  color: #888888;
  display: block;
`;

const RoleBadge = styled.span`
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${props => {
    if (props.role === 'Administrador') return 'rgba(255, 59, 48, 0.2)';
    if (props.role === 'Supervisor') return 'rgba(255, 149, 0, 0.2)';
    return 'rgba(10, 132, 255, 0.2)';
  }};
  color: ${props => {
    if (props.role === 'Administrador') return '#FF453A';
    if (props.role === 'Supervisor') return '#FF9F0A';
    return '#0A84FF';
  }};
`;

const StatusBadge = styled(RoleBadge)`
   background-color: ${props => props.status === 'Activo' ? 'rgba(52, 199, 89, 0.2)' : 'rgba(142, 142, 147, 0.2)'};
   color: ${props => props.status === 'Activo' ? '#34C759' : '#8E8E93'};
`;

const ActionsCell = styled.div`
  position: relative;
  text-align: right;
`;

const KebabMenuButton = styled.button`
  background: none;
  border: none;
  color: #A0A0A0;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;

  &:hover {
    background-color: #2C2C2E;
    color: #FFFFFF;
  }
`;

const ActionsMenu = styled.ul`
  position: absolute;
  right: 0;
  top: 100%;
  background-color: #2C2C2E;
  border: 1px solid #3A3A3C;
  border-radius: 8px;
  list-style: none;
  padding: 0.5rem 0;
  margin: 0.25rem 0 0 0;
  width: 150px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);

  li {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    color: #F5F5F5;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.75rem;

    &:hover {
      background-color: #3A3A3C;
    }

    &.delete {
      color: #FF453A;
    }
  }
`;

const NoResults = styled.p`
    text-align: center;
    color: #888888;
    margin-top: 2rem;
    padding: 1rem;
`;

// #endregion

export default UsuarioSettTemplate;