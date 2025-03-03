import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';
import { useLoader } from '../../services/loaderModalService';
import { toast } from 'react-toastify';
import environment from '../../config/environment';
import { useAuth } from '../../context/AuthContext';
import './login.css';

const Login = () => {
    const { login } = useAuth();
    const { show: showLoader, hide: hideLoader } = useLoader();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const authTokenName = environment.tokenName;

    const onSubmit = async (data) => {
        showLoader('Logging...');
        try {
            const response = await AuthService.login(data.identifier, data.password);
            localStorage.setItem(authTokenName, response.token);
            hideLoader();
            login();
            navigate('/dashboard');
        } catch (error) {
            hideLoader();
            console.error('Login failed: ' + error);
            toast.error('Login failed: ' + error);
        }
    };

    return (
        <div className="h-full flex items-center justify-center coverparentspace">
            <div className="max-w-md w-full">
                <div className="border-none md:border border-gray-300 px-4 py-3 mb-8 bg-white rounded-lg shadow-none md:shadow-md">
                    <h2 className="my-3 text-center text-3xl font-extrabold text-gray-900">Login</h2>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label htmlFor="identifier" className="block text-sm font-bold mb-2">Email / Account Number:</label>
                            <input
                                {...register('identifier', { required: true })}
                                type="text"
                                id="identifier"
                                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-indigo-500"
                            />
                            {errors.identifier && (
                                <p className="text-red-500 text-sm mt-1">Email / Account Number is required.</p>
                            )}
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-bold mb-2">Password:</label>
                            <div className="relative">
                                <input
                                    {...register('password', { required: true })}
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-indigo-500"
                                />
                                <span
                                    className={`fa ${showPassword ? 'fa-eye' : 'fa-eye-slash'} absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer`}
                                    onClick={() => setShowPassword(!showPassword)}
                                ></span>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">Password is required.</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
                            >
                                Login
                            </button>
                        </div>
                    </form>

                    <div className="flex justify-between">
                        <button
                            onClick={() => navigate('/login/otp')}
                            className="block border border-2 border-gray-300 bg-white mt-4 font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                        >
                            Login via Otp
                        </button>
                        <button
                            onClick={() => navigate('/forget-password')}
                            className="block border border-2 border-gray-300 bg-white mt-4 font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                        >
                            Forget Password?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
