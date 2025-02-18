import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';
import './home.css';

const Home = () => {
    const navigate = useNavigate();
    const isLoggedIn = AuthService.isLoggedIn();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/dashboard');
        }
    }, [isLoggedIn, navigate]);

    return (
        <>
            <section className="hero bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 m-[-0.5rem]">
                <div className="container-fluid">
                    <div className="panel-wrapper">
                        {/* Left Side */}
                        <div className="left-panel p-4">
                            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-semibold mb-4">
                                <i className="fas fa-piggy-bank text-blue-500 mr-2"></i> OneStopBank
                            </h1>
                            <p className="text-slate-800 text-lg sm:text-xl mb-4">
                                Your One-Stop Solution for Banking Needs
                            </p>

                            {!isLoggedIn ? (
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded shadow-md font-semibold"
                                    onClick={() => navigate('/register')}
                                >
                                    Create Account
                                </button>
                            ) : (
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded shadow-md text-sm font-semibold"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    Dashboard
                                </button>
                            )}
                        </div>

                        {/* Right Side */}
                        <div className="right-panel">
                            <img
                                src="../public/assets/dashboard.png"
                                alt="Dashboard Screenshot"
                                className="w-full rounded-lg border border-gray-200"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-8 m-[-0.5rem]">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Repeatable Card */}
                        <div className="min-w-0 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition duration-300 transform hover:scale-105">
                            <h4 className="mb-2 font-semibold text-gray-600 text-lg">
                                <span className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full">
                                    <i className="fas fa-shield-alt text-blue-500 text-3xl"></i>
                                </span>
                                Secure Transactions
                            </h4>
                            <p className="text-gray-600 text-normal">
                                Your transactions are secured using the latest encryption technologies to protect your financial data.
                            </p>
                        </div>

                        <div className="min-w-0 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition duration-300 transform hover:scale-105">
                            <h4 className="mb-2 font-semibold text-gray-600 text-lg">
                                <span className="p-3 mr-4 text-green-500 bg-green-100 rounded-full">
                                    <i className="fas fa-history text-green-500 text-3xl mb-4"></i>
                                </span>
                                Easy Fund Management
                            </h4>
                            <p className="text-gray-600 text-normal">
                                Manage your funds with ease using our intuitive and user-friendly banking interface.
                            </p>
                        </div>

                        <div className="min-w-0 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition duration-300 transform hover:scale-105">
                            <h4 className="mb-2 font-semibold text-gray-600 text-lg">
                                <span className="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full">
                                    <i className="fas fa-users text-orange-500 text-3xl mb-4"></i>
                                </span>
                                Multi-User Support
                            </h4>
                            <p className="text-gray-600 text-normal">
                                Our banking portal supports multiple users, making it perfect for families and businesses.
                            </p>
                        </div>

                        <div className="min-w-0 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition duration-300 transform hover:scale-105">
                            <h4 className="mb-2 font-semibold text-gray-600 text-lg">
                                <span className="p-3 mr-4 text-teal-500 bg-teal-100 rounded-full">
                                    <i className="fas fa-history text-teal-500 text-3xl mb-4"></i>
                                </span>
                                Transaction History
                            </h4>
                            <p className="text-gray-600 text-normal">
                                Keep track of your transaction history with detailed records and real-time updates.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black text-white py-4 mt-8 m-[-0.5rem]">
                <div className="container mx-auto text-center">
                    <p>&copy; 2023 OneStopBank. All rights reserved.</p>
                    {/* <div className="mt-4 flex flex-wrap p-3 justify-center items-center rowgap">
                        <span className="text-white font-bold text-xl mr-2">Star on Github</span>
                        <a href="https://github.com/daniela-castillo-giron/baking-portal-ui" target="_blank"
                            className="mr-4 text-white border border-gray-300 p-2 shadow-lg hover:text-blue-400 transition-all">
                            <i className="fab fa-github mr-1"></i> Frontend Repository
                        </a>
                        <a href="https://github.com/daniela-castillo-giron/baking-portal-be" target="_blank"
                            className="text-white mr-6 border border-gray-300 p-2 shadow-lg hover:text-blue-400 transition-all">
                            <i className="fab fa-github mr-1"></i> Backend Repository
                        </a>
                        <a href="https://daniela-castillo-giron.github.io/" target="_blank"
                            className="text-white border border-gray-300 p-2 shadow-lg hover:text-blue-400 transition-all">
                            <i className="fas fa-user-circle mr-1"></i> Portfolio
                        </a>
                    </div> */}
                </div>
            </footer>
        </>
    );
};

export default Home;
