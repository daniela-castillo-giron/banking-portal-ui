import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from '../services/apiService';
import { REDUX_SLICE_DATA_STATUS } from '../utils/constants';

// Async thunk to fetch all transactions
export const getTransactions = createAsyncThunk(
    'transactions/getTransactions',
    async (_, thunkAPI) => {
        try {
            const response = await ApiService.getTransactions();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.message);
        }
    }
);

// Initial state
const initialState = {
    data: [],
    status: REDUX_SLICE_DATA_STATUS.IDLE,
    error: null,
};

const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        setTransactions: (state, action) => {
            state.data = [...action.payload];
        },
        clearTransactions: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTransactions.pending, (state) => {
                state.status = REDUX_SLICE_DATA_STATUS.LOADING;
                state.error = null;
            })
            .addCase(getTransactions.fulfilled, (state, action) => {
                state.status = REDUX_SLICE_DATA_STATUS.SUCCEEDED;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(getTransactions.rejected, (state, action) => {
                state.status = REDUX_SLICE_DATA_STATUS.FAILED;
                state.error = action.payload;
            });
    },
});

export const { setTransactions, clearTransactions } = transactionsSlice.actions;

export default transactionsSlice.reducer;
