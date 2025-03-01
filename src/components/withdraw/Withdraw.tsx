import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/apiService';
import { useLoader } from '../../services/loaderModalService';
import { toast } from 'react-toastify';
import './withdraw.css';

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

const Withdraw = () => {
    const navigate = useNavigate();
    const { show, hide } = useLoader();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const onSubmit = async (data) => {
        show('Withdrawing...');
        try {
            const response = await ApiService.withdraw(data.amount, data.pin);
            hide();
            toast.success(response.msg || 'Withdrawal successful!');
            reset();
            navigate('/dashboard');
        } catch (error) {
            hide();
            console.error('Withdrawal failed: ' + error);
            toast.error('Withdrawal failed: ' + error);
        }
    };

    return (
        <div className="flex justify-center items-center coverparentspace">
            <div className="max-w-md w-full rounded-lg bg-white p-6 leading-5 text-slate-700 shadow-xl shadow-black/5 ring-1 ring-slate-700/10">
                <h2 className="text-3xl font-semibold mb-6 text-center">Withdraw</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded focus:outline-none"
                        >
                            Withdraw
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Withdraw;
