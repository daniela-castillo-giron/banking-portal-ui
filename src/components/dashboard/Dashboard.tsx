import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfileCard from '../userprofilecard/UserProfileCard';
import AccountDetailCard from '../accountDetailCard/AccountDetailCard';
import TransactionHistory from '../transactionHistory/TransactionHistory';
import PinCreationModal from '../pinCreationModal/PinCreationModal';
import { useSelector } from 'react-redux';
import { REDUX_SLICE_DATA_STATUS } from '../../utils/constants';
import './dashboard.css';

const Dashboard = () => {
    const accountDetails = useSelector(state => state.account);

    const [showPINCreationModel, setShowPINCreationModel] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (accountDetails.status === REDUX_SLICE_DATA_STATUS.SUCCEEDED) {
            if (accountDetails.data.hasPin === false) {
                setShowPINCreationModel(true);
            }
        } else if (accountDetails.status === REDUX_SLICE_DATA_STATUS.FAILED) {
            console.error('Account PIN status checking failed: ' + accountDetails.error);
        }
    }, [accountDetails]);

    const redirectToPINCreationPage = () => {
        setShowPINCreationModel(false);
        navigate('/account/pin');
    };

    // Only render the content if data has loaded successfully
    if (accountDetails.status === REDUX_SLICE_DATA_STATUS.LOADING) {
        return null;
    }

    return (
        <div className="coverparentspace">
            <div className="cards-wrapper w-full flex gap-2">
                <div className="w-full mb-2">
                    <UserProfileCard />
                </div>
                <div className="w-full mb-2">
                    <AccountDetailCard />
                </div>
            </div>

            <TransactionHistory />

            {showPINCreationModel && (
                <PinCreationModal redirect={redirectToPINCreationPage} />
            )}
        </div>
    );
};

export default Dashboard;
