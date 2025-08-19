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
  margin-bottom: 5px;
`;

const Label = styled.label`
  color: #B4B4B4;
  font-size: 13px;
  text-align: left;
`;

const ForgotPasswordLink = styled.a`
  color: #898989;
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
  height: 38px;
  padding: 10px 40px 10px 12px;
  border: 1px solid #373737;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  background: #1D1D1D;
  color: #fff;
  transition: border-color 0.2s;
  &::placeholder {
    color: #373737;
    font-size: 13px;
    letter-spacing: 1px;
  }
  &:focus {
    border-color: #555;
    background: #232323;
  }
`;

const PasswordIconWrapper = styled.div`
  position: absolute;
  right: 10px;
  color: #bbb;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 20px;
`;

function CustomInput({ label, label_inside, type, icon, register, name, errors }) {
  const [showPassword, setShowPassword] = useState(false);

  // Definir placeholder según el tipo
  let placeholderValue = label_inside;
  if (name === 'correo' || label.toLowerCase().includes('usuario')) {
    placeholderValue = "user@example.com";
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
      {errors[name]?.type === 'required' && <p style={{fontSize : '13px' , color : 'red'}}>Campo requerido</p>}
    </CustomInputContainer>
  );
}

export default CustomInput;