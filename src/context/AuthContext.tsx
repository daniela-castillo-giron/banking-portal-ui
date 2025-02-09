// context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(AuthService.isLoggedIn());

    const login = () => setLoggedIn(true);
    const logout = () => setLoggedIn(false);

    useEffect(() => {
        setLoggedIn(AuthService.isLoggedIn());
    }, []);

    return (
        <AuthContext.Provider value={{ loggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
