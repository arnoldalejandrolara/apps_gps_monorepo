import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { CustomSelect } from './CustomSelect'; 
import { FormInput } from './FormInput'; // Importa el nuevo componente de input
import { StatusLabel } from './StatusLabel';
import { createUser, checkNickname, updateUser } from '@mi-monorepo/common/services';

// --- Componente del Formulario ---
export function UserForm({ user, onSave }) {
    const token = useSelector(state => state.auth.token);
    const timeoutRef = useRef(null);
    
    const [formData, setFormData] = useState({
        name: user?.name || '',
        nickname: user?.nickname || '',
        email: user?.email || '',
        telefono: user?.telefono || '',
        role: user?.role || 5,
        password: '',
        confirmPassword: '',
    });

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
        if (!nickname.trim()) {
            setNicknameStatus({
                checking: false,
                available: null,
                message: ''
            });
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
                message: 'Error al verificar nickname'
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'nickname') {
            // Limpiar timeout anterior si existe
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Si el campo está vacío, limpiar el estado inmediatamente
            if (!value.trim()) {
                setNicknameStatus({
                    checking: false,
                    available: null,
                    message: ''
                });
                return;
            }

            // Configurar nuevo timeout para verificar después de 500ms
            timeoutRef.current = setTimeout(() => {
                checkNicknameAvailability(value);
            }, 500);
        }
    };

    // Limpiar timeout cuando el componente se desmonte
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validación de contraseñas solo para usuarios nuevos
        if (!user && formData.password !== formData.confirmPassword) {
            alert("Las contraseñas no coinciden. Por favor, inténtalo de nuevo.");
            return;
        }

        try {
            let response;

            if (user?.id) {
                // Actualizar usuario existente
                response = await updateUser(token, user.id, {
                    nombre: formData.name,
                    correo: formData.email,
                    nickname: formData.nickname,
                    telefono: formData.telefono,
                });

                if (response.status === 200) {
                    alert("Usuario actualizado correctamente");
                    onSave(response.usuario || user);
                } else {
                    alert("Error al actualizar el usuario");
                }
            } else {
                // Crear nuevo usuario
                response = await createUser(token, {
                    nombre: formData.name,
                    correo: formData.email,
                    nickname: formData.nickname,
                    telefono: formData.telefono,
                    id_tipo: formData.role,
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
            alert("Error en la operación. Por favor, inténtalo de nuevo.");
        }
    };

    const rolesDeUsuario = [
        { id: 5, name: 'Cuenta Secundaria', value: 'secundaria' },
    ];

    const [rolSeleccionado, setRolSeleccionado] = useState('Rol');

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            nickname: '',
            telefono: '',
            role: 5,
            password: '',
            confirmPassword: '',
        });
        setNicknameStatus({
            checking: false,
            available: null,
            message: ''
        });
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
                label="Telefono"
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ej. 3123456789"
                required
            />
            
            <FormGroup>
                <CustomSelect
                    showSearch={false}
                    label="Rol"
                    options={rolesDeUsuario}
                    value={rolSeleccionado}
                    onChange={setRolSeleccionado}
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
                <SaveButton type="submit">Guardar</SaveButton>
            </FormActions>
        </Form>
    );
}


// --- Estilos ---
const Form = styled.form`
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px 25px;
`;

const FormGroup = styled.div`margin-bottom: 0;`;

const SaveButton = styled.button`
    background-color: #28a745; 
    color: white; 
    border: none; 
    border-radius: 6px;
    padding: 10px 20px; 
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
    margin-top: 10px;
`;