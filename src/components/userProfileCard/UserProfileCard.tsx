import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../store/userSlice';
import { REDUX_SLICE_DATA_STATUS } from '../../utils/constants';
import './userprofilecard.css';

const UserProfileCard = () => {
    const dispatch = useDispatch();

    const userDetails = useSelector((state) => state.user);

    const [userProfileData, setUserProfileData] = useState(null);

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

    return (
        <div className="w-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <h2 className="text-2xl font-semibold mb-6">Hi, {userProfileData?.name}</h2>

            <div className="mb-4 flex items-center">
                <i className="fas fa-phone mr-2"></i>
                <label className="text-sm font-semibold">Phone Number:</label>
                <span className="ml-2 text-sm font-semibold">{userProfileData?.phoneNumber}</span>
            </div>

            <div className="mb-4 flex items-center">
                <i className="fas fa-envelope mr-2"></i>
                <label className="text-sm font-semibold">Email:</label>
                <span className="ml-2 text-sm font-semibold">{userProfileData?.email}</span>
            </div>

            <div className="mb-4 flex items-center">
                <i className="fas fa-address-book mr-2"></i>
                <label className="text-sm font-semibold">Address:</label>
                <span className="ml-2 text-sm font-semibold">{userProfileData?.address}</span>
            </div>
        </div>
    );
};

export default UserProfileCard;
