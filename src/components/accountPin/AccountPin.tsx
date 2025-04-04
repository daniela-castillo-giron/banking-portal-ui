import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import ApiService from '../../services/apiService';
import { useLoader } from '../../services/loaderModalService';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setAccountPinExistence, checkAccountPin } from '../../store/accountSlice';
import { REDUX_SLICE_DATA_STATUS } from '../../utils/constants';
import './accountPin.css';

const pinSchema = yup.object().shape({
    newPin: yup.string().required('New PIN is required').length(4, 'PIN must be 4 digits'),
    confirmPin: yup.string().oneOf([yup.ref('newPin')], 'PINs do not match').required('Confirm PIN is required'),
    password: yup.string().required('Password is required'),
});

const changeSchema = yup.object().shape({
    oldPin: yup.string().required('Old PIN is required').length(4, 'PIN must be 4 digits'),
    newPin: yup.string().required('New PIN is required').length(4, 'PIN must be 4 digits'),
    password: yup.string().required('Password is required'),
});

const AccountPin = () => {
    const dispatch = useDispatch();

    const accountDetails = useSelector(state => state.account);

    const { show, hide } = useLoader();
    const [showGeneratePINForm, setShowGeneratePINForm] = useState(true);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(showGeneratePINForm ? pinSchema : changeSchema),
    });

    useEffect(() => {
        if (accountDetails.pinStatus === REDUX_SLICE_DATA_STATUS.IDLE) {
            dispatch(checkAccountPin());
        } else if (accountDetails.pinStatus === REDUX_SLICE_DATA_STATUS.SUCCEEDED) {
            if (accountDetails.data.hasPin) {
                setShowGeneratePINForm(false);
            }
        } else if (accountDetails.pinStatus === REDUX_SLICE_DATA_STATUS.FAILED) {
            console.error('Account PIN status checking failed: ' + accountDetails.error);
            toast.error('Account PIN status checking failed: ' + accountDetails.error);
        }
    }, [accountDetails]);

    const onGenerateSubmit = async (data) => {
        show('Generating PIN...');
        try {
            await ApiService.createPin(data.newPin, data.password);
            dispatch(setAccountPinExistence(true));
            toast.success('PIN generated successfully');
            navigate('/dashboard');
        } catch (error) {
            console.error('PIN generation failed: ' + error);
            toast.error('PIN generation failed: ' + error);
        } finally {
            hide();
        }
    };

    const onChangeSubmit = async (data) => {
        show('Updating PIN...');
        try {
            await ApiService.updatePin(data.oldPin, data.newPin, data.password);
            toast.success('PIN updated successfully');
            navigate('/dashboard');
        } catch (error) {
            console.error('PIN update failed: ' + error);
            toast.error('PIN update failed: ' + error);
        } finally {
            hide();
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-700 flex flex-col items-center py-10 px-4">
            <div className="w-full bg-yellow-100 text-yellow-800 px-4 py-2 text-sm border-b border-yellow-300 text-center rounded">
                🔒 Important: PINs are personal and confidential. For your safety, OneStop Bank does not store your PIN in readable format.
            </div>

            <div className="w-full max-w-md mt-8">
                <div className="mb-4 p-4 border-l-4 border-blue-500 bg-blue-50 text-blue-800 text-sm rounded">
                    ⚠️ For your security, your PIN must be kept confidential and should not be shared with anyone. Never reuse a PIN you've used before.
                </div>

                <h2 className="text-3xl font-semibold mb-6 text-center">Account PIN</h2>

                <form
                    onSubmit={handleSubmit(showGeneratePINForm ? onGenerateSubmit : onChangeSubmit)}
                    className="space-y-4"
                >
                    {showGeneratePINForm ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">New PIN:</label>
                                <input
                                    type="password"
                                    {...register('newPin')}
                                    placeholder="Enter the new PIN"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                                />
                                {errors.newPin && <p className="text-red-500 text-sm mt-1">{errors.newPin.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Confirm PIN:</label>
                                <input
                                    type="password"
                                    {...register('confirmPin')}
                                    placeholder="Confirm the new PIN"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                                />
                                {errors.confirmPin && (
                                    <p className="text-red-500 text-sm mt-1">{errors.confirmPin.message}</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">Current PIN:</label>
                                <input
                                    type="password"
                                    {...register('oldPin')}
                                    placeholder="Enter your current PIN"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                                />
                                {errors.oldPin && <p className="text-red-500 text-sm mt-1">{errors.oldPin.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">New PIN:</label>
                                <input
                                    type="password"
                                    {...register('newPin')}
                                    placeholder="Enter the new PIN"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                                />
                                {errors.newPin && <p className="text-red-500 text-sm mt-1">{errors.newPin.message}</p>}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold mb-2">Password:</label>
                        <input
                            type="password"
                            {...register('password')}
                            placeholder="Enter your password"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        <div className="mt-2 text-sm text-gray-500 italic">
                            Your password is required to confirm your identity before PIN actions can be processed.
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded focus:outline-none"
                    >
                        {showGeneratePINForm ? 'Generate PIN' : 'Change PIN'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AccountPin;
