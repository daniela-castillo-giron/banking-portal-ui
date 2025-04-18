import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/apiService';
import { useLoader } from '../../services/loaderModalService';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../store/userSlice';
import { getAccountDetails } from '../../store/accountSlice';
import { getTransactions } from '../../store/transactionsSlice';
import { REDUX_SLICE_DATA_STATUS } from '../../utils/constants';
import './deposit.css';

const schema = yup.object().shape({
    amount: yup
        .number()
        .typeError('Amount must be a number')
        .required('Amount is required')
        .min(1, 'Amount must be positive'),
    pin: yup
        .string()
        .required('PIN is required')
        .length(4, 'PIN must be 4 digits'),
});

const Deposit = () => {
    const dispatch = useDispatch();

    const userDetails = useSelector((state) => state.user);

    const navigate = useNavigate();
    const { show, hide } = useLoader();

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
        if (userDetails.status === REDUX_SLICE_DATA_STATUS.IDLE) {
            dispatch(getUserDetails());
        } else if (userDetails.status === REDUX_SLICE_DATA_STATUS.SUCCEEDED) {
            setUserProfileData(userDetails.data);
        } else if (userDetails.status === REDUX_SLICE_DATA_STATUS.FAILED) {
            console.error('User details fetching failed: ' + userDetails.error);
            toast.error('User details fetching failed: ' + userDetails.error);
        }
    }, [userDetails]);

    const handleFormSubmit = (formData) => {
        setData(formData);
        setStep(2);
    };

    const handleConfirm = async () => {
        show('Depositing...');
        try {
            const response = await ApiService.deposit(data.amount, data.pin);
            dispatch(getAccountDetails());
            dispatch(getTransactions());
            toast.success(response.msg || 'Deposit successful!');
            reset();
            setResultStatus('success');
        } catch (error) {
            console.error('Deposit failed: ' + error);
            toast.error('Deposit failed: ' + error);
            setResultStatus('error');
        } finally {
            hide();
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
            {['Input', 'Confirmation', 'Result'].map((label, index) => {
                const current = index + 1;
                return (
                    <div key={index} className="flex flex-col items-center">
                        <div
                            className={`w-4 h-4 rounded-full ${step === current ? 'bg-green-600' : 'bg-gray-400'}`}
                        ></div>
                        <span className="mt-1">{label}</span>
                    </div>
                );
            })}
        </div>
    );

    // Only render the content if data has loaded successfully
    if (userDetails.status === REDUX_SLICE_DATA_STATUS.LOADING) {
        return null;
    }

    return (
        <div className="min-h-screen bg-white text-slate-700 flex flex-col items-center py-10 px-4">
            <div className="w-full max-w-2xl">
                <ProgressIndicator />

                {step === 1 && (
                    <>
                        <h2 className="text-3xl font-semibold mb-6 text-center">Deposit</h2>
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
                                <label className="block text-sm font-bold mb-2">PIN:</label>
                                <input
                                    autoComplete="off"
                                    type="password"
                                    {...register('pin')}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                                    placeholder="Enter your account PIN"
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
                        <h2 className="text-2xl font-semibold mb-6 text-center">Deposit Confirmation</h2>
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded border">
                                <h3 className="font-semibold mb-4 text-size-md">Deposit Details</h3>
                                <dl className="grid grid-cols-2 gap-y-2 text-sm">
                                    <dt className="text-gray-500 font-semibold">Account</dt>
                                    <dd>{userProfileData?.accountNumber} - {userProfileData?.name?.toUpperCase()}</dd>

                                    <dt className="text-gray-500 font-semibold">Credit Amount</dt>
                                    <dd>${Number(data.amount).toFixed(2)}</dd>

                                    <dt className="text-gray-500 font-semibold">Fee</dt>
                                    <dd>$0.00</dd>

                                    <dt className="text-gray-500 font-semibold">Total Credit</dt>
                                    <dd>${Number(data.amount).toFixed(2)}</dd>
                                </dl>
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
                        <h2 className={`text-2xl font-semibold mb-6 text-center ${resultStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {resultStatus === 'success' ? 'Successful Deposit' : 'Deposit Failed'}
                        </h2>
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded border">
                                <h3 className="font-semibold mb-4 text-size-md">Deposit Summary</h3>
                                <dl className="grid grid-cols-2 gap-y-2 text-sm">
                                    <dt className="text-gray-500 font-semibold">Account</dt>
                                    <dd>{userProfileData?.accountNumber} - {userProfileData?.name?.toUpperCase()}</dd>

                                    <dt className="text-gray-500 font-semibold">Credit Amount</dt>
                                    <dd>${Number(data.amount).toFixed(2)}</dd>

                                    <dt className="text-gray-500 font-semibold">Fee</dt>
                                    <dd>$0.00</dd>

                                    <dt className="text-gray-500 font-semibold">Date</dt>
                                    <dd>{new Date().toLocaleString()}</dd>

                                    <dt className="text-gray-500 font-semibold">Reference</dt>
                                    <dd>{Math.floor(Math.random() * 1000000000)}</dd>

                                    <dt className="text-gray-500 font-semibold">Status</dt>
                                    <dd>
                                        {resultStatus === 'success'
                                            ? 'Your deposit has been credited to your account.'
                                            : 'The deposit could not be completed.'}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={handleReset}
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

export default Deposit;
