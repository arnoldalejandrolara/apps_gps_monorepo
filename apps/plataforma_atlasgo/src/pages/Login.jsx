// import { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { login } from '../store/slices/authSlice';
// import { useNavigate } from 'react-router-dom';
// import { loginService } from '../services/authService';

// function Login() {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const [credentials, setCredentials] = useState({
//         username: '',
//         password: '',
//     });

//     const handleChange = (e) => {
//         setCredentials({ ...credentials, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const data = await loginService(credentials);
//             dispatch(login({ user: data.user, token: data.user.token }));
//             navigate('/dashboard');
//         } catch (error) {
//             console.error(error.message);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <input
//                 type="text"
//                 name="username"
//                 placeholder="Usuario"
//                 onChange={handleChange}
//             />
//             <input
//                 type="password"
//                 name="password"
//                 placeholder="Contraseña"
//                 onChange={handleChange}
//             />
//             <button type="submit">Iniciar sesión</button>
//         </form>
//     );
// }

// export default Login;


import React from 'react'
// import { LoginTemplate } from '../index.js'

import { LoginTemplate } from '../components/templates/LoginTemplate.jsx';


export function Login (){
  return (
    <LoginTemplate/>
  )
}


