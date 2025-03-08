import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import ApiService from '../../services/apiService';
import { useLoader } from '../../services/loaderModalService';
import { toast } from 'react-toastify';
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
    const { show, hide } = useLoader();
    const [loading, setLoading] = useState(true);
    const [showGeneratePINForm, setShowGeneratePINForm] = useState(true);
    const navigate = useNavigate();

    // Dynamic form hook based on mode
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(showGeneratePINForm ? pinSchema : changeSchema),
    });

    useEffect(() => {
        ApiService.checkPinCreated()
            .then((isPinCreated) => {
                if (isPinCreated === true) {
                    setShowGeneratePINForm(false);
                }
            })
            .catch((error) => console.error('Error checking PIN status:', error))
            .finally(() => setLoading(false));
    }, []);

    const onGenerateSubmit = async (data) => {
        show('Generating PIN...');
        try {
            await ApiService.createPin(data.newPin, data.password);
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="loader">Loading</div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center coverparentspace">
            <div className="max-w-md w-full rounded-lg bg-white p-6 leading-5 text-slate-700 shadow-xl shadow-black/5 ring-1 ring-slate-700/10">
                {showGeneratePINForm ? (
                    <form onSubmit={handleSubmit(onGenerateSubmit)} className="space-y-4">
                        <h2 className="text-3xl font-semibold mb-6 text-center">Generate PIN</h2>

                        <div>
                            <label className="block text-sm font-bold mb-2">New PIN:</label>
                            <input {...register('newPin')} type="password" placeholder="Enter the new PIN" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500" />
                            {errors.newPin && <p className="text-red-500 text-sm mt-1">{errors.newPin.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">Confirm PIN:</label>
                            <input {...register('confirmPin')} type="password" placeholder="Confirm the new PIN" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500" />
                            {errors.confirmPin && <p className="text-red-500 text-sm mt-1">{errors.confirmPin.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">Password:</label>
                            <input {...register('password')} type="password" placeholder="Enter your password" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500" />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        <div className="flex justify-center">
                            <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">Generate PIN</button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit(onChangeSubmit)} className="space-y-4">
                        <h2 className="text-3xl font-semibold mb-6 text-center">Change PIN</h2>

                        <div>
                            <label className="block text-sm font-bold mb-2">Old PIN:</label>
                            <input {...register('oldPin')} type="password" placeholder="Enter the old PIN" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500" />
                            {errors.oldPin && <p className="text-red-500 text-sm mt-1">{errors.oldPin.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">New PIN:</label>
                            <input {...register('newPin')} type="password" placeholder="Enter the new PIN" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500" />
                            {errors.newPin && <p className="text-red-500 text-sm mt-1">{errors.newPin.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">Password:</label>
                            <input {...register('password')} type="password" placeholder="Enter your password" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500" />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        <div className="flex justify-center">
                            <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">Change PIN</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AccountPin;
