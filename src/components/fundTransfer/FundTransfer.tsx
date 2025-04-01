import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/apiService';
import { useLoader } from '../../services/loaderModalService';
import { toast } from 'react-toastify';
import AuthService from '../../services/authService';
import './fundTransfer.css';

const schema = yup.object().shape({
    amount: yup
        .number()
        .typeError('Amount must be a number')
        .required('Amount is required')
        .min(1, 'Amount must be positive'),
    targetAccountNumber: yup.string().required('Target Account Number is required'),
    pin: yup.string().required('PIN is required').length(4, 'PIN must be 4 digits'),
});

const FundTransfer = () => {
    const { show, hide } = useLoader();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [data, setData] = useState(null);
    const [resultStatus, setResultStatus] = useState(null);
    const [userProfileData, setUserProfileData] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const userData = await AuthService.getUserDetails();
            setUserProfileData(userData);
        } catch (error) {
            console.error('Error fetching user profile data:', error);
        }
    };

    const handleFormSubmit = (formData) => {
        setData(formData);
        setStep(2);
    };

    const handleConfirm = async () => {
        show('Transferring funds...');
        try {
            const response = await ApiService.fundTransfer(data.amount, data.pin, data.targetAccountNumber);
            hide();
            toast.success(response.msg || 'Fund transfer successful!');
            reset();
            setResultStatus('success');
        } catch (error) {
            hide();
            console.error('Fund transfer failed: ' + error);
            toast.error('Fund transfer failed: ' + error);
            setResultStatus('error');
        }
        setStep(3);
    };

    const handleReset = () => {
        setData(null);
        setResultStatus(null);
        navigate('/dashboard');
        setStep(1);
    };

    const ProgressIndicator = () => (
        <div className="flex justify-center mb-6 space-x-8 text-sm">
            {['Selección', 'Confirmación', 'Resultado'].map((label, index) => {
                const current = index + 1;
                return (
                    <div key={index} className="flex flex-col items-center">
                        <div
                            className={`w-4 h-4 rounded-full ${step === current ? 'bg-green-600' : 'bg-gray-400'
                                }`}
                        ></div>
                        <span className="mt-1">{label}</span>
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="flex justify-center items-center coverparentspace">
            <div className="max-w-md w-full rounded-lg bg-white p-6 leading-5 text-slate-700 shadow-xl shadow-black/5 ring-1 ring-slate-700/10">
                <ProgressIndicator />

                {step === 1 && (
                    <>
                        <h2 className="text-3xl font-semibold mb-6 text-center">Fund Transfer</h2>
                        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">Amount:</label>
                                <input
                                    autoComplete="off"
                                    type="number"
                                    {...register('amount')}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                                    placeholder="Enter the amount"
                                />
                                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Target Account Number:</label>
                                <input
                                    autoComplete="off"
                                    type="text"
                                    {...register('targetAccountNumber')}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                                    placeholder="Enter target account"
                                />
                                {errors.targetAccountNumber && <p className="text-red-500 text-sm mt-1">{errors.targetAccountNumber.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">PIN:</label>
                                <input
                                    autoComplete="off"
                                    type="password"
                                    {...register('pin')}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                                    placeholder="Enter your PIN"
                                />
                                {errors.pin && <p className="text-red-500 text-sm mt-1">{errors.pin.message}</p>}
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded"
                            >
                                Continue
                            </button>
                        </form>
                    </>
                )}

                {step === 2 && data && (
                    <>
                        <h2 className="text-2xl font-semibold mb-4 text-center">Transfer Confirmation</h2>
                        <div className="text-sm space-y-4">
                            <div>
                                <strong>Origin Account:</strong>
                                <p>Account: {userProfileData.accountNumber} - {userProfileData.name}</p>
                                <p>Debit Amount: ${Number(data.amount).toFixed(2)}</p>
                                <p>Fee: $0.00</p>
                                <p>Total Debit: ${(Number(data.amount) + 0).toFixed(2)}</p>
                            </div>
                            <div className="border-t pt-4">
                                <strong>Target Account:</strong>
                                <p>Bank: OneStop Bank</p>
                                <p>Account: {data.targetAccountNumber}</p>
                                {/* <p>Account Holder Name: {data.name}</p> */}
                                <p>Account Type: Savings</p>
                                {/* <p>Beneficiary ID: 111111111111</p> */}
                                <p>Credit Amount: ${Number(data.amount).toFixed(2)}</p>
                            </div>
                            <div className="mt-4 p-3 bg-yellow-100 text-sm border-l-4 border-yellow-400">
                                ⚠️ Make sure the <strong>account holder name</strong> matches the name of the beneficiary for the destination account.
                            </div>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button
                                onClick={() => setStep(1)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Confirm
                            </button>
                        </div>
                    </>
                )}

                {step === 3 && data && (
                    <>
                        <h2 className={`text-2xl font-semibold mb-4 text-center ${resultStatus === 'success' ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {resultStatus === 'success' ? 'Successful Transfer' : 'Failed Transfer'}
                        </h2>
                        <div className="text-sm space-y-4">
                            <div>
                                <strong>Origin Account:</strong>
                                <p>Account: {userProfileData.accountNumber} - {userProfileData.name}</p>
                                <p>Debit Amount: ${Number(data.amount).toFixed(2)}</p>
                                <p>Fee: $0.00</p>
                                <p>Total Debit: ${(Number(data.amount) + 0).toFixed(2)}</p>
                            </div>
                            <div className="border-t pt-4">
                                <strong>Target Account:</strong>
                                <p>Bank: OneStop Bank</p>
                                <p>Account: {data.targetAccountNumber}</p>
                                {/* <p>Account Holder Name: {data.name}</p> */}
                                <p>Account Type: Savings</p>
                                {/* <p>Beneficiary ID: 111111111111</p> */}
                                <p>Credit Amount: ${Number(data.amount).toFixed(2)}</p>
                                <p>Reference: {Math.floor(Math.random() * 1000000000)}</p>
                                <p>Date: {new Date().toLocaleString()}</p>
                                <p>Result: {resultStatus === 'success' ? 'Your transfer has been sent and is being processed.' : 'The transfer could not be completed.'}</p>
                            </div>
                        </div>
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={() => {
                                    handleReset();
                                }}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded"
                            >
                                Finish
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default FundTransfer;
