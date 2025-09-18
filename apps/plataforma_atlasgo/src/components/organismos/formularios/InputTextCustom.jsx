import React, { useState } from 'react';
import styled from 'styled-components';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const CustomInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const LabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px; /* Un poco más de espacio */
`;

const Label = styled.label`
  /* CAMBIO: Color de texto oscuro para el label */
  color: #495057;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
`;

const ForgotPasswordLink = styled.a`
  /* CAMBIO: Color de enlace estándar para tema claro */
  color: #007bff;
  font-size: 12px;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 100%;
  height: 42px; /* Un poco más alto para mejor tacto */
  padding: 10px 40px 10px 12px;
  /* CAMBIO: Estilos de borde, fondo y texto para tema claro */
  border: 1px solid #ced4da;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  background: #ffffff;
  color: #212529;
  transition: border-color 0.2s, box-shadow 0.2s;

  &::placeholder {
    /* CAMBIO: Color de placeholder para tema claro */
    color: #6c757d;
    font-size: 13px;
    letter-spacing: normal; /* Espaciado normal */
  }

  &:focus {
    /* CAMBIO: Efecto de foco para tema claro */
    border-color: #80bdff;
    background: #ffffff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const PasswordIconWrapper = styled.div`
  position: absolute;
  right: 12px;
  /* CAMBIO: Color de icono para tema claro */
  color: #6c757d;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 22px;
`;

function CustomInput({ label, label_inside, type, icon, register, name, errors }) {
  const [showPassword, setShowPassword] = useState(false);

  // Definir placeholder según el tipo
  let placeholderValue = label_inside;
  if (name === 'correo' || label.toLowerCase().includes('usuario')) {
    placeholderValue = "usuario@ejemplo.com";
  }
  if (type === 'password') {
    placeholderValue = "••••••••";
  }

  return (
    <CustomInputContainer>
      <LabelContainer>
        <Label>{label}</Label>
        {type === 'password' && (
          <ForgotPasswordLink href="#">¿Has olvidado tu contraseña?</ForgotPasswordLink>
        )}
      </LabelContainer>
      <InputWrapper>
        <StyledInput
          type={type === 'password' && showPassword ? 'text' : type}
          placeholder={placeholderValue}
          {...register(name, { required: true })}
        />
        {type === 'password' && (
          <PasswordIconWrapper onClick={() => setShowPassword(s => !s)}>
            {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
          </PasswordIconWrapper>
        )}
      </InputWrapper>
      {errors[name]?.type === 'required' && <p style={{fontSize : '13px' , color : '#e74c3c', textAlign: 'left', marginTop: '4px'}}>Campo requerido</p>}
    </CustomInputContainer>
  );
}

export default CustomInput;