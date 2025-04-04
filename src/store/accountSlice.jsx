// src/store/accountSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from '../services/apiService';
import { REDUX_SLICE_DATA_STATUS } from '../utils/constants';

// Async thunk to fetch account details
export const getAccountDetails = createAsyncThunk(
    'account/getAccountDetails',
    async (_, thunkAPI) => {
        try {
            const accountDetailsResponse = await ApiService.getAccountDetails();
            const pinCheckResponse = await ApiService.checkPinCreated();
            return { ...accountDetailsResponse, hasPin: pinCheckResponse };
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.message);
        }
    }
);

// Initial state
const initialState = {
    data: {
        accountNumber: null,
        balance: null,
        accountType: null,
        branch: null,
        ifscCode: null,
        hasPin: null,
    },
    status: REDUX_SLICE_DATA_STATUS.IDLE,
    error: null,
};

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setAccountDetails: (state, action) => {
            state.data = { ...state.data, ...action.payload };
        },
        setAccountPinExistence: (state, action) => {
            state.data.hasPin = action.payload;
        },
        clearAccountDetails: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAccountDetails.pending, (state) => {
                state.status = REDUX_SLICE_DATA_STATUS.LOADING;
                state.error = null;
            })
            .addCase(getAccountDetails.fulfilled, (state, action) => {
                state.status = REDUX_SLICE_DATA_STATUS.SUCCEEDED;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(getAccountDetails.rejected, (state, action) => {
                state.status = REDUX_SLICE_DATA_STATUS.FAILED;
                state.error = action.payload;
            })
    },
});

export const { setAccountDetails, setAccountPinExistence, clearAccountDetails } = accountSlice.actions;

export default accountSlice.reducer;
