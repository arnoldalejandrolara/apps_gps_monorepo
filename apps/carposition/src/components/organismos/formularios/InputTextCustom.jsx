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
  padding-left: 10px;
`;

const Label = styled.label`
  color: #555;
  font-size: 14px;
  text-align: left;
`;

const ForgotPasswordLink = styled.a`
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
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  font-size: 14px;
  &:focus {
    border-color: #888;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 10px;
  cursor: pointer;
`;

function CustomInput({ label, label_inside, type, icon, register, name, errors }) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <CustomInputContainer>
      <LabelContainer>
        <Label>{label + ' *'}</Label>
        {type === 'password' && (
          <ForgotPasswordLink href="#">¿Olvidaste la contraseña?</ForgotPasswordLink>
        )}
      </LabelContainer>
      <InputWrapper>
        {icon && <IconWrapper>{icon}</IconWrapper>}
        <StyledInput
          type={type === 'password' && showPassword ? 'text' : type}
          placeholder={label_inside}
          {...register(name, { required: true })}
        />
        {type === 'password' && (
          <IconWrapper onClick={toggleShowPassword}>
            {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
          </IconWrapper>
        )}
      </InputWrapper>
      {errors[name]?.type === 'required' && <p style={{fontSize : '13px' , color : 'red'}}>Campo requerido</p>}
    </CustomInputContainer>
  );
}

export default CustomInput;