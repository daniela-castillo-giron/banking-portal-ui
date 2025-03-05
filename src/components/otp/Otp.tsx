import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';
import { useLoader } from '../../services/loaderModalService';
import { toast } from 'react-toastify';
import OTPInput from 'react-otp-input';
import { useAuth } from '../../context/AuthContext';
import './otp.css';

const generateSchema = yup.object().shape({
    identifier: yup.string().required('Email / Account Number is required'),
});

const Otp = () => {
    const { login } = useAuth();
    const { show: showLoader, hide: hideLoader } = useLoader();
    const [otp, setOtp] = useState('');
    const [otpGenerated, setOtpGenerated] = useState(false);
    const navigate = useNavigate();
    const authTokenName = 'authToken';

    // React Hook Form for the generate form
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(generateSchema),
    });

    useEffect(() => {
        const storedAccountNumber = sessionStorage.getItem('accountNumber');
        if (storedAccountNumber) {
            setValue('identifier', storedAccountNumber);
            setOtpGenerated(true);
        }

        // Cleanup: remove accountNumber from session storage when leaving
        return () => {
            sessionStorage.removeItem('accountNumber');
        };
    }, []);

    const onGenerateOTP = async (data) => {
        showLoader('Generating OTP...');
        try {
            const response = await AuthService.generateOTP(data.identifier);
            toast.success(`${response.message}, Check Email`);
            setOtpGenerated(true);
            sessionStorage.setItem('accountNumber', data.identifier);
        } catch (error) {
            console.error('OTP generation failed: ' + error);
            toast.error('OTP generation failed: ' + error);
        } finally {
            hideLoader();
        }
    };

    const verifyOTP = async () => {
        showLoader('Verifying OTP...');
        const identifier = sessionStorage.getItem('accountNumber');
        try {
            const response = await AuthService.verifyOTP({ identifier, otp });
            toast.success('Account Logged In');
            localStorage.setItem(authTokenName, response.token);
            login();
            navigate('/dashboard');
        } catch (error) {
            console.error('OTP verification failed: ' + error);
            toast.error('OTP verification failed: ' + error);
        } finally {
            hideLoader();
        }
    };

    return (
        <div className="h-full flex items-center justify-center coverparentspace">
            <div className="max-w-md w-full">
                <div className="border-none md:border border-gray-300 px-4 py-3 mb-8 bg-white rounded-lg shadow-none md:shadow-md">
                    <h2 className="my-3 text-center text-3xl font-extrabold text-gray-900">OTP Verification</h2>

                    {!otpGenerated ? (
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onGenerateOTP)}>
                            <div>
                                <label className="block text-sm font-bold mb-2">Email / Account Number</label>
                                <input
                                    autoComplete="off"
                                    type="text"
                                    {...register('identifier')}
                                    className="appearance-none rounded relative block w-full px-3 py-2 border text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Email / Account Number"
                                />
                                {errors.identifier && (
                                    <p className="text-red-500 text-sm mt-1">{errors.identifier.message}</p>
                                )}
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Generate OTP
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="mt-8 space-y-6">
                            <div className="flex justify-center">
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
                                onClick={verifyOTP}
                                disabled={otp.length !== 6}
                                className={`group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white ${otp.length === 6 ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-200 cursor-not-allowed'}`}
                            >
                                Verify OTP
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Otp;
