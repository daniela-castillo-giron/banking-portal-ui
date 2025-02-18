import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/apiService';
import UserProfileCard from '../userprofilecard/UserProfileCard';
import AccountDetailCard from '../accountDetailCard/AccountDetailCard';
import TransactionHistory from '../transactionHistory/TransactionHistory';
import PinCreationModal from '../pinCreationModal/PinCreationModal';
import './dashboard.css';

const Dashboard = () => {
    const [showPINCreationModel, setShowPINCreationModel] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkPINStatus();
    }, []);

    const checkPINStatus = async () => {
        try {
            const isPinCreated = await ApiService.checkPinCreated();
            if (isPinCreated === false) {
                setShowPINCreationModel(true);
            }
        } catch (error) {
            console.error('Error checking PIN status:', error);
        }
    };

    const redirectToPINCreationPage = () => {
        setShowPINCreationModel(false);
        navigate('/account/pin');
    };

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
