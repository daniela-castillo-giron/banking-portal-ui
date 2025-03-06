import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import OTPInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AuthService from '../../services/authService';
import { useLoader } from '../../services/loaderModalService';
import { toast } from 'react-toastify';

const sendOtpSchema = yup.object().shape({
    identifier: yup.string().required('Email or Account Number is required'),
});

const resetPasswordSchema = yup.object().shape({
    newPassword: yup
        .string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .max(127, 'Password must be at most 127 characters'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('newPassword')], 'Passwords do not match')
        .required('Please confirm your password'),
});

const ResetPassword = () => {
    const { show, hide } = useLoader();
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
    const [resetToken, setResetToken] = useState('');
    const [identifier, setIdentifier] = useState('');

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm({
        resolver: yupResolver(showNewPasswordForm ? resetPasswordSchema : sendOtpSchema),
    });

    useEffect(() => {
        const savedIdentifier = sessionStorage.getItem('resetIdentifier');
        if (savedIdentifier) {
            setIdentifier(savedIdentifier);
            setValue('identifier', savedIdentifier);
            setOtpSent(true);
        }

        return () => {
            sessionStorage.removeItem('resetIdentifier');
        };
    }, [setValue]);

    const handleSendOtp = async (data) => {
        show('Generating OTP...');
        try {
            await AuthService.sendOtpForPasswordReset(data.identifier);
            toast.success('OTP Sent Successfully');
            setIdentifier(data.identifier);
            setOtpSent(true);
            sessionStorage.setItem('resetIdentifier', data.identifier);
        } catch (error) {
            console.error('OTP submission Failed: ' + error);
            toast.error('OTP submission Failed: ' + error);
        } finally {
            hide();
        }
    };

    const handleVerifyOtp = async () => {
        show('Verifying OTP...');
        try {
            const response = await AuthService.verifyOtpForPasswordReset(identifier, otp);
            toast.success('OTP Verified');
            setResetToken(response.passwordResetToken);
            setShowNewPasswordForm(true);
        } catch (error) {
            console.error('OTP verification failed: ' + error);
            toast.error('OTP verification failed: ' + error);
        } finally {
            hide();
        }
    };

    const handleResetPassword = async (data) => {
        show('Resetting Password...');
        try {
            await AuthService.resetPassword(identifier, resetToken, data.newPassword);
            toast.success('Password Reset Successfully');
            navigate('/login');
        } catch (error) {
            console.error('Password Reset Failed: ' + error);
            toast.error('Password Reset Failed: ' + error);
        } finally {
            hide();
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100 coverparentspace">
            <div className="max-w-md w-full">
                {!showNewPasswordForm ? (
                    <div className="border-none md:border border-gray-300 px-4 py-3 mb-8 bg-white rounded-lg shadow-none md:shadow-md">
                        <h2 className="my-3 text-center text-3xl font-extrabold text-gray-900">Reset Password</h2>

                        {!otpSent ? (
                            <form onSubmit={handleSubmit(handleSendOtp)}>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-2">Email or Account Number:</label>
                                    <input
                                        {...register('identifier')}
                                        type="text"
                                        autoComplete="off"
                                        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-indigo-500"
                                    />
                                    {errors.identifier && (
                                        <p className="text-red-500 text-sm mt-1">{errors.identifier.message}</p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded"
                                >
                                    Send OTP
                                </button>
                            </form>
                        ) : (
                            <>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-2">Enter OTP:</label>
                                    <OTPInput
                                        value={otp}
                                        onChange={setOtp}
                                        numInputs={6}
                                        renderInput={(props) => <input {...props} />}
                                        inputStyle={{
                                            width: '50px',
                                            height: '50px',
                                            margin: '0 5px',
                                            fontSize: '18px',
                                            borderRadius: '4px',
                                            border: '1px solid #ced4da',
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={handleVerifyOtp}
                                    className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded"
                                    disabled={otp.length !== 6}
                                >
                                    Verify OTP
                                </button>
                            </>
                        )}

                        <button
                            onClick={() => navigate('/login')}
                            className="block border border-2 border-gray-300 bg-white mt-4 font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                        >
                            Back to Login
                        </button>
                    </div>
                ) : (
                    <div className="border-none md:border border-gray-300 px-4 py-3 mb-8 bg-white rounded-lg shadow-none md:shadow-md">
                        <h2 className="my-3 text-center text-3xl font-extrabold text-gray-900">Reset Password</h2>
                        <form onSubmit={handleSubmit(handleResetPassword)}>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">New Password:</label>
                                <input
                                    {...register('newPassword')}
                                    type="password"
                                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-indigo-500"
                                />
                                {errors.newPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Confirm Password:</label>
                                <input
                                    {...register('confirmPassword')}
                                    type="password"
                                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-indigo-500"
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded"
                            >
                                Reset Password
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
