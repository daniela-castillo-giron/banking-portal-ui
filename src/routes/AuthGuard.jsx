import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthService from '../services/authService';

const AuthGuard = ({ children }) => {
    const location = useLocation();
    const isLoggedIn = AuthService.isLoggedIn();

    // If user is logged in and tries to access root ("/"), redirect to dashboard
    if (isLoggedIn && (location.pathname === '/' || location.pathname === '')) {
        return <Navigate to="/dashboard" replace />;
    }

    // If not logged in and trying to access any protected route except "/", redirect to login
    if (!isLoggedIn && location.pathname !== '/') {
        return <Navigate to="/login" replace />;
    }

    // Otherwise, allow access
    return children;
};

export default AuthGuard;
