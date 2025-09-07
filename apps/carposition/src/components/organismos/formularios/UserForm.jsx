import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { CustomSelect } from './CustomSelect'; 
import { FormInput } from './FormInput';
import { StatusLabel } from './StatusLabel';
import { createUser, checkNickname, updateUser } from '@mi-monorepo/common/services';

// --- Componente del Formulario ---
export function UserForm({ user, onSave }) {
    const token = useSelector(state => state.auth.token);
    const timeoutRef = useRef(null);
    
    const [formData, setFormData] = useState({
        name: '',
        nickname: '',
        email: '',
        telefono: '',
        role: 5,
        password: '',
        confirmPassword: '',
    });

    const [rolSeleccionado, setRolSeleccionado] = useState(5);

    useEffect(() => {
        setFormData({
            name: user?.nombre || '',
            nickname: user?.nickname || '',
            email: user?.correo || '',
            telefono: user?.telefono || '',
            role: user?.role || 5,
        });
        setRolSeleccionado(user?.role || 5);
        setNicknameStatus({
            checking: false,
            available: null,
            message: ''
        });
    }, [user]);

    const [nicknameStatus, setNicknameStatus] = useState({
        checking: false,
        available: null,
        message: ''
    });

    const checkNicknameAvailability = async (nickname) => {
        if (!nickname.trim() || nickname === user?.nickname) { // No verificar si es el mismo nickname del usuario actual
            setNicknameStatus({ checking: false, available: null, message: '' });
            return;
        }

        setNicknameStatus(prev => ({ ...prev, checking: true }));
        
        try {
            const response = await checkNickname(token, nickname);
            if (response.status === 200) {
                const isAvailable = !response.exists;
                setNicknameStatus({
                    checking: false,
                    available: isAvailable,
                    message: isAvailable ? 'Nickname disponible' : 'Nickname ocupado'
                });
            }
        } catch (error) {
            setNicknameStatus({
                checking: false,
                available: null,
                message: 'Error al verificar'
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'nickname') {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (!value.trim()) {
                setNicknameStatus({ checking: false, available: null, message: '' });
                return;
            }
            timeoutRef.current = setTimeout(() => {
                checkNicknameAvailability(value);
            }, 500);
        }
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user && formData.password !== formData.confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        try {
            let response;
            if (user?.id) {
                response = await updateUser(token, user.id, {
                    nombre: formData.name,
                    correo: formData.email,
                    nickname: formData.nickname,
                    telefono: formData.telefono,
                    id_tipo: rolSeleccionado
                });
                if (response.status === 200) {
                    alert("Usuario actualizado correctamente");
                    onSave(response.usuario || { ...user, ...formData });
                } else {
                    alert("Error al actualizar el usuario");
                }
            } else {
                response = await createUser(token, {
                    nombre: formData.name,
                    correo: formData.email,
                    nickname: formData.nickname,
                    telefono: formData.telefono,
                    id_tipo: rolSeleccionado,
                    password: formData.password,
                });
                if (response.status === 200) {
                    alert("Usuario creado correctamente");
                    onSave(response.usuario);
                    resetForm();
                } else {
                    alert("Error al crear el usuario");
                }
            }
        } catch (error) {
            console.error('Error en la operación:', error);
            alert("Ocurrió un error. Por favor, inténtalo de nuevo.");
        }
    };

    const rolesDeUsuario = [
        { id: 5, name: 'Cuenta Secundaria', value: 'secundaria' },
        { id: 4, name: 'Administrador Cliente', value: 'admin_cliente' },
    ];

    const resetForm = () => {
        setFormData({
            name: '', email: '', nickname: '', telefono: '',
            role: 5, password: '', confirmPassword: '',
        });
        setNicknameStatus({ checking: false, available: null, message: '' });
        setRolSeleccionado(5);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormInput
                label="Nombre Completo"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej. Juan Pérez"
                required
                disabled={!!user} // Deshabilitar si se está editando
            />
            <FormInput
                label="Correo Electrónico"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                required
            />

            <FormInput
                label="Nickname"
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="Ej. juanperez"
                required
                statusComponent={
                    <StatusLabel 
                        checking={nicknameStatus.checking}
                        available={nicknameStatus.available}
                        message={nicknameStatus.message}
                    />
                }
            />

            <FormInput
                label="Teléfono"
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ej. 8331234567"
                required
            />
            
            <FormGroup>
                <CustomSelect
                    showSearch={false}
                    label="Rol"
                    options={rolesDeUsuario}
                    value={rolSeleccionado}
                    onChange={(value) => setRolSeleccionado(value)}
                />
            </FormGroup>

            {!user && (
                <>
                    <FormInput
                        label="Contraseña"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                    />
                    <FormInput
                        label="Confirmar Contraseña"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                    />
                </>
            )}

            <FormActions>
                <SaveButton type="submit">
                    {user ? 'Guardar Cambios' : 'Crear Usuario'}
                </SaveButton>
            </FormActions>
        </Form>
    );
}


// --- Estilos ---
const Form = styled.form`
    padding: 25px;
    background-color: #fff;
    border-radius: 8px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px 25px;
    overflow-y: auto; /* Permite scroll si el contenido es muy largo */

    // CAMBIO: Media query para hacer el formulario responsivo en móviles
    @media (max-width: 768px) {
        grid-template-columns: 1fr; // Cambia a una sola columna
        gap: 15px; // Reduce el espacio entre campos
        padding: 15px;
    }
`;

const FormGroup = styled.div`
    margin-bottom: 0;
`;

const SaveButton = styled.button`
    background-color: #28a745; 
    color: white; 
    border: none; 
    border-radius: 6px;
    padding: 12px 25px; // Un poco más de padding
    font-size: 14px; 
    font-weight: 500;
    cursor: pointer; 
    transition: background-color 0.2s ease;
    &:hover { background-color: #218838; }
`;

const FormActions = styled.div`
    grid-column: 1 / -1;
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
`;