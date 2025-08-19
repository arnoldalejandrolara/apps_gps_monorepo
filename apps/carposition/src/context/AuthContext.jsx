import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout as logoutAction } from '../store/slices/authSlice';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();

    const handleLogin = (userData) => {
        dispatch(login(userData)); // Dispatch login action to store
    };

    const logout = () => {
        dispatch(logoutAction()); // Dispatch logout action to store
    };

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated, handleLogin, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
