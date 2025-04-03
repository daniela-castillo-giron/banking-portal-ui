// src/store/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from '../services/authService';
import { REDUX_SLICE_DATA_STATUS } from '../utils/constants';

// Async thunk to fetch user details
export const getUserDetails = createAsyncThunk(
    'user/getUserDetails',
    async (_, thunkAPI) => {
        try {
            const response = await AuthService.getUserDetails();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.message);
        }
    }
);

// Initial state with nested user data
const initialState = {
    data: {
        accountNumber: null,
        accountType: null,
        address: null,
        branch: null,
        countryCode: null,
        email: null,
        ifscCode: null,
        name: null,
        phoneNumber: null,
    },
    status: REDUX_SLICE_DATA_STATUS.IDLE,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserDetails: (state, action) => {
            state.data = { ...state.data, ...action.payload };
        },
        clearUserDetails: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserDetails.pending, (state) => {
                state.status = REDUX_SLICE_DATA_STATUS.LOADING;
                state.error = null;
            })
            .addCase(getUserDetails.fulfilled, (state, action) => {
                state.status = REDUX_SLICE_DATA_STATUS.SUCCEEDED;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(getUserDetails.rejected, (state, action) => {
                state.status = REDUX_SLICE_DATA_STATUS.FAILED;
                state.error = action.payload;
            });
    },
});

export const { setUserDetails, clearUserDetails } = userSlice.actions;

export default userSlice.reducer;
