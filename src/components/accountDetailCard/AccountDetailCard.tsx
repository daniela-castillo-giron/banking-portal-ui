import React, { useEffect, useState } from 'react';
import ApiService from '../../services/apiService';
import { toast } from 'react-toastify';
import './accountdetailcard.css';

const AccountDetailCard = () => {
    const [accountDetails, setAccountDetails] = useState(null);

    useEffect(() => {
        ApiService.getAccountDetails()
            .then((data) => setAccountDetails(data))
            .catch((error) => {
                console.error('Account details fetching failed: ' + error);
                toast.error('Account details fetching failed: ' + error);
            });
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount || 0);
    };

    return (
        <div className="p-4 bg-blue-500 rounded-lg shadow-lg text-white">
            <h2 className="text-3xl font-semibold mb-6 text-yellow-400">
                {formatCurrency(accountDetails?.balance)}
            </h2>

            <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                    <label className="block text-sm font-bold">Account Number:</label>
                    <span className="font-bold text-base">{accountDetails?.accountNumber}</span>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold">Account Type:</label>
                    <span className="font-bold text-base">{accountDetails?.accountType}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                    <label className="block text-sm font-bold">Branch:</label>
                    <span className="font-bold text-base">{accountDetails?.branch}</span>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold">IFSC Code:</label>
                    <span className="font-bold text-base">{accountDetails?.ifscCode}</span>
                </div>
            </div>
        </div>
    );
};

export default AccountDetailCard;
