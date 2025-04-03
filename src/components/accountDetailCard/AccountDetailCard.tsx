import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountDetails } from '../../store/accountSlice';
import { REDUX_SLICE_DATA_STATUS } from '../../utils/constants';
import './accountdetailcard.css';

const AccountDetailCard = () => {
    const dispatch = useDispatch();

    const accountDetails = useSelector(state => state.account);

    const [accountData, setAccountData] = useState(null);

    useEffect(() => {
        if (accountDetails.status === REDUX_SLICE_DATA_STATUS.IDLE) {
            dispatch(getAccountDetails());
        } else if (accountDetails.status === REDUX_SLICE_DATA_STATUS.SUCCEEDED) {
            setAccountData(accountDetails.data);
        } else if (accountDetails.status === REDUX_SLICE_DATA_STATUS.FAILED) {
            console.error('Account details fetching failed: ' + accountDetails.error);
            toast.error('Account details fetching failed: ' + accountDetails.error);
        }
    }, [accountDetails]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount || 0);
    };

    return (
        <div className="p-4 bg-blue-500 rounded-lg shadow-lg text-white">
            <h2 className="text-3xl font-semibold mb-6 text-yellow-400">
                {formatCurrency(accountData?.balance)}
            </h2>

            <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                    <label className="block text-sm font-bold">Account Number:</label>
                    <span className="font-bold text-base">{accountData?.accountNumber}</span>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold">Account Type:</label>
                    <span className="font-bold text-base">{accountData?.accountType}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                    <label className="block text-sm font-bold">Branch:</label>
                    <span className="font-bold text-base">{accountData?.branch}</span>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold">IFSC Code:</label>
                    <span className="font-bold text-base">{accountData?.ifscCode}</span>
                </div>
            </div>
        </div>
    );
};

export default AccountDetailCard;
