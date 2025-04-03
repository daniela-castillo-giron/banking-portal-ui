import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    accountNumber: null,
    accountType: null,
    address: null,
    branch: null,
    countryCode: null,
    email: null,
    ifscCode: null,
    name: null,
    phoneNumber: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserDetails: (state, action) => {
            return { ...state, ...action.payload };
        },
        clearUserDetails: () => null,
    },
});

export const { setUserDetails, clearUserDetails } = userSlice.actions;

export default userSlice.reducer;
