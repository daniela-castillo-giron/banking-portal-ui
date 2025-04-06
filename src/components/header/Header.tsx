import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';
import environment from '../../config/environment';
import axiosService from '../../services/axiosService';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './header.css';

const Header = () => {
    const { logout: logoutContext } = useAuth();
    const navigate = useNavigate();
    const authTokenName = environment.tokenName;

    const isLoggedIn = AuthService.isLoggedIn();

    const checkScreenSize = () => window.innerWidth < 768;

    const logout = async () => {
        try {
            await AuthService.logOutUser();
            localStorage.removeItem(authTokenName);
            logoutContext();
            navigate('/');
        } catch (error) {
            console.error('Logout failed: ' + error);
            toast.error('Logout failed: ' + error);
        }
    };

    return (
        <header className="nav bg-white shadow">
            <div className="nav-wrapper flex items-center justify-between mx-1">
                {/* Logo */}
                {(!isLoggedIn || checkScreenSize()) && (
                    <h1
                        className="nav-logo min-w-min !min-w-[fit-content] text-xl md:text-2xl font-bold hover:bg-gray-100 py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <i className="fas fa-piggy-bank text-blue-500 mr-2"></i>
                        OneStopBank
                    </h1>
                )}

                {/* Right-side nav */}
                <div className="nav-body w-full flex justify-end space-x-4 p-1">
                    {!isLoggedIn && (
                        <>
                            <button
                                onClick={() => navigate('/login')}
                                className="smallscreen border border-2 border-gray-500 bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                            >
                                <i className="fas fa-sign-in-alt mr-1"></i> Login
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="smallscreen bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                            >
                                <i className="fas fa-user-plus mr-1"></i> Create Account
                            </button>
                        </>
                    )}

                    {isLoggedIn && (
                        <button
                            onClick={logout}
                            className="smallscreen bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                        >
                            <i className="fas fa-sign-out-alt mr-1"></i> Logout
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
