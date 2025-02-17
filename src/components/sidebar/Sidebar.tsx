import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
    const { loggedIn } = useAuth();
    const [sidebarVisible, setSidebarVisible] = useState(true);

    useEffect(() => {
        if (window.innerWidth < 768) setSidebarVisible(false);
    }, []);

    const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

    if (!loggedIn) return null;

    return (
        <div className="sidebar-wrapper shadow-lg pt-1">
            <div className={`togglebtnwrapper ${!sidebarVisible ? 'removepadding' : ''}`}>
                <Link
                    to="/"
                    className={`text-xl font-bold text-white cursor-pointer ${!sidebarVisible ? 'hide-logo' : ''}`}
                >
                    <i className="fas fa-piggy-bank mr-2"></i>
                    <span>OneStopBank</span>
                </Link>
                <button
                    type="button"
                    title="Toggle Sidebar"
                    onClick={toggleSidebar}
                    className="toggle-button"
                >
                    <i className="fas fa-bars"></i>
                </button>
            </div>

            <div className={`sidebar ${!sidebarVisible ? 'removepadding' : ''}`}>
                <nav className="h-screen">
                    <ul>
                        <li className="mb-5">
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) =>
                                    `sidebar-link inline-flex items-center gap-4 w-full text-normal font-semibold text-gray-300 transition duration-150 ${isActive ? 'active-link' : ''}`
                                }
                            >
                                <i className="fas fa-tachometer-alt"></i>
                                <span className={!sidebarVisible ? 'hide-logo' : ''}>Dashboard</span>
                            </NavLink>
                        </li>
                        <li className="mb-5">
                            <NavLink
                                to="/account/deposit"
                                className={({ isActive }) =>
                                    `sidebar-link inline-flex items-center gap-4 w-full text-normal font-semibold text-gray-300 transition duration-150 ${isActive ? 'active-link' : ''}`
                                }
                            >
                                <i className="fas fa-money-bill-wave"></i>
                                <span className={!sidebarVisible ? 'hide-logo' : ''}>Deposit</span>
                            </NavLink>
                        </li>
                        <li className="mb-5">
                            <NavLink
                                to="/account/withdraw"
                                className={({ isActive }) =>
                                    `sidebar-link inline-flex items-center gap-4 w-full text-normal font-semibold text-gray-300 transition duration-150 ${isActive ? 'active-link' : ''}`
                                }
                            >
                                <i className="fas fa-money-bill"></i>
                                <span className={!sidebarVisible ? 'hide-logo' : ''}>Withdraw</span>
                            </NavLink>
                        </li>
                        <li className="mb-5">
                            <NavLink
                                to="/account/fund-transfer"
                                className={({ isActive }) =>
                                    `sidebar-link inline-flex items-center gap-4 w-full text-normal font-semibold text-gray-300 transition duration-150 ${isActive ? 'active-link' : ''}`
                                }
                            >
                                <i className="fas fa-exchange-alt"></i>
                                <span className={!sidebarVisible ? 'hide-logo' : ''}>Fund Transfer</span>
                            </NavLink>
                        </li>
                        <li className="mb-5">
                            <NavLink
                                to="/account/pin"
                                className={({ isActive }) =>
                                    `sidebar-link inline-flex items-center gap-4 w-full text-normal font-semibold text-gray-300 transition duration-150 ${isActive ? 'active-link' : ''}`
                                }
                            >
                                <i className="fas fa-key"></i>
                                <span className={!sidebarVisible ? 'hide-logo' : ''}>Account PIN</span>
                            </NavLink>
                        </li>
                        <li className="mb-5">
                            <NavLink
                                to="/user/profile"
                                className={({ isActive }) =>
                                    `sidebar-link inline-flex items-center gap-4 w-full text-normal font-semibold text-gray-300 transition duration-150 ${isActive ? 'active-link' : ''}`
                                }
                            >
                                <i className="fas fa-user"></i>
                                <span className={!sidebarVisible ? 'hide-logo' : ''}>User Profile</span>
                            </NavLink>
                        </li>
                        <li className="mb-5">
                            <NavLink
                                to="/account/transaction-history"
                                className={({ isActive }) =>
                                    `sidebar-link inline-flex items-center gap-4 w-full text-normal font-semibold text-gray-300 transition duration-150 ${isActive ? 'active-link' : ''}`
                                }
                            >
                                <i className="fas fa-history"></i>
                                <span className={!sidebarVisible ? 'hide-logo' : ''}>Transaction History</span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
