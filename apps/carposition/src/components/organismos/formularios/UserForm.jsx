import React, { useState } from 'react';
import styled from 'styled-components';
import { CustomSelect } from './CustomSelect'; 
import { FormInput } from './FormInput'; // Importa el nuevo componente de input

// --- Componente del Formulario ---
export function UserForm({ user, onSave }) {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'Miembro',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!user && formData.password !== formData.confirmPassword) {
            alert("Las contraseñas no coinciden. Por favor, inténtalo de nuevo.");
            return;
        }

        const userDataToSave = { ...user, ...formData };
        delete userDataToSave.password;
        delete userDataToSave.confirmPassword;

        onSave(userDataToSave);
    };

    const rolesDeUsuario = [
        { id: 1, name: 'Owner', value: 'owner' },
        { id: 2, name: 'Administrator', value: 'admin' },
        { id: 3, name: 'Developer', value: 'dev' },
        { id: 4, name: 'Viewer', value: 'viewer' }
    ];

    const [rolSeleccionado, setRolSeleccionado] = useState('Rol');

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