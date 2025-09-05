import React, { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import { TablaPuntosInteres } from '../table/table.jsx';
import { useSelector } from 'react-redux';
import { getUsersTable } from '@mi-monorepo/common/services';

// Importa el nuevo componente UserForm
import { UserForm } from '../formularios/UserForm';

// --- Datos de Ejemplo ---
const dummyUsers = [
    { id: 1, name: 'Ana García', email: 'ana.garcia@example.com', role: 'Admin', status: 'Activo' },
    { id: 2, name: 'Juan Pérez', email: 'juan.perez@example.com', role: 'Miembro', status: 'Activo' },
    { id: 3, name: 'Luis Martínez', email: 'luis.martinez@example.com', role: 'Miembro', status: 'Inactivo' },
    { id: 4, name: 'Sofía López', email: 'sofia.lopez@example.com', role: 'Visitante', status: 'Activo' },
    { id: 5, name: 'Carlos Rodríguez', email: 'carlos.r@example.com', role: 'Miembro', status: 'Activo' },
    { id: 6, name: 'Laura Fernández', email: 'laura.f@example.com', role: 'Miembro', status: 'Activo' },
    { id: 7, name: 'Miguel Sánchez', email: 'miguel.s@example.com', role: 'Visitante', status: 'Inactivo' },
    { id: 8, name: 'Elena Gómez', email: 'elena.g@example.com', role: 'Miembro', status: 'Activo' },
    { id: 9, name: 'David Torres', email: 'david.t@example.com', role: 'Admin', status: 'Activo' },
];

// --- Componente Principal ---
export function UserControlComponent() {
    const [users, setUsers] = useState(dummyUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState('list'); // 'list' o 'form'
    const [editingUser, setEditingUser] = useState(null);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [totalRows, setTotalRows] = useState(0);

    const token = useSelector(state => state.auth.token);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleShowForm = (user = null) => {
        setEditingUser(user);
        setView('form');
    };

    const handleReturnToList = () => {
        setEditingUser(null);
        setView('list');
        fetchData();
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setView('form');
    };

    const handleSaveUser = (userData) => {
        if (userData.id) {
            setUsers(users.map(u => u.id === userData.id ? userData : u));
        } else {
            const newUser = { ...userData, id: Date.now(), status: 'Activo' };
            setUsers([...users, newUser]);
        }
        handleReturnToList();
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar a este usuario?")) {
            setUsers(users.filter(u => u.id !== userId));
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchData = async () => {
        const response = await getUsersTable(token, pagination.pageIndex, pagination.pageSize, sorting, '', searchTerm, null);
        console.log(response);
        setData(response.usuarios.data);
        setPageCount(Math.ceil(response.usuarios.recordsTotal / pagination.pageSize));
        setTotalRows(response.usuarios.recordsTotal);
    };

    useEffect(() => {
        fetchData();
    }, [token]);
    
    return (
        <ComponentWrapper>
            <ContentArea>
                {/* Vista de Lista */}
                <AnimatedView $isActive={view === 'list'} $direction="left">
                    <Header>
                        <SearchWrapper>
                            <SearchIcon />
                            <SearchInput 
                                type="text" 
                                placeholder="Buscar usuario..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </SearchWrapper>
                        <CreateButton onClick={() => handleShowForm()}>
                            <FaPlus style={{ marginRight: '8px' }} />
                            Crear Usuario
                        </CreateButton>
                    </Header>
                    { isMobile ? (
                        <UserList>
                            {filteredUsers.map(user => (
                                <UserCard key={user.id}>
                                    <Avatar>{user.name.charAt(0)}</Avatar>
                                    <UserInfo>
                                        <UserName>{user.name}</UserName>
                                        <UserEmail>{user.email}</UserEmail>
                                    </UserInfo>
                                    <UserRole role={user.role}>{user.role}</UserRole>
                                    <CardActions>
                                        <IconButton title="Editar Usuario" onClick={() => handleShowForm(user)}><FaEdit /></IconButton>
                                        <IconButton title="Eliminar Usuario" onClick={() => handleDeleteUser(user.id)}><FaTrash /></IconButton>
                                        <IconButton title="Ver Permisos"><FaShieldAlt /></IconButton>
                                    </CardActions>
                                </UserCard>
                            ))}
                        </UserList>
                    ) : (
                        <TableWrapper>
                            <TablaPuntosInteres
                                type="users"
                                data={data}
                                isLoading={isLoading}
                                pagination={pagination}
                                onPaginationChange={setPagination}
                                sorting={sorting}
                                onSortingChange={setSorting}
                                pageCount={pageCount}
                                totalRows={totalRows}
                                onEdit={handleEditUser}
                            />
                        </TableWrapper>
                    )}
                </AnimatedView>

                {/* Vista de Formulario */}
                <AnimatedView $isActive={view === 'form'} $direction="right">
                    <FormHeader>
                        <BackButton onClick={handleReturnToList}>
                            <FaArrowLeft style={{ marginRight: '8px' }} />
                            Regresar
                        </BackButton>
                    </FormHeader>
                    {/* Renderiza el componente importado */}
                    <UserForm 
                        user={editingUser} 
                        onSave={handleSaveUser}
                    />
                </AnimatedView>
            </ContentArea>
        </ComponentWrapper>
    );
}

const TableWrapper = styled.div`
    height: 100%;
    overflow-y: hidden;    
`;

// --- Estilos Modernos y Responsivos ---
const ComponentWrapper = styled.div`
    padding: 25px; 
    background-color: #F8F9FA; 
    border-radius: 8px;
    height: 100%; 
    display: flex; 
    flex-direction: column;
    position: relative;
    overflow: hidden;
    @media (max-width: 768px) { padding: 15px; }
`;
const ContentArea = styled.div`
    position: relative;
    flex-grow: 1;
    width: 100%;
    height: 100%;
`;
const AnimatedView = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: transform 0.4s ease-in-out;
    transform: translateX(${({ $isActive, $direction }) => 
        $isActive ? '0%' : ($direction === 'left' ? '-100vw' : '100vw')
    });
`;
const Header = styled.div`
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 20px; flex-wrap: wrap; flex-shrink: 0; 
    @media (max-width: 768px) {
        flex-direction: column; align-items: stretch; gap: 15px;
    }
`;
const SearchWrapper = styled.div` position: relative; `;
const SearchIcon = styled(FaSearch)`
    position: absolute; top: 50%; left: 15px;
    transform: translateY(-50%); color: #ADB5BD;
`;
const SearchInput = styled.input`
    padding: 10px 15px 10px 40px; border-radius: 6px; border: 1px solid #DEE2E6;
    background-color: #fff; font-size: 13px; width: 280px; outline: none;
    transition: all 0.2s ease;
    &:focus {
        border-color: #007BFF;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
    }
    @media (max-width: 768px) { width: 100%; }
`;
const CreateButton = styled.button`
    background-color: #007BFF; color: white; border: none; border-radius: 6px;
    padding: 10px 20px; font-size: 13px; font-weight: 500; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background-color 0.2s ease;
    &:hover { background-color: #0056b3; }
`;
const UserList = styled.div`
    flex-grow: 1; overflow-y: auto; height: 100%; 
`;
const UserCard = styled.div`
    display: flex; align-items: center; background: #FFFFFF; padding: 12px;
    border-radius: 8px; border: 1px solid #E9ECEF; margin-bottom: 10px;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
    @media (max-width: 480px) { flex-wrap: wrap; padding: 12px; }
`;
const Avatar = styled.div`
    width: 40px; height: 40px; border-radius: 50%; background-color: #007BFF;
    color: white; display: flex; align-items: center; justify-content: center;
    font-weight: bold; font-size: 18px; margin-right: 15px; flex-shrink: 0;
`;
const UserInfo = styled.div`
    flex-grow: 1; min-width: 0;
    @media (max-width: 480px) { flex-basis: 100%; margin-bottom: 10px; }
`;
const UserName = styled.span`
    font-size: 14px; font-weight: 500; color: #343A40; display: block;
`;
const UserEmail = styled.span`
    font-size: 13px; color: #6C757D; white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis; display: block;
    @media (max-width: 480px) { display: none; }
`;
const UserRole = styled.span`
    font-size: 12px; font-weight: 500; padding: 4px 10px; border-radius: 12px;
    margin-right: 20px; flex-shrink: 0;
    color: ${props => props.role === 'Admin' ? '#DC3545' : props.role === 'Miembro' ? '#28A745' : '#6C757D'};
    background-color: ${props => props.role === 'Admin' ? '#F8D7DA' : props.role === 'Miembro' ? '#D4EDDA' : '#E9ECEF'};
`;
const CardActions = styled.div` display: flex; align-items: center; gap: 10px; `;
const IconButton = styled.button`
    background: transparent; border: none; color: #ADB5BD; font-size: 18px;
    cursor: pointer; padding: 5px; transition: color 0.2s ease;
    &:hover { color: #007BFF; }
`;
const FormHeader = styled.div`
    display: flex; align-items: center; justify-content: space-between;
    padding-bottom: 15px; margin-bottom: 20px; border-bottom: 1px solid #DEE2E6;
    flex-shrink: 0;
`;
const BackButton = styled.button`
    background: transparent; border: 1px solid #DEE2E6; color: #495057;
    border-radius: 6px; padding: 8px 15px; font-size: 13px; font-weight: 500;
    cursor: pointer; display: flex; align-items: center; transition: all 0.2s ease;
    &:hover { background-color: #E9ECEF; }
`;
