import React, { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import { TablaPuntosInteres } from '../table/table.jsx';
import { useSelector } from 'react-redux';
import { getUsersTable } from '@mi-monorepo/common/services';
import { UserForm } from '../formularios/UserForm';
import { PermisosUser } from '../formularios/PermisosUser';

// --- Componente Principal ---
export function UserControlComponent() {
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState('list'); // 'list', 'form', 'formPermisos'
    const [editingUser, setEditingUser] = useState(null);
    const [permisosUser, setPermisosUser] = useState(null);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [totalRows, setTotalRows] = useState(0);

    const token = useSelector(state => state.auth.token);

    const handleShowForm = (user = null) => {
        setEditingUser(user);
        setView('form');
    };

    const handleReturnToList = () => {
        setEditingUser(null);
        setPermisosUser(null);
        setView('list');
        fetchData();
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setView('form');
    };

    const handlePermisos = (user) => {
        setPermisosUser(user);
        setView('formPermisos');
    };

    const handleSaveUser = (userData) => {
        handleReturnToList();
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar a este usuario?")) {
            // Lógica para eliminar...
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
        if (!token) return;
        setIsLoading(true);
        try {
            const response = await getUsersTable(token, pagination.pageIndex, pagination.pageSize, sorting, '', searchTerm, null);
            setData(response.usuarios.data || []);
            setPageCount(Math.ceil(response.usuarios.recordsTotal / pagination.pageSize));
            setTotalRows(response.usuarios.recordsTotal);
        } catch (error) {
            console.error("Error al obtener datos de usuarios:", error);
            setData([]); // Asegurarse de que data sea un array en caso de error
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token, pagination, sorting, searchTerm]);
    
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
                            {data.map(user => (
                                <UserCard key={user.id}>
                                    <Avatar>{(user.nombre || user.nickname)?.charAt(0) ?? '?'}</Avatar>
                                    
                                    <UserDetails>
                                        <UserInfo>
                                            <UserName>{user.nombre || user.nickname}</UserName>
                                            <UserEmail>{user.correo}</UserEmail>
                                        </UserInfo>
                                        <UserRole role={user.tipo}>{user.tipo.replace(/_/g, " ")}</UserRole>
                                    </UserDetails>

                                    <CardActions>
                                        <IconButton title="Editar Usuario" onClick={() => handleEditUser(user)}><FaEdit /></IconButton>
                                        <IconButton title="Ver Permisos" onClick={() => handlePermisos(user)}><FaShieldAlt /></IconButton>
                                        <IconButton title="Eliminar Usuario" onClick={() => handleDeleteUser(user.id)}><FaTrash /></IconButton>
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
                                onPermisos={handlePermisos}
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
                    <UserForm 
                        user={editingUser} 
                        onSave={handleSaveUser}
                    />
                </AnimatedView>

                {/* Vista de Permisos */}
                <AnimatedView $isActive={view === 'formPermisos'} $direction="right">
                    <FormHeader>
                        <BackButton onClick={handleReturnToList}>
                            <FaArrowLeft style={{ marginRight: '8px' }} />
                            Regresar
                        </BackButton>
                    </FormHeader>
                   <PermisosUser user={permisosUser} />
                </AnimatedView>

            </ContentArea>
        </ComponentWrapper>
    );
}

// --- Estilos ---
const TableWrapper = styled.div`
    height: 100%;
    overflow-y: hidden;    
`;
const ComponentWrapper = styled.div`
    padding: 25px; 
    background-color: #1e1e1e; 
    border-radius: 8px;
    height: 100%; 
    display: flex; 
    flex-direction: column;
    position: relative;
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
    background-color: #1e1e1e;
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
    transform: translateY(-50%); color: #6c757d;
`;
const SearchInput = styled.input`
    padding: 10px 15px 10px 40px; border-radius: 6px; border: 1px solid #444;
    background-color: #444; font-size: 13px; width: 280px; outline: none;
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
    flex-grow: 1; overflow-y: auto; height: 100%; padding-right: 5px;
     &::-webkit-scrollbar { width: 8px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb { background-color: #555; border-radius: 10px; }
`;
const UserDetails = styled.div`
    grid-area: details;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
`;
const UserCard = styled.div`
    display: grid;
    grid-template-areas:
        "avatar details"
        "actions actions";
    grid-template-columns: auto 1fr;
    gap: 0 15px;
    background: #2c2c2e;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #3a3a3c;
    margin-bottom: 10px;
    transition: box-shadow 0.2s ease, transform 0.2s ease;

    /* CAMBIO: Esta línea alinea verticalmente el avatar y el bloque de detalles. */
    align-items: center;
`;

const Avatar = styled.div`
    grid-area: avatar;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: #007BFF;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 20px;
    text-transform: uppercase;
`;
const UserInfo = styled.div`
    min-width: 0;
`;
const UserName = styled.span`
    font-size: 15px;
    font-weight: 600;
    color: #e0e0e0;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
const UserEmail = styled.span`
    font-size: 13px;
    color: #999;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
`;
const UserRole = styled.span`
    justify-self: start; align-self: start; margin-top: 4px; font-size: 12px;
    font-weight: 500; padding: 4px 10px; border-radius: 12px; text-transform: capitalize;

    /* Paleta de colores para roles adaptada a tema oscuro */
    color: ${props => 
        props.role === 'administrador_cliente' ? '#ff9da6' : 
        props.role === 'cuenta_secundaria_cliente' ? '#85e89d' : 
        '#a0a0a0'};
    background-color: ${props => 
        props.role === 'administrador_cliente' ? 'rgba(220, 53, 69, 0.2)' : 
        props.role === 'cuenta_secundaria_cliente' ? 'rgba(40, 167, 69, 0.2)' : 
        'rgba(173, 181, 189, 0.2)'};
`;
const CardActions = styled.div`
    grid-area: actions;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    padding-top: 12px;
    margin-top: 12px;
    border-top: 1px solid #3a3a3c;
`;
const IconButton = styled.button`
    background: transparent;
    border: none;
    color: #999;
    font-size: 18px;
    cursor: pointer;
    padding: 5px;
    transition: color 0.2s ease;

    &:hover {
        color: #007BFF;
    }
`;
const FormHeader = styled.div`
    display: flex; align-items: center; justify-content: space-between;
    padding-bottom: 15px; margin-bottom: 20px; border-bottom: 1px solid #DEE2E6;
    flex-shrink: 0;
`;
const BackButton = styled.button`
    background: transparent; border: 1px solid #444; color: #f0f0f0;
    border-radius: 6px; padding: 8px 15px; font-size: 13px; font-weight: 500;
    cursor: pointer; display: flex; align-items: center; transition: all 0.2s ease;
    &:hover { background-color: #3a3a3c; }
`;